import axios from "axios";

import { API_URL } from "../utils/config";

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

    throw { message: "Email hoặc mật khẩu không chính xác." };
  }
};

export const register = async (fullName, email, password, phone) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      fullName,
      email,
      password,
      phone,
    });
    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.log("Register error:", error?.response?.data || error.message);
    }
    throw { message: "Đăng ký không thành công. Vui lòng thử lại." };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot_password`, {
      email,
    });
    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.log(
        "Forgot password error:",
        error?.response?.data || error.message
      );
    }
    throw { message: "Không thể gửi email khôi phục. Vui lòng thử lại." };
  }
};

export const resetPassword = async (email, otp, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset_password`, {
      email,
      otp,
      password,
    });
    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.log(
        "Reset password error:",
        error?.response?.data || error.message
      );
    }
    throw {
      message:
        error?.response?.data?.message ||
        "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
    };
  }
};
