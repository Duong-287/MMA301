const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Create Express App
const server = express();

// Middleware parse JSON
server.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Default Route
server.get("/", (req, res) => {
  res.send("Welcome to Express Server");
});

// Start the server
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

server.listen(PORT, HOSTNAME, () => {
  console.log(`🚀 Server is running at http://${HOSTNAME}:${PORT}`);
});
