import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Not authenticated not token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({ error: "Not authenticated invalid token" });
        }
        const user = await User.findById(decoded.userId).select("-password");

       if(!User){
        return res.status(404).json({ error: "User not found" });
       }

       req.user = user;
       next();
    }catch (err) {
        console.log("Error: in middleware " + err);
        return res.status(401).json({ error: "Not authenticated" });
    }
      
};