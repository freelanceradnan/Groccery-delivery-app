import { User } from "../Models/DefaultModel.js"

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    const adminEmails = process.env.ADMIN_EMAILS 
      ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()) 
      : [];

    
    if (!adminEmails.includes(user.email.toLowerCase())) {
      return res.status(403).json({ message: "Forbidden: You are not an admin" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      message: "Admin verification failed", 
      error: error.message 
    });
  }
};

export default adminMiddleware