import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import { getPackageDetails, deletePackage } from "../../../Redux/actions/users";
import { fetchUserbookings } from "../../../Redux/actions/booking";
import { useDispatch } from "react-redux";
import {
  GetBillingDetails,
  getVoidBillingList,
  getNoShowGuestList,
} from "../../../Redux/actions/billing";
import { getUserDetails } from "../../../Redux/actions/users";
import { useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import "../../../assets/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import more from "../../../assets/Images/more.png";
import PackagesPage from "../Packages/PackagePage";
import Select from "react-select";
import moment from "moment";
import { voidBill } from "../../../Redux/actions/billing";
import { updateBillForVoid } from "../../../Redux/actions/billing";
import { generateCSVReport } from "../../../Redux/actions/billing";
import { generateNoShowReport } from "../../../Redux/actions/billing";
import { useNavigate } from "react-router-dom";

const RegenerateBill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log(
    "loginDetails--------------{{{{{{{{{{{}}}}}}}}}}}}}}-------->",
    loginDetails?.logindata?.userId
  );

  const [userBookings, setUserBookings] = useState([]);
  const [billingDetails, setBillingDetails] = useState([]);
  const [userName, setUserName] = useState([]);
  const [searchQuery, setSearchQuery] = useState(0);
  const [searchBillId, setSearhBillId] = useState("");
  const [loading, setLoading] = useState(true);

  const [disableInput, setDisableInput] = useState(false);

  const [itemDetails, setItemDetails] = useState([]);

  const [filteredUserBookings, setFilteredUserBookings] = useState([]);
  const [filteredBillingList, setFilteredBillingList] = useState([]);

  const todayDate = moment().format("YYYY-MM-DD");

  const [futureDate, setFutureDate] = useState(
    loginDetails?.logindata?.UserType == 2 ||
      loginDetails?.logindata?.UserType == 3
      ? todayDate
      : ""
  );

  // const [futureDate, setFutureDate] = useState("");

  console.log(
    "<------------------filtered Billing List-------------->",
    filteredBillingList
  );
  const [reportId, setReportId] = useState(0);
  const [shiftId, setShitId] = useState(0);
  const [userId, setUserId] = useState(0);
  const [billId, setBillId] = useState(0);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [showViewMoreNoShowListModal, setShowViewMoreNoShowListModal] =
    useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState({});
  const [selectedNoShowListDetails, setSelectedNoShowListDetails] = useState(
    {}
  );
  const [allBill, setAllBill] = useState(true);
  const [voidBillList, setVoidBillList] = useState(false);
  const [noShowGuestList, setNoShowGuestList] = useState(false);
  const [voidBillingList, setVoidBillingList] = useState([]);
  const [displayNoShowGuestList, setDisplayNoShowGuestList] = useState([]);
  const [eventDate, setEventDate] = useState(null);
  const [online, setOnline] = useState(reportId == 4 ? 1 : 0);

  const fetchBillingDetailsFn = () => {
    dispatch(
      GetBillingDetails(
        loginDetails?.logindata?.Token,
        futureDate,
        userId,
        shiftId,
        billId,
        searchBillId,
        online,

        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log("Callback---------get billings", callback?.response);
            setBillingDetails(callback?.response?.Details);
            setFilteredBillingList(callback?.response?.Details);
          } else {
            console.log("Callback---------get billings--error", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const fetchUsersDetails = () => {
    dispatch(
      getUserDetails(loginDetails?.logindata?.Token, 0, (callback) => {
        if (callback.status) {
          setLoading(false);
          setUserName(callback?.response?.Details);
          console.log("Callback---------User details", callback?.response);
        } else {
          console.log("Callback---------User details--error", callback.error);
          toast.error(callback.error);
        }
      })
    );
  };

  useEffect(() => {
    console.log("Called when id changed");
    fetchBillingDetailsFn();
    fetchUsersDetails();
    fetchVoidBillList();
    fetchNoShowGuestList();
    if (
      loginDetails?.logindata?.UserType == "3" ||
      loginDetails?.logindata?.UserType == "4"
    ) {
      const today = moment().format("YYYY-MM-DD");
      setFutureDate(today);
    }
  }, [dispatch]);

  const handleShiftChange = (selectedOption) => {
    setShitId(selectedOption?.value);
  };

  const handleReportTypeChange = (selectedOption) => {
    setReportId(selectedOption?.value);
  };

  const handleViewMore = (item) => {
    setSelectedUserDetails(item);
    setShowViewMoreModal(true);
  };
  const handleNoShowListViewMore = (item) => {
    console.log("handleNoShowListViewMore-->", item);
    setSelectedNoShowListDetails(item);
    setShowViewMoreNoShowListModal(true);
  };

  const handleCloseViewMore = () => {
    setShowViewMoreModal(false);
    setSelectedUserDetails({});
  };
  const handleCloseNoShowListViewMore = () => {
    setShowViewMoreNoShowListModal(false);
    setSelectedNoShowListDetails({});
  };

  const filterPackageDetailsFn = () => {
    if (searchQuery.trim() === "") {
      setFilteredBillingList([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = billingDetails.filter((item) =>
        item?.GuestName.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredBillingList(filtered);
    }
  };

  const handleSelectChange = (selectedOption) => {
    setUserId(selectedOption?.value);
  };

  const options = userName.map((user) => ({
    value: user.Id,
    label: user.Username,
  }));

  const shiftOptions = [
    { value: 0, label: "Select a shift" },
    { value: "1", label: "Shift 1" },
    { value: "2", label: "Shift 2" },
    { value: "3", label: "Shift 3" },
  ];

  const reportTypeOptions = [
    { value: "", label: "Select a report type" },
    { value: "1", label: "User Wise" },
    { value: "2", label: "Day Wise" },
    { value: "3", label: "Shift Wise" },
    { value: "4", label: "Online" },
  ];

  const searchBtn = () => {
    if (searchBillId && (futureDate || userId || shiftId)) {
      toast.error(
        "If Bill ID is selected, other filters should not be selected."
      );
      return;
    }

    if (shiftId && !futureDate) {
      toast.error("Please select a date when choosing shifts.");

      return;
    } else {
      fetchBillingDetailsFn();
    }
  };

  useEffect(() => {
    searchBtn();
  }, [searchBillId, futureDate, userId, shiftId]);

  useEffect(() => {
    setDisableInput(true);
  }, [futureDate, handleSelectChange, handleShiftChange]);

  const [billDate, setBillDate] = useState("");

  const clearFilters = () => {
    console.log("All clear");
    setFutureDate("");
    setShitId(0);
    setUserId(0);
    setBillId(0);
    setSearhBillId(0);
    fetchBillingDetailsFn();
  };

  const fetchVoidBillList = () => {
    dispatch(
      getVoidBillingList(loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          setLoading(false);
          console.log(
            "Callback---------getVoidBillingList",
            callback?.response
          );
          setVoidBillingList(callback?.response?.Details);
          // setFilteredBillingList(callback?.response?.Details);
        } else {
          console.log(
            "Callback---------getVoidBillingList>>error",
            callback.error
          );
          toast.error(callback.error);
        }
      })
    );
  };
  const fetchNoShowGuestList = () => {
    dispatch(
      getNoShowGuestList(
        loginDetails?.logindata?.Token,
        eventDate,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log(
              "Callback---------getNoShowGuestList",
              callback?.response
            );
            setDisplayNoShowGuestList(callback?.response?.Details);
            // setFilteredBillingList(callback?.response?.Details);
          } else {
            console.log(
              "Callback---------getNoShowGuestList>>error",
              callback.error
            );
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const handleToggle = (field) => {
    // Toggle the state of the corresponding field
    if (field === "allBill") {
      setAllBill(!allBill); // Toggle the state
      setVoidBillList(false);
      setNoShowGuestList(false);
    } else if (field === "voidBillList") {
      setVoidBillList(!voidBillList);
      setAllBill(false);
      setNoShowGuestList(false);
    } else if (field === "noShowGuestList") {
      setNoShowGuestList(!noShowGuestList);
      setAllBill(false);
      setVoidBillList(false);
    }
  };
  // Function to get the current date in the format 'YYYY-MM-DD'
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = (today.getDate() - 1).toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchNoShowGuestList();
  }, [eventDate]);

  useEffect(() => {
    if (
      allBill === false &&
      voidBillList === false &&
      noShowGuestList === false
    ) {
      setAllBill(true);
    }
  }, [allBill]);

  useEffect(() => {
    if (
      allBill === false &&
      voidBillList === false &&
      noShowGuestList === false
    ) {
      setAllBill(true);
    }
  }, [voidBillList]);

  useEffect(() => {
    if (
      allBill === false &&
      voidBillList === false &&
      noShowGuestList === false
    ) {
      setAllBill(true);
    }
  }, [noShowGuestList]);

  console.log(
    "Hi --------------> Welcome to the future dateeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    futureDate
  );

  const [isModalVisible, setModalVisibility] = useState(false);

  const closeModal = () => setModalVisibility(false);

  const [voidBookingId, stVoidBookingId] = useState("");
  const openModal = (item) => {
    console.log("Void billing id check", item?.BookingId);
    stVoidBookingId(item?.BookingId);
    setModalVisibility(true);
  };

  const handleVoidBill = () => {
    const voidBillData = {
      bookingId: voidBookingId,
    };

    dispatch(
      voidBill(loginDetails?.logindata?.Token, voidBillData, (callback) => {
        if (callback.status) {
          setLoading(false);
          console.log("Callback---------void bill", callback?.response);
        } else {
          console.log("Callback--------voidt>>error", callback.error);
          toast.error(callback.error);
        }
      })
    );
  };

  const [show, setShow] = useState(false);

  const [editVoidDetails, setEditVoidDetails] = useState("");

  const handleShow = (item) => {
    console.log("Update void bill----------------->", item);
    setEditVoidDetails(item);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const handleUpdateBilling = () => {
    // Add your logic to update billing information here
    // You can access the input values using state or refs
    handleClose(); // Close the modal after updating
  };

  const [newBillId, setNewBillId] = useState("");

  const handleUpdateVoidBill = () => {
    const UpdateVoidBillData = {
      voidBillId: editVoidDetails?.BillingId,
      bookingId: editVoidDetails?.BookingId,
      newBillId: newBillId,
    };

    dispatch(
      updateBillForVoid(
        loginDetails?.logindata?.Token,
        UpdateVoidBillData,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log("Callback------update---void bill", callback?.response);
            handleClose();
            fetchVoidBillList();
          } else {
            console.log("Callback------update --voidt>>error", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const generateReportFn = () => {
    const reportData = {
      userId: userId,
      billDate: futureDate,
      futureDate: billDate,
      shiftId: shiftId,
      reportTypeId: reportId,
    };

    dispatch(
      generateCSVReport(
        loginDetails?.logindata?.Token,
        reportData,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log(
              "Callback------generate report",
              callback?.response?.Details?.ReportFile
            );
            window.open(callback?.response?.Details?.ReportFile, "_blank");

            handleClose();
            setShitId(0);
            setBillId(0);
            setUserId(0);
            setFutureDate("");
            setReportId(0);
            fetchVoidBillList();
            setBillDate("");
          } else {
            console.log("Callback------generate report error", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const generateNoShowBillFn = () => {
    dispatch(
      generateNoShowReport(
        loginDetails?.logindata?.Token,
        eventDate,
        (callback) => {
          if (callback.status) {
            setLoading(false);
            console.log("Callback------No show bill---", callback?.response);
          } else {
            console.log("Callback------", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const combinedData = {};

  filteredBillingList.forEach((item) => {
    const bookingId = item.BookingId;
    if (!combinedData[bookingId]) {
      combinedData[bookingId] = {
        BookingId: bookingId,
        Items: [item],
      };
    } else {
      combinedData[bookingId].Items.push(item);
    }
  });

  const combinedDataArray = Object.values(combinedData);

  // Now, combinedDataArray contains the data grouped by BookingId
  console.log(
    "Combined Array-------------------------->",
    combinedDataArray[1]?.Items
  );

  const regenerateBillFn = (item) => {
    console.log(
      "Item--------------------------------- regenerate bill------------>",
      item?.Items
    );

    if (item?.Items[0]?.NumOfTeens - item?.Items[0]?.TotalGuestCount == 0) {
      navigate("/TeensBilling", {
        state: { BookingDetails: item?.Items },
      });
    } else {
      navigate("/BillingDetails", {
        state: { BookingDetails: item?.Items },
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <h3 className="mb-4">Reprint Billing List</h3>

      <div className="row mt-3">
        <div className="row">
          {/* <div className="col-lg-4">
            <label for="formGroupExampleInput " className="form_text">
              Display All Bills
            </label>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="discountSwitch"
                checked={allBill}
                onChange={() => handleToggle("allBill")}
              />
            </div>
          </div> */}

          <div className="col-md-4 col-lg-3 mb-3">
            <p style={{ fontWeight: "bold" }}>Search By Bill Id</p>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                placeholder="Search Bill Id"
                onChange={(e) => {
                  setSearhBillId(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th scope="col" className="text-center table_heading">
              Bill Id
            </th>
            <th scope="col" className="text-center table_heading">
              Booking Id
            </th>
            <th scope="col" className="text-center table_heading">
              Guest Name
            </th>
            <th scope="col" className="text-center table_heading">
              Phone
            </th>

            <th scope="col" className="text-center table_heading">
              Users Name
            </th>

            <th scope="col" className="text-center table_heading">
              Shift
            </th>
            <th scope="col" className="text-center table_heading">
              Reprint Bill
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
          ) : combinedDataArray.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No data found.
              </td>
            </tr>
          ) : (
            combinedDataArray.map((item) => (
              <tr key={item.id}>
                <td className="manager-list">{item?.Items[0]?.BillingId}</td>
                <td className="manager-list ">{item?.Items[0]?.BookingId}</td>

                <td className="manager-list ">{item?.Items[0]?.GuestName}</td>
                <td className="manager-list">{item?.Items[0]?.Phone}</td>
                <td className="manager-list">{item?.Items[0]?.UsersName}</td>
                <td className="manager-list">
                  {item?.Items[0]?.ShiftId === 0
                    ? "-"
                    : item?.Items[0]?.ShiftId}
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => regenerateBillFn(item)}
                  >
                    Reprint Bill
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
};

export default RegenerateBill;
