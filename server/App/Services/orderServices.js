import { Product, Order } from '../Models/DefaultModel.js'; 
//create order
export const createMyOrder = async (items, shippingAddress, paymentMethod, userid) => {
  try {
    const productIds = items.map((i) => i.product);

    const products = await Product.find({ _id: { $in: productIds } });
   
    const productMap = {};
    products.forEach((p) => {
      productMap[p._id.toString()] = p; 
    });

  
    for (const item of items) {
      const product = productMap[item.product];
      if (!product || (product.stock ?? 0) < item.quantity) {
        return { success: false, message: `Product ${product ? product.name : ''} is out of stock or insufficient` };
      }
    }

   
    const orderItems = items.map((item) => {
      const dbProduct = productMap[item.product];
      if (!dbProduct) throw new Error(`Product ${item.product} not found`);

      return {
        product: dbProduct._id,
        quantity: item.quantity,
        price: dbProduct.price 
      };
    });

   
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 20 ? 0 : 1.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

  
    const newOrder = {
      user: userid, 
      items: orderItems,
      shippingAddress, 
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
      status: "Pending", 
      statusHistory: [
        { 
          status: "Pending", 
          timestamp: new Date() 
        }
      ]
    };
    

    const order = await Order.create(newOrder);
    
    if (paymentMethod === "card") {
     //paylogic
    }

   
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } } 
      );
    }

    
    return { success: true, order };

  } catch (error) {
    console.error("Service Error Details:", error); 
    return { success: false, message: error.message || "Something went wrong while creating the order" };
  }
};
//get single order
export const getMyOrders=async(status,userid)=>{
    try {
        const where = {
      user: userid 
    };
    where.$or = [
  { paymentMethod: 'cash' }, 
  { paymentMethod: 'card', isPaid: true } 
];
    if (status && status !== 'all') {
      where.status = status;
    }
    const orders = await Order.find(where)
      .populate('deliveryPartner', 'name phone') 
      .sort({ createdAt: -1 }); 

    
    return ({
      success: true,
      orders
    });
    } catch (error) {
        return ({
      success: false,
      message: "Failed to fetch orders"
    });
    }
}
//get seperate order
export const getMyOrder=async(id,userid)=>{
    try {
    
        const order = await Order.findOne({
      _id: id,           
      user: userid 
    })
    .populate('items.product') 
    .populate('deliveryPartner', 'name phone avatar vehicleType'); 

    if (!order) {
      return {
        success: false,
        message: "Order not found"
      };
    }

   
    return {
      success: true,
      order
    };
    } catch (error) {
         return {
      success: false,
      message:error.message
    };
    }
    
}
//update order


export const updateOrderStatusService = async (id, status, note) => {
  try {
    
    const historyItem = {
      status: status,
      note: note || `Order changed to ${status.toLowerCase()}`, 
      timestamp: new Date()
    };
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: { status: status }, 
        $push: { statusHistory: historyItem } 
      },
      { new: true, runValidators: true } 
    );

    if (!updatedOrder) {
      return { success: false, message: "Order not found" };
    }

    return { success: true, order: updatedOrder };

  } catch (error) {
    return { success: false, message: error.message };
  }
};
//getall order
export const getAllOrdersService = async () => {
  try {
    const where = {
      $or: [
        { paymentMethod: 'cash' },
        { paymentMethod: 'card', isPaid: true }
      ]
    };

   
    const orders = await Order.find(where)
      .populate('user', 'name email') 
      .populate('deliveryPartner', 'name phone email') 
      .sort({ createdAt: -1 }); 

    return { success: true, orders };

  } catch (error) {
    return { success: false, message: error.message };
  }
};
//getlive location

export const getOrderLocationService = async (id, userid) => {
  try {
    const order = await Order.findOne({
      _id: id,
      user: userid
    }).select('liveLocation status'); 

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    return { success: true, order };

  } catch (error) {
    return { success: false, message: error.message };
  }
};