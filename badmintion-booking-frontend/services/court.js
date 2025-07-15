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

export const updateCourt = async (courtId, courtData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    // Append các trường khác (trừ images)
    Object.entries(courtData).forEach(([key, value]) => {
      if (key !== "images" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // 👉 Lọc ảnh cũ (đã là URL) và thêm vào "images"
    const oldImages = courtData.images.filter(
      (uri) => !uri.startsWith("file://")
    );
    formData.append("images", JSON.stringify(oldImages));

    // 👉 Lọc ảnh mới (local) và thêm vào "files"
    courtData.images
      .filter((uri) => uri.startsWith("file://"))
      .forEach((uri) => {
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("files", {
          uri,
          name: filename,
          type,
        });
      });

    const response = await axios.put(
      `${API_URL}/owner/grounds/${courtId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi chỉnh sửa sân:", error.response?.data || error.message);
    return { success: false, message: "Không thể cập nhật sân." };
  }
};

export const updateCourtStatus = async (courtId, newStatus) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/owner/grounds/${courtId}/status`,
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

    const formData = new FormData();

    Object.entries(courtData).forEach(([key, value]) => {
      if (key !== "images" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const oldImages = courtData.images.filter(
      (uri) => !uri.startsWith("file://")
    );
    formData.append("images", JSON.stringify(oldImages));

    courtData.images
      .filter((uri) => uri.startsWith("file://"))
      .forEach((uri) => {
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("files", {
          uri,
          name: filename,
          type,
        });
      });

    const response = await axios.post(`${API_URL}/owner/grounds`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.log("Lỗi tạo sân:", error.response?.data || error.message);
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