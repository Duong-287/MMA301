export const getWallet = async (req, res) => {
    try {
        const user = req.user; // Lấy thông tin người dùng từ token đã xác thực
        res.status(200).json({
            message: "Wallet information retrieved successfully",
            wallet: {
                id: user._id,
                balance: user.wallet.balance,
                transactions: user.wallet.transactions
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving wallet information", error: error.message });
    }
}

export const depositMoney = async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid deposit amount" });
    }

    try {
        const user = req.user; // Lấy thông tin người dùng từ token đã xác thực
        user.wallet.balance += amount;
        user.wallet.transactions.push({
            type: 'deposit',
            amount,
            date: new Date()
        });
        await user.save();

        res.status(200).json({
            message: "Deposit successful",
            wallet: {
                id: user._id,
                balance: user.wallet.balance,
                transactions: user.wallet.transactions
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error depositing money", error: error.message });
    }
}
export const withdrawMoney = async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    try {
        const user = req.user; // Lấy thông tin người dùng từ token đã xác thực
        if (user.wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        user.wallet.balance -= amount;
        user.wallet.transactions.push({
            type: 'withdraw',
            amount,
            date: new Date()
        });
        await user.save();

        res.status(200).json({
            message: "Withdrawal successful",
            wallet: {
                id: user._id,
                balance: user.wallet.balance,
                transactions: user.wallet.transactions
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error withdrawing money", error: error.message });
    }
}

// Lịch sử thu phí dịch vụ từ owner
export const getServiceFeeHistoryOwner = async (req, res) => {
    try {
        const user = req.user; // Lấy thông tin người dùng từ token đã xác thực
        const serviceFeeHistory = user.wallet.serviceFeeHistory || [];
        
        res.status(200).json({
            message: "Service fee history retrieved successfully",
            serviceFeeHistory
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving service fee history", error: error.message });
    }
}