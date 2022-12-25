import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
// import axios from "axios";

const options = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      letterSpacing: "0.025em",
      fontFamily: "Roboto, Source Code Pro, monospace, SFUIDisplay",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const PaymentCheckout = () => {
  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState({
    name: "T-shirt",
    price: 2900, // in cents
    id: "prod_HDdPj1XK7X7X7X",
  });

  const stripe = useStripe();
  const elements = useElements();

  const handleCardDetailsChange = (event) => {
    event.error ? setCheckoutError(event.error.message) : setCheckoutError("");
  };

  if (!stripe || !elements) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { clientSecret } = await fetch(
      "http://localhost:5000/create-payment-intent", // your backend endpoint
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: product.price,
          currency: "usd",
          paymentMethodType: "card",
        }),
      }
    ).then((res) => res.json());

    setProcessingTo(true);

    // confirm the payment on the client
    const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: "Charaf Marghin",
        },
      },
    });

    if (paymentIntent.status === "succeeded") {
      setProcessingTo(false);
      setSuccess(true);
      console.log("Payment is successful");
    } else {
      setProcessingTo(false);
      console.log("Payment is failed");
    }
  };

  if (success) return <p>Payment is successful</p>;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <span>Card number</span>
        <CardNumberElement
          options={options}
          onChange={handleCardDetailsChange}
        />
      </label>

      <label>
        <span>Expiration date</span>

        <CardExpiryElement
          options={options}
          onChange={handleCardDetailsChange}
        />
      </label>
      <label>
        <span>CVC</span>
        <CardCvcElement options={options} onChange={handleCardDetailsChange} />
      </label>

      {checkoutError && <p>{checkoutError}</p>}
      <button type="submit" disabled={isProcessing || !stripe}>
        Checkout
      </button>
    </form>
  );
};

export default PaymentCheckout;
