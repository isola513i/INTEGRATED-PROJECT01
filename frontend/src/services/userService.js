import { apiClient } from "@/services/httpClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (formData) => {
	try {


    const res = await apiClient.postForm(`/v2/users/register`, formData);
    if (!res.ok) throw new Error("Failed to Register");

    return await res.json();
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};

export const verfyByToken = async (token) => {
	try {
		const res = await fetch(
			`${API_BASE_URL}/v2/users/verify-email?token=${token}`,
			{
				method: "POST",
			}
		);
		return await res.json();
	} catch (error) {
		console.error("API error:", error);
		return { success: false, error };
	}
};

export const signInUser = async (email, password) => {
	const res = await fetch(`${API_BASE_URL}/v2/users/authentications`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});
	if (res.status === 403) {
		const REQUIRED = "You need to activate your account before signing in.";
		throw new Error(REQUIRED);
	}
	if (res.status === 401) {
		throw new Error("Username or Password is incorrect");
	}
	if (!res.ok) {
		const body = await res.text();
		throw new Error(body || "Sign-in failed");
	}

  return await res.json();
};

// GET PROFILE
export const getUserProfile = async (userId) => {
  const res = await apiClient.get(`/v2/users/${userId}`);

  if (res.status === 401) throw new Error("Unauthorized");
  if (res.status === 403) throw new Error("Forbidden");
  if (!res.ok) throw new Error((await res.text()) || "Failed to load profile");
  return await res.json();
};

// UPDATE PROFILE
export const updateUserProfile = async (userId, { nickName, fullName }) => {
  const payload = {};
  if (nickName !== undefined) payload.nickName = nickName;
  if (fullName !== undefined) payload.fullName = fullName;

  const res = await apiClient.putJson(`/v2/users/${userId}`, payload);
  if (res.status === 400) throw new Error("Invalid data");
  if (res.status === 401) throw new Error("Unauthorized");
  if (res.status === 403) throw new Error("Forbidden");
  if (!res.ok) throw new Error((await res.text()) || "Update profile failed");
  return await res.json();
};

export const fetchProfile = async (id) => {
  //const token = localStorage.getItem("accessToken");

//   const res = await fetch(`${API_BASE_URL}/v2/users/${id}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
	//   });
	
	const res = await apiClient.get(`/v2/users/${id}`);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
  return await res.json();
};
