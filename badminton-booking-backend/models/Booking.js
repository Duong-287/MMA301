const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema({
  courtId: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

bookingSchema.index({ courtId: 1, startTime: 1, endTime: 1 });

bookingSchema.pre('save', async function(next) {
  const overlappingBooking = await this.constructor.findOne({
    courtId: this.courtId,
    status: { $ne: 'cancelled' },
    startTime: { $lt: this.endTime },
    endTime: { $gt: this.startTime }
  });
  if (overlappingBooking) {
    throw new Error('Khung giờ này đã được đặt.');
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema, 'bookings');
module.exports = Booking;
