const Court = require("../models/Court");

const getAllGrounds = async (req, res) => { 
  try {
    const courtList = await Court.find().populate("ownerId", "_id username email fullName phone address");
    console.log("Fetching all grounds:", courtList);
    return res.status(200).json(courtList);
  } catch (error) {
    console.error("Error fetching grounds:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
 }
const getGroundById = async (req, res) => { 
  try {
    const {id} = req.params;
    const court = await Court.findById(id).populate("ownerId", "_id username fullName email phone address");
    return res.status(200).json({court});
  } catch (err) {
    console.log("Error get court by id: " + err);
    return res.status(500).json({message: "Internal server error"});
  }
 }
const createGround = async (req, res) => { 
  const {name , ownerId, address, startTime, endTime, pricePerHour, serviceFee} = req.body;
  try {
    const newCourt = new Court({
      name,
      ownerId,
      address,
      startTime,
      endTime,
      pricePerHour,
      serviceFee
    });
    await newCourt.save();
    return res.status(201).json({message: "Ground created successfully", court: newCourt});
  } catch (error) {
    console.error("Error creating ground:", error);
    return res.status(500).json({message: "Internal server error"});
  }
 }
const updateGround = async (req, res) => { 
  const {id} = req.params;
  const {name, address, startTime, endTime, pricePerHour, serviceFee} = req.body;
  try {
    const updatedCourt = await Court.findByIdAndUpdate(id, {
      name,
      address,
      startTime,
      endTime,
      pricePerHour,
      serviceFee
    }, {new: true});
    if (!updatedCourt) {
      return res.status(404).json({message: "Ground not found"});
    }
    return res.status(200).json({message: "Ground updated successfully", court: updatedCourt});
  } catch (error) {
    console.error("Error updating ground:", error);
    return res.status(500).json({message: "Internal server error"});
  }

 }
const deleteGround = async (req, res) => { 
  const {id} = req.params;
  try {
    const deletedCourt = await Court.findByIdAndDelete(id);
    if (!deletedCourt) {
      return res.status(404).json({message: "Ground not found"});
    }
    return res.status(200).json({message: "Ground deleted successfully"});
  } catch (error) {
    console.error("Error deleting ground:", error);
    return res.status(500).json({message: "Internal server error"});
  }
 }

module.exports = {
  getAllGrounds,
  getGroundById,
  createGround,
  updateGround,
  deleteGround
};
