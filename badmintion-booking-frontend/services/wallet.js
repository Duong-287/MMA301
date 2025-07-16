import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { API_URL } from "../utils/config";

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
    if (__DEV__) {
      console.log("Lỗi lấy ví:", error);
      return { success: false, message: "Không thể lấy ví." };
    }
  }
};

export const getCustomerWallet = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Token không tồn tại" };
    }

    const response = await axios.get(`${API_URL}/customer/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data.wallet,
    };
  } catch (error) {
    if (__DEV__) {
      console.log("🧨 Lỗi lấy ví:", error?.response?.data || error.message);
    }

    return {
      success: false,
      message:
        error?.response?.data?.message || "Không thể lấy ví. Vui lòng thử lại.",
    };
  }
};

export const addMoneyToWallet = async (amount) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/customer/wallet/deposit`,
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: response.data.wallet };
  } catch (error) {
    if (__DEV__) {
      console.log("Lỗi nạp tiền vào ví:", error);
      return { success: false, message: "Không thể nạp tiền vào ví." };
    }
  }
};
