import { DeliveryPartner, Order, Product, User } from "../Models/DefaultModel.js";
import bcrypt from "bcryptjs";
//get admin states data
export const getAdminStatesService = async () => {
    try {
        const activeOrdersFilter = {
            $nor: [
        { paymentMethod: "card", isPaid: false }
    ]
        };

        const [
            totalOrders,
            totalUsers,
            totalProducts,
            outOfStock,
            totalPartners,
            recentOrders
        ] = await Promise.all([
            Order.countDocuments(activeOrdersFilter),
            User.countDocuments({}),
            Product.countDocuments({}),
            Product.countDocuments({ stock: 0 }),
            DeliveryPartner.countDocuments({}),
            Order.find(activeOrdersFilter)
                .sort({ createdAt: -1 }) 
                .limit(8)                 
                .populate("user", "name email") 
                .populate("deliveryPartner", "name phone")
        ]);

        return {
            success: true,
            data: {
                totalOrders,
                totalUsers,
                totalProducts,
                outOfStock,
                totalPartners,
                recentOrders
            }
        };
    } catch (error) {
    
        return { success: false, error: error.message };
    }
};
//get deleviry partnar list
export const getDeliveryPartnersListService = async () => {
    try {
        const partners = await DeliveryPartner.find({}).select("-password").sort({ createdAt: -1 });
        
        return { success: true, status: 200, data: partners };
    } catch (error) {
        console.error("Get Partners List Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};

//create a delivery partner

export const createDeliveryPartnerService = async (partnerData) => {
    try {
        const { name, email, password, phone, vehiclesType } = partnerData;
        const existingPartner = await DeliveryPartner.findOne({ email: email.toLowerCase() });
        if (existingPartner) {
            return { success: false, status: 400, message: "Email already registered" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

     
        const newPartner = await DeliveryPartner.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            vehiclesType 
        });

      
        const partnerResponse = newPartner.toObject();
        delete partnerResponse.password;

        return { success: true, status: 201, data: partnerResponse };
    } catch (error) {
        console.error("Create Partner Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};

//update delivery parner 

export const updateDeliveryPartnerService = async (partnerId, status) => {
    try {
        const isActiveValue = typeof status === 'object' && status !== null ? status.status : status;

        const updatedPartner = await DeliveryPartner.findByIdAndUpdate(
            partnerId,
            { $set: { isActive: isActiveValue } },
            { returnDocument: 'after', runValidators: true }
        ).select("-password"); 
         
        if (!updatedPartner) {
            return { success: false, status: 404, message: "Delivery partner not found" };
        }

        return { success: true, status: 200, data: updatedPartner };
        
    } catch (error) {
        console.error("Update Partner Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};
//assign delevery partner

export const assignDeliveryPartnerService = async (orderId, partnerId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return { success: false, status: 404, message: "Order not found" };
        }

        const partner = await DeliveryPartner.findById(partnerId);
        if (!partner) {
            return { success: false, status: 404, message: "Delivery partner not found" };
        }
        
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        let currentStatus = order.status;
        
       
        if (currentStatus === "Pending" || currentStatus === "Confirmed" || currentStatus === "Placed") {
            currentStatus = "Confirmed"; 
        }

        const newHistoryLog = {
            status: "Assigned",
            note: `Assigned to ${partner.name}`,
            timestamp: new Date()
        };

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    deliveryPartner: partner._id,
                    deliveryOtp: otp,
                    status: currentStatus 
                },
                $push: {
                    statusHistory: newHistoryLog
                }
            },
            { returnDocument: 'after', runValidators: true } 
        ).populate("deliveryPartner", "name phone");

        return { success: true, status: 200, data: updatedOrder };
    } catch (error) {
        console.error("Assign Partner Service Error:", error);
        return { success: false, status: 500, message: error.message };
    }
};