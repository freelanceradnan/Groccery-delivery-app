import { createDeliveryPartnerService, getAdminStatesService, getDeliveryPartnersListService, updateDeliveryPartnerService, assignDeliveryPartnerService} from "../Services/adminServices.js"
//get admin states data
export const getAdminStates = async (req, res) => {
    try {
        const result = await getAdminStatesService();
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.error || "Failed to get admin data"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Admin data fetched successfully",
            data: result.data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

//get delivery partnar list
export const getDeliveryPartnersList = async (req, res) => {
    try {
        const result = await getDeliveryPartnersListService();

        if (!result.success) {
            return res.status(result.status).json({ 
                success: false, 
                message: result.message 
            });
        }

        return res.status(result.status).json({ 
            success: true, 
            count: result.data.length,
            partners: result.data 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

//create delivery partner
export const createDeliveryPartner = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide all required fields" 
            });
        }
   const result = await createDeliveryPartnerService(req.body);

        if (!result.success) {
            return res.status(result.status).json({ 
                success: false, 
                message: result.message 
            });
        }

        return res.status(result.status).json({ 
            success: true, 
            message: "Delivery partner profile created successfully", 
            partner: result.data 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

//update delivery partener

export const updateDeliveryPartner = async (req, res) => {
    try {
        const partnerId = req.params.id; 

        if (!partnerId) {
            return res.status(400).json({
                success: false,
                message: "Delivery partner ID is required"
            });
        }
        const result = await updateDeliveryPartnerService(partnerId, req.body);

        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }

        return res.status(result.status).json({
            success: true,
            message: "Delivery partner profile updated successfully",
            partner: result.data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

//assign delivery partner

export const assignDeliveryPartner = async (req, res) => {
    try {
        const orderId = req.params.id; 
        const { partnerId } = req.body;
        console.log(orderId,partnerId)
        if (!orderId || !partnerId) {
            return res.status(400).json({
                success: false,
                message: "Order ID and Partner ID are required"
            });
        }

       
        const result = await assignDeliveryPartnerService(orderId, partnerId);

        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message
            });
        }

        return res.status(result.status).json({
            success: true,
            message: "Delivery partner assigned to the order successfully",
            order: result.data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};