const express = require("express");
const {
  getAllGrounds,
  getGroundById,
  getActiveGrounds,
} = require("../controllers/GroundController");
const router = express.Router();

router.get("/", getAllGrounds);
router.get("/active", getActiveGrounds);
router.get("/:id", getGroundById);
module.exports = router;
