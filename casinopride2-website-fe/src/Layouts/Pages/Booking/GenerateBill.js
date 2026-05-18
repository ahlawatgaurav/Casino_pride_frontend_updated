import React from "react";
import check from "../../../assets/Images/check.png";
import { AddBillingDetails } from "../../../Redux/actions/billing";
import moment from "moment";

import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PayuPayments from "../Payments/PayuPayments";

const GenerateBill = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const BookingDetails = useSelector(
    (state) => state.booking?.userDetailsAfterBooking
  );

  const { userType } = location.state;
  const { userData } = location.state;

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
  console.log("loginDetails-------------->", loginDetails);

  console.log("User type---------->", userType);
  console.log("User Data---------->", userData);

  const toPdfgeneratioFn = () => {};

  console.log("FutureDate------->", userData?.FutureDate);

  const bookingdate = userData?.CreatedOn.slice(0, 10);

  const today = moment().format("YYYY-MM-DD");

  console.log("Todays date--->", today);

  const onsubmit = () => {
    const data = {
      bookingId: userData?.Id,
      packageId: userData?.PackageId,
      packageGuestCount: userData?.PackageGuestCount,
      totalGuestCount: userData?.TotalGuestCount,
      bookingDate: bookingdate,
      billingDate: today,
      teensCount: userData?.NumOfTeens,
    };

    console.log("data------------>", data);

    dispatch(
      AddBillingDetails(loginDetails?.logindata?.Token, data, (callback) => {
        if (callback.status) {
          console.log(
            "Generate Bill --------------?",
            callback?.response?.Details[0]?.NumOfTeens,
            callback?.response?.Details[0]?.TotalGuestCount
          );

          if (
            callback?.response?.Details[0]?.NumOfTeens -
              callback?.response?.Details[0]?.TotalGuestCount ==
            0
          ) {
            navigate("/sendAck", {
              state: { BookingDetails: callback?.response?.Details },
            });
          } else {
            navigate("/sendAck", {
              state: { BookingDetails: callback?.response?.Details },
            });
          }

          toast.error(callback.error);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  return (
    <div>
      {/* <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5
                  className="card-text"
                  style={{ color: "green", textAlign: "center" }}
                >
                  Payment was successful! Your booking has been confirmed.
                </h5>
                <div
                  className="text-center d-flex justify-content-center align-items-center mt-5 mb-5"
                  style={{ height: "200px" }}
                >
                  <img
                    src={check}
                    alt="Tick Mark"
                    className="img-fluid"
                    style={{ height: "200px", width: "200px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
          <button
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
            type="submit"
            className="btn btn_colour mt-5 btn-lg"
            onClick={onsubmit}
          >
            Generate Bill
          </button>
        </div>
      </div> */}

      <PayuPayments
        ActualAmount={userData?.ActualAmount}
        AmountAfterDiscount={userData?.AmountAfterDiscount}
        FullName={userData?.FullName}
        Email={userData?.Email}
        Phone={userData?.Phone}
        BookingDetails={BookingDetails}
      />
    </div>
  );
};

export default GenerateBill;
