import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/config";
export const getCourtsByOwner = async (ownerId) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.get(`${API_URL}/owner/grounds`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const filtered = response.data.filter(
      (court) => court.ownerId?._id?.toString() === ownerId?.toString()
    );
    return { success: true, data: filtered };
  } catch (error) {
    console.log("Lỗi lấy sân theo chủ sân:", error);
    return { success: false, message: "Không thể lấy danh sách sân." };
  }
};

export const getCourtById = async (courtId) => {
  try {
    const response = await axios.get(`${API_URL}/grounds/${courtId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi lấy sân theo ID:", error);
    return { success: false, message: "Không thể lấy sân." };
  }
};

export const updateCourt = async (courtId, updatedData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/owner/grounds/${courtId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi chỉnh sửa trạng thái sân:", error);
    return { success: false, message: "Không thể cập nhật trạng thái sân." };
  }
};

export const updateCourtStatus = async (courtId, newStatus) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/owner/grounds/${courtId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi chỉnh sửa trạng thái sân:", error);
    return { success: false, message: "Không thể cập nhật trạng thái sân." };
  }
};

export const createCourt = async (courtData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(`${API_URL}/owner/grounds`, courtData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi tạo sân:", error);
    return { success: false, message: "Không thể tạo sân." };
  }
};

export const deleteCourt = async (courtId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/owner/grounds/${courtId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi xóa sân:", error);
    return { success: false, message: "Không thể xóa sân." };
  }
};
