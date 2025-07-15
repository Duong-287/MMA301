import axios from "axios";

import { API_URL } from "../utils/config";

export const getAllGrounds = async () => {
    try {
        const response = await axios.get(`${API_URL}/grounds/`);
        return response.data;
    } catch (error) {
        if (__DEV__) {
        console.log("Error fetching grounds:", error?.response?.data || error.message);
        }
        throw { message: "Không thể lấy danh sách sân. Vui lòng thử lại." };
    }
}
export const getActiveGrounds = async () => {
    try {
        const response = await axios.get(`${API_URL}/grounds/active`);
        return response.data;
    } catch (error) {
        if (__DEV__) {
        console.log("Error fetching active grounds:", error?.response?.data || error.message);
        }
        throw { message: "Không thể lấy danh sách sân hoạt động. Vui lòng thử lại." };
    }
}
export const getReviewsByCourtId = async (courtId) => {
  try {
    const response = await axios.get(`${API_URL}/grounds/review`, {
      params: { courtId }, 
    });
    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.log("Error fetching reviews:", error?.response?.data || error.message);
    }
    throw { message: "Không thể lấy đánh giá. Vui lòng thử lại." };
  }
};