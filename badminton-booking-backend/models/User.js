const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['customer', 'owner', 'admin'], required: true },
  fullName: { type: String, required: true },
  phone: String,
  address: String,
}, { timestamps: true });

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
