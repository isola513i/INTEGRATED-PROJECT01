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
    },

    async login(email, password) {
      const res = await signInUser(email, password);
      this.setTokens(res.access_token, res.refresh_token);
      const c = decodeJWT(res.access_token);
      console.log(c);
      const user = await fetchProfile(c.id);
      this.user = user;
      localStorage.setItem("user", JSON.stringify(this.user));

      const cart = useCartStore();
      cart.getItems();
    },

    async logout() {
      try {
        if (this.isAuthenticated) {
          await logOut();
        }
      } catch (err) {
        // ignore
      } finally {
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

    async fetchCheckUser() {
      try {
        if (!this.isAuthenticated || !this.user?.id) return false;
        await fetchProfile(this.user.id);
      } catch {
        await this.logout();
      }
    },
  },
});
