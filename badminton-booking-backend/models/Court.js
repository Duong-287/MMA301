const mongoose = require("mongoose");
const { Schema } = mongoose;

const courtSchema = new Schema({
  name: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true },
  pricePerHour: { type: Number, required: true, min: 0 },
  serviceFee: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['active', 'waiting'], default: 'active' }
}, { timestamps: true });

courtSchema.index({ ownerId: 1 });
courtSchema.index({ status: 1 });
courtSchema.index({ address: 1 }); 

const Court = mongoose.model('Court', courtSchema, 'courts');
module.exports = Court;