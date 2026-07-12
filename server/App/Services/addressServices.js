import { Address, User } from "../Models/DefaultModel.js";
//getalluser addresses

export async function getMyAddress(userId) {
    try {
        const user = await User.findById(userId).select("addresses");
        
        if (!user) {
            return { success: false, status: 404, message: "User not found!" };
        }
        if (!user.addresses || user.addresses.length === 0) {
            return { success: false, status: 404, message: "No addresses found!" };
        }
        
        return { success: true, addresses: user.addresses };

    } catch (error) {
        return { success: false, status: 500, message: "Server Error", error: error.message };
    }
}
//createnew addresses
export async function createMyAddress(userId, label, address, city, state, zip, isDefault, lat, lng) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, status: 404, message: "User not found" };
        }
        let makeDefault = isDefault === true || isDefault === 'true';
        
       
        if (user.addresses.length === 0) {
            makeDefault = true;
        }

        if (makeDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }
        
        user.addresses.push({
            label,
            address,
            city,
            state,
            zip,
            isDefault: makeDefault,
            lat: Number(lat), 
            lng: Number(lng) 
        });

        await user.save();

        return { success: true, addresses: user.addresses };
        
    } catch (error) {
        return { success: false, status: 500, message: "Server Error", error: error.message };
    }
}
//update new address
export async function updateMyAddress(addressId, userId, label, address, city, state, zip, isDefault, lat, lng) {
    try {
        if (isDefault === true || isDefault === 'true') {
            await User.updateOne(
                { _id: userId },
                { $set: { "addresses.$[].isDefault": false } }
            );
        }

        const updateFields = {};
        if (label !== undefined) updateFields["addresses.$.label"] = label;
        if (address !== undefined) updateFields["addresses.$.address"] = address;
        if (city !== undefined) updateFields["addresses.$.city"] = city;
        if (state !== undefined) updateFields["addresses.$.state"] = state;
        if (zip !== undefined) updateFields["addresses.$.zip"] = zip;
        if (isDefault !== undefined) updateFields["addresses.$.isDefault"] = isDefault;
        if (lat !== undefined && lat !== null) updateFields["addresses.$.lat"] = Number(lat);
        if (lng !== undefined && lng !== null) updateFields["addresses.$.lng"] = Number(lng);
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, "addresses._id": addressId },
            { $set: updateFields },
            { new: true } 
        );

       
        if (!updatedUser) {
            return { success: false, status: 404, message: "Address or User not found" };
        }
    
       
        return { success: true, addresses: updatedUser.addresses };
        
    } catch (error) {
        return { success: false, status: 500, message: "Server Error", error: error.message };
    }
}

//delete address



export async function deleteMyAddress(addressId, userId) {
    try {

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, "addresses._id": addressId }, 
            { $pull: { addresses: { _id: addressId } } },
            { new: true } 
        );

        
        if (!updatedUser) {
            return { success: false, status: 404, message: "Address or User not found" };
        }

      
        return { success: true, addresses: updatedUser.addresses };

    } catch (error) {
        return { success: false, status: 500, message: "Server Error", error: error.message };
    }
}