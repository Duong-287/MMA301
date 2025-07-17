import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/config";

export const getBookingsByCourt = async (courtId) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.get(`${API_URL}/bookings/court/${courtId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi lấy đặt sân theo ID sân:", error);
    return { success: false, message: "Không thể lấy danh sách đặt sân." };
  }
};
// services/booking.js
export const createBooking = async (bookingData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    Object.entries(bookingData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Nếu là mảng (ví dụ: time), stringify lại
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await axios.post(
      `${API_URL}/customer/bookings`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi tạo đặt sân:", error?.response?.data || error.message);
    return { success: false, message: "Không thể tạo đặt sân." };
  }
};

//history booking
export const getHistoryBooking = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "Vui lòng đăng nhập để xem lịch sử đặt sân.",
      };
    }

    const response = await axios.get(`${API_URL}/customer/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi lấy danh sách đặt sân:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể lấy danh sách đặt sân.",
    };
  }
};
