import axios from "axios";

const BASE_URL = "http://192.168.1.18:3000";

// Tạo Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const uploadImage = async (imageUri) => {
  try {
    const formData = new FormData();
    const filename = imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("files", {
      uri: imageUri,
      name: filename,
      type,
    });

    const response = await api.post("/upload", formData);

    // Trả về URL của ảnh đầu tiên
    return response.data.files[0];
  } catch (error) {
    console.error(
      "❌ UploadImage Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.message || "Không thể upload ảnh"
    );
  }
};

export const uploadMultipleImages = async (imageUris) => {
  try {
    const formData = new FormData();

    imageUris.forEach((uri) => {
      if (!uri.startsWith("file://")) return;

      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("files", {
        uri,
        name: filename,
        type,
      });
    });

    const response = await api.post("/upload", formData);

    // Trả về danh sách URL từ server
    return response.data.files;
  } catch (error) {
    console.error(
      "❌ UploadMultipleImages Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.message || "Không thể upload ảnh"
    );
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    const response = await api.delete("/upload/image", {
      data: { imageUrl },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Không thể xóa ảnh"
    );
  }
};
