import axios from "axios";

// Base URL - thay đổi theo môi trường của bạn
const BASE_URL = "http://localhost:3000/api"; // hoặc URL backend của bạn

// Tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Tăng timeout cho upload ảnh
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Upload API functions
export const uploadAPI = {
  // Upload single image
  uploadImage: async (imageUri, folder = "courts") => {
    try {
      const formData = new FormData();

      // Tạo file object từ URI
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: type,
      });
      formData.append("folder", folder);

      const response = await api.post("/upload/image", formData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể upload ảnh");
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (imageUris, folder = "courts") => {
    try {
      const uploadPromises = imageUris.map((uri) =>
        uploadAPI.uploadImage(uri, folder)
      );
      const results = await Promise.all(uploadPromises);
      return results.map((result) => result.data.url);
    } catch (error) {
      throw new Error(error.message || "Không thể upload ảnh");
    }
  },

  // Delete image
  deleteImage: async (imageUrl) => {
    try {
      const response = await api.delete("/upload/image", {
        data: { imageUrl },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể xóa ảnh");
    }
  },
};

export default uploadAPI;
