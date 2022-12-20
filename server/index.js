require("dotenv").config();
let express = require("express");
let cors = require("cors");
let uuid = require("uuid/v4");
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

app.post("/payment", (req, res, next) => {
  const { product, token } = req.body; // you can get as many data as you need from te frontend :)
  const idempontencyKey = uuid();

  return strip.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) =>
      strip.charges.create(
        {
          amount: product.price * 100, // multiply by 100 because we get price by cent
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `This is a payment purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
              // you can add more data here
            },
          },
        },
        { idempontencyKey }
      )
    )
    .then((result) => res.status(200).json(result))
    .catch((error) => console.log(error)); // you can create your own error handler for this
});

// run server
const port = process.env.PORT || 5000;
app.listen(port);
