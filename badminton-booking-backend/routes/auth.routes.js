const express = require("express");
const { login, register,forgotPassword, resetPassword } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot_password", forgotPassword);
router.post("/reset_password", resetPassword);

module.exports = router;