import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { AddFutureBookingDatesFn } from "../../Redux/actions/users";

const AddFutureBookingDates = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData } = location.state || {};

  console.log("Userdata from add future bookings--------->", userData);

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
  const [startDate, setStartDate] = useState(
    userData?.StartDate ? userData?.StartDate : ""
  );
  const [endDate, setEndDate] = useState(
    userData?.EndDate ? userData?.EndDate : ""
  );
  const [dateType, setDateType] = useState(
    userData?.DateType ? userData.DateType : "booking_window"
  );
  const [reason, setReason] = useState(userData?.Reason ? userData.Reason : "");

  const todayDate = moment().format("YYYY-MM-DD");

  const onsubmit = () => {
    if (startDate == "" || endDate == "") {
      toast.warning("Please Select both the dates");
    } else if (moment(startDate).isAfter(moment(endDate), "day")) {
      toast.warning("Start date cannot be after end date");
    } else {
      const data = {
        futureDateId: 0,
        blockedDateId: userData?.Id || 0,
        dateType,
        reason,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      };

      dispatch(
        AddFutureBookingDatesFn(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              toast.success("Date period added");
              navigate(-1);
            } else {
              toast.error(callback.error);
            }
          }
        )
      );
    }
  };

  const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
  const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

  const DateEditFn = () => {
    if (startDate == "" || endDate == "") {
      toast.warning("Please Select both the dates");
    } else if (moment(startDate).isAfter(moment(endDate), "day")) {
      toast.warning("Start date cannot be after end date");
    } else {
      const data = {
        futureDateId: dateType === "booking_window" ? 1 : 0,
        blockedDateId: userData?.Id || 0,
        dateType,
        reason,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      };

      console.log(data, "inside data--------------------->");

      dispatch(
        AddFutureBookingDatesFn(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              toast.success("Date period edited");
              navigate(-1);
            } else {
              toast.error(callback.error);
            }
          }
        )
      );
    }
  };

  return (
    <div className="row">
      <h3 className="mb-4">Add Date Period</h3>
      <div className="col-lg-6 mt-3">
        <label for="formGroupExampleInput " className="form_text">
          Period Type <span style={{ color: "red" }}>*</span>
        </label>
        <select
          className="form-control mt-2"
          value={dateType}
          onChange={(e) => setDateType(e.target.value)}
        >
          <option value="booking_window">Booking Window</option>
          <option value="sold_out">Sold Out</option>
          <option value="black_out">Black Out</option>
        </select>
      </div>
      <div className="col-lg-6 mt-3">
        <label for="formGroupExampleInput " className="form_text">
          Start Date <span style={{ color: "red" }}>*</span>
        </label>
        <input
          class="form-control mt-2"
          type="date"
          placeholder="Enter series Start"
          onChange={(e) => setStartDate(e.target.value)}
          defaultValue={formattedStartDate}
          min={todayDate}
        />
      </div>
      <div className="col-lg-6 mt-3">
        <label for="formGroupExampleInput " className="form_text">
          End Date <span style={{ color: "red" }}>*</span>
        </label>
        <input
          class="form-control mt-2"
          type="date"
          placeholder="Enter series End"
          onChange={(e) => setEndDate(e.target.value)}
          defaultValue={formattedEndDate}
        />
      </div>
      {dateType !== "booking_window" && (
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Reason
          </label>
          <input
            className="form-control mt-2"
            type="text"
            placeholder="Optional reason"
            onChange={(e) => setReason(e.target.value)}
            value={reason}
          />
        </div>
      )}

      {!userData ? (
        <div className="mt-5">
          <button onClick={onsubmit} className="btn btn-primary">
            Add Period
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <button onClick={DateEditFn} className="btn btn-primary">
            Edit Period
          </button>
        </div>
      )}
    </div>
  );
};

export default AddFutureBookingDates;
