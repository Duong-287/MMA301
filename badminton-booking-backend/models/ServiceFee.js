const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceFeeSchema = new Schema({
  courtId: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
  amount: { type: Number, required: true, min: 0 },
  month: { type: String, required: true }, // "2025-06"
  status: { type: String, enum: ['pending', 'completed', 'overdue'], default: 'pending' },
  dueDate: { type: Date, required: true },
  paidDate: Date
}, { timestamps: true });

serviceFeeSchema.index({ courtId: 1 });
serviceFeeSchema.index({ status: 1 });
serviceFeeSchema.index({ dueDate: 1 });
serviceFeeSchema.index({ courtId: 1, month: 1 });

const ServiceFee = mongoose.model('ServiceFee', serviceFeeSchema, 'service_fees');
module.exports = ServiceFee;