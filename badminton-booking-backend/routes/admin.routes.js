const express = require("express");
const { getWallet, getServiceFeeHistoryOwner } = require("../controllers/WalletController");
const router = express.Router();

// Xem số dư ví
router.get("/wallet", getWallet);
// Xem lịch sử thu phí duy trì từ owner
router.get("/wallet/history", getServiceFeeHistoryOwner)

module.exports = router;