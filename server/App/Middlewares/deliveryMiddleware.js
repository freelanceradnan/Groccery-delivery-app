import jwt from "jsonwebtoken";
import { DeliveryPartner } from "../Models/DefaultModel.js";

const deliveryAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
     
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false,
                message: "No token provided, authorization denied" 
            });
        }
       
        const token = authHeader.split(" ")[1];
      
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
       
        if (decoded.role !== "deliveryPartner") {
            return res.status(403).json({ 
                success: false,
                message: "Access denied. Delivery partner only." 
            });
        }

      
        const partner = await DeliveryPartner.findById(decoded.id).select("-password");

        if (!partner || !partner.isActive) {
            return res.status(403).json({ 
                success: false,
                message: "Account is deactivated or does not exist" 
            });
        }

        
        req.partner = partner; 
        
        next(); 
    } catch (error) {
        console.error("Delivery Auth Middleware Error:", error);
        return res.status(401).json({ 
            success: false,
            message: "Token is not valid" 
        });
    }
};

export default deliveryAuth; // রাউট ফাইলে ইমপোর্ট করে ব্যবহার করার জন্য (লাইন ৩৫)