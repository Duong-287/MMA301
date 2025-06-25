const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const {verifyToken, isAdmin, isOwner, isCustomer} = require("./middleware/auth.middleware");
require("dotenv").config();

const app = express();

// Kết nối MongoDB trước khi khởi động server
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Đăng ký các route public
app.use("/grounds", require("./routes/ground.routes.js"));
app.use("/auth", require("./routes/auth.routes"));

// Đăng ký các route cần xác thực
app.use("/admin", verifyToken, isAdmin, require("./routes/admin.routes"));
app.use("/owner", verifyToken, isOwner, require("./routes/owner.routes"));
app.use("/customer", verifyToken, isCustomer, require("./routes/customer.routes"));

// Xử lý lỗi 404 mà không cần `http-errors`
app.use((req, res, next) => {
    res.status(404).json({
        error: {
            status: 404,
            message: "Not Found"
        }
    });
});

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            status: err.status || 500,
            message: err.message || "Internal Server Error"
        }
    });
});

// Lắng nghe server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at: http://localhost:${PORT}`);
});
