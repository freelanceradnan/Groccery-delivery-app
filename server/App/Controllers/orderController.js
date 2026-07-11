import { createMyOrder, getAllOrdersService, getMyOrder, getMyOrders, getOrderLocationService, updateOrderStatusService } from "../Services/orderServices.js";
//create order
export const CreateOrder = async (req, res) => {
    const userid=req.user.id
    try {
        const { items, shippingAddress, paymentMethod } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No Order Items" });
        }

       
        const result = await createMyOrder(items, shippingAddress, paymentMethod,userid);

       
        if (!result || !result.success) {
            return res.status(400).json({ 
                success: false, 
                message: result?.message || "Failed to create order" 
            });
        }

       
        return res.status(201).json({ 
            success: true, 
            order: result.order
        });

    } catch (error) {
        console.error("Controller Order Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

//getuser order
export const GetOrders=async(req,res)=>{
    const {status}=req.query;
    const userid=req.user.id
    try {
     const result=await getMyOrders(status,userid)
     if(!result.success){
        return res.status(400).json({success:false,message:"failed to get users order"})
     }
     return res.status(200).json({success:true,result})
    } catch (error) {
        return res.status(400).json({success:false,message:"failed to get users order"})
    }
}
//getuserorder details
//getuser order
export const GetOrder = async (req, res) => {
  const id = req.params.id;
  const userid = req.user.id;
  
  try {
    const result = await getMyOrder(id, userid);
    
    if (!result.success) {
      return res.status(404).json({ 
        success: false, 
        message: result.message 
      });
    }
    
   
    return res.status(200).json({ 
      success: true, 
      order: result.order 
    });

  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error while fetching order" 
    });
  }
};

//update
export const updateOrderStatus = async (req, res) => {
  const id = req.params.id; 
  const { status, note } = req.body; 
  try {
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }
 
    const result = await updateOrderStatusService(id, status, note);

    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      order: result.order
    });

  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};
//getall order
export const getAllOrders = async (req, res) => {
  try {
    const result = await getAllOrdersService();

    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        message: result.message 
      });
    }

    return res.status(200).json({
      success: true,
      orders: result.orders
    });

  } catch (error) {
    console.error("Get All Orders Controller Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch all orders" });
  }
};

//getorder live locations
export const getOrderLocation = async (req, res) => {
  const id = req.params.id;
  const userid = req.user.id; 

  try {

    const result = await getOrderLocationService(id, userid);

    if (!result.success) {
      return res.status(404).json({ 
        success: false, 
        message: result.message 
      });
    }

    
    return res.status(200).json({
      success: true,
      liveLocation: result.order.liveLocation,
      status: result.order.status
    });

  } catch (error) {
    console.error("Get Order Location Controller Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch order location" });
  }
};