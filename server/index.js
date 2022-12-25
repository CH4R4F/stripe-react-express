require("dotenv").config();
let express = require("express");
let cors = require("cors");
let strip = require("stripe")(process.env.STRIPE_SECRET_KEY);

// constants
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res, next) => {
  res.send("This is working good");
});

app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency, paymentMethodType } = req.body;
  try {
    const paymentIntent = await strip.paymentIntents.create({
      amount,
      currency,
      payment_method_types: [paymentMethodType],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// run server
const port = process.env.PORT || 5000;
app.listen(port);
