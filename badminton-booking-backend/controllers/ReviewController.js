const Review = require("../models/Review");

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
    return res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

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
}

module.exports = {
  addNewReviewToCourt,
  removeReviewById,
};