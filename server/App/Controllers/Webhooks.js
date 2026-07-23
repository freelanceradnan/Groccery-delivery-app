import Stripe from 'stripe';
import { Order } from '../Models/DefaultModel.js'; 
import dotenv from 'dotenv'; 
dotenv.config({ path: '../../../server/.env' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const StripeWebHook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId || session.client_reference_id;

    console.log("Processing Order ID:", orderId); 

    if (orderId) {
      try {
        const order = await Order.findOneAndUpdate(
          { _id: orderId, isPaid: false },
          { 
            $set: { 
              isPaid: true, 
              status: 'Confirmed' 
            },
            $push: { 
              statusHistory: { 
                status: 'Confirmed', 
                timestamp: new Date() 
              } 
            }
          },
          { new: true }
        );
        if (!order) {
          console.log(`Order ${orderId} already processed or does not exist.`);
          return res.status(200).json({ received: true });
        }

        if (order.user) {
          await User.findByIdAndUpdate(order.user, {
            $addToSet: { orders: order._id }
          });
        }

        console.log(`Updating stock for ${order.items.length} item(s)...`);
        
        for (const item of order.items) {
          const productId = item.product;
          const qtyToDeduct = item.quantity;

          const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: -qtyToDeduct } },
            { new: true }
          );

          if (updatedProduct) {
            console.log(`Stock updated for ${productId}. New stock: ${updatedProduct.stock}`);
          } else {
            console.error(`Could not find product ${productId} to update stock.`);
          }
        }

        console.log(`Successfully completed payment & stock update for Order: ${orderId}`);

      } catch (dbErr) {
        console.error("Database error during webhook processing:", dbErr);
        return res.status(500).json({ error: "Database update failed" });
      }
    }
  }

  res.status(200).json({ received: true });
};