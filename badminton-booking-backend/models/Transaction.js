const transactionSchema = new Schema({
  walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
  type: { type: String, enum: ['deposit', 'booking', 'service_fee', 'refund'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  relatedId: { type: Schema.Types.ObjectId }, // Tham chiếu đến Booking hoặc Court
  createdAt: { type: Date, default: Date.now }
});

transactionSchema.index({ walletId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');
module.exports = Transaction;