export const StripeWebHook = async (req, res) => {
  let event;

  if (endpointSecret) {
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    event = req.body;
  }

  // Handle Events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { isPaid: true, status: "Paid" },
          { new: true } 
        );

      //stock decrease
        if (updatedOrder && Array.isArray(updatedOrder.items)) {
          for (const item of updatedOrder.items) {
            await Product.findByIdAndUpdate(
              item.product,
              { $inc: { stock: -item.quantity } }
            );
          }
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await Order.findByIdAndDelete(orderId);
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.json({ received: true });
};