/**
 * Happy Minds — Auth, data & payments layer
 * Shares ONE Firebase project (Authentication + Firestore) with the HappyMinds Android app.
 *
 * Exposes window.HMAuth:
 *   ready                                   Promise: resolves once we know who (if anyone) is signed in
 *   register({name,email,password})         → { ok, pending?, error? }   (account must be approved by an admin)
 *   login({email,password})                 → { ok, user?, error?, code? } (code: PENDING | REJECTED)
 *   loginWithGoogle()                       → { ok, user?, pending?, cancelled?, error?, code? }
 *                                             one button for both sign-in and sign-up
 *   logout() · currentUser() · isLoggedIn() · sendPasswordReset(email)
 *   startPayment({amount,fullName,email,method})  → { ok, donationId?, url?, error? }
 *   watchDonation(id, onStatus, onError)    → Promise<unsubscribe>
 *   getDonationsForUser()                   → array, newest first
 *   limits                                  { min, max } donation amount in rand
 *
 * Firestore documents (identical to the app, see its FirestoreMappers.kt):
 *   users/{uid}      fullName, email, childName, age, grade, status (PENDING|APPROVED|REJECTED),
 *                    isVolunteer, helpType, skills, createdAt (ms)
 *   donations/{id}   userId, amount ("50.00"), frequency, fullName, email,
 *                    status (PENDING|COMPLETE|FAILED|CANCELLED), pfPaymentId, timestamp (ms)
 *                    → written ONLY by the PayFast Cloudflare Worker; the website just reads.
 *
 * Load this as <script type="module"> BEFORE the scripts that use HMAuth.
 */
import { startFirebase, isConfigured } from './firebase-init.js';

const HM_CONFIG = {
  payfast: {
    // The deployed Cloudflare Worker (same one the app uses). It must list this website in WEB_ORIGINS.
    workerUrl: 'https://happyminds-payfast.connecthub-za.workers.dev',
    min: 10,       // same limits as the app
    max: 50000,
  },
};

/* ── Firebase bootstrap ─────────────────────────────────────── */
let fb = null;        // { auth, db, A, F } once started; stays null if not configured / SDK unreachable
let profile = null;   // the signed-in, APPROVED user's profile: { id, name, email, status }

/** Reads users/{uid}. Resolves { state: 'MISSING' } or { state: <status>, profile }. */
async function loadProfile(fbUser) {
  const snap = await fb.F.getDoc(fb.F.doc(fb.db, 'users', fbUser.uid));
  if (!snap.exists()) return { state: 'MISSING' };
  const d = snap.data();
  const status = ['PENDING', 'APPROVED', 'REJECTED'].includes(d.status) ? d.status : 'PENDING';
  return {
    state: status,
    profile: { id: fbUser.uid, name: d.fullName || fbUser.email || '', email: d.email || fbUser.email || '', status },
  };
}

/** True if users/{uid}'s account is listed in admins/{uid} (readable by the account itself). */
async function isStaff(fbUser) {
  try { return (await fb.F.getDoc(fb.F.doc(fb.db, 'admins', fbUser.uid))).exists(); }
  catch { return false; }
}

const ready = (async () => {
  try {
    fb = await startFirebase();
    if (!fb) return;                     // not configured (startFirebase already warned)
    const { A } = fb;

    // Wait for Firebase to restore any saved session...
    await new Promise(resolve => {
      const unsubscribe = A.onAuthStateChanged(fb.auth, () => { unsubscribe(); resolve(); });
    });

    // ...then do what the app's restoreSession() does: only approved learners stay signed in.
    // A staff member signed in on the staff portal is left alone (they are just not a learner here).
    const u = fb.auth.currentUser;
    if (u) {
      try {
        const res = await loadProfile(u);
        if (res.state === 'APPROVED') profile = res.profile;
        else if (res.state === 'MISSING' && await isStaff(u)) { /* staff session: keep it, no learner profile */ }
        else await A.signOut(fb.auth);
      } catch (err) {
        // Offline or other failure: stay signed in, but behave as signed out on this page view.
        console.warn('[HMAuth] Could not load profile:', err);
      }
    }
  } catch (err) {
    console.error('[HMAuth] Could not start Firebase:', err);
    fb = null;
  }
})();

const NOT_READY = {
  ok: false,
  error: isConfigured
    ? 'Could not reach Firebase. Check your connection and try again.'
    : 'The site is not connected to Firebase yet. Please try again later.',
};

/* ── Helpers ────────────────────────────────────────────────── */
function friendlyError(err) {
  switch (err?.code) {
    case 'auth/email-already-in-use':   return 'An account with this email already exists.';
    case 'auth/invalid-email':          return 'Enter a valid email address.';
    case 'auth/weak-password':          return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':         return 'Incorrect email or password.';
    case 'auth/too-many-requests':      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed': return 'No internet connection. Please try again.';
    case 'auth/operation-not-allowed':  return 'This sign-in method is not enabled for this project.';
    case 'auth/popup-blocked':          return 'Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.';
    case 'auth/account-exists-with-different-credential':
                                        return 'An account with this email already exists. Sign in with your email and password instead.';
    case 'auth/unauthorized-domain':    return 'This website address is not authorised for Google sign-in yet.';
    case 'auth/user-disabled':          return 'This account has been disabled.';
    case 'permission-denied':           return 'You do not have permission to do that.';
    default:
      console.error('[HMAuth]', err);
      return 'Something went wrong. Please try again.';
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Public API ─────────────────────────────────────────────── */
const HMAuth = {
  ready,
  limits: { min: HM_CONFIG.payfast.min, max: HM_CONFIG.payfast.max },

  /** Same steps as the app's UserRepository.register(): Auth account + PENDING profile, then sign out. */
  async register({ name, email, password }) {
    await ready;
    if (!fb) return NOT_READY;
    name = String(name || '').trim();
    email = String(email || '').trim();
    if (!name) return { ok: false, error: 'Please enter your full name.' };

    let created;
    try {
      created = await fb.A.createUserWithEmailAndPassword(fb.auth, email, password);
    } catch (err) {
      return { ok: false, error: friendlyError(err) };
    }
    try {
      await fb.F.setDoc(fb.F.doc(fb.db, 'users', created.user.uid), {
        fullName:    name,
        email:       email.toLowerCase(),
        childName:   '',
        age:         '',
        grade:       '',
        status:      'PENDING',
        isVolunteer: false,
        helpType:    '',
        skills:      '',
        createdAt:   Date.now(),
      });
    } catch (err) {
      // Don't leave an Auth account behind without a profile (the app does the same).
      try { await fb.A.deleteUser(created.user); } catch { /* ignore */ }
      return { ok: false, error: friendlyError(err) };
    }
    profile = null;
    await fb.A.signOut(fb.auth);          // must be approved by an admin before first use
    return { ok: true, pending: true };
  },

  /** Same two steps as the app's login(): verify the password, then check admin approval. */
  async login({ email, password }) {
    await ready;
    if (!fb) return NOT_READY;
    try {
      const cred = await fb.A.signInWithEmailAndPassword(fb.auth, String(email || '').trim(), password);
      const res = await loadProfile(cred.user);
      if (res.state === 'MISSING') {
        await fb.A.signOut(fb.auth);
        return { ok: false, error: 'No learner profile exists for this account. (Staff sign in on the staff portal page.)' };
      }
      if (res.state === 'PENDING') {
        await fb.A.signOut(fb.auth);
        return { ok: false, code: 'PENDING', error: 'Your account is pending admin approval.' };
      }
      if (res.state === 'REJECTED') {
        await fb.A.signOut(fb.auth);
        return { ok: false, code: 'REJECTED', error: 'Your account request was declined.' };
      }
      profile = res.profile;
      return { ok: true, user: profile };
    } catch (err) {
      if (fb.auth.currentUser) { try { await fb.A.signOut(fb.auth); } catch { /* ignore */ } }
      profile = null;
      return { ok: false, error: friendlyError(err) };
    }
  },

  /**
   * Google sign-in. Same approval rules as email/password:
   *  - brand-new Google user  → create a PENDING profile (exactly like register()), sign out, { pending: true }
   *  - existing, APPROVED     → signed in
   *  - existing, PENDING / REJECTED → refused and signed out
   *  - existing Auth account with no learner profile (e.g. staff) → refused; no profile is invented for it
   */
  async loginWithGoogle() {
    await ready;
    if (!fb) return NOT_READY;

    let cred;
    try {
      const provider = new fb.A.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });   // let people pick the right Google account
      cred = await fb.A.signInWithPopup(fb.auth, provider);
    } catch (err) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request')
        return { ok: false, cancelled: true };
      return { ok: false, error: friendlyError(err) };
    }

    const user = cred.user;
    const isNew = !!fb.A.getAdditionalUserInfo(cred)?.isNewUser;
    const refuse = async (result) => {
      profile = null;
      try { await fb.A.signOut(fb.auth); } catch { /* ignore */ }
      return result;
    };

    try {
      const res = await loadProfile(user);

      if (res.state === 'MISSING') {
        if (!isNew)
          return await refuse({ ok: false, error: 'No learner profile exists for this account. (Staff sign in on the staff portal page.)' });

        const email = (user.email || '').toLowerCase();
        try {
          await fb.F.setDoc(fb.F.doc(fb.db, 'users', user.uid), {
            fullName:    (user.displayName || '').trim() || email.split('@')[0],
            email,
            childName:   '',
            age:         '',
            grade:       '',
            status:      'PENDING',
            isVolunteer: false,
            helpType:    '',
            skills:      '',
            createdAt:   Date.now(),
          });
        } catch (err) {
          try { await fb.A.deleteUser(user); } catch { /* ignore */ }   // brand-new account: don't leave it half-made
          return await refuse({ ok: false, error: friendlyError(err) });
        }
        return await refuse({ ok: true, pending: true });
      }

      if (res.state === 'PENDING')  return await refuse({ ok: false, code: 'PENDING',  error: 'Your account is pending admin approval.' });
      if (res.state === 'REJECTED') return await refuse({ ok: false, code: 'REJECTED', error: 'Your account request was declined.' });

      profile = res.profile;
      return { ok: true, user: profile };
    } catch (err) {
      return await refuse({ ok: false, error: friendlyError(err) });
    }
  },

  async logout() {
    await ready;
    profile = null;
    if (fb) await fb.A.signOut(fb.auth);
  },

  currentUser() { return fb && fb.auth.currentUser ? profile : null; },
  isLoggedIn()  { return !!this.currentUser(); },

  async sendPasswordReset(email) {
    await ready;
    if (!fb) return NOT_READY;
    try {
      await fb.A.sendPasswordResetEmail(fb.auth, String(email || '').trim());
      return { ok: true };
    } catch (err) {
      return { ok: false, error: friendlyError(err) };
    }
  },

  /**
   * Asks the Worker to create a PENDING donation and a signed PayFast URL (the same call the app makes).
   * The caller then sends the browser to `url`. Card details are typed on PayFast's page only.
   * method: 'cc' (credit card) or 'dc' (debit card).
   */
  async startPayment({ amount, fullName, email, method }) {
    await ready;
    if (!fb) return NOT_READY;
    const user = fb.auth.currentUser;
    if (!user || !profile) return { ok: false, error: 'Please sign in to donate.' };

    const { min, max, workerUrl } = HM_CONFIG.payfast;
    amount = Math.round(Number(amount) * 100) / 100;
    fullName = String(fullName || '').trim();
    email = String(email || '').trim();
    if (!(amount >= min && amount <= max))
      return { ok: false, error: `Enter an amount between R${min} and R${max.toLocaleString('en-ZA')}.` };
    if (!fullName) return { ok: false, error: 'Please enter your name.' };
    if (!EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email address.' };

    let res;
    try {
      const token = await user.getIdToken();
      res = await fetch(`${workerUrl}/create`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount:    amount.toFixed(2),
          frequency: 'once',
          fullName, email,
          method:    method === 'dc' ? 'dc' : 'cc',
          returnUrl: location.origin + location.pathname,   // PayFast sends the donor back to this page
        }),
      });
    } catch (err) {
      console.error('[HMAuth] Payment service unreachable:', err);
      return { ok: false, error: 'Could not reach the payment service. Please try again in a moment.' };
    }

    let data = null;
    try { data = await res.json(); } catch { /* handled below */ }
    if (!res.ok) return { ok: false, error: (data && data.error) || 'Payment could not be started.' };
    if (!data || !data.donationId || typeof data.url !== 'string' || !data.url.startsWith('https://'))
      return { ok: false, error: 'Payment could not be started.' };
    return { ok: true, donationId: data.donationId, url: data.url };
  },

  /** Calls onStatus now and on every change of donations/{id}.status. Resolves to an unsubscribe function. */
  async watchDonation(donationId, onStatus, onError) {
    await ready;
    if (!fb || !fb.auth.currentUser) { onError?.(new Error('signed-out')); return () => {}; }
    return fb.F.onSnapshot(
      fb.F.doc(fb.db, 'donations', donationId),
      snap => { const s = snap.exists() ? snap.data().status : null; if (s) onStatus(s); },
      err => { console.error('[HMAuth] watchDonation:', err); onError?.(err); },
    );
  },

  /** The signed-in donor's own donations, newest first. */
  async getDonationsForUser() {
    await ready;
    const user = fb?.auth.currentUser;
    if (!user || !profile) return [];
    try {
      const { db, F } = fb;
      const snap = await F.getDocs(F.query(F.collection(db, 'donations'), F.where('userId', '==', user.uid)));
      return snap.docs
        .map(d => {
          const x = d.data();
          return {
            id: d.id,
            amount: typeof x.amount === 'string' ? parseFloat(x.amount) || 0 : Number(x.amount) || 0,   // the Worker stores "50.00"
            status: x.status || 'PENDING',
            date: new Date(Number(x.timestamp) || 0),
          };
        })
        .sort((a, b) => b.date - a.date);        // sorted here so no composite index is needed
    } catch (err) {
      console.error('[HMAuth] Could not load donation history:', err);
      return [];
    }
  },
};

window.HMAuth = HMAuth;
