import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Base URL - thay đổi theo môi trường của bạn
const BASE_URL = "http://localhost:3000/owner"; // hoặc URL backend của bạn

// Tạo axios instance với config chung
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = AsyncStorage.getItem("authorization"); // hoặc AsyncStorage trong React Native
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Booking API functions
export const bookingAPI = {
  // Lấy lịch trình của một sân theo ngày
  getCourtSchedule: async (courtId, date) => {
    try {
      const response = await api.get(`/bookings/court/${courtId}/schedule`, {
        params: { date: date.toISOString().split("T")[0] }, // Format: YYYY-MM-DD
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy lịch trình sân"
      );
    }
  },

  // Lấy lịch trình của nhiều sân theo ngày
  getCourtsSchedule: async (courtIds, date) => {
    try {
      const response = await api.post(`/bookings/courts/schedule`, {
        courtIds,
        date: date.toISOString().split("T")[0],
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy lịch trình các sân"
      );
    }
  },

  // Lấy danh sách booking theo owner
  getBookingsByOwner: async (ownerId, filters = {}) => {
    try {
      const response = await api.get(`/bookings/owner/${ownerId}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách booking"
      );
    }
  },

  // Tạo booking mới
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể tạo booking");
    }
  },

  // Cập nhật trạng thái booking
  updateBookingStatus: async (bookingId, status, reason = null) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, {
        status,
        reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể cập nhật trạng thái booking"
      );
    }
  },

  // Hủy booking
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể hủy booking");
    }
  },

  // Block/Unblock time slot
  blockTimeSlot: async (courtId, date, startTime, endTime, reason) => {
    try {
      const response = await api.post("/bookings/block-slot", {
        courtId,
        date: date.toISOString().split("T")[0],
        startTime,
        endTime,
        reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể khóa slot thời gian"
      );
    }
  },

  // Unblock time slot
  unblockTimeSlot: async (blockId) => {
    try {
      const response = await api.delete(`/bookings/block-slot/${blockId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể mở khóa slot thời gian"
      );
    }
  },

  // Lấy thống kê booking
  getBookingStats: async (ownerId, startDate, endDate) => {
    try {
      const response = await api.get(`/bookings/stats/${ownerId}`, {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy thống kê booking"
      );
    }
  },
};

export default bookingAPI;
