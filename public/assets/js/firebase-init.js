/**
 * Shared Firebase starter, used by auth.js (public site) and admin-portal.js (staff portal).
 * Loads the Firebase web SDK from Google's CDN and resolves { auth, db, A, F }, where
 * A = firebase-auth module and F = firebase-firestore module.
 * Resolves null when firebase-config.js still has placeholder values.
 */
import { firebaseConfig } from './firebase-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/12.19.0';

export const isConfigured = !Object.values(firebaseConfig).some(v => String(v).includes('YOUR_'));

export async function startFirebase() {
  if (!isConfigured) {
    console.warn('[Firebase] Not configured. Edit public/assets/js/firebase-config.js.');
    return null;
  }
  const [appSdk, A, F] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-auth.js`),
    import(`${SDK}/firebase-firestore.js`),
  ]);
  const app = appSdk.initializeApp(firebaseConfig);
  return { auth: A.getAuth(app), db: F.getFirestore(app), A, F };
}
