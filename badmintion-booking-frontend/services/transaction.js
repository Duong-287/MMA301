import axios from "axios";
import { API_URL } from "../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getTransactions = async () => {
  try {
    const token = await AsyncStorage.getItem("token"); 

    const response = await axios.get(`${API_URL}/customer/transaction`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
