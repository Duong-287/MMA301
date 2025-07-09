const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { log } = require("console");


// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, fullName, email, password, phone, role, address } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || !fullName || !role) {
      return res.status(400).json({ message: "Please fill in all information" });
    }
    // Kiểm tra role hợp lệ
    const validRoles = ["customer", "owner", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    // Kiểm tra username tồn tại
    const userExistUsername = await User.find({ "username": username });

    if (userExistUsername.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // Check email tồn tại
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "Email already exists" });

    // Mã hóa password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const Users = new User({
      username,
      password: hashedPassword,
      email,
      role,
      fullName,
      phone,
      address,
    });

    await Users.save();

    res.status(201).json({Users});
  } catch (err) {
    res.status(500).json({ message: "Server error: ", error: err.message });
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
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

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
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 tiếng
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`; // frontend
    const message = `Click vào link để đặt lại mật khẩu: ${resetUrl}`;

    await sendEmail(user.email, "Đặt lại mật khẩu", message);

    res.status(200).json({ message: "Email khôi phục đã được gửi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn." });

    user.password = password; // nhớ hash nếu dùng bcrypt
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server." });
  }
};

