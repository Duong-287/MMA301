const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const {
  verifyToken,
  isAdmin,
  isOwner,
  isCustomer,
} = require("./middleware/auth.middleware");
const path = require("path");
require("dotenv").config();

const upload = require("./utils/upload"); // import upload

const app = express();

// Kết nối MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Cho phép truy cập static file upload qua http://localhost:3000/uploads/...
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Đăng ký route upload file
app.post("/upload", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "No files were uploaded.",
      },
    });
  }

  // Trả về URL các file đã upload
  const uploadedFiles = req.files.map(file => `/uploads/${file.filename}`);

  res.status(200).json({
    message: "Files uploaded successfully",
    files: uploadedFiles,
  });
});

// Đăng ký các route public
app.use("/grounds", require("./routes/ground.routes.js"));
app.use("/auth", require("./routes/auth.routes"));

// Đăng ký các route cần xác thực
app.use("/admin", verifyToken, isAdmin, require("./routes/admin.routes"));
app.use("/owner", verifyToken, isOwner, require("./routes/owner.routes"));
app.use("/customer", verifyToken, isCustomer, require("./routes/customer.routes"));

// Xử lý lỗi 404
app.use((req, res, next) => {
  res.status(404).json({
    error: {
      status: 404,
      message: "Not Found",
    },
  });
});

// Xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running at: http://localhost:${PORT}`);
});
