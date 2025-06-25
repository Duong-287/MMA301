const getBookingHistory = async (req, res) => {
  try {
    const user = req.user; // Lấy thông tin người dùng từ token đã xác thực
    const bookings = await Booking.find({ userId: user._id }).populate(
      "groundId"
    );

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No booking history found" });
    }

    res.status(200).json({
      message: "Booking history retrieved successfully",
      bookings: bookings.map((booking) => ({
        id: booking._id,
        ground: booking.groundId.name,
        date: booking.date,
        timeSlot: booking.timeSlot,
        status: booking.status,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving booking history",
        error: error.message,
      });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const user = req.user; // Lấy thông tin người dùng từ token đã xác thực
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this booking" });
    }
    if (booking.status !== "confirmed") {
      return res
        .status(400)
        .json({ message: "Only confirmed bookings can be cancelled" });
    }
    booking.status = "cancelled";
    await booking.save();
    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: {
        id: booking._id,
        ground: booking.groundId.name,
        date: booking.date,
        timeSlot: booking.timeSlot,
        status: booking.status,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling booking", error: error.message });
  }
};

const createBooking = async (req, res) => {
  const { groundId, date, timeSlot } = req.body;

  if (!groundId || !date || !timeSlot) {
    return res
      .status(400)
      .json({ message: "Ground ID, date, and time slot are required" });
  }

  try {
    const user = req.user; // Lấy thông tin người dùng từ token đã xác thực
    const booking = new Booking({
      userId: user._id,
      groundId,
      date,
      timeSlot,
      status: "pending",
    });
    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: {
        id: booking._id,
        ground: booking.groundId.name,
        date: booking.date,
        timeSlot: booking.timeSlot,
        status: booking.status,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

const detailBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const user = req.user; // Lấy thông tin người dùng từ token đã xác thực
    const booking = await Booking.findById(bookingId).populate("groundId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this booking" });
    }

    res.status(200).json({
      message: "Booking details retrieved successfully",
      booking: {
        id: booking._id,
        ground: booking.groundId.name,
        date: booking.date,
        timeSlot: booking.timeSlot,
        status: booking.status,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving booking details",
        error: error.message,
      });
  }
};

module.exports = {
  getBookingHistory,
  cancelBooking,
  createBooking,
  detailBooking,
};
