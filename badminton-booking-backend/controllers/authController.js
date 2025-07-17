const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { log } = require("console");
const sendEmail = require("../utils/sendEmail");
const Wallet = require("../models/Wallet");
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, address, image } = req.body;
    let { role } = req.body;

    // Gán mặc định role là "customer" nếu không được gửi lên
    if (!role) {
      role = "customer";
    }

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !fullName) {
      return res
        .status(400)
        .json({ message: "Please fill in all information" });
    }

    // Kiểm tra role hợp lệ
    const validRoles = ["customer", "owner", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Kiểm tra email tồn tại
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Mã hóa password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const Users = new User({
      password: hashedPassword,
      email,
      role,
      fullName,
      phone,
      address,
      image,
    });

    await Users.save();

    await Wallet.create({
      userId: Users._id,
      balance: 0,
    });

    res.status(201).json({ Users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP tạo ra:", otp);
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút

    console.log("Current:", Date.now());
    console.log("Expires:", user?.resetPasswordExpires?.getTime());
    await user.save();

    const message = `
      <p>Xin chào ${user.fullName},</p>
      <p>Mã khôi phục mật khẩu của bạn là: <b>${otp}</b></p>
      <p>Mã có hiệu lực trong 10 phút.</p>
    `;

    await sendEmail(user.email, "Mã khôi phục mật khẩu", message, true);
    res
      .status(200)
      .json({ message: "Mã khôi phục đã được gửi đến email của bạn." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  console.log("==== DEBUG RESET PASSWORD ====");
  console.log("Body nhận:", req.body);
  console.log("Email nhận:", email);
  console.log("OTP nhận:", otp);
  try {
    const user = await User.findOne({
      email: String(email).trim(),
      resetPasswordOTP: String(otp).trim(),
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log("User tìm thấy:", user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
