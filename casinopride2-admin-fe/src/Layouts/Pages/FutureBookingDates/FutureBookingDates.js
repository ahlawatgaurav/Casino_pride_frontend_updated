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
import {
  deleteFutureBookingDatePeriod,
  getFutureBookingDatesDetails,
} from "../../../Redux/actions/users";
import moment from "moment";

const FutureBookingDates = () => {
  const dispatch = useDispatch();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [discountDetails, setDiscountDetails] = useState([]);
  const [futureDates, setFutureDates] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);

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

            const details = callback?.response?.Details || {};
            setFilteredDiscountDetails(details);
            setDiscountDetails(details);
            setFutureDates(details);
            setBlockedDates(details?.BlockedDates || []);
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

  const deleteDatePeriod = (blockedDateId) => {
    dispatch(
      deleteFutureBookingDatePeriod(
        loginDetails?.logindata?.Token,
        blockedDateId,
        (callback) => {
          if (callback.status) {
            toast.success("Date period deleted");
            getchFutureBookingDates();
          } else {
            toast.error(callback.error || "Failed to delete date period");
          }
        }
      )
    );
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
          <div className="col-md-4 col-lg-12 d-flex justify-content-end mb-3">
            <button className="btn btn-primary">
              <Link
                to="/AddFutureBookingDates"
                state={{ userType: "4" }}
                className="addLinks"
              >
                Add Date Period
              </Link>
            </button>
          </div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Type
            </th>
            <th scope="col" className="text-center table_heading">
              Start Date
            </th>
            <th scope="col" className="text-center table_heading">
              End Date
            </th>
            <th scope="col" className="text-center table_heading">
              Edit
            </th>
            <th scope="col" className="text-center table_heading">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
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
              <td colSpan="5" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            filteredDiscountDetails && (
              <tr>
                <td className="manager-list">Booking Window</td>
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
                <td className="manager-list">-</td>
              </tr>
            )
          )}
          {!loading &&
            blockedDates.map((datePeriod) => (
              <tr key={datePeriod.Id}>
                <td className="manager-list">
                  {datePeriod.DateType === "sold_out" ? "Sold Out" : "Black Out"}
                </td>
                <td className="manager-list">
                  {moment(datePeriod.StartDate).format("YYYY-MM-DD")}
                </td>
                <td className="manager-list">
                  {moment(datePeriod.EndDate).format("YYYY-MM-DD")}
                </td>
                <td className="manager-list">
                  <Link
                    to="/AddFutureBookingDates"
                    state={{ userData: datePeriod }}
                    className="links"
                  >
                    <AiFillEdit
                      style={{ color: "#C5CEE0", fontSize: "20px" }}
                    />
                  </Link>
                </td>
                <td className="manager-list">
                  <button
                    className="btn btn-link p-0"
                    onClick={() => deleteDatePeriod(datePeriod.Id)}
                  >
                    <AiFillDelete
                      style={{ color: "#d32f2f", fontSize: "20px" }}
                    />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default FutureBookingDates;
