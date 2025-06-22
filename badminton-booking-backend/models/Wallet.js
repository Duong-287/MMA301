const walletSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

walletSchema.index({ userId: 1 });
walletSchema.index({ balance: 1 });

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;