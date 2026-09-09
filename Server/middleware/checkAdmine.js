import { User } from "../Api/models/user.js";

export const checkAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        // שימוש ב-toLowerCase() כדי להשוות נכון, ללא קשר לאיך שזה נשמר ב-DB
        if (!user || user.role.toLowerCase() !== "admin") {
            return res.status(403).json({ message: "גישה נדחתה. מיועד למנהלים בלבד." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "שגיאה באימות מנהל", error: error.message });
    }
}