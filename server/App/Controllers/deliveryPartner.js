import { cancelDeliveryService, completeDeliveryService, getDeliveryDetailService, getMyDeliveriesService, loginDeliveryPartnerService, updateDeliveryStatusService,updateLocationService} from "../Services/deliverypartnerServices.js";

//login
export const loginDeliveryPartner = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }
        const result = await loginDeliveryPartnerService(email, password);

        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }
        return res.status(result.status).json({
            success: true,
            message: "Logged in successfully",
            partner: result.data.partner,
            token: result.data.token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};
//get my deliveries
export const getMyDeliveries = async (req, res) => {
    try {
        const partnerId = req.partner?.id || req.user?.id; 
        const queryStatus = req.query.status; 
        
        if (!partnerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. Delivery partner ID missing."
            });
        }

        const result = await getMyDeliveriesService(partnerId, queryStatus);

        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }

        return res.status(result.status).json({
            success: true,
            orders: result.data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

//get details delivery
export const getDeliveryDetail = async (req, res) => {
    try {
        const orderId = req.params.id; 
        const partnerId = req.partner?.id || req.user?.id; 
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

       
        const result = await getDeliveryDetailService(orderId, partnerId);

        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }
        return res.status(result.status).json({
            success: true,
            order: result.data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

//completed

export const completeDelivery = async (req, res) => {
    try {
        const orderId = req.params.id; 
        const partnerId = req.partner?.id || req.user?.id; 
        const { otp } = req.body; 
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required to complete delivery"
            });
        }

    
        const result = await completeDeliveryService(orderId, partnerId, otp);

        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }

       
        return res.status(result.status).json({
            success: true,
            message: "Order delivered successfully",
            order: result.data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};
//cancel
export const cancelDelivery = async (req, res) => {
    try {
        const orderId = req.params.id; 
        const partnerId = req.partner?.id || req.user?.id;
        const { reason } = req.body; 


        const result = await cancelDeliveryService(orderId, partnerId, reason);

        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }


        return res.status(result.status).json({
            success: true,
            message: "Delivery cancelled successfully",
            order: result.data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }}

//update delivery status

export const updateDeliveryStatus = async (req, res) => {
    try {
        const orderId = req.params.id; 
        const partnerId = req.partner?.id || req.user?.id; 
        const { status } = req.body; 
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }
         
        const result = await updateDeliveryStatusService(orderId, partnerId, status);

        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }

        return res.status(result.status).json({
            success: true,
            message: `Order status updated to ${status} successfully`,
            order: result.data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};
//update location status

export const updateLocation = async (req, res) => {
    try { 
        const partnerId = req.partner?.id || req.user?.id; 
        const { lat, lng } = req.body;
        const orderId=req.params.id
        if (lat === undefined || lng === undefined) {
            return res.status(400).json({
                success: false,
                message: "Latitude (lat) and Longitude (lng) are required"
            });
        }

       
        const result = await updateLocationService(orderId, partnerId, lat, lng);

        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }


        return res.status(result.status).json({
            success: true,
            message: "Live location updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};