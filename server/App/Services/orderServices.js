import { Product, Order, User } from '../Models/DefaultModel.js'; 
import Stripe from 'stripe';
import dotenv from 'dotenv'; 
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//create order

export const createMyOrder = async (items, shippingAddress, paymentMethod, userid, origin) => {
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
        return { 
          success: false, 
          message: `Product ${product ? product.name : ''} is out of stock or insufficient` 
        };
      }
    }

    const orderItems = items.map((item) => {
      const dbProduct = productMap[item.product];
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

    const method = paymentMethod ? String(paymentMethod).trim().toLowerCase() : 'cash';
    const isOnlinePayment = method === "card" || method === "stripe";

    const newOrderPayload = {
      user: userid,
      items: orderItems,
      shippingAddress,
      paymentMethod: method,
      subtotal,
      deliveryFee,
      tax,
      total,
      status: "Placed" ,
      isPaid: false, 
      isActive: method === "cash",
      statusHistory: [{ status: isOnlinePayment ? "Pending" : "Placed", timestamp: new Date() }]
    };

    const order = await Order.create(newOrderPayload);

    if (isOnlinePayment) {
      const clientUrl = origin || process.env.CLIENT_URL || 'http://localhost:5173';

      try {
        const session = await stripe.checkout.sessions.create({
          success_url: `${clientUrl}/orders/${order._id}`,
          cancel_url: `${clientUrl}/checkout?payment_cancelled=true`,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: { name: 'Grocery Order Payment' },
                unit_amount: Math.round(total * 100)
              },
              quantity: 1
            },
          ],
          mode: 'payment',
          metadata: { orderId: order._id.toString() }
        });

        return { success: true, url: session.url, orderId: order._id };

      } catch (stripeErr) {
        console.error("Stripe Session Creation Failed:", stripeErr.message);
       
        await Order.findByIdAndDelete(order._id);
        return { success: false, message: `Stripe Payment Error: ${stripeErr.message}` };
      }
    }

  
    await User.findByIdAndUpdate(userid, {
      $push: { orders: order._id }
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    return { success: true, order };

  } catch (error) {
    console.error("Service Error Details:", error);
    return { 
      success: false, 
      message: error.message || "Something went wrong while creating the order" 
    };
  }
};
//get single order
// getMyOrders Service
export const getMyOrders = async (status, userid) => {
  try {
    const where = { user: userid };

    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await Order.find(where)
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });

    return {
      success: true,
      orders
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch orders"
    };
  }
};
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
  
    const orders = await Order.find({})
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