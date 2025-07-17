import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/config";

export const getUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Không tìm thấy token." };
    }

    const response = await axios.get(`${API_URL}/customer/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi lấy profile người dùng:", error);

    const message =
      error.response?.data?.message || "Không thể lấy thông tin người dùng.";

    return { success: false, message };
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Không tìm thấy token." };
    }

    const response = await axios.put(`${API_URL}/customer/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi cập nhật profile người dùng:", error);

    const message =
      error.response?.data?.message ||
      "Không thể cập nhật thông tin người dùng.";

    return { success: false, message };
  }
};

export const getUserWallet = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Không tìm thấy token." };
    }

    const response = await axios.get(`${API_URL}/customer/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi lấy wallet người dùng:", error);

    const message =
      error.response?.data?.message || "Không thể lấy wallet người dùng.";

    return { success: false, message };
  }
};

export const userBooking = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Không tìm thấy token." };
    }

    const response = await axios.get(`${API_URL}/customer/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi lấy booking người dùng:", error);

    const message =
      error.response?.data?.message || "Không thể lấy booking người dùng.";

    return { success: false, message };
  }
};
export const createUserBooking = async (bookingData) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Không tìm thấy token." };
    }

    const response = await axios.post(
      `${API_URL}/customer/bookings`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi tạo booking:", error);

    const message =
      error.response?.data?.message || "Không thể tạo booking mới.";

    return { success: false, message };
  }
};
