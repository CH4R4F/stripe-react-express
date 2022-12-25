require("dotenv").config();
let express = require("express");
let cors = require("cors");
let stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// constants
const app = express();

// get raw body not parsed
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// middlewares
app.use(cors());

// routes
app.get("/", (req, res, next) => {
  res.send("This is working good");
});

app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency, paymentMethodType } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: [paymentMethodType],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/webhook", async (req, res) => {
  // get segnature from header
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // your webhook secret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // handle the event
  switch (event.type) {
    case "customer.created":
      console.log("customer created");
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
    // ... handle other event types
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

// run server
const port = process.env.PORT || 5000;
app.listen(port);
