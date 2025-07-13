const Court = require("../models/Court");
const fs = require("fs");
const path = require("path");

const getAllGrounds = async (req, res) => {
  try {
    const courtList = await Court.find().populate(
      "ownerId",
      "_id username email fullName phone address"
    );
    console.log("Fetching all grounds:", courtList);
    return res.status(200).json(courtList);
  } catch (error) {
    console.error("Error fetching grounds:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getGroundById = async (req, res) => {
  try {
    const { id } = req.params;
    const court = await Court.findById(id).populate(
      "ownerId",
      "_id username fullName email phone address"
    );
    return res.status(200).json({ court });
  } catch (err) {
    console.log("Error get court by id: " + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const createGround = async (req, res) => {
  const {
    name,
    address,
    startTime,
    endTime,
    latitude,
    longitude,
    pricePerHour,
    serviceFee,
  } = req.body;
  const { ownerId } = req.user;
  const images = req.files.map((file) => `/uploads/${file.filename}`);

  try {
    const newCourt = await Court.create({
      name,
      images,
      ownerId,
      address,
      startTime,
      endTime,
      pricePerHour,
      latitude,
      longitude,
      serviceFee,
    });
    return res
      .status(201)
      .json({ message: "Ground created successfully", court: newCourt });
  } catch (error) {
    console.error("Error creating ground:", error);

    // rollback file tránh rác
    req.files.forEach((file) => {
      fs.unlink(path.join(__dirname, "..", "uploads", file.filename), (err) => {
        if (err) console.error("Error deleting file:", file.filename, err);
      });
    });

    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateGround = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    startTime,
    endTime,
    pricePerHour,
    latitude,
    longitude,
    serviceFee,
  } = req.body;

  const newImages = req.files.map((file) => `/uploads/${file.filename}`);

  try {
    // Lấy court cũ
    const existingCourt = await Court.findById(id);
    if (!existingCourt) {
      return res.status(404).json({ message: "Ground not found" });
    }

    // Gộp ảnh cũ và ảnh mới
    const updatedImages = [...existingCourt.images, ...newImages];

    // Update
    existingCourt.name = name ?? existingCourt.name;
    existingCourt.address = address ?? existingCourt.address;
    existingCourt.startTime = startTime ?? existingCourt.startTime;
    existingCourt.endTime = endTime ?? existingCourt.endTime;
    existingCourt.pricePerHour = pricePerHour ?? existingCourt.pricePerHour;
    existingCourt.latitude = latitude ?? existingCourt.latitude;
    existingCourt.longitude = longitude ?? existingCourt.longitude;
    existingCourt.serviceFee = serviceFee ?? existingCourt.serviceFee;
    existingCourt.images = updatedImages;

    await existingCourt.save();

    return res
      .status(200)
      .json({ message: "Ground updated successfully", court: existingCourt });
  } catch (error) {
    console.error("Error updating ground:", error);

    // rollback file nếu lỗi
    req.files.forEach((file) => {
      fs.unlink(path.join(__dirname, "..", "uploads", file.filename), (err) => {
        if (err) console.error("Error deleting file:", file.filename, err);
      });
    });

    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteGround = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourt = await Court.findByIdAndDelete(id);
    if (!deletedCourt) {
      return res.status(404).json({ message: "Ground not found" });
    }
    return res.status(200).json({ message: "Ground deleted successfully" });
  } catch (error) {
    console.error("Error deleting ground:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getActiveGrounds = async (req, res) => {
  try {
    const activeCourts = await Court.find({ status: "active" }).populate(
      "ownerId",
      "_id username email fullName phone address"
    );

    return res.status(200).json(activeCourts);
  } catch (error) {
    console.error("Error fetching active grounds:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllGrounds,
  getGroundById,
  createGround,
  updateGround,
  deleteGround,
  getActiveGrounds,
};
