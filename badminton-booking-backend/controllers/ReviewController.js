const Review = require("../models/Review");
const mongoose = require("mongoose");

const getReviewsByCourtId = async (req, res) => {
  try {
    const { courtId } = req.query;
    const trimmedCourtId = courtId?.trim();

    if (!trimmedCourtId) {
      console.warn("⚠️ Court ID is missing or invalid");
      return res.status(400).json({ message: "Court ID is required" });
    }

    let reviews = [];
    try {
      reviews = await Review.find({ courtId: trimmedCourtId })
        .populate("customerId", "fullName image")
        .sort({ createdAt: -1 });
    } catch (dbErr) {
      console.error("❌ Error querying database:", dbErr.message);
      console.error(dbErr.stack);
      return res
        .status(500)
        .json({ message: "Error fetching reviews from DB" });
    }

    const formatted = reviews.map((review) => ({
      id: review._id,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt,
      userName: review.customerId?.fullName || "Ẩn danh",
      avatar: review.customerId?._id?.toString().slice(-2) || "NA",
      images: review.customerId?.image || "Không có ảnh",
    }));

    console.log("✅ Formatted reviews:", JSON.stringify(formatted, null, 2));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("🔥 Unknown error message:", error.message);
    console.error("🔥 Full error stack:\n", error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addNewReviewToCourt = async (req, res) => {
  const { courtId } = req.params;
  const { rating, comment } = req.body;

  try {
    const newReview = new Review({
      courtId,
      userId: req.user.id,
      rating,
      comment,
    });

    await newReview.save();
    return res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const removeReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.status(200).json({ message: "Review removed successfully" });
  } catch (error) {
    console.error("Error removing review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addNewReviewToCourt,
  removeReviewById,
  getReviewsByCourtId,
};
