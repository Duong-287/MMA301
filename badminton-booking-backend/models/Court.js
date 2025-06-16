const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String, // URL hình ảnh
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // người sở hữu sân (nếu có)
      required: false,
    },
    openTime: {
      type: String, // "06:00"
      required: true,
    },
    closeTime: {
      type: String, // "22:00"
      required: true,
    },
    hourlyPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Court", courtSchema);
