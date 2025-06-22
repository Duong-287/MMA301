const courtSchema = new Schema({
  name: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  startTime: { type: String, required: true }, // VD: "08:00"
  endTime: { type: String, required: true }, // VD: "22:00"
  pricePerHour: { type: Number, required: true, min: 0 },
  serviceFee: { type: Number, required: true, min: 0 }, // Phí dịch vụ hàng tháng
  status: { type: String, enum: ['active', 'waiting'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

courtSchema.index({ ownerId: 1 });
courtSchema.index({ status: 1 });
courtSchema.index({ address: 1 });

const Court = mongoose.model('Court', courtSchema, 'courts');
module.exports = Court;