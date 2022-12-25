import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaymentCheckout from "./components/PaymentCheckout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./App.css";

// load stripe with flat theme
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

const App = () => {
  return (
    <BrowserRouter>
      <Elements
        theme={{
          theme: "flat",
        }}
        stripe={stripePromise}
      >
        <Routes>
          <Route path="/payment" element={<PaymentCheckout />} />
          <Route path="/success" element={<h1>Success bro</h1>} />
          <Route path="/cancel" element={<h1>cancel bro</h1>} />
        </Routes>
      </Elements>
    </BrowserRouter>
  );
};

export default App;
