const express = require("express");
const {
  getInformation,
  updateUserProfile,
} = require("../controllers/UserController");
const {
  getWallet,
  depositMoney,
  withdrawMoney,
} = require("../controllers/WalletController");
const {
  createBooking,
  detailBooking,
  getBookingHistory,
  cancelBooking,
} = require("../controllers/BookingController");
const {
  addNewReviewToCourt,
  removeReviewById,
} = require("../controllers/ReviewController");
const { getTransactions } = require("../controllers/Transactions");
const router = express.Router();
const multer = require("multer");
const upload = multer();

//lịch sử giao dịch
router.get("/transaction", getTransactions);
// Xem thông tin cá nhân
router.get("/profile", getInformation);
//Update thông tin cá nhân
router.put("/profile", updateUserProfile);
// Xem số dư ví
router.get("/wallet", getWallet);
// Nạp tiền vào ví
router.post("/wallet/deposit", depositMoney);
// Rút tiền về ngân hàng
router.post("/wallet/withdraw", withdrawMoney);
// Danh sách sân đã đặt
router.get("/bookings", getBookingHistory);
// Chi tiết đơn đặt sân
router.get("/bookings/:id", detailBooking);
// Đặt sân (trừ tiền và đổi trạng thái sân)
router.post("/bookings", upload.none(), createBooking);
// Hủy đặt sân
router.delete("/bookings/:id", cancelBooking);
// send review to court
router.post("/review/:courtId", addNewReviewToCourt);
// remove review a court by id
router.delete("/review/:id", removeReviewById);

module.exports = router;
