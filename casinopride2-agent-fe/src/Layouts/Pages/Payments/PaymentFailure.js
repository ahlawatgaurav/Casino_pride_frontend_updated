import React from "react";
import paymentf from "../../../assets/Images/paymentf.png";
import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <img src={paymentf} style={{ height: "50%", width: "50%" }} />
      </div>

      <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
        <button
          style={{ paddingLeft: "100px", paddingRight: "100px" }}
          type="submit"
          className="btn btn-primary mt-5 btn-lg"
          onClick={() => navigate("/NewBooking")}
        >
          Go To Bookings
        </button>
      </div>
    </>
  );
};

export default PaymentFailure;
