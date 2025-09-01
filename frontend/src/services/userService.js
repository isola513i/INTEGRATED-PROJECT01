const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/v2/users/register`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to Register");

    return await res.json();
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};

<<<<<<< HEAD
export const verfyByToken = async (token)=>{
  try{
    const res = await fetch(`${API_BASE_URL}/v2/users/verify-email?token=${token}`,{
      method:"POST"
    })
    return await res.json();
  }catch(error){
    console.error("API error:", error)
    return { success: false, error };
  }
}
=======
export const signInUser = async (formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/v2/users/signIn`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to Sign In");

    return await res.json();
  } catch (error) {
    console.error("API error:", error);
    return { success: false, error };
  }
};

>>>>>>> c1f2f5a6c02f9a7338b4900f05c1f96c7c73f61f
