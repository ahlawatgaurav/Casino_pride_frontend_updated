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

  const { userData } = location.state;

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

  const todayDate = moment().format("YYYY-MM-DD");

  const onsubmit = () => {
    if (startDate == "" || endDate == "") {
      toast.warning("Please Select both the dates");
    } else {
      const data = {
        futureDateId: 0,
        startDate: startDate,
        endDate: endDate,
      };

      dispatch(
        AddFutureBookingDatesFn(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              toast.success("Future booking dates added");
              navigate(-1);
              toast.error(callback.error);
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
    } else {
      const data = {
        futureDateId: 1,
        startDate: startDate,
        endDate: endDate,
      };

      console.log(data, "inside data--------------------->");

      dispatch(
        AddFutureBookingDatesFn(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              toast.success("Future booking dates Edited");
              navigate(-1);
              toast.error(callback.error);
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
      <h3 className="mb-4">Add Future Booking Dates</h3>
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

      {!userData ? (
        <div className="mt-5">
          <button onClick={onsubmit} className="btn btn-primary">
            Add Date
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <button onClick={DateEditFn} className="btn btn-primary">
            Edit Date
          </button>
        </div>
      )}
    </div>
  );
};

export default AddFutureBookingDates;
