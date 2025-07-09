const mongoose = require("mongoose");
const { Schema } = mongoose;

const walletSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

walletSchema.methods.deposit = function(amount) {
  this.balance += amount;
  return this.save();
};

walletSchema.methods.withdraw = function(amount) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance.');
  }
  this.balance -= amount;
  return this.save();
};

const Wallet = mongoose.model('Wallet', walletSchema, 'wallets');
module.exports = Wallet;