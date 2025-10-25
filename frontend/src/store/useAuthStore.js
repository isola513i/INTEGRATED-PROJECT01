// src/store/useAuthStore.js (Updated)
import { defineStore } from "pinia";
import { fetchProfile, signInUser, logOut } from "@/services/userService";
import { useCartStore } from "./useCartStore";

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
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    isRefreshing: false, // Prevent multiple refresh requests
    refreshQueue: [], // Queue requests while refreshing
  }),

  getters: {
    tokenPayload: (s) => decodeJWT(s.accessToken),
    tokenExpMs: (s) => {
      const exp = decodeJWT(s.accessToken)?.exp;
      return exp ? exp * 1000 : 0;
    },
    isTokenValid: (s) => {
      if (!s.accessToken) return false;
      const now = Date.now();
      return s.tokenExpMs > now; // true if still valid
    },
    // isExpired: (s) => {
    //   if (!s.accessToken) return true;
    //   const now = Date.now();
    //   return s.tokenExpMs <= now;
    // },
    isAuthenticated: (s) => !!s.accessToken && s.isTokenValid,
    isLoggedIn: (s) => !!s.accessToken && s.isTokenValid && !!s.user,
    userId: (s) => s.user?.id,
  },

  actions: {
    setTokens(access) {
      this.accessToken = access || "";
      localStorage.setItem("accessToken", this.accessToken);
    },

    async login(email, password) {
      const res = await signInUser(email, password);
      this.setTokens(res.access_token);
      const c = decodeJWT(res.access_token);
      const user = await fetchProfile(c.id);
      this.user = user;
      localStorage.setItem("user", JSON.stringify(this.user));

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
        this.accessToken = "";
        this.user = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        const cart = useCartStore();
        cart.clear();
      }
    },

    async fetchCheckUser() {
      try {
        if (!this.isAuthenticated || !this.user?.id) return false;
        await fetchProfile(this.user.id);
      } catch {}
    },

    // ✅ NEW: Refresh access token
    async refreshAccessToken() {
      if (this.isRefreshing) {
        console.log(this.isRefreshing);
        // If already refreshing, queue this request
        return new Promise((resolve) => {
          this.refreshQueue.push(resolve);
        });
      }
      this.isRefreshing = true;

      try {
        console.log("Before Request-refresh token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/v2/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Send refresh_token cookie
            body: JSON.stringify({}),
          }
        );

        if (!res.ok) {
          window.location.replace("/ssi4/signin");
          return false;
        }

        const data = await res.json();
        this.setTokens(data.access_token);

        // Process queued requests
        this.refreshQueue.forEach((resolve) => resolve(true));
        this.refreshQueue = [];

        return true;
      } catch (err) {
        console.error("Token refresh failed:", err);
        this.refreshQueue = [];
        await this.logout();
        return false;
      } finally {
        this.isRefreshing = false;
      }
    },

    // ✅ NEW: Ensure token is valid before making requests
    async ensureValidToken() {
      // Only refresh if token is expired
      if (this.isTokenValid) {
        return true;
      }

      // Optional: If no token at all, skip refreshing
      if (!this.accessToken) {
        return false;
      }

      return await this.refreshAccessToken();
    },
  },
});
/*
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
    // setTokens(access, refresh) {
    //   this.accessToken = access || "";
    //   this.refreshToken = refresh || "";
    //   localStorage.setItem("accessToken", this.accessToken);
    //   localStorage.setItem("refreshToken", this.refreshToken);
    // }, 
    // does not need to store refresh token because it is httpOnly cookie

    setTokens(access) {
      this.accessToken = access || "";
      localStorage.setItem("accessToken", this.accessToken);
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
    // async refreshTokens() {
    //   if (!this.refreshToken) return false;

    //   try {
    //     const res = await fetch(
    //       `${import.meta.env.VITE_API_BASE_URL}/v2/auth/refresh`,
    //       {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ refresh_token: this.refreshToken }),
    //         credentials: "include", // if backend sets cookies
    //       }
    //     );

    //     if (!res.ok) throw new Error("Failed to refresh token");
    //     const data = await res.json();

    //     // Backend returns only new access token in body, refresh in cookie or body
    //     const newAccess = data.access_token;
    //     const newRefresh = data.refresh_token || this.refreshToken;

    //     this.setTokens(newAccess, newRefresh);
    //     return true;
    //   } catch (err) {
    //     console.error("Token refresh failed:", err);
    //     await this.logout();
    //     return false;
    //   }
    // },
  },
});
*/
