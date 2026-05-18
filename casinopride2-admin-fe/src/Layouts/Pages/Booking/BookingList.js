import React, { useState, useEffect } from "react";
import "../../../assets/ManagerList.css";
import { Link } from "react-router-dom";
import {
  getPackageDetails,
  deletePackage,
  getUserById,
} from "../../../Redux/actions/users";
import {
  fetchBookingDetailsById,
  fetchUserbookings,
  getPackagesDetails,
  updateBookingForPayAtCounterFn,
  updateShiftForBooking,
} from "../../../Redux/actions/booking";
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
import moment from "moment";
import {
  AddBillingDetails,
  AddupdateAgentSettlement,
  updateBillingDetails,
} from "../../../Redux/actions/billing";
import editpencil from "../../../assets/Images/editpencil.png";
import { FaBeer } from "react-icons/fa";
import { checkShiftForUser } from "../../../Redux/actions/users";
import { recentShiftForOutlet } from "../../../Redux/actions/users";
import { checkActiveOutlet } from "../../../Redux/actions/users";

import { LiaFileInvoiceSolid, LiaMoneyBillSolid } from "react-icons/lia";
import { CiCircleMore } from "react-icons/ci";

const BookingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const today = moment().utc().add(150, "minutes").format("YYYY-MM-DD");
  console.log("Today------>", today);
  const [payAT, setPay] = useState(true);

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const outletOpenDetails = useSelector((state) => state.auth?.outeltDetails);

  const activeDateOfOutlet = useSelector(
    (state) => state.users?.saveOutletDate?.Details
  );

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);
  const [loader, setLoader] = useState(true);

  const [userBookings, setUserBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (Id) => {
    setShowModal(true);
    console.log("id to be deleted", Id);
    setUserId(Id);
  };

  const [itemDetails, setItemDetails] = useState([]);
  const [futureDate, setFutureDate] = useState(today);
  console.log("futureDate---->", futureDate);

  const [filteredUserBookings, setFilteredUserBookings] = useState([]);

  const fetchUserBookingFn = () => {
    dispatch(
      fetchUserbookings(
        loginDetails?.logindata?.Token,
        futureDate,
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
            setUserBookings([])
            setFilteredUserBookings([])
          }
        }
      )
    );
  };

  const fetchPackageDetails = () => {
    dispatch(
      getPackagesDetails(loginDetails?.logindata?.Token, 4, (callback) => {
        if (callback.status) {
          setLoading(false);

          setFilterPackageDetails(callback?.response?.Details?.packageDetails);
          setPackageDetails(callback?.response?.Details?.packageDetails);
          setItemDetails(callback?.response?.Details?.packageItemDetails);
        }
      })
    );
  };

  useEffect(() => {
    fetchUserBookingFn();
    fetchPackageDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);

  console.log("selectedUserDetails------------------->", selectedUserDetails);

  const handleViewMore = (userDetails) => {
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
  }, [futureDate]);

  const outletOpenDate = useSelector(
    (state) => state.users?.saveOutletDate?.Details?.OutletDate
  );
  const todayOutletDate = moment(outletOpenDate).format("YYYY-MM-DD");

  const [editBookingDetails, setEditBookingDetails] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatePaymentModalOpen, setIsUpdatePaymentModalOpen] =
    useState(false);
  const [isBillGenerationModalOpen, setIsBillGenerationModalOpen] =
    useState(false);
  const [UpdatePaymentDetails, setUpdatePaymentDetails] = useState(null);

  const [paymentOption, setPaymentOption] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [cardHoldersName, setcardHoldersName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");
  const [upiId, setUpiId] = useState("");
  const [localAgentDetails, setLocalAgentDetails] = useState("");
  const [travelAgentDetails, setTravelAgentDetails] = useState(null);
  const [partCash, setPartCash] = useState("");
  const [partCard, setPartCard] = useState("");
  const [enableUpdatePayment, setEnableUpdatepayment] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePaymentSelection = (event) => {
    // Update the selected option when the user makes a selection
    setPaymentOption(event.target.value);

    console.log("payment selection----->", event.target.value);

    setCashAmount("");
    setUpiAmount("");
    setCardAmount("");
    if (event.target.value === "Cash") {
      setCashAmount(UpdatePaymentDetails?.AmountAfterDiscount);
    } else if (event.target.value === "UPI") {
      setUpiAmount(UpdatePaymentDetails?.AmountAfterDiscount);
    } else if (event.target.value === "Card") {
      setCardAmount(UpdatePaymentDetails?.AmountAfterDiscount);
    }
  };

  const handlePartPayments = (e) => {
    const newAmount = Number(e.target.value);

    if (paymentOption === "Part Card / Part Cash") {
    }
    if (paymentOption === "Part Cash / Part UPI") {
    }
    if (paymentOption === "Part Card / Part UPI") {
    }
  };

  const handlePartCard = (e) => {
    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
    }

    if (inputValue > parseFloat(UpdatePaymentDetails?.AmountAfterDiscount)) {
      //checking if the discount that is added is more than the discount percent of the agent
      inputValue = UpdatePaymentDetails?.AmountAfterDiscount;
    }

    if (paymentOption === "Part Card / Part Cash") {
      setCashAmount(
        parseFloat(UpdatePaymentDetails?.AmountAfterDiscount) - inputValue
      );
    }

    if (paymentOption === "Part Card / Part UPI") {
      setUpiAmount(
        parseFloat(UpdatePaymentDetails?.AmountAfterDiscount) - inputValue
      );
    }

    setCardAmount(inputValue);
  };

  const handlePartCash = (e) => {
    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
    } else if (
      inputValue > parseFloat(UpdatePaymentDetails?.AmountAfterDiscount)
    ) {
      //checking if the discount that is added is more than the discount percent of the agent
      inputValue = UpdatePaymentDetails?.AmountAfterDiscount;
    }

    if (paymentOption === "Part Card / Part Cash") {
      setCardAmount(
        parseFloat(UpdatePaymentDetails?.AmountAfterDiscount) - inputValue
      );
    }

    if (paymentOption === "Part Cash / Part UPI") {
      setUpiAmount(
        parseFloat(UpdatePaymentDetails?.AmountAfterDiscount) - inputValue
      );
    }

    setCashAmount(inputValue);
  };

  const handlePartUPI = (e) => {
    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
    } else if (
      inputValue > parseFloat(UpdatePaymentDetails?.AmountAfterDiscount)
    ) {
      //checking if the discount that is added is more than the discount percent of the agent
      inputValue = UpdatePaymentDetails?.AmountAfterDiscount;
    }

    if (paymentOption === "Part Card / Part UPI") {
      setCardAmount(
        parseFloat(UpdatePaymentDetails?.AmountAfterDiscount) - inputValue
      );
    }

    if (paymentOption === "Part Cash / Part UPI") {
      setCashAmount(
        parseFloat(UpdatePaymentDetails?.AmountAfterDiscount) - inputValue
      );
    }

    setUpiAmount(inputValue);
  };

  const StartUpdatingPayment = (item) => {
    setUpdatePaymentDetails(item);
    setPaymentOption(item.PaymentMode);

    if (
      item.PaymentMode === "Card" ||
      item.PaymentMode === "Part Card / Part Cash" ||
      item.PaymentMode === "Part Card / Part UPI"
    ) {
      setCardType(item.CardType);
      setCardAmount(item.CardAmount);
      setCardNumber(item.CardNumber);
      setcardHoldersName(item.CardHoldersName);
    }
    if (
      item.PaymentMode === "Cash" ||
      item.PaymentMode === "Part Card / Part Cash" ||
      item.PaymentMode === "Part Cash / Part UPI"
    ) {
      setCashAmount(item.CashAmount);
    }

    if (
      item.PaymentMode === "UPI" ||
      item.PaymentMode === "Part Card / Part UPI" ||
      item.PaymentMode === "Part Cash / Part UPI"
    ) {
      setUpiId(item.UPIId);
      setUpiAmount(item.UPIAmount);
    }

    setIsUpdatePaymentModalOpen(true);
  };

  const startBillGeneration = (item) => {
    setPaymentOption(item.PaymentMode);
    setSelectedItem(item);
    setIsBillGenerationModalOpen(true);
  }

  const handleShowR = () => {
    // setShow(true)

    if (paymentOption == "") {
      toast.warning("Please select the payment option");
      setLoader(false);
    } else if (
      paymentOption == "Card" &&
      cardType == "" &&
      cardNumber == "" &&
      cardHoldersName == "" &&
      cardAmount == ""
    ) {
      toast.warning("Please enter all card details");
      setLoader(false);
    } else if (paymentOption == "UPI" && upiAmount == "") {
      toast.warning("Please enter upi details");
      setLoader(false);
    } else if (
      paymentOption == "Part Card / Part Cash" &&
      cardType == "" &&
      cardNumber == "" &&
      cardHoldersName == "" &&
      cardAmount == "" &&
      cashAmount == ""
    ) {
      toast.warning("Please enter all the details");
      setLoader(false);
    } else if (
      paymentOption == "Part Card / Part UPI" &&
      cardType == "" &&
      cardNumber == "" &&
      cardHoldersName == "" &&
      cardAmount == "" &&
      upiAmount == ""
    ) {
      toast.warning("Please enter all the details");
      setLoader(false);
    } else if (
      paymentOption == "Part Cash / Part UPI" &&
      cashAmount == "" &&
      upiAmount == ""
    ) {
      toast.warning("Please enter all the details");
      setLoader(false);
    } else if (paymentOption == "Cash" && cashAmount == "") {
      toast.warning("Please enter the cash amount");
      setLoader(false);
    } else {
      onsubmit();
    }
  };

  const onsubmit = () => {
    setLoader(true);

    // setCardType("");
    // setCardAmount("");
    // setCardNumber("");
    // setcardHoldersName("");
    // setCashAmount("");
    // setUpiId("");
    // setUpiAmount("");

    const data = {
      paymentMode: paymentOption,
      cardAmount: cardAmount === "" ? 0 : cardAmount,
      cashAmount: cashAmount === "" ? 0 : cashAmount,
      UPIAmount: upiAmount === "" ? 0 : upiAmount,
      cardHoldersName: cardAmount === "" ? null : cardHoldersName,
      cardNumber: cardAmount === "" ? null : cardNumber,
      cardType: cardAmount === "" ? null : cardType,
      UPIId: upiAmount === "" ? null : upiId,
      bookingId: UpdatePaymentDetails?.Id,
      settleByCompany : paymentOption == "Company Settlement" ? 1 : 0
    };

    console.log("Data from Update Payment booking ------->", data);

    dispatch(
      updateBookingForPayAtCounterFn(
        loginDetails?.logindata?.Token,
        data,
        (callback) => {
          if (callback.status) {
            console.log(
              "Update Payment booking Response --------------?",
              callback?.response?.Details
            );
              if (callback?.response?.Details?.IsBillGenerated != 1) {
                navigate("/GenerateBill", {
                  state: { userData: callback?.response?.Details },
                });
              }
              else
           { 
            dispatch(
              updateBillingDetails(
                loginDetails?.logindata?.Token,
                {
                  bookingId: UpdatePaymentDetails?.Id,
                },
                (callback) => {
                  if (callback.status) {
                    console.log(
                      "Callback------update---billing--payment--update",
                      callback?.response.Details[0]
                    );

                    if (
                      callback?.response?.Details[0]?.NumOfTeens -
                        callback?.response?.Details[0]?.TotalGuestCount ==
                      0
                    ) {
                      navigate("/TeensBilling", {
                        state: {
                          BookingDetails: callback?.response?.Details,
                        },
                      });
                      setLoader(false);
                    } else {
                      navigate("/BillingDetails", {
                        state: {
                          BookingDetails: callback?.response?.Details,
                        },
                      });
                      setLoader(false);
                    }
                  } else {
                    console.log(
                      "Callback------update --voidt>>error",
                      callback.error
                    );
                    toast.error(callback.error);
                  }
                }
              )
            );}

            toast.success("Payment details update success");
            setEnableUpdatepayment(false);
            setIsUpdatePaymentModalOpen(false);

            // console.log("data------------>", data);

            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const startEditing = (item) => {
    console.log("Item details from modal------------------->", item);
    setEditBookingDetails(item);
    setIsEditing(true);
  };
  const cancelEditing = () => setIsEditing(false);

  // const [guestName, setGuestName] = useState(
  //   editBookingDetails?.FullName ? editBookingDetails?.FullName : ""
  // );
  // const [address, setAddress] = useState(
  //   editBookingDetails?.Address ? editBookingDetails?.Address : ""
  // );
  // const [dateofbirth, setDateofbirth] = useState(
  //   editBookingDetails?.DOB ? editBookingDetails?.DOB : ""
  // );
  // const [gstNumber, setgstNumber] = useState(
  //   editBookingDetails.GSTNumber ? editBookingDetails.GSTNumber : ""
  // );

  const [guestName, setGuestName] = useState("");
  const [address, setAddress] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [gstNumber, setgstNumber] = useState("");

  // Use a single useEffect to initialize all fields when editBookingDetails changes
  useEffect(() => {
    if (editBookingDetails) {
      setGuestName(editBookingDetails?.FullName || "");
      setAddress(editBookingDetails?.Address || "");
      setDateofbirth(editBookingDetails?.DOB || "");
      setgstNumber(editBookingDetails?.GSTNumber || "");
    }
  }, [isEditing]);

  // Use a single useEffect to initialize all fields when editBookingDetails changes

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
    console.log(
      "backendData.selectedCountryName--------->",
      backendData.selectedCountryName
    );

    if (backendData.selectedCountryName) {
      setSelectedCountry({ name: backendData.selectedCountryName });
    } else {
      setSelectedCountry(null);
    }


    if (backendData.selectedStateName) {
      setSelectedState({ name: backendData.selectedStateName });
    } else {
      setSelectedState(null);
    }
    // setSelectedCountry({ name: backendData.selectedCountryName });
    // setSelectedState({ name: backendData.selectedStateName });
  }, [editBookingDetails]);

  console.log("Backend Data---------->", backendData);

  console.log("guestName============>", guestName);

  const updateBookingFn = () => {
    if (!guestName) {
      toast.error("Please enter the guest name");
    } else if (gstNumber && gstNumber?.length != 15) {
      console.log("Error");
      toast.error("Enter a valid GST number");
    } else {
      const data = {
        bookingId: editBookingDetails?.Id,
        guestName: guestName ? guestName : editBookingDetails?.FullName,
        address: address ? address : editBookingDetails?.Address,
        email: editBookingDetails?.Email,
        phone: editBookingDetails?.Phone,
        totalGuestCount: editBookingDetails?.TotalGuestCount,
        dob: dateofbirth ? dateofbirth : editBookingDetails?.DOB,
        country: selectedCountry?.name,
        state: selectedState?.name,
        city: selectedCity ? selectedCity : editBookingDetails.City,
        GSTNumber: gstNumber ? gstNumber : editBookingDetails.GSTNumber,
        isActive: 1,
        packageId: editBookingDetails?.PackageId,
        packageGuestCount:  editBookingDetails?.PackageGuestCount,
        userId: loginDetails?.logindata?.userId,
        userTypeId: loginDetails?.logindata?.UserType,
        shiftId:  editBookingDetails?.ShiftId,
        actualAmount: editBookingDetails?.ActualAmount,
        governmentId: editBookingDetails?.GovernmentId,
        amountAfterDiscount: editBookingDetails?.AmountAfterDiscount,
        packageName: editBookingDetails?.PackageName,
        packageWeekdayPrice: JSON.stringify(editBookingDetails?.PackageWeekdayPrice),
        packageWeekendPrice: JSON.stringify(editBookingDetails?.PackageWeekendPrice),
        numOfTeens: editBookingDetails?.NumOfTeens,
        teensPrice: editBookingDetails?.TeensPrice,
        teensRate: editBookingDetails?.TeensRate,
        teensTax: editBookingDetails?.TeensTax,
        teensTaxName: editBookingDetails?.TeensTaxName,
        paymentMode: editBookingDetails?.PaymentMode,
        cashAmount: editBookingDetails?.CashAmount,
        cardAmount: editBookingDetails?.CardAmount,
        UPIAmount: editBookingDetails?.UPIAmount,
      };

      dispatch(
        updateBooking(loginDetails?.logindata?.Token, data, (callback) => {
          if (callback.status) {
            console.log(
              "update booking details --------------?",
              callback?.response?.Details
            );

            toast.success("Updated Booking details success");
              if (callback?.response?.Details?.IsBillGenerated == 1) {
                dispatch(
                  updateBillingDetails(
                    loginDetails?.logindata?.Token,
                    {
                      bookingId: callback?.response?.Details?.Id,
                    },
                    (callback) => {
                      if (callback.status) {
                        console.log(
                          "Callback------update---billing--payment--update",
                          callback?.response.Details[0]
                        );
    
                        if (
                          callback?.response?.Details[0]?.NumOfTeens -
                            callback?.response?.Details[0]?.TotalGuestCount ==
                          0
                        ) {
                          navigate("/TeensBilling", {
                            state: {
                              BookingDetails: callback?.response?.Details,
                            },
                          });
                          setLoader(false);
                        } else {
                          navigate("/BillingDetails", {
                            state: {
                              BookingDetails: callback?.response?.Details,
                            },
                          });
                          setLoader(false);
                        }
                      } else {
                        console.log(
                          "Callback------update --voidt>>error",
                          callback.error
                        );
                        toast.error(callback.error);
                      }
                    }
                  )
                );
              }
              else{
                navigate("/GenerateBill", {
                  state: { userData: callback?.response?.Details },
                });
              }

            // navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };

  const [shiftStatus, setShiftStatus] = useState(false);

 

  console.log("shiftStatus--->", shiftStatus);

  console.log(
    "filteredUserBookings--------------------->",
    filteredUserBookings
  );

  const filterBookingDetails = (value) => {
    if (value?.trim() === "") {
      fetchUserBookingFn();
      // setFilteredManagerDetails([]);
    } else {
      const lowerCaseQuery = value?.toLowerCase();
      const filtered = filteredUserBookings?.filter(
        (item) =>
          item?.FullName?.toLowerCase()?.includes(lowerCaseQuery) ||
          item?.Phone?.includes(value)
      );
      setFilteredUserBookings(filtered);
    }
  };

  //shift code

  const [shiftDetailsForUser, setSHiftDetaislForUser] = useState();
  const [recentShiftOpen, setRecentShiftOpen] = useState([]);

  const [shiftForUserOne, setShiftForUserOne] = useState(false);
  const [shiftDetails, setShiftDetails] = useState("");
  const [checkActiveOtlet, setCheckActiveOutlet] = useState();

  const [shiftDisable, setShiftDisable] = useState(true);

  const [outletStatus, setOutletStatus] = useState();

  useEffect(() => {
    dispatch(
      checkActiveOutlet(loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("check active outlet--->", callback?.response?.Details);
          setOutletStatus(callback?.response?.Details);

          if (callback?.response?.Details == null) {
            setCheckActiveOutlet(false);
            setLoader(false);
          } else {
            setCheckActiveOutlet(
              callback?.response?.Details?.OutletDate == today ? true : false
            );
          }
        } else {
          toast.error(callback.error);
        }
      })
    );

    dispatch(
      recentShiftForOutlet(
        !checkActiveOtlet ? activeDateOfOutlet?.OutletDate : today,
        loginDetails?.logindata?.Token,
        (callback) => {
          if (callback) {
            console.log(
              "Recent shift for outlet----------------------------------*********************************----- ->",
              callback?.response?.Details
            );

            if (callback?.response?.Details?.length == 0) {
              setShiftDetails(callback?.response?.Details);
              setLoader(false);
            } else {
              console.log(
                "Else condition for recent shift open",
                callback?.response?.Details
              );

              setShiftDetails(callback?.response?.Details[0]);

              setLoader(false);
            }
          } else {
            console.log("Nothing");
          }
        }
      )
    );
  }, [validateDetails]);
  const checkShiftFn = () => {
    dispatch(
      checkShiftForUser(
        checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
        validateDetails?.Details?.Id,
        validateDetails?.Details?.UserType,
        loginDetails?.logindata?.Token,
        (callback) => {
          if (callback) {
            console.log(
              "Callback from shifts for user -----------***********************8--->",
              callback?.response?.Details
            );
            if (
              callback?.response?.Details == null ||
              callback?.response?.Details.length == 0
            ) {
              setShiftForUserOne(true);
              dispatch(
                recentShiftForOutlet(
                  !checkActiveOtlet ? activeDateOfOutlet?.OutletDate : today,
                  loginDetails?.logindata?.Token,
                  (callback) => {
                    if (callback) {
                      console.log(
                        "Recent shift for outlet----------------------------------*********************************----- ->",
                        callback?.response?.Details
                      );

                      if (callback?.response?.Details?.length == 0) {
                        setSHiftDetaislForUser(callback?.response?.Details);
                        setLoader(false);
                      } else {
                        console.log(
                          "Else condition for recent shift open",
                          callback?.response?.Details
                        );
                        setRecentShiftOpen(callback?.response?.Details);

                        setLoader(false);
                      }
                    } else {
                      toast.error(callback.error);
                    }
                  }
                )
              );
            } else {
              console.log(
                "Else for check shift for user",
                callback?.response?.Details
              );
              setSHiftDetaislForUser(callback?.response?.Details);

              setLoader(false);
            }

            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        }
      )
    );
  };

  useEffect(() => {
    checkShiftFn();
  }, []);

  const shifts = {};
  if (shiftDetailsForUser) {
    shiftDetailsForUser.forEach((item) => {
      const { ShiftTypeId, OpenTime, CloseTime, ShiftOpen } = item;
      if (!shifts[ShiftTypeId]) {
        shifts[ShiftTypeId] = [];
      }
      shifts[ShiftTypeId].push({ ShiftTypeId, OpenTime, CloseTime, ShiftOpen });
    });
  }

  const GenerateBill = (item) => {
    console.log('item?.FutureDate>>',item?.FutureDate);
    console.log('item?.BookingDate-------',item?.BookingDate);
    console.log('GenerateBill>>item>>',item);
    //checking if its Travel Agent
    if (item?.UserTypeId == 5) {
      if (
        (shifts && shifts[1] && !shifts[1][0]?.ShiftOpen === 1) ||
        (shifts && shifts[3] && !shifts[3][0]?.ShiftOpen === 1) ||
        (shifts && shifts[2] && !shifts[2][0]?.ShiftOpen === 1) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 2 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 0) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 2 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 1) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 3 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 1) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 1 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 0) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 1 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 1) ||
        (shifts && shifts[2] && shifts[2][0]?.ShiftOpen === 0 && !shifts[3]) ||
        (shifts && shifts[1] && shifts[1][0]?.ShiftOpen === 0 && !shifts[2]) ||
        shiftForUserOne
      ) {
        toast.error("Open the  shift to generate a bill");
      } else {
        const data = {
          bookingId: item.Id,
          packageId: item.PackageId,
          packageGuestCount: item.PackageGuestCount,
          totalGuestCount: item.TotalGuestCount,
          // bookingDate: item.CreatedOn?.slice(0, 10),
          bookingDate: item?.BookingDate != null ? 
          moment(item?.BookingDate).format("YYYY-MM-DD") :
          moment(item?.FutureDate).format("YYYY-MM-DD"),
          billingDate: today,
          teensCount: item.NumOfTeens,
          actualAmount: item.ActualAmount,
          amountAfterDiscount: item.AmountAfterDiscount,
          // discount: item.PanelDiscount ? item.PanelDiscount : item.CouponDiscount,
          discount: item.PanelDiscount
          ? item.PanelDiscount
          : item.WebsiteDiscount
          ? item.WebsiteDiscount
          : item.CouponDiscount
          ? item.CouponDiscount
          : item.AgentPanelDiscount
          ? item.AgentPanelDiscount
          : 0,
          packageWeekdayPrice: JSON.stringify(item.PackageWeekdayPrice),
          packageWeekendPrice: JSON.stringify(item.PackageWeekendPrice),
        };
        const shiftData = {
          bookingId: item.Id,
          // shiftTypeId : shiftDetails?.ShiftTypeId === 1 && shiftDetails?.ShiftOpen === 1
          // ? 1
          // : shiftDetails?.ShiftTypeId === 2 && shiftDetails?.ShiftOpen === 1
          // ? 2
          // : shiftDetails?.ShiftTypeId === 3 && shiftDetails?.ShiftOpen === 1
          // ? 3
          // : 0,
          shiftTypeId:
          (shifts && shifts[1] && shifts[1][0]?.ShiftOpen === 1) 
          ? 1 
          : (shifts && shifts[2] && shifts[2][0]?.ShiftOpen === 1) 
          ? 2
          : (shifts && shifts[3] && shifts[3][0]?.ShiftOpen === 1)
          ? 3
          : 0,
        };
        dispatch(
          updateShiftForBooking(
            loginDetails?.logindata?.Token,
            shiftData,
            (callback1) => {
              if (callback1.status) {
                console.log(
                  "booking details updateShiftForBooking--------------?",
                  callback1?.response?.Details
                );

                dispatch(
                  getUserById(item?.UserId, (callback3) => {
                    console.log("getUserById>>callabck>>", callback3);
                    if (callback3.status) {
                      console.log(
                        "callback3.response.details>>",
                        callback3?.response?.Details
                      );
                      // setLocalAgentId(callback3?.response?.Details?.Id);
                      setTravelAgentDetails(callback3?.response?.Details);
                      const AgentSettlemetDiscount =
                      callback3?.response?.Details?.DiscountPercent -
                      item?.AgentPanelDiscount;

                    console.log(
                      "AgentSettlemetDiscount-------->",
                      AgentSettlemetDiscount
                    );

                    const calculateAmountAfterDiscount =
                      item?.ActualAmount *
                      (1 -
                        item?.AgentPanelDiscount / 100);

                    console.log(
                      "calculateAmountAfterDiscount",
                      calculateAmountAfterDiscount
                    );

                    // const AgentSettlementAmount =
                    //   (calculateAmountAfterDiscount * AgentSettlemetDiscount) /
                    //   100;
                    const AgentSettlementAmount = ( AgentSettlemetDiscount/ 100) *item?.AmountAfterDiscount
                    const agentData = {
                      userId: callback3?.response?.Details?.Id,
                      agentName: callback3?.response?.Details?.Name,
                      userTypeId: callback3?.response?.Details?.UserType,
                      settlementAmount: AgentSettlementAmount,
                      bookingDate:
                        item?.CreatedOn?.slice(0, 10),
                      bookingId:item?.Id,
                    };
                    dispatch(
                      AddupdateAgentSettlement(
                        agentData,
                        loginDetails?.logindata?.Token,
                        (callback4) => {
                          if (callback4.status) {

                            dispatch(
                              AddBillingDetails(
                                loginDetails?.logindata?.Token,
                                data,
                                (callback2) => {
                                  if (callback2.status) {
                                    console.log(
                                      "Generate Bill --------------",
                                      callback2?.response?.Details
                                    );
                                    if (
                                      callback2?.response?.Details[0]?.NumOfTeens -
                                        callback2?.response?.Details[0]
                                          ?.TotalGuestCount ==
                                      0
                                    ) {
                                      navigate("/TeensBilling", {
                                        state: {
                                          BookingDetails: callback2?.response?.Details,
                                        },
                                      });
                                      setLoader(false);
                                    } else {
                                      navigate("/BillingDetails", {
                                        state: {
                                          BookingDetails: callback2?.response?.Details,
                                        },
                                      });
                                      setLoader(false);
                                    }
                                  } else {
                                    toast.error(callback2.error);
                                    setLoader(false);
                                  }
                                }
                              )
                            );
                            console.log(
                              "Callback add update details of agent discount seetlement amopunt---->",
                              callback4?.response?.Details
                            );

                            setLoader(false);

                            // resolve(callback);
                          } else {
                            toast.error(callback4.error);
                            // reject(callback);
                          }
                        }
                      )
                    );
                    } else {
                      toast.error(callback3.error);
                    }
                  })
                );

    
              } else {
                toast.error(callback1.error);
              }
            }
          )
        );
      }
    }
    else{
      if (
        (shifts && shifts[1] && !shifts[1][0]?.ShiftOpen === 1) ||
        (shifts && shifts[3] && !shifts[3][0]?.ShiftOpen === 1) ||
        (shifts && shifts[2] && !shifts[2][0]?.ShiftOpen === 1) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 2 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 0) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 2 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 1) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 3 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 1) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 1 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 0) ||
        (recentShiftOpen &&
          recentShiftOpen[0]?.ShiftTypeId === 1 &&
          recentShiftOpen &&
          recentShiftOpen[0]?.ShiftOpen === 1) ||
        (shifts && shifts[2] && shifts[2][0]?.ShiftOpen === 0 && !shifts[3]) ||
        (shifts && shifts[1] && shifts[1][0]?.ShiftOpen === 0 && !shifts[2]) ||
        shiftForUserOne
      ) {
        toast.error("Open the  shift to generate a bill");
      } else {
        const data = {
          bookingId: item.Id,
          packageId: item.PackageId,
          packageGuestCount: item.PackageGuestCount,
          totalGuestCount: item.TotalGuestCount,
          // bookingDate: item.CreatedOn?.slice(0, 10),
          bookingDate: item?.BookingDate != null ? 
          moment(item?.BookingDate).format("YYYY-MM-DD") :
          moment(item?.FutureDate).format("YYYY-MM-DD"),
          billingDate: today,
          teensCount: item.NumOfTeens,
          actualAmount: item.ActualAmount,
          amountAfterDiscount: item.AmountAfterDiscount,
          // discount: item.PanelDiscount ? item.PanelDiscount : item.CouponDiscount,
          discount: item.PanelDiscount
          ? item.PanelDiscount
          : item.WebsiteDiscount
          ? item.WebsiteDiscount
          : item.CouponDiscount
          ? item.CouponDiscount
          : item.AgentPanelDiscount
          ? item.AgentPanelDiscount
          : 0,
          packageWeekdayPrice: JSON.stringify(item.PackageWeekdayPrice),
          packageWeekendPrice: JSON.stringify(item.PackageWeekendPrice),
        };
        const shiftData = {
          bookingId: item.Id,
          // shiftTypeId : shiftDetails?.ShiftTypeId === 1 && shiftDetails?.ShiftOpen === 1
          // ? 1
          // : shiftDetails?.ShiftTypeId === 2 && shiftDetails?.ShiftOpen === 1
          // ? 2
          // : shiftDetails?.ShiftTypeId === 3 && shiftDetails?.ShiftOpen === 1
          // ? 3
          // : 0,
          shiftTypeId:
          (shifts && shifts[1] && shifts[1][0]?.ShiftOpen === 1) 
          ? 1 
          : (shifts && shifts[2] && shifts[2][0]?.ShiftOpen === 1) 
          ? 2
          : (shifts && shifts[3] && shifts[3][0]?.ShiftOpen === 1)
          ? 3
          : 0,
        };
        dispatch(
          updateShiftForBooking(
            loginDetails?.logindata?.Token,
            shiftData,
            (callback) => {
              if (callback.status) {
                console.log(
                  "booking details updateShiftForBooking--------------?",
                  callback?.response?.Details
                );
                    dispatch(
          AddBillingDetails(
            loginDetails?.logindata?.Token,
            data,
            (callback) => {
              if (callback.status) {
                console.log(
                  "Generate Bill --------------",
                  callback?.response?.Details
                );
    
                if (
                  callback?.response?.Details[0]?.NumOfTeens -
                    callback?.response?.Details[0]?.TotalGuestCount ==
                  0
                ) {
                  navigate("/TeensBilling", {
                    state: { BookingDetails: callback?.response?.Details },
                  });
                  setLoader(false);
                } else {
                  navigate("/BillingDetails", {
                    state: { BookingDetails: callback?.response?.Details },
                  });
                  setLoader(false);
                }
    
                toast.error(callback.error);
              } else {
                toast.error(callback.error);
                setLoader(false);
              }
            }
          )
        );
    
              } else {
                toast.error(callback.error);
              }
            }
          )
        );
      }
    }

  };

  return (
    (
      <div>
        <ToastContainer />
        <h3 className="mb-4">Booking List</h3>
        <div>
          <div className="row">
            <div className="col-md-6 col-lg-6 mb-3">
              <p style={{ fontWeight: "bold" }}>Search</p>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) => {
                    // setSearchQuery(e.target.value);
                    // filterPackageDetailsFn();
                    filterBookingDetails(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="col-md-2 col-lg-2 mb-2">
              <p style={{ fontWeight: "bold" }}>Future Booking Date</p>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Search name"
                  // onChange={(e) => {
                  //   setSearchQuery(e.target.value);
                  //   filterPackageDetailsFn();
                  // }}
                  defaultValue={today}
                  onChange={(e) => setFutureDate(e.target.value)}
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
                Guest Name
              </th>
              <th scope="col" className="text-center table_heading">
                Guest Phone
              </th>
              <th scope="col" className="text-center table_heading">
                Packages
              </th>
              <th scope="col" className="text-center table_heading">
                Package Amount
              </th>
              <th scope="col" className="text-center table_heading">
                Total Amount
              </th>
              <th scope="col" className="text-center table_heading">
                Total Guest Count
              </th>
              <th scope="col" className="text-center table_heading">
                Generate Bill
              </th>
              <th scope="col" className="text-center table_heading">
                Update Booking
              </th>
              {
               loginDetails?.logindata?.UserType === 1 ||
                loginDetails?.logindata?.UserType === 2  ? (
                  <th scope="col" className="text-center table_heading">
                  Update Payment
                </th>
                )
                :
                (
                  <></>
                )
              }

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
                  <td className="manager-list" style={{ fontSize: "12px" }}>
                    {item && item?.PackageName && item?.PackageName ? (
                      JSON.parse(item?.PackageName).map((item, index) => (
                        <li key={index} style={{ listStyleType: "none" }}>
                          {item}{" "}
                        </li>
                      ))
                    ) : (
                      <span>No package name available</span>
                    )}
                  </td>

                  {/* <td className="manager-list">
                  {item?.FinalPrice?.map((price, index) => (
                    <li key={index} style={{ listStyleType: "none" }}>
                      {price}
                    </li>
                  ))}
                </td> */}
                  <td className="manager-list">
                    {/* {item?.Items[0]?.FinalPrice?.map((price, index) => (
                              <li key={index} style={{ listStyleType: "none" }}>
                                {price}
                              </li>
                            ))} */}
                    {item?.TeensPrice === 0 &&
                      item?.FinalPrice.length !== 0 && (
                        // Display only price
                        <div>
                          {item?.FinalPrice?.map((price, index) => (
                            <li key={index} style={{ listStyleType: "none" }}>
                              {price}
                            </li>
                          ))}
                        </div>
                      )}
                    {item?.TeensPrice !== 0 &&
                      item?.FinalPrice.length !== 0 && (
                        <div>
                          {item?.FinalPrice?.map((price, index) => (
                            <li key={index} style={{ listStyleType: "none" }}>
                              {price}
                            </li>
                          ))}
                          <div>{item?.TeensPrice}</div>
                        </div>
                      )}
                    {item?.TeensPrice !== 0 &&
                      item?.FinalPrice.length === 0 && (
                        <div>{item?.TeensPrice}</div>
                      )}
                  </td>

                  <td className="manager-list">
                    {item?.ActualAmount - item?.AmountAfterDiscount ==
                    item?.ActualAmount
                      ? item?.ActualAmount
                      : item?.AmountAfterDiscount}
                  </td>
                  <td className="manager-list">{item.TotalGuestCount}</td>

                    {/*Generate Bill column */}
                  <td className="manager-list">
                    {
                      (item?.FutureDate == today) ?
                      (item?.IsBillGenerated != 1) ? 
                      <LiaFileInvoiceSolid
                        onClick={() => startBillGeneration(item)}
                        style={{
                          height: "22px",
                          width: "22px",
                          backgroundColor: "white",
                        }}
                      />
                      : 
                      <p>Bill Generated</p>
                      : (
                        <p>-</p>
                      )
                    }
                  </td>

                    {/*Update booking column */}
                  <td className="manager-list">
                  {
                    (moment(item?.FutureDate).format("YYYY-MM-DD") === today) ||
                    // moment(item?.BookingDate).format("YYYY-MM-DD") === today ? (
                    moment(item?.BookingDate).format("YYYY-MM-DD") == activeDateOfOutlet?.OutletDate
                    ? (
                    <AiFillEdit
                      onClick={() => ([1, 2].includes(loginDetails?.logindata?.UserType) && item?.IsBillGenerated != 1) ? navigate("/UpdateBooking/" + item.Id ) : startEditing(item)}
                      style={{
                        height: "20px",
                        width: "20px",
                        backgroundColor: "white",
                      }}
                    />
                    )
                    :(<p>-</p>)}
                  </td>
                   
                {/*Update Payment */}
                {
                loginDetails?.logindata?.UserType === 1 ||
                loginDetails?.logindata?.UserType === 2  ? (
                  <td className="manager-list">
                  {
                  (moment(item?.FutureDate).format("YYYY-MM-DD") === today && item?.PayAtCounter == 1) ||
                  // moment(item?.BookingDate).format("YYYY-MM-DD") === today ? (
                  moment(item?.FutureDate).format("YYYY-MM-DD") == activeDateOfOutlet?.OutletDate
                  ? (
                    <LiaMoneyBillSolid
                      onClick={() => StartUpdatingPayment(item)}
                      style={{
                        height: "22px",
                        width: "22px",
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <p>-</p>
                  )}
                </td>
                )
                :
                (
                <></>
                )}


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
                    // onClick={() => handleViewMore(item)}
                  >
                    {/* <img src={more} className="more_img" /> */}
                    <CiCircleMore
                      onClick={() => handleViewMore(item)}
                      style={{
                        height: "22px",
                        width: "22px",
                        backgroundColor: "white",
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <ToastContainer />

        <Modal show={showViewMoreModal} onHide={handleCloseViewMore} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Guest Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <div className="row">
            <div className="col-2">
              <p className="table-modal-list">Guest Name:</p>
            </div>
            <div className="col-9">
              <p className="table-modal-list">{selectedUserDetails.FullName}</p>
            </div>
          </div> */}
            <div className="col-6">
              <p className="table-modal-list">
                Guest Name: <span> {selectedUserDetails.FullName}</span>
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                Guest Phone no: {selectedUserDetails.Phone}
              </p>
            </div>
            {!selectedUserDetails.Email == "" ? (
              <div className="col-6">
                <p className="table-modal-list ">
                  Guest Email: {selectedUserDetails.Email}
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
                  Guest Address: {selectedUserDetails.Address}
                </p>
              </div>
            ) : (
              <></>
            )}
            {!selectedUserDetails.Country == "" ? (
              <div className={`col-${!selectedUserDetails.City == "" ? 4 : 6}`}>
                <p className="table-modal-list ">
                  Country: {selectedUserDetails.Country}
                </p>
              </div>
            ) : (
              <></>
            )}
            {!selectedUserDetails.State == "" ? (
              <div className={`col-${!selectedUserDetails.City == "" ? 4 : 6}`}>
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
                Total Amount: {selectedUserDetails?.AmountAfterDiscount}
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                Event Date :{" "}
                {moment(selectedUserDetails?.FutureDate).format(
                  "YYYY-MM-DD"
                )}
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
            <div className="col-6">
              <p className="table-modal-list ">
                Package Name:{" "}
                {selectedUserDetails.PackageName ? (
                  JSON.parse(selectedUserDetails.PackageName).map(
                    (item, index) => <span key={index}>{item} </span>
                  )
                ) : (
                  <span>No package name available</span>
                )}
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                Package Guest Count:{" "}
                {selectedUserDetails.PackageGuestCount ? (
                  JSON.parse(selectedUserDetails.PackageGuestCount).map(
                    (item, index) => <span key={index}>{item} </span>
                  )
                ) : (
                  <span>No package count available</span>
                )}
              </p>
            </div>
            <div className="col-6">
              <p className="table-modal-list ">
                Package Price:{" "}
                {selectedUserDetails.FinalPrice ? (
                  selectedUserDetails.FinalPrice.map((item, index) => (
                    <span key={index}>{item} </span>
                  ))
                ) : (
                  <span>No package name available</span>
                )}
              </p>
            </div>
            {selectedUserDetails?.IsBookingWebsite ? <div className="col-6">
              <p className="table-modal-list ">
              {`Booking Mode: Website`}
              </p>
            </div> : null}
            <div className="col-6">
              <p className="table-modal-list ">
              {`Booking Date: ${selectedUserDetails?.CreatedOn?.slice(0, 10) || selectedUserDetails?.BookingDate}`}
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
          <Modal.Header>
            <Modal.Title>Update Booking</Modal.Title>
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
                <label
                  htmlFor="formGroupExampleInput"
                  className="form_text mb-2"
                >
                  Country
                </label>
                <Select
                  className="form_text"
                  options={Country.getAllCountries()}
                  getOptionLabel={(options) => options["name"]}
                  getOptionValue={(options) => options["name"]}
                  value={selectedCountry}
                  onChange={(item) => setSelectedCountry(item)}
                  placeholder="Select"
                />
              </div>

              <div className="col-lg-6 mt-3">
                <label
                  htmlFor="formGroupExampleInput"
                  className="form_text mb-2"
                >
                  State
                </label>
                <Select
                  className="form_text"
                  options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                  getOptionLabel={(options) => options["name"]}
                  getOptionValue={(options) => options["name"]}
                  value={selectedState}
                  onChange={(item) => setSelectedState(item)}
                  placeholder="Select"
                />
              </div>

              {/* <div className="col-lg-6 mt-3">
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
            </div> */}
              <div className="col-lg-6 mt-3 ">
                <label for="formGroupExampleInput " className="form_text mb-2">
                  City
                </label>

                <input
                  class="form-control "
                  type="text"
                  placeholder="Enter your city"
                  onChange={(e) => setSelectedCity(e.target.value)}
                  defaultValue={editBookingDetails?.City}
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

        <Modal
          show={isUpdatePaymentModalOpen}
          onHide={() => setIsUpdatePaymentModalOpen(false)}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Update Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {payAT && (
              <div>
                {/* <h2>Pay At Counter</h2> */}
                <div
                  style={{ flexDirection: "row" }}
                  className=" mt-5 col-lg-12"
                >
                  <h4 className=" ">
                    {"         "}Amount Payable
                    <span style={{ color: "red" }}>
                      {" "}
                      Rs. {UpdatePaymentDetails?.AmountAfterDiscount}{" "}
                    </span>
                  </h4>
                </div>
                <div className="col-lg-6">
                  <br />
                  <br />
                  <label for="formGroupExampleInput " className="form_text">
                    Payment Option <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="dropdown"
                    class="form-control mt-2"
                    value={paymentOption} // Set the selected option based on the state
                    onChange={handlePaymentSelection} // Handle changes to the dropdown
                    disabled={!enableUpdatePayment}
                  >
                    <option value="">Select...</option>
                    <option value="Cash">Cash </option>
                    <option value="Card">Card </option>
                    <option value="UPI">UPI </option>
                    <option value="Part Card / Part Cash">
                      Part Card / Part Cash
                    </option>
                    <option value="Part Card / Part UPI">
                      Part Card / Part UPI
                    </option>
                    <option value="Part Cash / Part UPI">
                      Part Cash / Part UPI
                    </option>

                    <option value="Company Settlement">
                      Company Settlement{" "}
                    </option>
                  </select>
                </div>

                {paymentOption == "Cash" ? (
                  <div className="row">
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Cash Amount <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        class="form-control mt-2"
                        type="text"
                        placeholder="Enter the amount"
                        // onChange={(e) => setCashAmount(e.target.value)}
                        disabled={true}
                        defaultValue={UpdatePaymentDetails?.AmountAfterDiscount}
                        value={cashAmount}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {paymentOption == "Card" ? (
                  <>
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Card Amount <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        class="form-control mt-2"
                        type="number"
                        placeholder="Enter the amount"
                        onChange={(e) => setCardAmount(e.target.value)}
                        value={cardAmount}
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label
                        htmlFor="formGroupExampleInput"
                        className="form_text"
                      >
                        Card Holder's Name{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        className="form-control mt-2"
                        type="text"
                        placeholder="Enter the card holder's name"
                        disabled={!enableUpdatePayment}
                        value={cardHoldersName}
                        onChange={(e) => setcardHoldersName(e.target.value)}
                      />
                    </div>

                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Card Type <span style={{ color: "red" }}>*</span>
                      </label>
                      <select
                        id="dropdown"
                        class="form-control mt-2"
                        value={cardType}
                        onChange={(e) => setCardType(e.target.value)}
                        disabled={!enableUpdatePayment}
                      >
                        <option value="">Select...</option>
                        <option value="VISA">Visa card </option>
                        <option value="MAST">MasterCard </option>
                        <option value="Rupay">Rupay Card </option>
                        <option value="Others">Others </option>
                      </select>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label
                        htmlFor="formGroupExampleInput"
                        className="form_text"
                      >
                        Card Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        className="form-control mt-2"
                        type="number"
                        placeholder="Enter the card number"
                        disabled={!enableUpdatePayment}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {paymentOption == "UPI" ? (
                  <div className="row">
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        UPI Amount
                      </label>
                      <input
                        class="form-control mt-2"
                        type="text"
                        placeholder="Enter the amount"
                        onChange={(e) => setUpiAmount(e.target.value)}
                        disabled={true}
                        value={upiAmount}
                      />
                    </div>

                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        UPI Id
                      </label>
                      <input
                        class="form-control mt-2"
                        type="text"
                        placeholder="Enter the UPI Id"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        disabled={!enableUpdatePayment}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {paymentOption == "Part Card / Part Cash" ? (
                  <>
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Part Card Amount <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        class="form-control mt-2"
                        placeholder="Enter the amount"
                        // onChange={(e) => setCardAmount(e.target.value)}
                        value={cardAmount}
                        onChange={handlePartCard}
                        disabled={!enableUpdatePayment}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>

                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Part Cash Amount <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        class="form-control mt-2"
                        placeholder="Enter the amount"
                        // onChange={(e) => setCashAmount(e.target.value)}
                        value={cashAmount}
                        onChange={handlePartCash}
                        disabled={!enableUpdatePayment}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label
                        htmlFor="formGroupExampleInput"
                        className="form_text"
                      >
                        Card Holder's Name{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        className="form-control mt-2"
                        type="text"
                        placeholder="Enter the card holder's name"
                        disabled={!enableUpdatePayment}
                        value={cardHoldersName}
                        onChange={(e) => setcardHoldersName(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Card Type <span style={{ color: "red" }}>*</span>
                      </label>
                      <select
                        id="dropdown"
                        class="form-control mt-2"
                        value={cardType}
                        disabled={!enableUpdatePayment}
                        onChange={(e) => setCardType(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="VISA">Visa card </option>
                        <option value="MAST">MasterCard </option>
                        <option value="Rupay">Rupay Card </option>
                        <option value="Others">Others </option>
                      </select>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label
                        htmlFor="formGroupExampleInput"
                        className="form_text"
                      >
                        Card Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        className="form-control mt-2"
                        type="number"
                        placeholder="Enter the card number"
                        disabled={!enableUpdatePayment}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {paymentOption == "Part Card / Part UPI" ? (
                  <>
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Part Card Amount <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        class="form-control mt-2"
                        type="text"
                        placeholder="Enter the amount"
                        // onChange={(e) => setCardAmount(e.target.value)}
                        value={cardAmount}
                        onChange={handlePartCard}
                        disabled={!enableUpdatePayment}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Part Online(UPI) Amount{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        class="form-control mt-2"
                        type="text"
                        placeholder="Enter the amount"
                        // onChange={(e) => setUpiAmount(e.target.value)}
                        value={upiAmount}
                        onChange={handlePartUPI}
                        disabled={!enableUpdatePayment}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>

                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        UPI Id
                      </label>
                      <input
                        class="form-control mt-2"
                        type="text"
                        placeholder="Enter the UPI Id"
                        disabled={!enableUpdatePayment}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>

                    <div className="col-lg-6 mt-3">
                      <label
                        htmlFor="formGroupExampleInput"
                        className="form_text"
                      >
                        Card Holder's Name{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        className="form-control mt-2"
                        type="text"
                        placeholder="Enter the card holder's name"
                        disabled={!enableUpdatePayment}
                        value={cardHoldersName}
                        onChange={(e) => setcardHoldersName(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Card Type <span style={{ color: "red" }}>*</span>
                      </label>
                      <select
                        id="dropdown"
                        class="form-control mt-2"
                        disabled={!enableUpdatePayment}
                        value={cardType}
                        onChange={(e) => setCardType(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="VISA">Visa card </option>
                        <option value="MAST">MasterCard </option>
                        <option value="Rupay">Rupay Card </option>
                        <option value="Others">Others </option>
                      </select>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label
                        htmlFor="formGroupExampleInput"
                        className="form_text"
                      >
                        Card Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        className="form-control mt-2"
                        type="number"
                        placeholder="Enter the card number"
                        disabled={!enableUpdatePayment}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {paymentOption == "Part Cash / Part UPI" ? (
                  <>
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Part Cash <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        class="form-control mt-2"
                        type="text"
                        placeholder="Enter the amount"
                        // onChange={(e) => setCashAmount(e.target.value)}
                        value={cashAmount}
                        onChange={handlePartCash}
                        disabled={!enableUpdatePayment}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        Part Online(UPI) <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        class="form-control mt-2"
                        type="text"
                        placeholder="Enter the amount"
                        // onChange={(e) => setUpiAmount(e.target.value)}
                        value={upiAmount}
                        onChange={handlePartUPI}
                        disabled={!enableUpdatePayment}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                    <div className="col-lg-6 mt-3">
                      <label for="formGroupExampleInput " className="form_text">
                        UPI Id
                      </label>
                      <input
                        class="form-control mt-2"
                        type="text"
                        placeholder="Enter the UPI Id"
                        disabled={!enableUpdatePayment}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {!enableUpdatePayment && (
                  <button
                    onClick={() => setEnableUpdatepayment(true)}
                    style={{ paddingLeft: "100px", paddingRight: "100px" }}
                    className="btn btn_colour mt-5 btn-lg"
                  >
                    Enable Editing
                  </button>
                )}
                {/* <button
                  onClick={handleShowR}
                  style={{ paddingLeft: "100px", paddingRight: "100px" }}
                  className="btn btn_colour mt-5 btn-lg"
                >
                  {" "}
                  Pay
                </button> */}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsUpdatePaymentModalOpen(false);
                setEnableUpdatepayment(false);

                setCardType("");
                setCardAmount("");
                setCardNumber("");
                setcardHoldersName("");
                setCashAmount("");
                setUpiId("");
                setUpiAmount("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!enableUpdatePayment}
              onClick={onsubmit}
            >
              Update Booking
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={isBillGenerationModalOpen}
          onHide={() => setIsBillGenerationModalOpen(false)}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Generate Bill</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           Are You sure you want to proceed?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsBillGenerationModalOpen(false);
                setSelectedItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (
                  selectedItem?.PayAtCounter == 1 &&
                  selectedItem?.PaymentMode == null
                ) {
                  window.open(
                    `/acknowledgementDetails?BookingId=${selectedItem.Id}`,
                    "_self"
                  );
                } else {
                  GenerateBill(selectedItem);
                }
              }}
            >
              Generate Bill
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  );
};

export default BookingList;
