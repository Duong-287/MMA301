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
    if (__DEV__) {
      console.log("Login error:", error?.response?.data || error.message);
    }

    // Ẩn lỗi chi tiết, chỉ báo chung chung
    throw { message: "Email hoặc mật khẩu không chính xác." };
  }
};
