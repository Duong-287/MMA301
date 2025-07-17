const Booking = require("../models/Booking");
const Court = require("../models/Court");
const Wallet = require("../models/Wallet");
const moment = require("moment-timezone");
const getBookingHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    // Lấy lịch sử booking của user, kèm theo populate để lấy tên sân
    const bookingHistory = await Booking.find({ customerId: userId }).populate(
      "courtId", // populate theo courtId
      "name" // chỉ lấy trường name của sân
    );

    // Định dạng lại dữ liệu trước khi trả về
    const formatted = bookingHistory.map((booking) => ({
      _id: booking._id,
      courtName: booking.courtId?.name || "N/A", // phòng trường hợp court bị xóa
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      totalAmount: booking.totalPrice,
    }));
    console.log(formatted);
    // Trả dữ liệu về frontend
    return res.status(200).json({ bookings: formatted });
  } catch (err) {
    console.log("❌ Error at getBookingHistory:", err);
    return res.status(500).json({ message: "Internal system error" });
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
  const { courtId, startTime, endTime } = req.body;

  try {
    const start = moment(startTime).tz("Asia/Ho_Chi_Minh").toDate();
    const end = moment(endTime).tz("Asia/Ho_Chi_Minh").toDate();
    const timeNow = moment().tz("Asia/Ho_Chi_Minh").toDate();

    // Kiểm tra thời gian đặt
    const startMs = start.getTime();
    const endMs = end.getTime();
    const nowMs = timeNow.getTime();

    if (startMs <= nowMs) {
      return res
        .status(400)
        .json({ message: "Start time must be in the future" });
    }

    if (endMs <= startMs) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    const totalHours = (end - start) / (1000 * 60 * 60);

    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json("Court not found");
    }

    const startHour = new Date(startTime).getUTCHours() + 7;
    const endHour = end.getHours() + end.getMinutes() / 60;

    if (startHour < 7 || startHour >= 22) {
      return res
        .status(400)
        .json({ message: "You only can book from 07:00 to 22:00" });
    }

    const openHour = parseTimeToDecimal(court.startTime);
    const closeHour = parseTimeToDecimal(court.endTime);

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

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      await Booking.findByIdAndDelete(booked._id);
      return res.status(404).json({ message: "Wallet not found" });
    }

    try {
      await wallet.withdraw(booked.totalPrice);
    } catch (err) {
      await Booking.findByIdAndDelete(booked._id);
      return res
        .status(400)
        .json({ message: err.message || "Insufficient balance." });
    }

    return res.status(201).json({
      message: "Booking successful",
      booking: booked,
      newBalance: wallet.balance,
    });
  } catch (err) {
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
