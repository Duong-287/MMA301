const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
// Load environment variables
dotenv.config();

// Create Express App
const server = express();

// Middleware parse JSON
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRoutes);
// MongoDB Connection
connectDB();

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
