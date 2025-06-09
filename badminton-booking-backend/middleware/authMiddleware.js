const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // check have a token or not
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // chứa id, role,...
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  } else {
    return res.status(401).json({ message: "Không tìm thấy token" });
  }
};
module.exports = authMiddleware;
