import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AddCouponDetails, EditCouponDetails } from "../../Redux/actions/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/global.css";
import moment from "moment";
import axios from "axios";

const AddCoupon = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;

  console.log(
    " userData?.StartDate---------->",
    moment(userData?.StartDate).format("YYYY-MM-DD")
  );

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [couponTitle, setcouponTitle] = useState(
    userData?.CouponTitle ? userData?.CouponTitle : ""
  );
  const [couponDiscount, setcouponDiscount] = useState(
    userData?.CouponDiscount ? userData?.CouponDiscount : ""
  );
  const [initial, setinitial] = useState(
    userData?.Initial ? userData?.Initial : ""
  );
  const [seriesStart, setseriesStart] = useState(
    userData?.SeriesStart ? userData?.SeriesStart : ""
  );
  const [seriesEnd, setseriesEnd] = useState(
    userData?.SeriesEnd ? userData?.SeriesEnd : ""
  );
  const [startDate, setstartDate] = useState(
    userData?.StartDate ? userData?.StartDate : ""
  );
  const [endDate, setendDate] = useState(
    userData?.EndDate ? userData?.EndDate : ""
  );

  const [isChecked, setIsChecked] = useState(
    userData?.IsCouponEnabled ? userData?.IsCouponEnabled : 0
  );

  //   const [totalCoupons, settotalCoupons] = useState("");
  const [usedCoupons, setusedCoupons] = useState([]);
  const [remainingCoupons, setremainingCoupons] = useState("");

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const initialDate = userData
    ? moment(userData.StartDate).format("YYYY-MM-DD")
    : "";

  const addWeekToDate = (dateString) => {
    const parsedDate = moment(dateString);
    const newDate = parsedDate.add(7, "days");
    return newDate.format("YYYY-MM-DD");
  };

  // const todayDate = moment().format("YYYY-MM-DD");
  const todayDate = moment().add(1, "days").format("YYYY-MM-DD");

  console.log("startDate----------->", startDate);

  const onsubmit = () => {
    const startNumber = parseInt(seriesStart);
    const endNumber = parseInt(seriesEnd);
    const totalCoupons = endNumber - startNumber + 1;

    if (
      couponTitle == "" ||
      couponDiscount == "" ||
      initial == "" ||
      seriesStart == "" ||
      seriesEnd == "" ||
      startDate == "" ||
      endDate == ""
    ) {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        couponTitle: couponTitle,
        couponDiscount: parseInt(couponDiscount),
        initial: initial,
        seriesStart: seriesStart,
        seriesEnd: seriesEnd,
        startDate: startDate,
        endDate: endDate,
        totalCoupons: totalCoupons,
        usedCoupons: "[]",
        remainingCoupons: totalCoupons,
        isActive: 1,
        isCouponEnabled: 1,
      };
      dispatch(
        AddCouponDetails(data, loginDetails?.logindata?.Token, (callback) => {
          if (callback.status) {
            toast.success("User Added");
            navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };

  const onEditCoupon = () => {
    const startNumber = parseInt(seriesStart);
    const endNumber = parseInt(seriesEnd);
    const totalCoupons = endNumber - startNumber + 1;
    console.log('check >>startDate>>',startDate);

    if (
      couponTitle == "" ||
      couponDiscount == "" ||
      initial == "" ||
      seriesStart == "" ||
      seriesEnd == "" ||
      startDate == "" ||
      endDate == ""
    ) {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        couponId: userData?.Id,
        couponRef: userData?.Ref,
        couponTitle: couponTitle,
        couponDiscount: parseInt(couponDiscount),
        initial: initial,
        seriesStart: seriesStart,
        seriesEnd: seriesEnd,
        // startDate: addWeekToDate(startDate),
        // endDate: addWeekToDate(endDate),
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
        totalCoupons: totalCoupons,
        usedCoupons: "[]",
        remainingCoupons: totalCoupons,
        isActive: 1,
        isCouponEnabled: isChecked === true ? 1 : 0,
      };

      console.log("dataaaaaaaaa-----", data);

      dispatch(
        EditCouponDetails(data, loginDetails?.logindata?.Token, (callback) => {
          if (callback.status) {
            toast.success("Coupon Edited");
            navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };

  console.log("isChecked", isChecked);
  const formattedDate = moment(startDate).format("YYYY-MM-DD");
  const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

  const handleInputChange = (e) => {
    const inputText = e.target.value;

    // Use regular expression to match only numbers and limit to 2 digits
    const regex = /^[0-9]{0,2}$/;
    if (regex.test(inputText)) {
      if (
        inputText === "" ||
        (parseInt(inputText, 10) >= 0 && parseInt(inputText, 10) <= 99)
      ) {
        setcouponDiscount(inputText);
      }
    }
  };
  return (
    <div>
      {" "}
      <ToastContainer />{" "}
      <div className="row">
        {userData ? (
          <h3 className="mb-4">Edit Coupon</h3>
        ) : (
          <h3 className="mb-4">Add Coupon</h3>
        )}

        <div className="col-lg-6 mt-3 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Coupon Title <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2 "
            type="text"
            disabled={userData ? true : false}
            placeholder="Coupon Title"
            onChange={(e) => setcouponTitle(e.target.value)}
            defaultValue={userData?.CouponTitle}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Initial <span style={{ color: "red" }}>*</span>
          </label>
          {/* <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter Initial"
            onChange={(e) => setinitial(e.target.value)}
            defaultValue={userData?.Initial}
          /> */}
          
          {/* Restrict Numbers from entering */}
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter Initial"
            onKeyDown={(e) => {
              const allowedKeys = [
                'Backspace',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Delete',
              ];

              if (
                !(/[a-zA-Z]/.test(e.key) || allowedKeys.includes(e.key))
              ) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const inputValue = e.target.value;
              setinitial(inputValue);
            }}
            value={initial}
          />


        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Series Start <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            type="number"
            placeholder="Enter series Start"
            onChange={(e) => setseriesStart(e.target.value)}
            defaultValue={userData?.SeriesStart}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Series End <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            type="number"
            placeholder="Enter series End"
            onChange={(e) => setseriesEnd(e.target.value)}
            defaultValue={userData?.SeriesEnd}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Start Date <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            type="date"
            placeholder="Enter Start Date"
            onChange={(e) => setstartDate(e.target.value)}
            defaultValue={formattedDate}
            // defaultValue={moment(userData?.StartDate).format("YYYY-MM-DD")}

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
            placeholder=" End Date"
            onChange={(e) => setendDate(e.target.value)}
            defaultValue={formattedEndDate}
            // min={startDate}
            min={moment(startDate).add(1, "days").format("YYYY-MM-DD")}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label
            for="formGroupExampleInput "
            className="form_text"
            style={{ fontSize: "15px", fontWeight: "600" }}
          >
            Coupon Discount (percent) <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control mt-2"
            type="text"
            placeholder="Coupon Discount"
            onChange={handleInputChange}
            value={couponDiscount}
            maxLength={2}
          />
        </div>

        {userData ? (
          <div className="col-lg-6 mt-5">
            <div className="form-check form-switch">
              <label for="formGroupExampleInput " className="form_text">
                Is Coupon active
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="switch"
                checked={isChecked}
                onChange={handleToggle}
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        {!userData ? (
          <div className="mt-5">
            <button onClick={onsubmit} className="btn btn-primary">
              Add Coupon
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <button onClick={onEditCoupon} className="btn btn-primary">
              Edit Coupon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCoupon;
