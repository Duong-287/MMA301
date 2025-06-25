const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Mật khẩu đã mã hóa
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['customer', 'owner', 'admin'], required: true },
  fullName: { type: String, required: true },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
