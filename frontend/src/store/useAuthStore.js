// src/store/useAuthStore.js
import { defineStore } from 'pinia';
import { fetchProfile, signInUser } from '@/services/userService';

// decode JWT
function decodeJWT(token) {
  if (!token) return {};
  const base64Url = token.split('.')[1] || '';
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4))
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json || '{}');
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null,
  }),

  getters: {
    isAuthenticated: (s) => !!s.accessToken,
    isLoggedIn: (s) => !!s.accessToken && !!s.user, // เพิ่ม isLoggedIn
    userId: (s) => s.user?.id, // เพิ่ม userId getter
  },

  actions: {
    setTokens(access, refresh) {
      this.accessToken = access || '';
      this.refreshToken = refresh || '';
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
    },

    async login(email, password) {
      const res = await signInUser(email, password);
      this.setTokens(res.access_token, res.refresh_token);
      const c = decodeJWT(res.access_token);
      console.log(c);
      const user = await fetchProfile(c.id);
      this.user = user;
      localStorage.setItem('user', JSON.stringify(this.user));
    },

    logout() {
      this.$reset();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },

    // ย้ายเข้ามาใน actions และแก้ไข syntax
    async fectchCheckUser() {
      try {
        if (!this.user?.id) return;
        const res = await fetchProfile(this.user.id);
        if (!res || !res.id) {
          this.logout(); // แก้ไขเพิ่ม ()
        }
      } catch (er) {
        this.logout(); // แก้ไขเพิ่ม ()
      }
    },
  },
});
