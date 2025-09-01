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
