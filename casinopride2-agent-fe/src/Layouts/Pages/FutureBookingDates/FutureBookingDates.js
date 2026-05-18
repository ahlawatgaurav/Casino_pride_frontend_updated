import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import {
  getPanleDiscounts,
  deleteWebsiteDiscount,
} from "../../../Redux/actions/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import { getFutureBookingDatesDetails } from "../../../Redux/actions/users";
import moment from "moment";

const FutureBookingDates = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [discountDetails, setDiscountDetails] = useState([]);
  const [futureDates, setFutureDates] = useState("");

  const [filteredDiscountDetails, setFilteredDiscountDetails] = useState([]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (Id) => {
    setShowModal(true);
    console.log("id to be deleted", Id);
    setUserId(Id);
  };

  const getchFutureBookingDates = () => {
    dispatch(
      getFutureBookingDatesDetails(
        loginDetails?.logindata?.Token,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log(
              "Callback---------future booking dates",
              callback?.response
            );

            setFilteredDiscountDetails(callback?.response?.Details);
            setDiscountDetails(callback?.response?.Details);
            setFutureDates(callback?.response?.Details);
          }
        }
      )
    );
  };

  useEffect(() => {
    getchFutureBookingDates();
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const filterPackageDetailsFn = () => {
    if (searchQuery.trim() === "") {
      setFilteredDiscountDetails([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = discountDetails.filter((item) =>
        item?.PanelDiscountTitle.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredDiscountDetails(filtered);
    }
  };

  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState({});

  const handleViewMore = (userDetails) => {
    setSelectedUserDetails(userDetails);
    setShowViewMoreModal(true);
  };

  const handleCloseViewMore = () => {
    setShowViewMoreModal(false);
    setSelectedUserDetails({});
  };

  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = (PackageId) => {
    console.log("PackageId", PackageId);
  };

  const formattedStartDate = moment(filteredDiscountDetails.StartDate).format(
    "YYYY-MM-DD"
  );
  const formattedEndDate = moment(filteredDiscountDetails.EndDate).format(
    "YYYY-MM-DD"
  );

  return (
    <div>
      <h3 className="mb-4">Future Booking Dates</h3>
      <div className="container">
        <div className="row">
          {/* <div className="col-md-8 col-lg-6 mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search Discount title"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  filterPackageDetailsFn();
                }}
              />
            </div>
          </div> */}
          {!futureDates ? (
            <div className="col-md-4 col-lg-12 d-flex justify-content-end mb-3">
              <button className="btn btn-primary">
                <Link
                  to="/AddFutureBookingDates"
                  state={{ userType: "4" }}
                  className="addLinks"
                >
                  Add Future Booking Dates
                </Link>
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Start Date
            </th>
            <th scope="col" className="text-center table_heading">
              End Date
            </th>
            <th scope="col" className="text-center table_heading">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Oval
                    height={80}
                    width={50}
                    color="#4fa94d"
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              </td>
            </tr>
          ) : filteredDiscountDetails.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            filteredDiscountDetails && (
              <tr>
                <td className="manager-list">{formattedStartDate}</td>
                <td className="manager-list">{formattedEndDate}</td>

                <td className="manager-list">
                  <Link
                    to="/AddFutureBookingDates"
                    state={{ userData: filteredDiscountDetails }}
                    className="links"
                  >
                    <AiFillEdit
                      style={{ color: "#C5CEE0", fontSize: "20px" }}
                    />
                  </Link>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default FutureBookingDates;
