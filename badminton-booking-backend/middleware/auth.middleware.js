const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ error: "No token provided. Access denied!" });
    }

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized. Invalid token!" });
        }
        req.user = decoded; // Lưu thông tin người dùng vào request
        next();
    });
};

module.exports = verifyToken;
