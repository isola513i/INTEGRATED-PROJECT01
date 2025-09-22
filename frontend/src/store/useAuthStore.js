// src/store/useAuthStore.js
import { defineStore } from "pinia";
import { signInUser } from "@/services/userService";
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
		nickname: localStorage.getItem("nickname") || "",
		userId: +(localStorage.getItem("userId") || 0),
		email: localStorage.getItem("email") || "",
		role: localStorage.getItem("role") || "", // BUYER/SELLER
	}),

	getters: {
		isAuthenticated: (s) => !!s.accessToken,
	},

	actions: {
		setTokens(access, refresh) {
			this.accessToken = access || "";
			this.refreshToken = refresh || "";
			localStorage.setItem("accessToken", this.accessToken);
			localStorage.setItem("refreshToken", this.refreshToken);
		},
		setProfileFromAccess(accessToken) {
			const c = decodeJWT(accessToken);
			this.nickname = c.nickname || "";
			this.userId = Number(c.id || 0);
			this.email = c.email || "";
			this.role = (c.role || "").toString().toUpperCase();

			localStorage.setItem("nickname", this.nickname);
			localStorage.setItem("userId", String(this.userId || 0));
			localStorage.setItem("email", this.email);
			localStorage.setItem("role", this.role);
		},
		setNickname(nick) {
			this.setProfileFromAccess(this.accessToken);
			this.nickname = nick || this.nickname;
			localStorage.setItem("nickname", this.nickname);
		},
		setNickName(nick) {
			this.setNickname(nick);
		},

		async login(email, password) {
			const res = await signInUser(email, password);
			this.setTokens(res.access_token, res.refresh_token);
			this.setProfileFromAccess(res.access_token);
		},

		logout() {
			this.accessToken = "";
			this.refreshToken = "";
			this.nickname = "";
			this.userId = 0;
			this.email = "";
			this.role = "";

			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("nickname");
			localStorage.removeItem("userId");
			localStorage.removeItem("email");
			localStorage.removeItem("role");
		},
	},
});
