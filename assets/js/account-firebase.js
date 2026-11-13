/**
 * Firebase login + cart storage for account.js. Loaded on demand (separate file in the build).
 *
 * Data: Firestore document carts/{uid} = { items: [{ id, qty }], updatedAt }.
 * Only the signed-in owner can read / write it (firestore.rules).
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, sendEmailVerification, signOut
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

export function createFirebaseBackend(config) {
  const app = initializeApp(config);
  const auth = getAuth(app);
  auth.languageCode = 'vi';
  const db = getFirestore(app);
  const cartDoc = (uid) => doc(db, 'carts', uid);
  const toUser = (u) => (u ? { uid: u.uid, name: u.displayName || '', email: u.email || '', photo: u.photoURL || '' } : null);

  return {
    onAuthChange(cb) {
      return onAuthStateChanged(auth, (u) => cb(toUser(u)));
    },
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    },
    async signInWithEmail(email, password) {
      await signInWithEmailAndPassword(auth, email, password);
    },
    async register(name, email, password) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      sendEmailVerification(cred.user).catch(() => {});
      // The sign-in was announced before the name was set: hand the named account back
      return toUser(cred.user);
    },
    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (err) {
        // Don't reveal whether the email has an account
        if (!/user-not-found/.test(err && err.code)) throw err;
      }
    },
    async signOut() {
      await signOut(auth);
    },
    async getIdToken() {
      return auth.currentUser ? auth.currentUser.getIdToken() : '';
    },
    async loadCart(uid) {
      const snap = await getDoc(cartDoc(uid));
      return snap.exists() && Array.isArray(snap.data().items) ? snap.data().items : [];
    },
    async saveCart(uid, items) {
      await setDoc(cartDoc(uid), { items: items.slice(0, 100).map((it) => ({ id: String(it.id), qty: Number(it.qty) })), updatedAt: serverTimestamp() });
    },
    watchCart(uid, cb) {
      // Changes made on another device / tab; our own pending writes are skipped
      return onSnapshot(cartDoc(uid), (snap) => {
        if (snap.metadata.hasPendingWrites || !snap.exists()) return;
        const items = snap.data().items;
        if (Array.isArray(items)) cb(items);
      }, () => {});
    }
  };
}
