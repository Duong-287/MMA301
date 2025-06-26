const mongoose = require("mongoose");
const { Schema } = mongoose;

const fundSchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

fundSchema.index({ adminId: 1 });

const Fund = mongoose.model('Fund', fundSchema, 'funds');
module.exports = Fund;