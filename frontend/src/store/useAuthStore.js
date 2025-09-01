import { defineStore } from "pinia";
import { signInUser } from "@/services/userService";

function decodeJWT(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
  return JSON.parse(decodeURIComponent(escape(atob(padded))));
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
    nickname: localStorage.getItem("nickname") || "",
  }),
  getters: { isAuthenticated: (s) => !!s.accessToken },
  actions: {
    async login(email, password) {
      const data = await signInUser(email, password);
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;

      const payload = decodeJWT(this.accessToken);
      this.nickname = payload.nickname || "";

      localStorage.setItem("accessToken", this.accessToken);
      localStorage.setItem("refreshToken", this.refreshToken);
      localStorage.setItem("nickname", this.nickname);
    },
    logout() {
      this.$reset();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("nickname");
    },
  },
});
