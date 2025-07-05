const Booking = require("../models/Booking");
const Court = require("../models/Court");
const Wallet = require("../models/Wallet");

const getBookingHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const bookingHistory = await Booking.find({ customerId: userId });
    return res.status(200).message({ Booking: bookingHistory });
  } catch (err) {
    console.log("Error at get booking history: " + err);
    return res.status(500).json("Internal system error");
  }
};

const cancelBooking = async (req, res) => {
  const userId = req.user.id;
  const { id: bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.customerId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // Kiểm tra thời gian huỷ cách startTime ít nhất 1 tiếng
    const now = new Date();
    const oneHourInMs = 60 * 60 * 1000;
    if (new Date(booking.startTime) - now < oneHourInMs) {
      return res.status(400).json({
        message: "Cannot cancel because start time is less than 1 hour away",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    const wallet = await Wallet.findOne({ userId: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    await wallet.deposit(booking.totalPrice);

    return res.status(200).json({
      message: "Booking cancelled and refund successful",
      refundAmount: booking.totalPrice,
      newBalance: wallet.balance,
    });
  } catch (err) {
    console.error("Error at cancelBooking:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Tạo hàm parse HH:mm
const parseTimeToDecimal = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour + minute / 60;
};

const createBooking = async (req, res) => {
  const userId = req.user.id;
  const timeNow = new Date();
  const { courtId, startTime, endTime } = req.body;

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Làm tròn về phút
    start.setSeconds(0, 0);
    end.setSeconds(0, 0);
    timeNow.setSeconds(0, 0);

    // Kiểm tra thời gian
    if (!(start > timeNow && end > start)) {
      return res
        .status(400)
        .json({ message: "Invalid start time or end time" });
    }

    const totalHours = (end - start) / (1000 * 60 * 60);

    const court = await Court.findById(courtId);
    if (!court) return res.status(404).json("Court not found");
    /// 1. Parse giờ từ booking request
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;

    // 2. Parse giờ mở cửa - đóng cửa từ court
    const openHour = parseTimeToDecimal(court.startTime); // từ "06:00"
    const closeHour = parseTimeToDecimal(court.endTime); // từ "22:00"

    // 3. So sánh điều kiện
    if (startHour < openHour || endHour > closeHour) {
      return res.status(400).json({
        message: `You only can book from ${court.startTime} to ${court.endTime}`,
      });
    }

    const price = totalHours * court.pricePerHour;

    const newBooking = new Booking({
      courtId,
      customerId: userId,
      startTime: start,
      endTime: end,
      totalPrice: price,
      status: "confirmed",
    });

    const booked = await newBooking.save();

    if (!booked) {
      return res.status(500).json({ message: "Booking failed" });
    }

    // Tìm ví và trừ tiền
    const wallet = await Wallet.findOne({ userId: userId });
    if (!wallet) {
      // Xoá booking nếu không có ví
      await Booking.findByIdAndDelete(booked._id);
      return res.status(404).json({ message: "Wallet not found" });
    }

    try {
      await wallet.withdraw(booked.totalPrice);
    } catch (err) {
      // Trường hợp không đủ tiền -> xoá booking
      await Booking.findByIdAndDelete(booked._id);
      if (err.message.includes("Insufficient balance."))
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Insufficient balance." });
    }

    return res.status(201).json({
      message: "Booking successful",
      booking: booked,
      newBalance: wallet.balance,
    });
  } catch (err) {
    console.error("Error at create booking:", err.message);

    if (err.message.includes("This time slot has been booked.")) {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const detailBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const bookingDetail = await Booking.findById(id);
    return res.status(200).json({ Booking: bookingDetail });
  } catch (err) {
    console.log("error at view detail booking: " + err);
    return res.status(500).json({ message: "Internal systerm error" });
  }
};

const getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const bookingDetail = await Booking.findById(id);
    return res.status(200).json({ Booking: bookingDetail });
  } catch (err) {
    console.log("error at view detail booking: " + err);
    return res.status(500).json({ message: "Internal systerm error" });
  }
};

module.exports = {
  getBookingHistory,
  cancelBooking,
  createBooking,
  detailBooking,
  getBookingById,
};
