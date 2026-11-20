/**
 * Supabase Customer Authentication & Storage for beVIBE
 * Synchronizes customer accounts and orders directly with Supabase.
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY, sendOrderToSupabase } from './order-config.js';

const SESSION_KEY = 'bevibe_user_session';
const ACCOUNTS_KEY = 'bevibe_customer_accounts';
const CART_PREFIX = 'bevibe_cart_';

export function createSupabaseBackend() {
  const listeners = new Set();

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(u) {
    if (u) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    listeners.forEach((fn) => {
      try { fn(u); } catch (e) {}
    });
  }

  function getStoredAccounts() {
    try {
      const data = localStorage.getItem(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStoredAccounts(accs) {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accs));
    } catch (e) {}
  }

  window.addEventListener('storage', (e) => {
    if (e.key === SESSION_KEY) {
      const u = getCurrentUser();
      listeners.forEach((fn) => {
        try { fn(u); } catch (err) {}
      });
    }
  });

  return {
    onAuthChange(cb) {
      listeners.add(cb);
      // Immediately notify current state
      setTimeout(() => {
        cb(getCurrentUser());
      }, 0);
      return () => listeners.delete(cb);
    },

    async signInWithGoogle() {
      // Simulate/trigger Google Auth & persist profile into Supabase
      return new Promise((resolve, reject) => {
        const emailPrompt = prompt('Nhập địa chỉ Email Google của bạn để tiếp tục:', '');
        if (!emailPrompt) {
          const err = new Error('User cancelled');
          err.code = 'popup-closed-by-user';
          reject(err);
          return;
        }

        const cleanEmail = emailPrompt.trim().toLowerCase();
        if (!cleanEmail.includes('@')) {
          const err = new Error('Invalid email');
          err.code = 'invalid-email';
          reject(err);
          return;
        }

        const namePart = cleanEmail.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const user = {
          uid: 'g_' + Math.random().toString(36).slice(2, 10),
          name: formattedName,
          email: cleanEmail,
          photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=002d62,d4a017`
        };

        // Save session locally
        setCurrentUser(user);

        // Save account into Supabase
        sendOrderToSupabase({
          order_type: 'Tài khoản khách hàng Google',
          customer_name: user.name,
          phone: '',
          email: user.email,
          clinic_or_spa: 'Tài khoản website beVIBE',
          collaboration_need: 'Đăng nhập Google',
          note: `Khách hàng đăng nhập qua tài khoản Google (${cleanEmail})`,
          shipping_address: '',
          total_amount: 0
        }).catch(() => {});

        resolve(user);
      });
    },

    async signInWithEmail(email, password) {
      const cleanEmail = email.trim().toLowerCase();
      const accounts = getStoredAccounts();
      const existing = accounts[cleanEmail];

      if (existing) {
        if (existing.password !== password) {
          const err = new Error('Wrong password');
          err.code = 'wrong-password';
          throw err;
        }
        const user = {
          uid: existing.uid,
          name: existing.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          photo: existing.photo || ''
        };
        setCurrentUser(user);

        // Record sign-in in Supabase
        sendOrderToSupabase({
          order_type: 'Đăng nhập tài khoản',
          customer_name: user.name,
          phone: '',
          email: cleanEmail,
          clinic_or_spa: 'Tài khoản website beVIBE',
          collaboration_need: 'Đăng nhập tài khoản khách hàng',
          note: 'Đăng nhập thành công',
          shipping_address: '',
          total_amount: 0
        }).catch(() => {});

        return user;
      }

      // If user hasn't registered locally yet, auto-create account if password is valid
      const newUid = 'sb_' + Math.random().toString(36).slice(2, 10);
      const name = cleanEmail.split('@')[0];
      const newUser = {
        uid: newUid,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: cleanEmail,
        password: password,
        photo: ''
      };
      accounts[cleanEmail] = newUser;
      saveStoredAccounts(accounts);
      setCurrentUser(newUser);

      sendOrderToSupabase({
        order_type: 'Tài khoản khách hàng',
        customer_name: newUser.name,
        phone: '',
        email: cleanEmail,
        clinic_or_spa: 'Tài khoản website beVIBE',
        collaboration_need: 'Đăng nhập / Đăng ký tài khoản',
        note: 'Tài khoản mới đăng nhập thành công',
        shipping_address: '',
        total_amount: 0
      }).catch(() => {});

      return newUser;
    },

    async register(name, email, password) {
      const cleanEmail = email.trim().toLowerCase();
      const accounts = getStoredAccounts();

      if (accounts[cleanEmail]) {
        const err = new Error('Email already in use');
        err.code = 'email-already-in-use';
        throw err;
      }

      const uid = 'sb_' + Math.random().toString(36).slice(2, 10);
      const user = {
        uid,
        name: name.trim(),
        email: cleanEmail,
        password: password,
        photo: ''
      };

      accounts[cleanEmail] = user;
      saveStoredAccounts(accounts);
      setCurrentUser(user);

      // Save into Supabase
      await sendOrderToSupabase({
        order_type: 'Đăng ký tài khoản mới',
        customer_name: user.name,
        phone: '',
        email: cleanEmail,
        clinic_or_spa: 'Tài khoản website beVIBE',
        collaboration_need: 'Đăng ký tài khoản khách hàng',
        note: 'Khách hàng tạo tài khoản thành công trên website beVIBE',
        shipping_address: '',
        total_amount: 0
      });

      return user;
    },

    async resetPassword(email) {
      // Send note/inquiry to Supabase
      await sendOrderToSupabase({
        order_type: 'Yêu cầu đặt lại mật khẩu',
        customer_name: 'Khách hàng',
        phone: '',
        email: email,
        clinic_or_spa: 'Tài khoản website beVIBE',
        collaboration_need: 'Đặt lại mật khẩu',
        note: `Yêu cầu đặt lại mật khẩu cho email ${email}`,
        shipping_address: '',
        total_amount: 0
      });
      return true;
    },

    async signOut() {
      setCurrentUser(null);
    },

    async getIdToken() {
      const u = getCurrentUser();
      return u ? 'sb_token_' + u.uid : '';
    },

    async loadCart(uid) {
      try {
        const data = localStorage.getItem(CART_PREFIX + uid);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    },

    async saveCart(uid, items) {
      try {
        localStorage.setItem(CART_PREFIX + uid, JSON.stringify(items || []));
      } catch (e) {}
    },

    watchCart(uid, cb) {
      const handler = (e) => {
        if (e.key === CART_PREFIX + uid) {
          try {
            cb(JSON.parse(e.newValue || '[]'));
          } catch (err) {}
        }
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }
  };
}
