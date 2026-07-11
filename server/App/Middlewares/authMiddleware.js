import { TokenDecode } from "../Utils/Token.js";

const authMiddleware = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "No token provided, authorization denied" 
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = TokenDecode(token);
    
    req.user = { id: decoded.user_id };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware