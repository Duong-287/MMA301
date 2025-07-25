const mongoose = require("mongoose");
const { Schema } = mongoose;

const facilitySchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  available: { type: Boolean, default: true }
}, { _id: false }); 

const courtSchema = new Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true },
  pricePerHour: { type: Number, required: true, min: 0 },
  serviceFee: { type: Number, required: true, min: 0 },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status: { type: String, enum: ['active', 'waiting'], default: 'active' },
  description: { type: String, default: '' },
  facilities: [facilitySchema],
  rules: [{ type: String }],
  policies: [{ type: String }]
}, { timestamps: true });
courtSchema.index({ ownerId: 1 });
courtSchema.index({ status: 1 });
courtSchema.index({ address: 1 });

const Court = mongoose.model('Court', courtSchema, 'courts');
module.exports = Court;
