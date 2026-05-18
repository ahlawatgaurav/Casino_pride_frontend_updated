import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AddDiscountOnWebsiteDetails,
  EditWebsiteDiscounts,
} from "../../Redux/actions/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/global.css";
import moment from "moment";

const AddDiscountOnWebsite = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;

  const todayDate = moment().format("YYYY-MM-DD");

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [usedCoupons, setusedCoupons] = useState([]);
  const [remainingCoupons, setremainingCoupons] = useState("");

  const [discountTitle, setDiscountTitle] = useState(
    userData?.DiscountTitle ? userData?.DiscountTitle : ""
  );
  const [discountAmount, setDiscountAmount] = useState(
    userData?.Discount ? userData?.Discount : ""
  );
  const [startDate, setstartDate] = useState(
    userData?.StartDate ? userData?.StartDate : ""
  );
  const [endDate, setendDate] = useState(
    userData?.EndDate ? userData?.EndDate : ""
  );

  const [isChecked, setIsChecked] = useState(
    userData?.IsDiscountEnabled ? userData?.IsDiscountEnabled : 0
  );

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const onsubmit = () => {
    if (
      discountTitle == "" ||
      discountAmount == "" ||
      startDate == "" ||
      endDate == ""
    ) {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        discountTitle: discountTitle,
        discountAmount: discountAmount,
        StartDate: startDate,
        EndDate: endDate,
        IsActive: 1,
        isDiscountEnabled: 1,
      };

      dispatch(
        AddDiscountOnWebsiteDetails(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              toast.success("Discount Added");
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

  const onEditCoupon = () => {
    if (
      discountTitle == "" ||
      discountAmount == "" ||
      startDate == "" ||
      endDate == ""
    ) {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        discountId: userData?.Id,
        discountRef: userData?.Ref,
        discountTitle: discountTitle,
        discountAmount: discountAmount,
        StartDate: startDate,
        EndDate: endDate,
        IsActive: 1,
        isDiscountEnabled: isChecked ? 1: 0,
      };

      dispatch(
        EditWebsiteDiscounts(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              toast.success("Website Discounts Edited");
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
    <div>
      {" "}
      <ToastContainer />{" "}
      <div className="row">
        <h3 className="mb-4">Add Website Discount</h3>
        <div className="col-lg-6 mt-3 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Discount Title <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2 "
            type="text"
            disabled={userData ? true : false}
            placeholder="Discount Title"
            onChange={(e) => setDiscountTitle(e.target.value)}
            defaultValue={userData?.DiscountTitle}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label
            for="formGroupExampleInput "
            className="form_text"
            style={{ fontSize: "15px", fontWeight: "600" }}
          >
            Discount Percentage <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            type="number"
            placeholder="Enter Discount Percentage"
            onChange={(e) => setDiscountAmount(e.target.value)}
            defaultValue={userData?.Discount}
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
            defaultValue={userData?.StartDate}
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
            placeholder="End Date"
            onChange={(e) => setendDate(e.target.value)}
            defaultValue={userData?.EndDate}
            min={startDate}
          />
        </div>

        <div className="col-lg-6 mt-5">
          <div className="form-check form-switch">
            <label for="formGroupExampleInput " className="form_text">
              Is Discount active?
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

        {!userData ? (
          <div className="mt-5">
            <button onClick={onsubmit} className="btn btn-primary">
              Add Website Discount
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <button onClick={onEditCoupon} className="btn btn-primary">
              Edit Website Discount
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDiscountOnWebsite;
