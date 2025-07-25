const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

const getWallet = async (req, res) => {
  const userId = req.user.id;
  try {
    const wallet = await Wallet.findOne({ userId: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    return res.status(200).json({
      wallet: {
        id: wallet._id,
        userId: wallet.userId,
        balance: wallet.balance,
      },
    });
  } catch (err) {
    console.error("Error fetching wallet information:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const depositMoney = async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid deposit amount" });
  }
  try {
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
      await wallet.save();
    }
    // Nạp tiền
    await wallet.deposit(amount);

    // Ghi lại transaction
    const transaction = new Transaction({
      walletId: wallet._id,
      type: "deposit",
      amount: amount,
      description: `Nạp tiền vào ví (+${amount} VND)`,
    });
    await transaction.save();
    return res.status(200).json({
      message: "Deposit successful",
      balance: wallet.balance,
    });
  } catch (err) {
    console.error("Error depositing money:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const withdrawMoney = async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;
  if (!amount || amount <= 0)
    return res.status(404).json("Invalid withdraw money");
  try {
    const wallet = await Wallet.findOne({ userId: userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    await wallet.withdraw(amount);
    return res
      .status(200)
      .json({ message: "Withdraw successfull", balance: wallet.balance });
  } catch (err) {
    console.log("Error at withdraw money: " + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getServiceFeeHistoryOwner = async (req, res) => {
  const userId = req.user.id;
};

module.exports = {
  getWallet,
  depositMoney,
  withdrawMoney,
  getServiceFeeHistoryOwner,
};
