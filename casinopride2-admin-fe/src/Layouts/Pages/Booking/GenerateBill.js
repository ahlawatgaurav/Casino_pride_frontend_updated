import React, { useState } from "react";
import check from "../../../assets/Images/check.png";
import { AddBillingDetails } from "../../../Redux/actions/billing";
import moment from "moment";

import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";

const GenerateBill = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // const bookingdate = userData?.CreatedOn.slice(0, 10);
  const bookingdate = userData?.BookingDate != null ? moment(userData?.BookingDate).format("YYYY-MM-DD") : moment(userData?.FutureDate).format("YYYY-MM-DD")

  const today = moment().format("YYYY-MM-DD");

  console.log("Todays date--->", today);

  const [loader, setLoader] = useState(false);

  const onsubmit = () => {
    setLoader(true);
    const data = {
      bookingId: userData?.Id,
      packageId: userData?.PackageId,
      packageGuestCount: userData?.PackageGuestCount,
      totalGuestCount: userData?.TotalGuestCount,
      bookingDate: bookingdate,
      billingDate: today,
      teensCount: userData?.NumOfTeens,
      actualAmount: userData?.ActualAmount,
      amountAfterDiscount: userData?.AmountAfterDiscount,
      discount: userData?.PanelDiscount
        ? userData?.PanelDiscount
        : userData?.CouponDiscount,
      packageWeekdayPrice: userData?.PackageWeekdayPrice,
      packageWeekendPrice: userData?.PackageWeekendPrice,
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
            navigate("/TeensBilling", {
              state: { BookingDetails: callback?.response?.Details },
            });
            setLoader(false);
          } else {
            navigate("/BillingDetails", {
              state: { BookingDetails: callback?.response?.Details },
            });
            setLoader(false);
          }

          toast.error(callback.error);
        } else {
          toast.error(callback.error);
          setLoader(false);
        }
      })
    );
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5
                  className="card-text"
                  style={{ color: "green", textAlign: "center" }}
                >
                  Booking Updated.
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
            disabled={loader}
          >
            {!loader ? (
              "Generate Bill"
            ) : (
              <Oval
                height={20}
                width={20}
                color="black"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="black"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateBill;
