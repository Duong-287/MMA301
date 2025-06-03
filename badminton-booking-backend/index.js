const http = require("http");
const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const server = express();

// Middleware parse JSON
server.use(express.json());

// Start the server
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
});

// 0. Welcome Route
server.get("/", (req, res) => {
  res.send("Welcome to Express Server");
});
