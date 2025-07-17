const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

const getTransactions = async (req, res) => {
  const userId = req.user.id;
  console.log("User ID:", userId);
  try {
    const wallet = await Wallet.findOne({ userId: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    // Lấy danh sách transaction, sắp xếp mới nhất trước
    const transactions = await Transaction.find({ walletId: wallet._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      wallet: {
        id: wallet._id,
        userId: wallet.userId,
        balance: wallet.balance,
      },
      data: transactions,
    });
  } catch (err) {
    console.error("Error fetching wallet information:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getTransactions,
};
