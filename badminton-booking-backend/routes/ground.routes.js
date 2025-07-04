const express = require("express");
const { getAllGrounds, getGroundById } = require("../controllers/GroundController");
const router = express.Router();

router.get("/", getAllGrounds);
router.get("/:id", getGroundById);
module.exports = router;