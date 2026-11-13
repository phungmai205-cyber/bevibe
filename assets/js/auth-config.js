/**
 * Customer accounts (Firebase) — see HUONG-DAN-TAI-KHOAN.md.
 *
 * Paste the "firebaseConfig" object from Firebase console → Project settings → Your apps → Web app.
 * These values are public by design (they only identify the project); the data is protected by
 * the rules in firestore.rules.
 *
 * While FIREBASE_CONFIG is null the account button still shows, but sign-in is switched off
 * and the cart stays on this browser as before.
 */
export const FIREBASE_CONFIG = null;
/* Example:
export const FIREBASE_CONFIG = {
  apiKey: 'AIza...',
  authDomain: 'bevibe-xxxx.firebaseapp.com',
  projectId: 'bevibe-xxxx',
  storageBucket: 'bevibe-xxxx.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef'
};
*/
