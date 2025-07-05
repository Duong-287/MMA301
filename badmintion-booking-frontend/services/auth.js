// Gọi API từ phía backend (axios)
import axios from "axios";

const API_URL = "http://192.168.0.102:3000";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Server error" };
  }
};
