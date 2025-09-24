import { useAuthStore } from "@/store/useAuthStore";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
	console.error(
		"VITE_API_BASE_URL is missing! Check .env.* and start command."
	);
}

function safeAuth() {
	try {
		return useAuthStore();
	} catch {
		return null;
	}
}

//request
async function request(
	path,
	{ method = "GET", headers = {}, body, attachAuth = true } = {}
) {
	const auth = safeAuth();
	const finalHeaders = { Accept: "application/hal+json", ...headers };

	// “Interceptor”
	if (attachAuth && auth?.accessToken) {
		finalHeaders.Authorization = `Bearer ${auth.accessToken}`;
	}

	const res = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers: finalHeaders,
		body,
	});
	return res;
}

// apiClient
export const apiClient = {
	get: (path, opts) => request(path, { ...opts, method: "GET" }),

	postJson: (path, data, opts) =>
		request(path, {
			method: "POST",
			headers: { "Content-Type": "application/json", ...(opts?.headers || {}) },
			body: JSON.stringify(data ?? {}),
			...opts,
		}),

	postForm: (path, formData, opts) =>
		request(path, { method: "POST", body: formData, ...opts }),

	putJson: (path, data, opts) =>
		request(path, {
			method: "PUT",
			headers: { "Content-Type": "application/json", ...(opts?.headers || {}) },
			body: JSON.stringify(data ?? {}),
			...opts,
		}),
};
