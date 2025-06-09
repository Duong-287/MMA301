const adminMiddleware = (req, res, next) => {
  // Kiểm tra xem người dùng có quyền admin hay không
  if (req.user && req.user.role === "admin") {
    next(); // Cho phép tiếp tục nếu là admin
  } else {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" }); // Trả về lỗi nếu không phải admin
  }
};

module.exports = adminMiddleware;

