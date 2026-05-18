import React from "react";
import logo from "./logo.svg";
import "./App.css";
import PackagesPage from "./Layouts/Pages/PackagesPage";
import BookingPage from "./Layouts/Pages/BookingPage";

import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import NewBooking from "./Layouts/Components/NewBooking";
import GenerateBill from "./Layouts/Pages/Booking/GenerateBill";
import BillingDetails from "./Layouts/Pages/Billing/BillingDetails";
import TeensBilling from "./Layouts/Pages/Billing/TeensBilling";
import SendAck from "./Layouts/Pages/Booking/SendAck";
import QrLinkPage from "./Layouts/Pages/QRLink/QrLinkPage";
import PaymentFailure from "./Layouts/Pages/Payments/PaymentFailure";
import PaymentLinkPayment from "./Layouts/Pages/PayuPayment/PaymentLinksPayment";
import PaymentLinkBooking from "./Layouts/Pages/PayuPayment/PaymentLinkBooking";

function App() {
  let { param } = useParams();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewBooking />} />
        <Route path="/NewBooking" element={<NewBooking />} />
        <Route path="/GenerateBill" element={<GenerateBill />} />
        <Route path="/BillingDetails" element={<BillingDetails />} />
        <Route path="/TeensBilling" element={<TeensBilling />} />
        <Route path="/PaymentFailure" element={<PaymentFailure />} />
        <Route path="/SendAck" element={<SendAck />} />
        <Route path="/p" element={<QrLinkPage />} />
        <Route path="/u" element={<PaymentLinkPayment />} />
        <Route path="/booking/:bookingId" element={<PaymentLinkBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
