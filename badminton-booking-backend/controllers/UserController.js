const User = require("../models/User");

const getInformation = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userInfo = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
    };
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error fetching user information:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getInformation,
};
