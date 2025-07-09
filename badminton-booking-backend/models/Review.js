const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  courtId: { type: Schema.Types.ObjectId, ref: "Court", required: true },
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, minlength: 2, maxlength: 500 },
}, { timestamps: true });


const Review = mongoose.model('Review', reviewSchema, 'reviews');
module.exports = Review;