const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["customer", "owner", "admin"],
      required: true,
    },
    fullName: { type: String, required: true },
    phone: String,
    address: String,
    image: { type: String },
    resetPasswordOTP: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
