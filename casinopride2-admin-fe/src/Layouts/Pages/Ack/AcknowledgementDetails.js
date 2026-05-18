import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchBookingDetailsById,
  updateBookingForPayAtCounterFn,
  updateShiftForBooking,
} from "../../../Redux/actions/booking";
import {
  AddBillingDetails,
  AddupdateAgentSettlement,
} from "../../../Redux/actions/billing";
import moment from "moment";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { getUserById } from "../../../Redux/actions/users";
import { checkActiveOutlet } from "../../../Redux/actions/users";
import { recentShiftForOutlet,checkShiftForUser } from "../../../Redux/actions/users";

const AcknowledgementDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [partCash, setPartCash] = useState("");
  const [partCard, setPartCard] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setamount] = useState("");
  const [packageIds, setPackageIds] = useState([]);
  const [packageGuestCount, setPackageGuestCount] = useState([]);
  const [amountAfterDiscount, setamountAfterDiscount] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [cardHoldersName, setcardHoldersName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");

  const [paymentOption, setPaymentOption] = useState("");
  const handlePaymentSelection = (event) => {
    // Update the selected option when the user makes a selection
    setPaymentOption(event.target.value);

    console.log("payment selection----->", event.target.value);

    const DiscountedAmount = bookingData?.amountAfterDiscount;
    setcardHoldersName("");
    setCardNumber("");
    setCardType("");

    if (event.target.value == "Cash") {
      setCashAmount(DiscountedAmount);
      setUpiAmount("");
      setCardAmount("");
    } else if (event.target.value == "UPI") {
      setUpiAmount(DiscountedAmount);
      setCashAmount("");
      setCardAmount("");
    } else if (event.target.value == "Card") {
      setCardAmount(DiscountedAmount);
      setCashAmount("");
      setUpiAmount("");
    }
  };
  const [show, setShow] = useState(false);

  const [payAT, setPay] = useState(false);

  const [futureDate, setFutureDate] = useState();

  const [dateFromBackend, setDateFromBackend] = useState();
  const [isBillGenerated, setIsBilllGenerated] = useState();
  const [billGenerated, setBillGenerated] = useState(false);

  const [comparisonResult, setComparisonResult] = useState("");
  const [disabledBtn, setDisableBtn] = useState(false);
  const [isDateInPast, setIsDateInPast] = useState(false);
  const [isDateInFuture, setIsDateInFuture] = useState(false);
  const [isPresentDate, setIsPresentDate] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const outletOpenDate = useSelector(
    (state) => state.users?.saveOutletDate?.Details?.OutletDate
  );

  const handleShow = () => setShow(true);
  const handleClose = () => {
    // navigate("/NewBooking");
    window.close();
    setShow(false);
  };

  const [loader, setLoader] = useState(false);
  const today = moment().format("YYYY-MM-DD");
  const todayOutletDate = moment(outletOpenDate).format("YYYY-MM-DD");
  
  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );
  const activeDateOfOutlet = useSelector(
    (state) => state.users?.saveOutletDate?.Details
  );
  const [shiftDetails, setShiftDetails] = useState("");
  const [checkActiveOtlet, setCheckActiveOutlet] = useState();

  const [shiftDisable, setShiftDisable] = useState(true);

  const [outletStatus, setOutletStatus] = useState();
    //new code for shifts messages
    const [shiftDetailsForUser, setSHiftDetaislForUser] = useState();
    const [recentShiftOpen, setRecentShiftOpen] = useState([]);
    const [shiftForUserOne, setShiftForUserOne] = useState(false);

  console.log("today----------->", dateFromBackend);
  console.log("validateDetails----------->", activeDateOfOutlet);
  useEffect(() => {
    compareDates();
  }, [dateFromBackend, today]);

  function compareDates() {
    const backendDate = moment(dateFromBackend).startOf("day");
    const today = moment().startOf("day");
    if (isBillGenerated == 1) {
      setBillGenerated(true)
    }
    if (backendDate.isBefore(today)) {
      // Condition 1: If the backendDate is before today
      setComparisonResult("Past date.");
      setIsDateInPast(true);
      setIsDateInFuture(false);
      setDisableBtn(true);
      setIsPresentDate(false);
    } else if (backendDate.isAfter(today)) {
      // Condition 2: If the backendDate is after today
      setComparisonResult("Future date");
      setIsDateInFuture(true);
      setIsDateInPast(false);
      setIsPresentDate(false);
      setDisableBtn(true);
    } else {
      // Condition 3: If the backendDate is neither before nor after today (i.e., they match)
      setComparisonResult("Dates match");
      setIsDateInPast(false);
      setIsDateInFuture(false);
      setDisableBtn(false);
      setIsPresentDate(true);
    }
  }

  console.log("comparisonResult------------>", comparisonResult);
  const [localAgentDetails, setLocalAgentDetails] = useState("");
  const [localAgentId, setLocalAgentId] = useState();
  useEffect(() => {
    console.log('hohoho>>');
    if (!loginDetails) {
      navigate("/");
    } else {
      //.log("Hi");
      //setShow(true);
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
    }
  }, [validateDetails]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const BookingId = url.searchParams.get("BookingId");
    console.log("BookingId++++", BookingId);

    dispatch(
      fetchBookingDetailsById(
        loginDetails?.logindata?.Token,
        BookingId,
        (callback) => {
          if (callback.status) {
            console.log(
              "Callback---------get user bookings",
              callback?.response?.Details
            );
            console.log(
              "callback?.response?.Details?.FutureDate",
              callback?.response?.Details?.FutureDate
            );
            setDateFromBackend(callback?.response?.Details?.FutureDate);
            setIsBilllGenerated(callback?.response?.Details?.IsBillGenerated);

            const data = {
              bookingId: callback?.response?.Details.Id,
              packageId: callback?.response?.Details.PackageId,
              packageGuestCount: callback?.response?.Details.PackageGuestCount,
              totalGuestCount: callback?.response?.Details.TotalGuestCount,
              bookingDate: moment(callback?.response?.Details?.FutureDate).format("YYYY-MM-DD"),
              // billingDate: today,
              billingDate: todayOutletDate,
              teensCount: callback?.response?.Details.NumOfTeens,
              actualAmount: callback?.response?.Details.ActualAmount,
              amountAfterDiscount:
                callback?.response?.Details.AmountAfterDiscount,
              discount: callback?.response?.Details.PanelDiscount
                ? callback?.response?.Details.PanelDiscount
                : callback?.response?.Details.WebsiteDiscount
                ? callback?.response?.Details.WebsiteDiscount
                : callback?.response?.Details.CouponDiscount
                ? callback?.response?.Details.CouponDiscount
                : callback?.response?.Details.AgentPanelDiscount
                ? callback?.response?.Details.AgentPanelDiscount
                : 0,

              packageWeekdayPrice:
                callback?.response?.Details.PackageWeekdayPrice,
              packageWeekendPrice:
                callback?.response?.Details.PackageWeekendPrice,
              payAtCounter: callback?.response?.Details?.PayAtCounter,
            };

            if (callback?.response?.Details?.PayAtCounter != 1) {
              setShow(true);
            } else {
              if (
                callback?.response?.Details?.PayAtCounter == 1 &&
                callback?.response?.Details?.PaymentMode == null
              ) {
                setPay(true);
              } else {
                setPay(false);

                setShow(true);
              }
            }
            console.log("Data-----from ack booking>", data);
            setBookingData(data);
            dispatch(
              getUserById(callback?.response?.Details?.UserId, (callback) => {
                console.log("hii get user by Id>>callabck>>", callback);
                if (callback.status) {
                  console.log(
                    "callabck.response.details>>",
                    callback?.response?.Details
                  );
                  setLocalAgentId(callback?.response?.Details?.Id);
                  setLocalAgentDetails(callback?.response?.Details);
                } else {
                  toast.error(callback.error);
                }
              })
            );
            // dispatch(
            //   AddBillingDetails(
            //     loginDetails?.logindata?.Token,
            //     data,
            //     (callback) => {
            //       if (callback.status) {
            //         console.log(
            //           "Generate Bill --------------",
            //           callback?.response?.Details
            //         );

            //         if (
            //           callback?.response?.Details[0]?.NumOfTeens -
            //             callback?.response?.Details[0]?.TotalGuestCount ==
            //           0
            //         ) {
            //           navigate("/TeensBilling", {
            //             state: { BookingDetails: callback?.response?.Details },
            //           });
            //           setLoader(false);
            //         } else {
            //           navigate("/BillingDetails", {
            //             state: { BookingDetails: callback?.response?.Details },
            //           });
            //           setLoader(false);
            //         }

            //         toast.error(callback.error);
            //       } else {
            //         toast.error(callback.error);
            //         setLoader(false);
            //       }
            //     }
            //   )
            // );
          } else {
            console.log(callback.error);
            toast.error(callback.error);
          }
        }
      )
    );

    checkShiftFn()
  }, []);

  console.log("futureDate------------>", futureDate);
  console.log("today------->", today);

  const confirmBilling = () => {
    console.log("bookingData?.data--->", bookingData);
    const shiftData = {
      bookingId: bookingData?.bookingId,
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
            const AgentSettlemetDiscount =
            localAgentDetails?.DiscountPercent -
            callback1?.response?.Details?.AgentPanelDiscount;

          console.log(
            "AgentSettlemetDiscount-------->",
            AgentSettlemetDiscount
          );

            const calculateAmountAfterDiscount =
            callback1?.response?.Details?.ActualAmount *
            (1 -
              callback1?.response?.Details?.AgentPanelDiscount / 100);

          console.log(
            "calculateAmountAfterDiscount",
            calculateAmountAfterDiscount
          );

          // const AgentSettlementAmount =
          //   (calculateAmountAfterDiscount * AgentSettlemetDiscount) /
          //   100;
          const AgentSettlementAmount = (AgentSettlemetDiscount/100)*callback1?.response?.Details?.AmountAfterDiscount


          const agentData = {
            userId: localAgentDetails?.Id,
            agentName: localAgentDetails?.Name,
            userTypeId: localAgentDetails?.UserType,
            settlementAmount: AgentSettlementAmount,
            // bookingDate:
            //   bookingData?.bookingDate
            //   ?.slice(0, 10),
            bookingDate:
              moment(bookingData?.bookingDate).format("YYYY-MM-DD"),
            bookingId:bookingData?.bookingId,
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
                      bookingData,
                      (callback) => {
                        if (callback.status) {
                          console.log(
                            "Generate Bill --------------",
                            callback?.response?.Details
                          );
               
                          if (
                            callback?.response?.Details[0]?.NumOfTeens -
                              callback?.response?.Details[0]
                                ?.TotalGuestCount ==
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
                          toast.error(callback.error);
                        } else {
                          toast.error(callback.error);
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
            toast.error(callback1.error);
          }
        }
      )
    );

  };

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

    const data = {
      paymentMode: paymentOption,
      cardAmount: cardAmount,

      partCash: partCash,
      partCard: partCard,

      cashAmount: cashAmount,
      cardAmount: cardAmount,
      UPIAmount: upiAmount,
      cardHoldersName: cardHoldersName,
      cardNumber: cardNumber,
      cardType: cardType,
      UPIId: upiId,

      bookingId: bookingData?.bookingId,
      settleByCompany : paymentOption == "Company Settlement" ? 1 : 0
    };
    const shiftData = {
      bookingId: bookingData?.bookingId,
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
    console.log("Data from booking ------->", data);

    dispatch(
      updateBookingForPayAtCounterFn(
        loginDetails?.logindata?.Token,
        data,
        (callback) => {
          if (callback.status) {
            console.log(
              "booking details --------------?",
              callback?.response?.Details
            );

            setBookingData(callback?.response?.Details);

            // toast.success("Booking details success");

              
    dispatch(
      updateShiftForBooking(
        loginDetails?.logindata?.Token,
        shiftData,
        (callback) => {
          if (callback.status) {
            console.log(
              "booking details --------------?",
              callback?.response?.Details
            );

            setBookingData(callback?.response?.Details);

            toast.success("Booking details success");

            const data = {
              bookingId: callback?.response?.Details?.Id,
              packageId: callback?.response?.Details?.PackageId,
              packageGuestCount: callback?.response?.Details?.PackageGuestCount,
              totalGuestCount: callback?.response?.Details?.TotalGuestCount,
              // bookingDate: callback?.response?.Details?.CreatedOn?.slice(0, 10),
              bookingDate: callback?.response?.Details?.BookingDate != null ? 
              moment(callback?.response?.Details?.BookingDate).format("YYYY-MM-DD") :
              moment(callback?.response?.Details?.FutureDate).format("YYYY-MM-DD"),
              // billingDate: today,
              billingDate: todayOutletDate,
              teensCount: callback?.response?.Details?.NumOfTeens,
              actualAmount: callback?.response?.Details?.ActualAmount,
              amountAfterDiscount:
                callback?.response?.Details?.AmountAfterDiscount,
              // discount: callback?.response?.Details?.PanelDiscount
              //   ? callback?.response?.Details?.PanelDiscount
              //   : callback?.response?.Details?.CouponDiscount,
              discount: callback?.response?.Details.PanelDiscount
                ? callback?.response?.Details.PanelDiscount
                : callback?.response?.Details.WebsiteDiscount
                ? callback?.response?.Details.WebsiteDiscount
                : callback?.response?.Details.CouponDiscount
                ? callback?.response?.Details.CouponDiscount
                : callback?.response?.Details.AgentPanelDiscount
                ? callback?.response?.Details.AgentPanelDiscount
                : 0,
              packageWeekdayPrice:
                callback?.response?.Details?.PackageWeekdayPrice,
              packageWeekendPrice:
                callback?.response?.Details?.PackageWeekendPrice,
            };

            console.log("data------------>", data);

            const AgentSettlemetDiscount =
            localAgentDetails?.DiscountPercent -
            callback?.response?.Details?.AgentPanelDiscount;

          console.log(
            "AgentSettlemetDiscount-------->",
            AgentSettlemetDiscount
          );

          const calculateAmountAfterDiscount =
            callback?.response?.Details?.ActualAmount *
            (1 -
              callback?.response?.Details?.AgentPanelDiscount / 100);

          console.log(
            "calculateAmountAfterDiscount",
            calculateAmountAfterDiscount
          );

          // const AgentSettlementAmount =
          //   (calculateAmountAfterDiscount * AgentSettlemetDiscount) /
          //   100;
          const AgentSettlementAmount = (AgentSettlemetDiscount/100)*callback?.response?.Details?.AmountAfterDiscount

          const agentData = {
            userId: localAgentDetails?.Id,
            agentName: localAgentDetails?.Name,
            userTypeId: localAgentDetails?.UserType,
            settlementAmount: AgentSettlementAmount,
            bookingDate:
              callback?.response?.Details?.CreatedOn?.slice(0, 10),
            bookingId: callback?.response?.Details?.Id,
          };
          dispatch(
            AddupdateAgentSettlement(
              agentData,
              loginDetails?.logindata?.Token,
              (callback2) => {
                if (callback2.status) {

                  console.log(
                    "Callback add update details of agent discount seetlement amopunt---->",
                    callback2?.response?.Details
                  );
                  dispatch(
                    AddBillingDetails(
                      loginDetails?.logindata?.Token,
                      data,
                      (callback4) => {
                        if (callback4.status) {
                          console.log(
                            "Generate Bill --------------?",
                            callback4?.response?.Details[0]?.NumOfTeens,
                            callback4?.response?.Details[0]?.TotalGuestCount
                          );
                          if (
                            callback4?.response?.Details[0]?.NumOfTeens -
                              callback4?.response?.Details[0]
                                ?.TotalGuestCount ==
                            0
                          ) {
                            navigate("/TeensBilling", {
                              state: {
                                BookingDetails: callback4?.response?.Details,
                              },
                            });
                            setLoader(false);
                          } else {
                            navigate("/BillingDetails", {
                              state: {
                                BookingDetails: callback4?.response?.Details,
                              },
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
                  setLoader(false);

                  // resolve(callback);
                } else {
                  toast.error(callback2.error);
                  // reject(callback);
                }
              }
            )
          );
   


            // navigate("/GenerateBill", {
            //   state: { userData: callback?.response?.Details },
            // });
            // navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        }
      )
    );


            // navigate("/GenerateBill", {
            //   state: { userData: callback?.response?.Details },
            // });
            // navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        }
      )
    );
  };

  // const handlePartCard = (e) => {
  //   let inputValue = parseFloat(e.target.value);

  //   if (isNaN(inputValue) || inputValue < 0) {
  //     inputValue = "";
  //   } else if (inputValue > bookingData?.amountAfterDiscount) {
  //     //checking if the discount that is added is more than the discount percent of the agent
  //     inputValue = bookingData?.amountAfterDiscount;
  //   }

  //   setCardAmount(inputValue);
  // };
  // const handlePartCash = (e) => {
  //   let inputValue = parseFloat(e.target.value);

  //   if (isNaN(inputValue) || inputValue < 0) {
  //     inputValue = "";
  //   } else if (inputValue > bookingData?.amountAfterDiscount) {
  //     //checking if the discount that is added is more than the discount percent of the agent
  //     inputValue = bookingData?.amountAfterDiscount;
  //   }
  //   setCashAmount(inputValue);
  // };
  // const handlePartUPI = (e) => {
  //   let inputValue = parseFloat(e.target.value);

  //   if (isNaN(inputValue) || inputValue < 0) {
  //     inputValue = "";
  //   } else if (inputValue > bookingData?.amountAfterDiscount) {
  //     //checking if the discount that is added is more than the discount percent of the agent
  //     inputValue = bookingData?.amountAfterDiscount;
  //   }
  //   setUpiAmount(inputValue);
  // };

  const handlePartCard = (e) => {
    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
    }

    if (inputValue > parseFloat(bookingData?.amountAfterDiscount)) {
      //checking if the discount that is added is more than the discount percent of the agent
      inputValue = bookingData?.amountAfterDiscount;
    }

    if (paymentOption === "Part Card / Part Cash") {
      setCashAmount(parseFloat(bookingData?.amountAfterDiscount) - inputValue);
    }

    if (paymentOption === "Part Card / Part UPI") {
      setUpiAmount(parseFloat(bookingData?.amountAfterDiscount) - inputValue);
    }

    setCardAmount(inputValue);
  };

  const handlePartCash = (e) => {
    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
    } else if (inputValue > parseFloat(bookingData?.amountAfterDiscount)) {
      //checking if the discount that is added is more than the discount percent of the agent
      inputValue = bookingData?.amountAfterDiscount;
    }

    if (paymentOption === "Part Card / Part Cash") {
      setCardAmount(parseFloat(bookingData?.amountAfterDiscount) - inputValue);
    }

    if (paymentOption === "Part Cash / Part UPI") {
      setUpiAmount(parseFloat(bookingData?.amountAfterDiscount) - inputValue);
    }

    setCashAmount(inputValue);
  };

  const handlePartUPI = (e) => {
    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
    } else if (inputValue > parseFloat(bookingData?.amountAfterDiscount)) {
      //checking if the discount that is added is more than the discount percent of the agent
      inputValue = bookingData?.amountAfterDiscount;
    }

    if (paymentOption === "Part Card / Part UPI") {
      setCardAmount(parseFloat(bookingData?.amountAfterDiscount) - inputValue);
    }

    if (paymentOption === "Part Cash / Part UPI") {
      setCashAmount(parseFloat(bookingData?.amountAfterDiscount) - inputValue);
    }

    setUpiAmount(inputValue);
  };
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
  const handleOpenShift = () => {
    if (
      shiftDetailsForUser &&
      shiftDetailsForUser?.length > 0 &&
      recentShiftOpen &&
      recentShiftOpen?.length === 0
    ) {
      if (shifts && shifts[1] && shifts[1][0]?.ShiftOpen === 1) {
        console.log("Shift 1 is open");
        // setShiftDisable(false);
        return (
          <div>
            <p style={{fontWeight:"bold"}}>Shift 1 is open</p>
          </div>
        );
      } else if (
        shifts &&
        shifts[1] &&
        shifts[1][0]?.ShiftOpen === 0 &&
        !shifts[2]
      ) {
        return (
          <div>
            <p style={{fontWeight:"bold"}}>Shift 1 is Closed</p>
          </div>
        );
      } else if (shifts && shifts[2] && shifts[2][0]?.ShiftOpen === 1) {
        console.log("Shift 3 is open");
        // setShiftDisable(false);
        return (
          <div>
            <p style={{fontWeight:"bold"}}>Shift 2 is open</p>
          </div>
        );
      } else if (
        shifts &&
        shifts[2] &&
        shifts[2][0]?.ShiftOpen === 0 &&
        !shifts[3]
      ) {
        console.log("Shift 4 is open");
        return (
          <div>
            <p style={{fontWeight:"bold"}}>Shift 2 is closed</p>
          </div>
        );
      } else if (shifts && shifts[3] && shifts[3][0]?.ShiftOpen === 1) {
        console.log("Shift 5 is open");
        // setShiftDisable(false);
        return (
          <div>
            <p style={{fontWeight:"bold"}}>Shift 3 is open</p>
          </div>
        );
      }
    } else if (
      Object.keys(shifts).length === 0 &&
      recentShiftOpen?.length > 0
    ) {
      if (
        recentShiftOpen[0]?.ShiftTypeId === 1 &&
        recentShiftOpen[0]?.ShiftOpen === 1
      ) {
        return (
          <div>
            <p style={{fontWeight:"bold",color:'red'}}>Open Shift 1</p>
          </div>
        );
      } else if (
        recentShiftOpen[0]?.ShiftTypeId === 1 &&
        recentShiftOpen[0]?.ShiftOpen === 0
      ) {
        return (
          <div>
            <p style={{fontWeight:"bold",color:'red'}}>Open shift 2</p>
          </div>
        );
      } else if (
        recentShiftOpen[0]?.ShiftTypeId === 3 &&
        recentShiftOpen[0]?.ShiftOpen === 1
      ) {
        return (
          <div>
            <p style={{fontWeight:"bold",color:'red'}}>Open shift 3</p>
          </div>
        );
      } else if (
        recentShiftOpen[0]?.ShiftTypeId === 2 &&
        recentShiftOpen[0]?.ShiftOpen === 1
      ) {
        return (
          <div>
            <p style={{fontWeight:"bold",color:'red'}}>Open shift 2</p>
          </div>
        );
      } else if (
        recentShiftOpen[0]?.ShiftTypeId === 2 &&
        recentShiftOpen[0]?.ShiftOpen === 0
      ) {
        console.log("Shift 8 is open");
        return (
          <div>
            <p style={{fontWeight:"bold",color:'red'}}>Open shift 3</p>
          </div>
        );
      }
    }

    console.log("Default case");

    return (
      <div>
        <p style={{fontWeight:"bold",color:'red'}}>Open the Shift to create a new booking </p>
      </div>
    );
  };
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

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {isPresentDate ? (
            <Modal.Title>Confirm Booking</Modal.Title>
          ) : (
            <Modal.Title>Error</Modal.Title>
          )}
        </Modal.Header>

        <Modal.Body>
          {isPresentDate ? (
            <div>
               <p>{handleOpenShift()}</p>
            <p>Do you want to continue with the booking?</p>
            </div>
          ) : (
            <p></p>
          )}
          {isDateInFuture ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Sorry, this booking cannot be processed as it is scheduled for a
              future date.
            </p>
          ) : (
            <p></p>
          )}


          {isDateInPast ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Sorry, this booking cannot be processed as it was scheduled for a
              past date.
            </p>
          ) : (
            <p></p>
          )}
        </Modal.Body>

        <Modal.Body>
           {billGenerated==true ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
              This Bill is already generated
            </p>
          ) : (
            <p></p>
          )}
           </Modal.Body>
        <Modal.Footer>
          {isPresentDate && billGenerated == false ? (
            <Button variant="primary" 
            disabled={
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
              (shifts &&
                shifts[2] &&
                shifts[2][0]?.ShiftOpen === 0 &&
                !shifts[3]) ||
              (shifts &&
                shifts[1] &&
                shifts[1][0]?.ShiftOpen === 0 &&
                !shifts[2]) ||
              shiftForUserOne
            }
            onClick={confirmBilling}>
              Confirm
            </Button>
          ) : (
            <></>
          )}
        </Modal.Footer>
      </Modal>

      {payAT && (
        <div>
          <h2>Pay At Counter</h2>
          <div style={{ flexDirection: "row" }} className=" mt-5 col-lg-12">
            <h4 className=" ">
              {"         "}Amount Payable
              <span style={{ color: "red" }}>
                {" "}
                Rs. {bookingData?.amountAfterDiscount}{" "}
              </span>
            </h4>
          </div>
          <p>{handleOpenShift()}</p>
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
            >
              <option value="">Select...</option>
              <option value="Cash">Cash </option>
              <option value="Card">Card </option>
              <option value="UPI">UPI </option>
              <option value="Part Card / Part Cash">
                Part Card / Part Cash
              </option>
              <option value="Part Card / Part UPI">Part Card / Part UPI</option>
              <option value="Part Cash / Part UPI">Part Cash / Part UPI</option>

              <option value="Company Settlement">Company Settlement </option>
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

                  defaultValue={cashAmount}
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
                />
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Holder's Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="text"
                  placeholder="Enter the card holder's name"
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
                >
                  <option value="">Select...</option>
                  <option value="VISA">Visa card </option>
                  <option value="MAST">MasterCard </option>
                  <option value="Rupay">Rupay Card </option>
                  <option value="Others">Others </option>
                </select>
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="number"
                  placeholder="Enter the card number"
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
                  value={upiAmount}
                  defaultValue={upiAmount}
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
                  onChange={(e) => setUpiId(e.target.value)}
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
                  type="number"
                  placeholder="Enter the amount"
                  // onChange={(e) => setCardAmount(e.target.value)}
                  value={cardAmount}
                  onChange={handlePartCard}
                  onWheel={(e) => e.target.blur()}
                />
              </div>

              <div className="col-lg-6 mt-3">
                <label for="formGroupExampleInput " className="form_text">
                  Part Cash Amount <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  class="form-control mt-2"
                  type="number"
                  placeholder="Enter the amount"
                  // onChange={(e) => setCashAmount(e.target.value)}
                  value={cashAmount}
                  onChange={handlePartCash}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Holder's Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="text"
                  placeholder="Enter the card holder's name"
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
                >
                  <option value="">Select...</option>
                  <option value="VISA">Visa card </option>
                  <option value="MAST">MasterCard </option>
                  <option value="Rupay">Rupay Card </option>
                  <option value="Others">Others </option>
                </select>
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="number"
                  placeholder="Enter the card number"
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
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>

              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Holder's Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="text"
                  placeholder="Enter the card holder's name"
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
                >
                  <option value="">Select...</option>
                  <option value="VISA">Visa card </option>
                  <option value="MAST">MasterCard </option>
                  <option value="Rupay">Rupay Card </option>
                  <option value="Others">Others </option>
                </select>
              </div>
              <div className="col-lg-6 mt-3">
                <label htmlFor="formGroupExampleInput" className="form_text">
                  Card Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  className="form-control mt-2"
                  type="number"
                  placeholder="Enter the card number"
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
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <button
            onClick={handleShowR}
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
            disabled={
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
              (shifts &&
                shifts[2] &&
                shifts[2][0]?.ShiftOpen === 0 &&
                !shifts[3]) ||
              (shifts &&
                shifts[1] &&
                shifts[1][0]?.ShiftOpen === 0 &&
                !shifts[2]) ||
              shiftForUserOne
            }
            className="btn btn_colour mt-5 btn-lg"
          >
            {" "}
            Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default AcknowledgementDetails;
