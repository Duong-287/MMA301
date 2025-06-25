export const getAllGrounds = async (req, res) => {
    try {
        const grounds = await Ground.find();
        res.status(200).json(grounds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching grounds", error: error.message });
    }
}
export const getGroundById = async (req, res) => {
    const { id } = req.params;
    try {
        const ground = await Ground.findById(id);
        if (!ground) {
            return res.status(404).json({ message: "Ground not found" });
        }
        res.status(200).json(ground);
    } catch (error) {
        res.status(500).json({ message: "Error fetching ground", error: error.message });
    }
}