export const getInformation = async (req, res) => {
    try {
        const user = req.user; // Lấy thông tin người dùng từ token đã xác thực
        res.status(200).json({
            message: "User information retrieved successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user information", error: error.message });
    }
}