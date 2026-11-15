
import { startFirebase, isConfigured } from './firebase-init.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let fb = null;            // { auth, db, A, F }
let startError = null;    // set if the Firebase SDK could not be loaded
let firebaseReady = Promise.resolve();   // settles when the attempt to start Firebase has finished
let users = [];           // every users/{uid} doc: { id, name, email, isVolunteer, childName, age, grade, role, roleKey, note, date, status }
let volunteers = [];      // the isVolunteer subset of `users` (same objects, so status changes show in both tabs)
let donations = [];       // { id, userId, name, email, amount, freq: 'One-time'|'Monthly', date, status }

/* ══════════════════════ Firestore → UI shapes ══════════════════════ */
const VOL_STATUS = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' };
const DB_STATUS  = { Pending: 'PENDING', Approved: 'APPROVED', Rejected: 'REJECTED' };
const DON_STATUSES = ['PENDING', 'COMPLETE', 'FAILED', 'CANCELLED'];

const toMillis = v => (typeof v === 'number' ? v : (v && typeof v.toMillis === 'function' ? v.toMillis() : Number(v) || 0));

function toUser(id, d) {
  const role = String(d.helpType || '').trim() || 'Other';
  return {
    id,
    name:        String(d.fullName || '').trim() || String(d.email || '(no name)'),
    email:       String(d.email || ''),
    isVolunteer: d.isVolunteer === true,
    childName:   String(d.childName || '').trim(),
    age:         String(d.age ?? '').trim(),
    grade:       String(d.grade ?? '').trim(),
    role,                                       // volunteers: what they want to help with (free text)
    roleKey:     role.toLowerCase(),            // ...so group it case-insensitively
    note:        String(d.skills || '').trim(),
    date:        toMillis(d.createdAt),
    status:      VOL_STATUS[d.status] || 'Pending',
  };
}

function toDonation(id, d) {
  const amount = typeof d.amount === 'string' ? parseFloat(d.amount) : Number(d.amount);   // the Worker stores "50.00"
  return {
    id,
    userId: String(d.userId || ''),
    name:   String(d.fullName || '').trim() || '(no name)',
    email:  String(d.email || ''),
    amount: Number.isFinite(amount) ? amount : 0,
    freq:   String(d.frequency || '').toLowerCase() === 'monthly' ? 'Monthly' : 'One-time',
    date:   toMillis(d.timestamp),
    status: DON_STATUSES.includes(d.status) ? d.status : 'PENDING',
  };
}

/* ══════════════════════ Formatting ══════════════════════ */
const fmtDate = ms => (ms ? new Date(ms).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
const money = n => 'R' + (Number.isInteger(n)
  ? n.toLocaleString('en-ZA')
  : n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const sameMonth = ms => { const a = new Date(ms), b = new Date(); return ms > 0 && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(); };

function friendlyError(err) {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':         return 'Incorrect email or password. Please try again.';
    case 'auth/invalid-email':          return 'Please enter a valid email address.';
    case 'auth/too-many-requests':      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed': return 'No internet connection. Please try again.';
    case 'auth/user-disabled':          return 'This account has been disabled.';
    case 'permission-denied':           return 'Permission denied. Is this account listed in the admins collection?';
    case 'unavailable':                 return 'Could not reach the database. Please try again.';
    default: console.error('[admin]', err); return 'Something went wrong. Please try again.';
  }
}

/* ══════════════════════ Sign in / out ══════════════════════ */
/** Says WHY there is no Firebase connection, so it can be fixed. */
function notConnectedMessage() {
  if (!isConfigured) return 'Firebase is not set up yet. Fill in public/assets/js/firebase-config.js with your project keys.';
  if (startError)    return `Could not load Firebase (${startError.message || startError}). Check your internet connection or ad-blocker, then reload this page.`;
  return 'Could not connect to Firebase. Reload this page and try again.';
}

function showLoginError(msg) { const e = $('loginError'); e.textContent = msg; e.style.display = 'block'; }
function clearLoginError()   { $('loginError').style.display = 'none'; }

function showLogin() {
  document.body.classList.remove('checking');
  $('adminDashboard').style.display = 'none';
  $('loginScreen').style.display = 'flex';
}

async function isAdmin(user) {
  const snap = await fb.F.getDoc(fb.F.doc(fb.db, 'admins', user.uid));   // readable by the account itself
  return snap.exists();
}

async function doLogin() {
  clearLoginError();
  const email = $('loginUser').value.trim();
  const password = $('loginPass').value;
  if (!email || !password) { showLoginError('Please enter your email and password.'); return; }

  const btn = $('loginBtn'); btn.disabled = true;
  try {
    await firebaseReady;                           // Firebase may still be downloading: wait for it instead of failing
    if (!fb) { showLoginError(notConnectedMessage()); return; }
    const cred = await fb.A.signInWithEmailAndPassword(fb.auth, email, password);
    let admin = false;
    try { admin = await isAdmin(cred.user); }
    catch (err) { await fb.A.signOut(fb.auth); showLoginError(friendlyError(err)); return; }

    if (!admin) {                                    // same message the app uses
      await fb.A.signOut(fb.auth);
      showLoginError('This account does not have admin access.');
      return;
    }
    enterDashboard(cred.user);
  } catch (err) {
    showLoginError(friendlyError(err));
  } finally {
    btn.disabled = false;
  }
}

async function doLogout() {
  try { if (fb) await fb.A.signOut(fb.auth); } catch (err) { console.error(err); }
  leaveDashboard();
}

function leaveDashboard() {
  users = []; volunteers = []; donations = [];     // don't leave records in memory or on screen after sign-out
  $('usrTableBody').textContent = ''; $('volTableBody').textContent = ''; $('donTableBody').textContent = '';
  $('roleBreakdown').textContent = ''; $('donBreakdown').textContent = '';
  $('loginUser').value = ''; $('loginPass').value = '';
  showLogin();
}

function enterDashboard(user) {
  document.body.classList.remove('checking');
  clearLoginError();
  $('loginScreen').style.display = 'none';
  $('adminDashboard').style.display = 'block';
  $('adminAvatar').textContent = (user.email || 'AD').slice(0, 2).toUpperCase();
  loadData();
}

/* ══════════════════════ Loading data ══════════════════════ */
function statusRow(cols, text) {
  return `<tr><td colspan="${cols}"><div class="empty-state"><p>${esc(text)}</p></div></td></tr>`;
}

async function loadData() {
  $('usrTableBody').innerHTML = statusRow(7, 'Loading users…');
  $('volTableBody').innerHTML = statusRow(7, 'Loading applications…');
  $('donTableBody').innerHTML = statusRow(7, 'Loading donations…');
  try {
    const { db, F } = fb;
    const [uSnap, dSnap] = await Promise.all([
      F.getDocs(F.collection(db, 'users')),
      F.getDocs(F.collection(db, 'donations')),
    ]);
    users = uSnap.docs.map(d => toUser(d.id, d.data())).sort((a, b) => b.date - a.date);
    volunteers = users.filter(u => u.isVolunteer);
    donations = dSnap.docs.map(d => toDonation(d.id, d.data())).sort((a, b) => b.date - a.date);
    renderAll();
  } catch (err) {
    const msg = `Couldn't load data. ${friendlyError(err)}`;
    $('usrTableBody').innerHTML = statusRow(7, msg);
    $('volTableBody').innerHTML = statusRow(7, msg);
    $('donTableBody').innerHTML = statusRow(7, msg);
  }
}

function renderAll() {
  updateUserStats(); renderUsers();
  updateVolStats(); renderRoleFilter(); renderVolunteers(); renderRoleBreakdown();
  updateDonStats(); renderDonations(); renderDonBreakdown();
}

/* ══════════════════════ Tabs ══════════════════════ */
function showTab(tab, el) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  $('tab-' + tab).classList.add('active');
  el.classList.add('active');
  $('pageTitle').textContent = { users: 'All users', volunteers: 'Volunteer applications', donations: 'Donation records' }[tab];
}

/* ══════════════════════ Users (learners + volunteers) ══════════════════════ */
const childText = u => [u.childName, [u.age && `Age ${u.age}`, u.grade && `Grade ${u.grade}`].filter(Boolean).join(' · ')].filter(Boolean).join(' — ');

function renderUsers() {
  const sf = $('usr-filter').value, tf = $('usr-type-filter').value;
  const q = $('usr-search').value.trim().toLowerCase();
  const rows = users.filter(u =>
    (sf === 'all' || u.status === sf) &&
    (tf === 'all' || (tf === 'Volunteer') === u.isVolunteer) &&
    (!q || `${u.name} ${u.email} ${u.childName}`.toLowerCase().includes(q)));
  const tbody = $('usrTableBody');
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>${users.length ? 'No users match these filters.' : 'No users yet.'}</p></div></td></tr>`;
    return;
  }
  const btn = (u, set, cls, label) => `<button class="action-btn ${cls}" data-user="${esc(u.id)}" data-set="${set}">${label}</button>`;
  tbody.innerHTML = rows.map(u => `
    <tr>
      <td class="name-cell"><strong>${esc(u.name)}</strong>${u.isVolunteer && u.role !== 'Other' ? `<small>${esc(u.role)}</small>` : ''}</td>
      <td class="muted">${esc(u.email)}</td>
      <td class="muted">${u.childName ? esc(childText(u)) : '—'}</td>
      <td><span class="badge ${u.isVolunteer ? 'badge-blue' : 'badge-gray'}">${u.isVolunteer ? 'Volunteer' : 'Learner'}</span></td>
      <td class="muted">${fmtDate(u.date)}</td>
      <td>${statusBadge(u.status)}</td>
      <td>${u.status === 'Pending' ? btn(u, 'Approved', 'btn-approve', 'Approve') + btn(u, 'Rejected', 'btn-reject', 'Reject')
          : u.status === 'Approved' ? btn(u, 'Rejected', 'btn-reject', 'Reject') + btn(u, 'view', 'btn-view', 'View')
          :                           btn(u, 'Approved', 'btn-approve', 'Approve') + btn(u, 'view', 'btn-view', 'View')}</td>
    </tr>`).join('');
}

function updateUserStats() {
  const pending = users.filter(u => u.status === 'Pending').length;
  $('usr-total').textContent    = users.length;
  $('usr-pending').textContent  = pending;
  $('usr-pending-sub').textContent = pending > 0 ? 'needs review' : 'all clear';
  $('usr-approved').textContent = users.filter(u => u.status === 'Approved').length;
  $('usr-month').textContent    = users.filter(u => sameMonth(u.date)).length;
  const badge = $('usersBadge');
  badge.textContent = pending;
  badge.style.display = pending > 0 ? 'flex' : 'none';
}

/* ══════════════════════ Volunteers ══════════════════════ */
function statusBadge(s) {
  if (s === 'Approved') return `<span class="badge badge-green">✓ Approved</span>`;
  if (s === 'Rejected') return `<span class="badge badge-red">✕ Rejected</span>`;
  return `<span class="badge badge-amber">● Pending</span>`;
}

/** The role dropdown is built from what volunteers actually typed, since helpType is free text. */
function roleCounts() {
  const map = new Map();
  for (const v of volunteers) {
    const e = map.get(v.roleKey) || { key: v.roleKey, label: v.role, count: 0 };
    e.count++; map.set(v.roleKey, e);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function renderRoleFilter() {
  const sel = $('vol-role-filter'), current = sel.value;
  sel.innerHTML = `<option value="all">All roles</option>` +
    roleCounts().map(r => `<option value="${esc(r.key)}">${esc(r.label)}</option>`).join('');
  sel.value = [...sel.options].some(o => o.value === current) ? current : 'all';
}

function renderVolunteers() {
  const sf = $('vol-filter').value, rf = $('vol-role-filter').value;
  const rows = volunteers.filter(v => (sf === 'all' || v.status === sf) && (rf === 'all' || v.roleKey === rf));
  const tbody = $('volTableBody');
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>${volunteers.length ? 'No applications match this filter.' : 'No volunteer applications yet.'}</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map(v => `
    <tr>
      <td class="name-cell"><strong>${esc(v.name)}</strong>${v.note ? `<small>${esc(v.note)}</small>` : ''}</td>
      <td class="muted">${esc(v.email)}</td>
      <td class="muted">—</td>
      <td>${esc(v.role)}</td>
      <td class="muted">${fmtDate(v.date)}</td>
      <td>${statusBadge(v.status)}</td>
      <td>${v.status === 'Pending'
        ? `<button class="action-btn btn-approve" data-user="${esc(v.id)}" data-set="Approved">Approve</button><button class="action-btn btn-reject" data-user="${esc(v.id)}" data-set="Rejected">Reject</button>`
        : `<button class="action-btn btn-view" data-user="${esc(v.id)}" data-set="view">View</button>`}
      </td>
    </tr>`).join('');
}

/** Approve / Reject (shared by the Users and Volunteers tables). Writes users/{id}.status, which the rules allow only for admins. */
async function updateUser(id, status) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  const buttons = [...document.querySelectorAll('button[data-user]')].filter(b => b.dataset.user === id);
  buttons.forEach(b => { b.disabled = true; });
  try {
    await fb.F.updateDoc(fb.F.doc(fb.db, 'users', id), { status: DB_STATUS[status] });
    u.status = status;                               // `volunteers` holds the same object, so both tabs stay in step
    updateUserStats(); renderUsers();
    updateVolStats(); renderVolunteers(); renderRoleBreakdown();
  } catch (err) {
    buttons.forEach(b => { b.disabled = false; });
    alert(`Update failed: ${friendlyError(err)}`);
  }
}

function showUserDetails(id) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  const lines = [`Record for ${u.name}`, `Email: ${u.email || '—'}`, `Type: ${u.isVolunteer ? 'Volunteer' : 'Learner'}`];
  if (u.childName) lines.push(`Child: ${childText(u)}`);
  if (u.isVolunteer) { lines.push(`Role: ${u.role}`); if (u.note) lines.push(`Skills: ${u.note}`); }
  lines.push(`Joined: ${fmtDate(u.date)}`, `Status: ${u.status}`);
  alert(lines.join('\n'));
}

function updateVolStats() {
  const pending = volunteers.filter(v => v.status === 'Pending').length;
  $('vol-total').textContent    = volunteers.length;
  $('vol-pending').textContent  = pending;
  $('vol-pending-sub').textContent = pending > 0 ? 'needs review' : 'all clear';
  $('vol-approved').textContent = volunteers.filter(v => v.status === 'Approved').length;
  $('vol-month').textContent    = volunteers.filter(v => sameMonth(v.date)).length;
  const badge = $('pendingBadge');
  badge.textContent = pending;
  badge.style.display = pending > 0 ? 'flex' : 'none';
}

function renderRoleBreakdown() {
  const total = volunteers.length;
  $('roleBreakdown').innerHTML = total ? roleCounts().map(r => {
    const pct = Math.round(r.count / total * 100);
    return `
      <div style="margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:.85rem;font-weight:500">${esc(r.label)}</span>
          <span style="font-size:.8rem;color:#9aada8">${r.count} <span style="color:#d94a2b">(${pct}%)</span></span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
  }).join('') : `<p style="font-size:.85rem;color:#9aada8">No applications yet.</p>`;
}

/* ══════════════════════ Donations ══════════════════════
   Like the app, money totals count only COMPLETE (paid) donations; the table shows every attempt. */
const paid = () => donations.filter(d => d.status === 'COMPLETE');

function donationBadge(s) {
  if (s === 'COMPLETE')  return `<span class="badge badge-green">✓ Confirmed</span>`;
  if (s === 'FAILED')    return `<span class="badge badge-red">✕ Failed</span>`;
  if (s === 'CANCELLED') return `<span class="badge badge-red">✕ Cancelled</span>`;
  return `<span class="badge badge-amber">● Pending</span>`;
}

/** A ready-to-send thank-you/receipt email. It opens the admin's mail app; nothing is sent automatically. */
function receiptMailto(d) {
  const subject = 'Your Happy Minds donation receipt';
  const body = `Dear ${d.name},\n\nThank you for your generous donation of ${money(d.amount)} to Happy Minds on ${fmtDate(d.date)}.\n` +
               `Payment reference: ${d.id}\n\nWith gratitude,\nThe Happy Minds team`;
  return `mailto:${encodeURIComponent(d.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function renderDonations() {
  const ff = $('don-filter').value;
  const rows = ff === 'all' ? donations : donations.filter(d => d.freq === ff);
  const tbody = $('donTableBody');
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg><p>${donations.length ? 'No donations match this filter.' : 'No donations yet.'}</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map(d => `
    <tr>
      <td class="name-cell"><strong>${esc(d.name)}</strong></td>
      <td class="muted">${esc(d.email)}</td>
      <td class="amount-cell">${money(d.amount)}</td>
      <td><span class="badge ${d.freq === 'Monthly' ? 'badge-blue' : 'badge-gray'}">${d.freq}</span></td>
      <td class="muted">${fmtDate(d.date)}</td>
      <td>${donationBadge(d.status)}</td>
      <td>${d.status === 'COMPLETE' && d.email
        ? `<button class="action-btn btn-receipt" data-receipt="${esc(d.id)}" data-mailto="${esc(receiptMailto(d))}">Send receipt</button>`
        : '<span class="muted">—</span>'}</td>
    </tr>`).join('');
}

function updateDonStats() {
  const ok = paid();
  const total = ok.reduce((s, d) => s + d.amount, 0);
  const month = ok.filter(d => sameMonth(d.date)).reduce((s, d) => s + d.amount, 0);
  $('don-total').textContent = money(total);
  $('don-month').textContent = money(month);
  $('don-count').textContent = new Set(ok.map(d => d.userId || d.email)).size;
  $('don-avg').textContent   = money(ok.length ? Math.round(total / ok.length) : 0);
}

function renderDonBreakdown() {
  const tiers = [
    { label: 'R10–R199',  min: 0,    max: 199.99   },
    { label: 'R200–R499', min: 200,  max: 499.99   },
    { label: 'R500–R999', min: 500,  max: 999.99   },
    { label: 'R1 000+',   min: 1000, max: Infinity },
  ];
  const ok = paid(), total = ok.length;
  $('donBreakdown').innerHTML = total ? tiers.map(t => {
    const inTier = ok.filter(d => d.amount >= t.min && d.amount <= t.max);
    const pct = Math.round(inTier.length / total * 100);
    const sum = inTier.reduce((s, d) => s + d.amount, 0);
    return `
      <div style="margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:.85rem;font-weight:500">${t.label}</span>
          <span style="font-size:.8rem;color:#9aada8">${inTier.length} donor${inTier.length !== 1 ? 's' : ''} · <span style="color:#d94a2b">${money(sum)}</span></span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:#1a4dad"></div></div>
      </div>`;
  }).join('') : `<p style="font-size:.85rem;color:#9aada8">No confirmed donations yet.</p>`;
}

/* ══════════════════════ Wiring & start-up ══════════════════════ */
function bindEvents() {
  $('loginBtn').addEventListener('click', doLogin);
  [$('loginUser'), $('loginPass')].forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); }));
  $('signOutLink').addEventListener('click', e => { e.preventDefault(); doLogout(); });
  $('nav-users').addEventListener('click',      e => showTab('users',      e.currentTarget));
  $('nav-volunteers').addEventListener('click', e => showTab('volunteers', e.currentTarget));
  $('nav-donations').addEventListener('click',  e => showTab('donations',  e.currentTarget));
  $('usr-filter').addEventListener('change', renderUsers);
  $('usr-type-filter').addEventListener('change', renderUsers);
  $('usr-search').addEventListener('input', renderUsers);
  $('vol-filter').addEventListener('change', renderVolunteers);
  $('vol-role-filter').addEventListener('change', renderVolunteers);
  $('don-filter').addEventListener('change', renderDonations);

  const onUserAction = e => {
    const btn = e.target.closest('button[data-user]');
    if (!btn) return;
    if (btn.dataset.set === 'view') showUserDetails(btn.dataset.user);
    else updateUser(btn.dataset.user, btn.dataset.set);
  };
  $('usrTableBody').addEventListener('click', onUserAction);
  $('volTableBody').addEventListener('click', onUserAction);
  $('donTableBody').addEventListener('click', e => {
    const btn = e.target.closest('button[data-receipt]');
    if (btn) window.location.href = btn.dataset.mailto;
  });
}

async function boot() {
  $('todayDate').textContent = new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('pendingBadge').style.display = 'none';
  $('usersBadge').style.display = 'none';
  bindEvents();

  firebaseReady = (async () => {
    try { fb = await startFirebase(); }
    catch (err) { console.error('[admin] Could not start Firebase:', err); startError = err; fb = null; }
  })();
  await firebaseReady;
  if (!fb) { showLogin(); showLoginError(notConnectedMessage()); return; }

  // Restore a saved session if it belongs to an admin; otherwise show the sign-in screen.
  // (A signed-in learner is NOT signed out: they may be using the public site in another tab.)
  let first = true;
  fb.A.onAuthStateChanged(fb.auth, async user => {
    if (first) {
      first = false;
      try { if (user && await isAdmin(user)) { enterDashboard(user); return; } }
      catch (err) { console.warn('[admin] Could not check admin access:', err); }
      showLogin();
    } else if (!user && $('adminDashboard').style.display === 'block') {
      leaveDashboard();                              // signed out elsewhere (another tab)
    }
  });
}

boot();