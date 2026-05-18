import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import { getPackageDetails, deletePackage } from "../../../Redux/actions/users";
import { fetchUserbookings } from "../../../Redux/actions/booking";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal, Form } from "react-bootstrap";
import more from "../../../assets/Images/more.png";
import PackagesPage from "../Packages/PackagePage";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { updateBooking } from "../../../Redux/actions/booking";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { fetchBookingByUser } from "../../../Redux/actions/booking";
import moment from "moment";

const BookingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
  console.log(
    "Login details of user------------------>",
    loginDetails?.logindata?.userId
  );

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);

  const [userBookings, setUserBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (Id) => {
    setShowModal(true);
    console.log("id to be deleted", Id);
    setUserId(Id);
  };
  const todayDate = moment().format("YYYY-MM-DD");

  const [itemDetails, setItemDetails] = useState([]);
  const [bookingDate, setBookingDate] = useState(todayDate);

  const [filteredUserBookings, setFilteredUserBookings] = useState([]);

  const fetchUserBookingFn = () => {
    dispatch(
      fetchBookingByUser(
        loginDetails?.logindata?.Token,
        loginDetails?.logindata?.userId,
        bookingDate,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log(
              "Callback---------get user bookings",
              callback?.response
            );
            setUserBookings(callback?.response?.Details);
            setFilteredUserBookings(callback?.response?.Details);
          } else {
            console.log(callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  useEffect(() => {
    fetchUserBookingFn();
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState({});

  const handleViewMore = (userDetails) => {
    console.log("User details on view more------------->", userDetails);
    setSelectedUserDetails(userDetails);
    setShowViewMoreModal(true);
  };

  const handleCloseViewMore = () => {
    setShowViewMoreModal(false);
    setSelectedUserDetails({});
  };

  const filterPackageDetailsFn = () => {
    if (searchQuery.trim() === "") {
      setFilteredUserBookings([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = userBookings.filter((item) =>
        item?.FullName.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredUserBookings(filtered);
    }
  };

  useEffect(() => {
    fetchUserBookingFn();
  }, [bookingDate]);

  const [editBookingDetails, setEditBookingDetails] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const startEditing = (item) => {
    console.log("Item details from modal------------------->", item);
    setEditBookingDetails(item);
    setIsEditing(true);
  };
  const cancelEditing = () => setIsEditing(false);

  const [guestName, setGuestName] = useState(
    editBookingDetails ? editBookingDetails.FullName : ""
  );
  const [address, setAddress] = useState(
    editBookingDetails ? editBookingDetails?.Address : ""
  );
  const [dateofbirth, setDateofbirth] = useState("");
  const [gstNumber, setgstNumber] = useState(
    editBookingDetails ? editBookingDetails?.GSTNumber : ""
  );

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    console.log(selectedCountry);
    console.log(selectedCountry?.isoCode);
    console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  }, [selectedCountry]);

  const backendData = {
    selectedCountryName: editBookingDetails?.Country,
    selectedStateName: editBookingDetails?.State,
  };

  useEffect(() => {
    setSelectedCountry({ name: backendData.selectedCountryName });
    setSelectedState({ name: backendData.selectedStateName });
  }, []);

  console.log();

  const updateBookingFn = () => {
    const data = {
      bookingId: editBookingDetails?.Id,
      guestName: guestName,
      address: address,
      dob: dateofbirth,
      country: selectedCountry?.name,
      state: selectedState?.name,
      city: selectedCity,
      GSTNumber: gstNumber,
      isActive: 1,
    };

    dispatch(
      updateBooking(loginDetails?.logindata?.Token, data, (callback) => {
        if (callback.status) {
          toast.success("Updated Booking details success");

          navigate("/GenerateBill", {
            state: { userData: callback?.response?.Details },
          });

          toast.error(callback.error);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const filterBookingList = (value) => {
    if (value?.trim() == "") {
      fetchUserBookingFn();
    } else {
      const lowerCaseQuery = value.toLowerCase();
      const filtered = userBookings?.filter(
        (item) =>
          item?.FullName?.toLowerCase()?.includes(lowerCaseQuery) ||
          item?.Phone?.includes(value) ||
          item?.Email?.toLowerCase()?.includes(lowerCaseQuery)
      );
      setFilteredUserBookings(filtered);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h3 className="mb-4">Booking List</h3>
      <div>
        <div className="row">
          <div className="col-md-6 col-lg-6 mb-3 justify-content-start">
            <p style={{ fontWeight: "bold" }}>Search </p>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                onChange={(e) => {
                  filterBookingList(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="col-md-2 col-lg-2 mb-2">
            <p style={{ fontWeight: "bold" }}>Booking Date</p>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                placeholder="Search name"
                // defaultValue={bookingDate}
                defaultValue={moment(bookingDate).format("YYYY-MM-DD")}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4 col-lg-4 d-flex justify-content-end mb-3">
            <Link
              to="/NewBooking"
              state={{ userType: "4" }}
              className="addLinks"
              >
              <button className="btn btn-primary h-100">
                New Booking
              </button>
            </Link>
          </div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Full Name
            </th>
            <th scope="col" className="text-center table_heading">
              Phone
            </th>
            <th scope="col" className="text-center table_heading">
              Total Amount
            </th>
            <th scope="col" className="text-center table_heading">
              Total Guest Count
            </th>
            {/* <th scope="col" className="text-center table_heading">
              Update Booking
            </th> */}

            <th scope="col" className="text-center table_heading">
              View more
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
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
          ) : filteredUserBookings.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            filteredUserBookings.map((item) => (
              <tr key={item.id}>
                <td className="manager-list ">{item.FullName}</td>
                <td className="manager-list">{item.Phone}</td>
                <td className="manager-list">{item.ActualAmount}</td>
                <td className="manager-list">{item.TotalGuestCount}</td>
                {/* <td className="manager-list">
                  <button
                    className="btn btn-primary"
                    onClick={() => startEditing(item)}
                  >
                    Update Booking
                  </button>
                </td> */}

                {/* <td className="manager-list">
                  <Link
                    to="/AddPackage"
                    state={{ userData: item }}
                    className="links"
                  >
                    <AiFillEdit
                      style={{ color: "#C5CEE0", fontSize: "20px" }}
                    />
                  </Link>
                </td> */}

                <td
                  className="manager-list"
                  onClick={() => handleViewMore(item)}
                >
                  <img src={more} className="more_img" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />

      <Modal show={showViewMoreModal} onHide={handleCloseViewMore} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-6">
            <p className="table-modal-list ">
              Full Name: {selectedUserDetails.FullName}
            </p>
          </div>
          <div className="col-6">
            <p className="table-modal-list ">
              Phone: {selectedUserDetails.Phone}
            </p>
          </div>
          {!selectedUserDetails.Email == "" ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Email: {selectedUserDetails.Email}
              </p>
            </div>
          ) : (
            <></>
          )}{" "}
          <div className="col-6">
            <p className="table-modal-list ">
              Guest Count: {selectedUserDetails.TotalGuestCount}
            </p>
          </div>
          {!selectedUserDetails.Address == "" ? (
            <div className="col-12">
              <p className="table-modal-list ">
                Address: {selectedUserDetails.Address}
              </p>
            </div>
          ) : (
            <></>
          )}
          {!selectedUserDetails.Country == "" ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Country: {selectedUserDetails.Country}
              </p>
            </div>
          ) : (
            <></>
          )}
          {!selectedUserDetails.State == "" ? (
            <div className="col-6">
              <p className="table-modal-list ">
                State: {selectedUserDetails.State}
              </p>
            </div>
          ) : (
            <></>
          )}
          {!selectedUserDetails.City == "" ? (
            <div className="col-4">
              <p className="table-modal-list ">
                City: {selectedUserDetails.City}
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="col-6">
            <p className="table-modal-list ">
              Actual Amount: {selectedUserDetails.ActualAmount}
            </p>
          </div>
          <div className="col-6">
            <p className="table-modal-list ">
              Amount After Discount: {selectedUserDetails.AmountAfterDiscount}
            </p>
          </div>
          <div className="col-6">
            <p className="table-modal-list ">
              Booking Commission: {selectedUserDetails.BookingCommision}
            </p>
          </div>

          {selectedUserDetails.DOB == "" ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Date of Birth: {selectedUserDetails.DOB}
              </p>
            </div>
          ) : (
            <></>
          )}
          {selectedUserDetails.PanelDiscount > 0 ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Panel Discount : {selectedUserDetails.PanelDiscount} %
              </p>
            </div>
          ) : (
            <></>
          )}
          {selectedUserDetails.WebsiteDiscount > 0 ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Website Discount : {selectedUserDetails.WebsiteDiscount} %
              </p>
            </div>
          ) : (
            <></>
          )}
          {selectedUserDetails.CouponDiscount > 0 ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Coupon Discount : {selectedUserDetails.CouponDiscount} %
              </p>
            </div>
          ) : (
            <></>
          )}
          {!selectedUserDetails.ReferredBy === "" ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Referred By : {selectedUserDetails.ReferredBy}
              </p>
            </div>
          ) : (
            <></>
          )}
          {selectedUserDetails?.PackageName ? (
            <div className="col-6">
              <p className="table-modal-list ">
                Packages : {JSON.parse(selectedUserDetails?.PackageName)}
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="col-6">
            <p className="table-modal-list ">
              Booking Date and Time : {selectedUserDetails?.CreatedOn}
            </p>
          </div>
          <div className="col-6">
            <p className="table-modal-list ">
              Event Date : {selectedUserDetails?.FutureDate}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        show={isEditing}
        onHide={cancelEditing}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking for {editBookingDetails?.Id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-6 mt-3 mt-3">
              <label for="formGroupExampleInput " className="form_text">
                Guest Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                class="form-control mt-2 "
                type="text"
                placeholder="Full Name"
                onChange={(e) => setGuestName(e.target.value)}
                defaultValue={editBookingDetails?.FullName}
              />
            </div>

            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput " className="form_text">
                Address <span style={{ color: "red" }}>*</span>
              </label>
              <input
                class="form-control mt-2"
                type="text"
                placeholder="Enter your address"
                onChange={(e) => setAddress(e.target.value)}
                defaultValue={editBookingDetails?.Address}
              />
            </div>

            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput " className="form_text">
                Date of birth
              </label>
              <input
                class="form-control mt-2"
                type="date"
                placeholder="Enter Start Date"
                onChange={(e) => setDateofbirth(e.target.value)}
                defaultValue={editBookingDetails?.DOB}
              />
            </div>
            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput " className="form_text">
                GST Details
              </label>
              <input
                class="form-control mt-2"
                type="text"
                placeholder="Enter GST number"
                onChange={(e) => setgstNumber(e.target.value)}
                defaultValue={editBookingDetails?.GSTNumber}
              />
            </div>

            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput " className="form_text mb-2">
                Country
              </label>
              <Select
                // className="form-control"
                options={Country.getAllCountries()}
                getOptionLabel={(options) => {
                  return options["name"];
                }}
                getOptionValue={(options) => {
                  return options["name"];
                }}
                value={selectedCountry}
                onChange={(item) => {
                  setSelectedCountry(item);
                }}
              />
            </div>
            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput " className="form_text mb-2">
                State
              </label>
              <Select
                // className="form-control"
                options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                getOptionLabel={(options) => {
                  return options["name"];
                }}
                getOptionValue={(options) => {
                  return options["name"];
                }}
                value={selectedState}
                onChange={(item) => {
                  setSelectedState(item);
                }}
              />
            </div>
            <div className="col-lg-6 mt-3 ">
              <label for="formGroupExampleInput " className="form_text mb-2">
                City
              </label>

              <input
                class="form-control "
                type="text"
                placeholder="Enter your city"
                onChange={(e) => setSelectedCity(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelEditing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateBookingFn}>
            Update Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingList;
