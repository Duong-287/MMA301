const express = require("express");
const router = express.Router();
const { depositMoney, withdrawMoney, getWallet } = require("../controllers/WalletController");
const { getAllGrounds, createGround, updateGround, deleteGround,  updateGroundStatus } = require("../controllers/GroundController");
const { getBookingHistory, getBookingById } = require("../controllers/BookingController");
const { getInformation } = require("../controllers/UserController");
const upload = require("../utils/upload");

router.get("/profile", getInformation);
router.get("/wallet", getWallet);
router.post("/wallet/deposit", depositMoney);
router.post("/wallet/withdraw", withdrawMoney);
router.get("/grounds", getAllGrounds);
router.post("/grounds", upload.array("images"), createGround);
router.put("/grounds/:id", upload.array("images"), updateGround);
router.put("/grounds/:id/status", updateGroundStatus);
router.delete("/grounds/:id", deleteGround);
router.get("/bookings", getBookingHistory);
router.get("/bookings/:id", getBookingById);

module.exports = router;