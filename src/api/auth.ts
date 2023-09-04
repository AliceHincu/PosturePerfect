import axios from "./axios";

export const registerUser = async (formData: any) => {
  try {
    const response = await axios.post("/auth/register", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (formData: any) => {
  try {
    const response = await axios.post("/auth/login", formData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateSessionToken = async () => {
  try {
    const response = await axios.get("/auth/validate", { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};
