import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.0.102:3000";

export const getOwnerWallet = async (ownerId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_URL}/owner/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data.wallet };
  } catch (error) {
    console.log("Lỗi lấy ví:", error);
    return { success: false, message: "Không thể lấy ví." };
  }
};
