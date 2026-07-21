
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DeliveryPartner, Order } from "../Models/DefaultModel.js";
import mongoose from "mongoose";
//login partener
export const loginDeliveryPartnerService = async (email, password) => {
    try {
   
        const partner = await DeliveryPartner.findOne({ email: email.toLowerCase() });
        if (!partner) {
            return { success: false, status: 401, message: "Invalid email or password" };
        }

    
        if (!partner.isActive) {
            return { success: false, status: 403, message: "Your account has been deactivated" };
        }

        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) {
            return { success: false, status: 401, message: "Invalid email or password" };
        }
        const token = jwt.sign(
            { id: partner._id, role: "deliveryPartner" },
            process.env.JWT_SECRET || "your_default_secret_key",
            { expiresIn: "1d" }
        );

        const partnerResponse = partner.toObject();
        delete partnerResponse.password;

        return { 
            success: true, 
            status: 200, 
            data: { partner: partnerResponse, token } 
        };

    } catch (error) {
        console.error("Login Partner Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};

//getmy deliveries
export const getMyDeliveriesService = async (partnerId, queryStatus) => {
    try {
        const filter = { deliveryPartner: partnerId };
        if (queryStatus === "active") {
            filter.status = { $in: ["Pending", "Confirmed", "Processing", "Out for Delivery"] };
        } else if (queryStatus === "completed") {
            filter.status = { $in: ["Delivered", "Cancelled"] };
        }

      
        const orders = await Order.find(filter)
            .populate("user", "name email phone") 
            .sort({ createdAt: -1 }); 

        return { success: true, status: 200, data: orders };
    } catch (error) {
        console.error("Get My Deliveries Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};
//get delivery details

export const getDeliveryDetailService = async (orderId, partnerId) => {
    try {
        const order = await Order.findOne({
            _id: orderId,
            deliveryPartner: partnerId
        }).populate("user", "name email phone"); 

        if (!order) {
            return { success: false, status: 404, message: "Delivery order not found" };
        }

        return { success: true, status: 200, data: order };
    } catch (error) {
        console.error("Get Delivery Detail Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};

//completed orders
export const completeDeliveryService = async (orderId, partnerId, otp) => {
    try {
        
        const order = await Order.findOne({
            _id: orderId,
            deliveryPartner: partnerId
        });

       
        if (!order || order.status === "Cancelled" || order.status === "Delivered") {
            return { success: false, status: 400, message: "Invalid Request. Order might be cancelled or already delivered." };
        }

        if (String(order.deliveryOtp) !== String(otp)) {
            return { success: false, status: 400, message: "Invalid OTP. Verification failed." };
        }

        const newHistoryLog = {
            status: "Delivered",
            note: "Delivered by partner",
            timestamp: new Date()
        };

  
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    status: "Delivered",      
                    deliveryOtp: ""         
                },
                $push: {
                    statusHistory: newHistoryLog 
                }
            },
            { returnDocument: 'after', runValidators: true }
        ).populate("user", "name email phone");

        return { success: true, status: 200, data: updatedOrder };
    } catch (error) {
        console.error("Complete Delivery Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};

//cancel delivery

export const cancelDeliveryService = async (orderId, partnerId, reason) => {
    try {
      
        const order = await Order.findOne({
            _id: orderId,
            deliveryPartner: partnerId
        });

        if (!order) {
            return { success: false, status: 404, message: "Delivery order not found" };
        }

        if (order.status === "Delivered") {
            return { success: false, status: 400, message: "Cannot cancel a delivered order" };
        }
        const newHistoryLog = {
            status: "Cancelled",
            note: reason || "Cancelled by delivery partner",
            timestamp: new Date()
        };

     
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    status: "Cancelled",
                    deliveryOtp: "" 
                },
                $push: {
                    statusHistory: newHistoryLog
                }
            },
            { returnDocument: 'after', runValidators: true } 
        ).populate("user", "name email phone");

        return { success: true, status: 200, data: updatedOrder };
    } catch (error) {
        console.error("Cancel Delivery Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};
//update delivery status


export const updateDeliveryStatusService = async (orderId, partnerId, status) => {
    try {
    
        const validOrderId = new mongoose.Types.ObjectId(orderId);
        const validPartnerId = new mongoose.Types.ObjectId(partnerId);
       

       
        const allowedStatuses = ["Assigned", "Packed", "Out for Delivery", "Delivered", "Cancelled"];
        if (!allowedStatuses.includes(status)) {
            return { success: false, status: 400, message: "Invalid status update" };
        }

        const newHistoryLog = {
            status: status,
            note: `Status updated to ${status}`,
            timestamp: new Date()
        };


        const updatedOrder = await Order.findOneAndUpdate(
            { 
                _id: orderId, 
                deliveryPartner: partnerId 
            },
            {
                $set: { status: status },
                $push: { statusHistory: newHistoryLog }
            },
            { returnDocument: 'after', runValidators: true }
        ).populate("user", "name email phone");

        if (!updatedOrder) {
            return { success: false, status: 404, message: "Delivery order not found or unauthorized" };
        }

        return { success: true, status: 200, data: updatedOrder };
        
    } catch (error) {
        console.error("Update Delivery Status Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};
//update delivery location


export const updateLocationService = async (orderId, partnerId, lat, lng) => {
    try {
       console.log('datas',orderId,partnerId,lat,lng)
        const activeStatuses = ["Pending", "Confirmed", "Processing", "Out for Delivery"];

     
        const order = await Order.findOne({
            _id: orderId,
            deliveryPartner: partnerId,
            status: { $in: activeStatuses }
        });

        if (!order) {
            return { 
                success: false, 
                status: 400, 
                message: "Active delivery order not found or order has been finalized" 
            };
        }

       
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    liveLocation: {
                        lat: Number(lat),
                        lng: Number(lng),
                        updatedAt: new Date()
                    }
                }
            },
            { returnDocument: 'after', runValidators: true }
        );

        return { success: true, status: 200, data: updatedOrder };
    } catch (error) {
        console.error("Update Location Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};