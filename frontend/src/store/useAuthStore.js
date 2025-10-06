// src/store/useAuthStore.js
import { defineStore } from "pinia";
import { fetchProfile, signInUser, logOut } from "@/services/userService";
import { useCartStore } from "./useCartStore";

// decode JWT
function decodeJWT(token) {
  if (!token) return {};
  const base64Url = token.split(".")[1] || "";
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4))
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(json || "{}");
}

let expiryTimer = null;
function clearExpiryTimer() {
  if (expiryTimer) {
    clearTimeout(expiryTimer);
    expiryTimer = null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  }),

  getters: {
    tokenPayload: (s) => decodeJWT(s.accessToken),
    tokenExpMs: (s) => {
      const exp = decodeJWT(s.accessToken)?.exp; // seconds
      return exp ? exp * 1000 : 0;
    },
    isTokenValid: (s) => {
      if (!s.accessToken) return false;
      const now = Date.now();
      return s.tokenExpMs > now; // ยังไม่หมดอายุ
    },

    // ✅ ปรับให้ดูวันหมดอายุจริง ๆ
    isAuthenticated: (s) => !!s.accessToken && s.isTokenValid,
    isLoggedIn: (s) => !!s.accessToken && s.isTokenValid && !!s.user,

    userId: (s) => s.user?.id,
  },

  actions: {
    setTokens(access, refresh) {
      this.accessToken = access || "";
      this.refreshToken = refresh || "";
      localStorage.setItem("accessToken", this.accessToken);
      localStorage.setItem("refreshToken", this.refreshToken);

      // ตั้ง timer ง่าย ๆ ให้ logout เมื่อถึงเวลา (ลบ 10 วินาทีเผื่อ)
      clearExpiryTimer();
      const payload = decodeJWT(this.accessToken);
      const expMs = payload?.exp ? payload.exp * 1000 : 0;
      const remain = expMs - Date.now() - 10_000;
      if (remain > 0) {
        expiryTimer = setTimeout(() => {
          // หมดอายุแล้ว → logout อัตโนมัติ
          this.logout();
        }, remain);
      }
    },

    // ✅ เรียกตอนบูตแอป: เคลียร์ token ที่หมดอายุแล้วทันที
    hydrate() {
      if (!this.isTokenValid) {
        this.accessToken = "";
        this.refreshToken = "";
        this.user = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        clearExpiryTimer();
      } else {
        // ถ้ายัง valid ให้ตั้ง timer ตาม setTokens()
        this.setTokens(this.accessToken, this.refreshToken);
      }
    },

    async login(email, password) {
      const res = await signInUser(email, password);
      this.setTokens(res.access_token, res.refresh_token);
      const c = decodeJWT(res.access_token);
      const user = await fetchProfile(c.id);
      this.user = user;
      localStorage.setItem("user", JSON.stringify(this.user));

      // ✅ เคลียร์ตะกร้าทุกครั้งที่ login สำเร็จ
      const cart = useCartStore();
      cart.clear();
    },

    async logout() {
      try {
        if (this.isAuthenticated) {
          await logOut();
        }
      } catch (err) {
        // ignore
      } finally {
        clearExpiryTimer();
        this.accessToken = "";
        this.refreshToken = "";
        this.user = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        const cart = useCartStore();
        cart.clear();
      }
    },

    // (สะกดเดิมไว้ให้ ใช้ได้เหมือนเดิม)
    async fectchCheckUser() {
      try {
        if (!this.user?.id) return;
        const res = await fetchProfile(this.user.id);
        if (!res || !res.id) {
          this.logout();
        }
      } catch (er) {
        this.logout();
      }
    },
  },
});
