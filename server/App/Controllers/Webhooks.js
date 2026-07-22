import Stripe from 'stripe';
import { Order } from '../Models/DefaultModel.js'; // আপনার Order Model-এর সঠিক পাথ দিন
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

  // 🔴 পেমেন্ট সফল হলে ডাটাবেজ আপডেট লজিক
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // session থেকে orderId বের করুন
    const orderId = session.metadata?.orderId || session.client_reference_id;

    console.log("Processing Order ID:", orderId); // 👈 এটি টার্মিনালে চেক করুন

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        status: 'Paid',
        isActive: true,
      });
      console.log("✅ Order updated to Paid successfully!");
    }
  }

  res.status(200).json({ received: true });
};