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

	if (attachAuth && auth?.accessToken) {
		finalHeaders.Authorization = `Bearer ${auth.accessToken}`;
	}
	if (auth?.user?.id != null) {
		finalHeaders["X-USER-ID"] = String(auth.user.id);
	}
	const hasBody = body !== undefined && body !== null;

	if (hasBody) {
		const hasCT = Object.keys(finalHeaders).some(
			(k) => k.toLowerCase() === "content-type"
		);

		if (!hasCT) {
			finalHeaders["Content-Type"] = "application/json";
		}

		if (
			finalHeaders["Content-Type"]?.includes("application/json") &&
			typeof body === "object" &&
			!(body instanceof FormData)
		) {
			body = JSON.stringify(body);
		}
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

	putFormData: (path, formData, opts) =>
		request(path, {
			method: "PUT",
			body: formData,
			...opts,
		}),
	delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
