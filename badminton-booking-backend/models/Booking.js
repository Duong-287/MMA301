const bookingSchema = new Schema({
  courtId: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

bookingSchema.index({ courtId: 1 });
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ startTime: 1 });
bookingSchema.index({ endTime: 1 });
bookingSchema.index({ courtId: 1, startTime: 1, endTime: 1 });

bookingSchema.pre('save', async function(next) {
  // Kiểm tra khung giờ hợp lệ và không trùng lặp
  const overlappingBooking = await this.constructor.findOne({
    courtId: this.courtId,
    status: { $ne: 'cancelled' },
    $or: [
      { startTime: { $lt: this.endTime, $gte: this.startTime } },
      { endTime: { $gt: this.startTime, $lte: this.endTime } },
      { $and: [{ startTime: { $lte: this.startTime } }, { endTime: { $gte: this.endTime } }] }
    ]
  });
  if (overlappingBooking) {
    throw new Error('Khung giờ này đã được đặt.');
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema, 'bookings');
module.exports = Booking;