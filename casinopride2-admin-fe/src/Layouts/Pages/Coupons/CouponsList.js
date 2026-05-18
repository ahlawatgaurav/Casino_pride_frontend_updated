import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import { getCouponDetails, deleteCoupon } from "../../../Redux/actions/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import more from "../../../assets/Images/more.png";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const CouponsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);

  const [couponDetails, setCouponDetails] = useState([]);
  const [filteredCouponDetails, setFilteredCouponDetails] = useState([]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (Id) => {
    setShowModal(true);
    console.log("id to be deleted", Id);
    setUserId(Id);
  };

  const fetchCouponDetails = () => {
    dispatch(
      getCouponDetails(loginDetails?.logindata?.Token, 4, (callback) => {
        if (callback.status) {
          setLoading(false);
          console.log(
            "Callback---------get Coupon Details",
            callback?.response
          );

          setFilterPackageDetails(callback?.response?.Details);
          setCouponDetails(callback?.response?.Details);
          setFilteredCouponDetails(callback?.response?.Details);
        }
      })
    );
  };

  useEffect(() => {
    fetchCouponDetails();
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  // const filterCouponListDetails = () => {
  //   if (searchQuery.trim() === "") {
  //     setFilteredCouponDetails([]);
  //   } else {
  //     const lowerCaseQuery = searchQuery.toLowerCase();
  //     const filtered = couponDetails.filter((item) =>
  //       item?.CouponTitle.toLowerCase().includes(lowerCaseQuery)
  //     );
  //     setFilteredCouponDetails(filtered);
  //   }
  // };

  const filterCouponListDetails = (value) => {
    if (value?.trim() === "") {
      fetchCouponDetails();
      // setFilteredManagerDetails([]);
    } else {
      const lowerCaseQuery = value?.toLowerCase();
      const filtered = couponDetails?.filter((item) =>
        item?.CouponTitle?.toLowerCase()?.includes(lowerCaseQuery)
      );
      setFilteredCouponDetails(filtered);
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

  const originalDate = "2023-09-08T18:30:00.000Z";

  // Use moment to parse the original date string
  const parsedDate = moment(originalDate);

  // Add a week to the parsed date
  const newDate = parsedDate.add(7, "days");

  // Format the new date as 'YYYY-MM-DD'
  const formattedDate = newDate.format("YYYY-MM-DD");

  console.log("startDate--------------->", formattedDate);

  const addWeekToDate = (dateString) => {
    const parsedDate = moment(dateString);
    const newDate = parsedDate.add(7, "days");
    return newDate.format("YYYY-MM-DD");
  };

  return (
    <div>
      <h3 className="mb-4">Coupon List</h3>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-lg-6 mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search coupon name"
                onChange={(e) => {
                  // setSearchQuery(e.target.value);
                  filterCouponListDetails(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-6 d-flex justify-content-end mb-3">
            <button className="btn btn-primary">
              <Link
                to="/AddCoupon"
                state={{ userType: "4" }}
                className="addLinks"
              >
                Add Coupon
              </Link>
            </button>
          </div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Coupon Name
            </th>
            <th scope="col" className="text-center table_heading">
              Series Start
            </th>
            <th scope="col" className="text-center table_heading">
              Series End
            </th>
            <th scope="col" className="text-center table_heading">
              Start Date
            </th>
            <th scope="col" className="text-center table_heading">
              End Date
            </th>
            <th scope="col" className="text-center table_heading">
              Status
            </th>
            <th scope="col" className="text-center table_heading">
              Edit
            </th>

            <th scope="col" className="text-center table_heading">
              View more
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
          ) : filteredCouponDetails.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            filteredCouponDetails.map((item) => (
              <tr key={item.id}>
                <td className="manager-list ">{item?.CouponTitle}</td>
                <td className="manager-list">{item?.SeriesStart}</td>
                <td className="manager-list">{item?.SeriesEnd}</td>
                <td className="manager-list">
                  {moment(item?.StartDate).format("YYYY-MM-DD")}
                </td>
                <td className="manager-list">
                  {moment(item?.EndDate).format("YYYY-MM-DD")}
                </td>

                <td className="manager-list">
                  {item.IsCouponEnabled === 1 ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>In Active</span>
                  )}
                </td>

                <td className="manager-list">
                  <Link
                    to="/AddCoupon"
                    state={{ userData: item }}
                    className="links"
                  >
                    <AiFillEdit
                      style={{ color: "#C5CEE0", fontSize: "20px" }}
                    />
                  </Link>
                </td>

                <td
                  className="manager-list"
                  onClick={() => handleViewMore(item)}
                >
                  <img src={more} className="more_img" />
                </td>

                {/* <td className="manager-list">
                  <div className="row">
                    <div className="col-lg-4">
                      <Link
                        to="/AddPackage"
                        state={{ userData: item }}
                        className="links"
                      >
                        <AiFillEdit />
                      </Link>
                    </div>
                    <div className="col-lg-4">
                      <AiFillDelete onClick={() => handleShow(item.Id)} />
                    </div>
                    <div
                      className="col-lg-4"
                      onClick={() => handleViewMore(item)}
                    >
                      View more
                    </div>
                  </div>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />

      <Modal show={showViewMoreModal} onHide={handleCloseViewMore}>
        <Modal.Header closeButton>
          <Modal.Title>Coupon Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="manager-list ">
            Coupon Title: {selectedUserDetails?.CouponTitle}
          </p>
          <p className="manager-list ">
            Initial : {selectedUserDetails?.Initial}
          </p>
          <p className="manager-list ">
            Series Start: {selectedUserDetails?.SeriesStart}
          </p>
          <p className="manager-list ">
            Series End: {selectedUserDetails?.SeriesEnd}
          </p>
          <p className="manager-list ">
            {/* Start Date: {addWeekToDate(selectedUserDetails?.StartDate)} */}
            Start Date: {moment(selectedUserDetails?.StartDate).format("YYYY-MM-DD")}
          </p>
          <p className="manager-list ">
            {/* End Date: {addWeekToDate(selectedUserDetails?.EndDate)} */}
            End Date: {moment(selectedUserDetails?.EndDate).format("YYYY-MM-DD")}
          </p>

          <p className="manager-list ">
            Remaining Coupons: {selectedUserDetails.RemainingCoupons}
          </p>
          <p className="manager-list ">
            Total Coupons: {selectedUserDetails.TotalCoupons}
          </p>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default CouponsList;
