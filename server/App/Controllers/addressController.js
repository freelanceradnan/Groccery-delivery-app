
import { createMyAddress, deleteMyAddress, getMyAddress, updateMyAddress } from "../Services/addressServices.js"

//getall adresses
export const getAddresses = async (req, res) => {
    const userid = req.user.id; 

    try {
        const result = await getMyAddress(userid);
        
        if (!result.success) {
            return res.status(404).json({ status: false, message: result.message }); 
        } 
        
        return res.status(200).json({ status: true, data: result.addresses });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};
//createnew adresses
export const createAddress = async (req, res) => {
       
    const { label, address, city, state, zip, isDefault, lat, lng } = req.body;
    const userId = req.user.id; 
    try {
        if (!label || !address || !city || !state || !zip) {
            return res.status(400).json({ success: false, message: "Address field data missing!" });
        }
        if (lat == null || lng == null) {
            return res.status(400).json({ success: false, message: "Location coordinates missing!" }); 
        }
        
       
        const result = await createMyAddress(userId, label, address, city, state, zip, isDefault, lat, lng);
        
        if (!result.success) {
            return res.status(result.status || 400).json({ success: false, message: result.message });
        }
        
        return res.status(201).json({ success: true, addresses: result.addresses });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

//update addess

export const updateAddress = async (req, res) => {
    const { label, address, city, state, zip, isDefault, lat, lng } = req.body;
    const addressId = req.params.id; 
    const userId = req.user.id;  
    
    try {
    
        if (lat == null || lng == null) {
            return res.status(400).json({ 
                success: false, 
                message: "Location not found! Please allow your location and try again." 
            }); 
        }

      
        const result = await updateMyAddress(addressId, userId, label, address, city, state, zip, isDefault, lat, lng);
        
        if (!result.success) {
            return res.status(result.status || 400).json({ 
                success: false, 
                message: result.message || "Update address failed!" 
            });
        }
        
        return res.status(200).json({ success: true, addresses: result.addresses });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

//delete address
export const deleteAddress = async (req, res) => {
     const addressId=req.params.id
     const userId=req.user.id
    try {
        const result = await deleteMyAddress(addressId, userId);
        if (!result.success) {
            return res.status(result.status || 400).json({ 
                success: false, 
                message: result.message || "Delete address failed!" 
            });
        }
        
        return res.status(200).json({ success: true, addresses: result.addresses });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};