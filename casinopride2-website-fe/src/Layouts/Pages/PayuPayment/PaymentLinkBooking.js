import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingDetails } from "../../../Redux/actions/booking";
import PayuPayments from "../Payments/PayuPayments";
import { userDetailsAfterBooking } from "../../../Redux/reducers/booking";
import "./styles.css";

const PaymentLinkBooking = () => {
  const navigate = useNavigate();
  let { bookingId } = useParams();
  const dispatch = useDispatch();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [packageAmount, setPackageAmount] = useState(null);
  const [futureDate, setFutureDate] = useState(null);



  useEffect(() => {
    dispatch(getBookingDetails(bookingId, (callback) => {
      if (callback.status) {
        setBookingDetails(callback?.response?.Details);
        setFutureDate(callback?.response?.Details?.FutureDate)
        dispatch(userDetailsAfterBooking(callback?.response?.Details));
      }
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, dispatch]);

  useEffect(() => {
    if(bookingDetails) {
  const isWeekday = (date) => {
    const day = date.getDay();
    return day >= 1 && day <= 4;
  }
    let dateObj  = new Date(futureDate);
    let isTodayWeekday = isWeekday(dateObj);

    if (isTodayWeekday) {
      setPackageAmount(bookingDetails?.PackageWeekdayPrice);
    } else {
      setPackageAmount(bookingDetails?.PackageWeekendPrice);
    }
  }
  },[bookingDetails, futureDate]);

  const onButtonClick = () => {
    navigate("/GenerateBill", {
      state: { userData: bookingDetails },
    });
  }

  const BookingDetails = () => {
    return <div className="container text-white payment-container">
      <div className="text-white text-center mt-4" style={{ fontSize: "32px" }}>Booking Details</div>
      <div className="border-bottom data-row mt-5 mx-auto text-white" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="text-white label" style={{ fontSize: "18px" }}>Package Name</div>
        <div className="text-white value" style={{ fontSize: "18px" }}>{JSON.parse(bookingDetails?.PackageName)}</div>
      </div>

      <div className="border-bottom data-row mx-auto text-white" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="text-white label" style={{ fontSize: "18px" }}>Package Amount</div>
        <div className="text-white value" style={{ fontSize: "18px" }}>{JSON.parse(packageAmount)}</div>
      </div>

      <div className="border-bottom data-row mx-auto text-white" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="text-white label" style={{ fontSize: "18px" }}>Package Count</div>
        <div className="text-white value" style={{ fontSize: "18px" }}>{JSON.parse(bookingDetails?.PackageGuestCount)}</div>
      </div>

      <div className="border-bottom data-row mx-auto text-white" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="text-white label" style={{ fontSize: "18px" }}>Number of Adults and Kids</div>
        <div className="text-white value" style={{ fontSize: "18px" }}>{`${bookingDetails?.TotalGuestCount - bookingDetails?.NumOfTeens} Adult(s)   ${bookingDetails?.NumOfTeens ? `${bookingDetails?.NumOfTeens} Kids` : ""}`}</div>
      </div>

      <div className="border-bottom data-row mx-auto text-white" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="text-white label" style={{ fontSize: "18px" }}>Total Amount</div>
        <div className="text-white value" style={{ fontSize: "18px" }}>{bookingDetails?.ActualAmount}</div>
      </div>

      <div className="border-bottom data-row mx-auto text-white" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="text-white label" style={{ fontSize: "18px" }}>Discount</div>
        <div className="text-white value" style={{ fontSize: "18px" }}>{bookingDetails?.AgentPanelDiscount}%</div>
      </div>

      <div className="border-bottom data-row mx-auto text-white" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="text-white label" style={{ fontSize: "18px" }}>Grand Total</div>
        <div className="text-white value" style={{ fontSize: "18px" }}>{bookingDetails?.AmountAfterDiscount}</div>
      </div>

      <div className="border-bottom data-row mx-auto text-white" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="text-white label" style={{ fontSize: "18px" }}>Booking Date</div>
        <div className="text-white value" style={{ fontSize: "18px" }}>{(bookingDetails?.CreatedOn).slice(0, 10)}</div>
      </div>

      <div className="mx-auto data-row text-white" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="text-white label" style={{ fontSize: "18px" }}>Event Date</div>
        <div className="text-white value" style={{ fontSize: "18px" }}>{bookingDetails?.FutureDate}</div>
      </div>

      <div className="text-center mb-5">
        <button
          style={{ paddingLeft: "100px", paddingRight: "100px" }}
          type="submit"
          className="btn btn-primary bg-golden mt-5 btn-lg"
          onClick={onButtonClick}
        >
          Confirm
        </button>
      </div>
    </div>
  }

  return bookingDetails ? <BookingDetails /> : null;
}

export default PaymentLinkBooking;