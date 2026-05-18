import React, { useState, useMemo, useRef } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getCouponsbyInitials,
  getPanelDiscounts,
  EditUsedCoupon,
  getUserByPhone,
} from "../../Redux/actions/users";
import {  fetchBookingDetailsById, updateBooking } from "../../Redux/actions/booking";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/global.css";
import PackagesPage from "../Pages/Packages/PackagePage";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { checkShiftForUser } from "../../Redux/actions/users";
import moment from "moment";
import logo from "../../assets/Images/icone-fleche-droite-verte.png";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import checkcircle from "../../assets/Images/checkcircle.png";
import { recentShiftForOutlet } from "../../Redux/actions/users";
import { getEnabledPanelDiscount } from "../../Redux/actions/users";
import { compose } from "@reduxjs/toolkit";
import { Oval, MagnifyingGlass, RotatingLines } from "react-loader-spinner";
import {
  AddBillingDetails,
  AddupdateAgentSettlement,
  updateBillingDetails,
  voidBill,
} from "../../Redux/actions/billing";
import { checkActiveOutlet } from "../../Redux/actions/users";
import { getUserById } from "../../Redux/actions/users";
import { countDriverBookings } from "../../Redux/actions/users";
import { ROLES } from "../../constants/roles";

import debounce from "lodash.debounce";
const DEBOUNCE_TIME_MS = 600;

// import { QrReader } from "react-qr-reader";
const UpdateBooking = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { bookingId } = useParams();
  // const { userType } = location.state;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const [dateFromBackend, setDateFromBackend] = useState();
  const [isBillGenerated, setIsBilllGenerated] = useState();
  const [payAT, setPay] = useState(false);
  const outletOpenDate = useSelector(
    (state) => state.users?.saveOutletDate?.Details?.OutletDate
  );
  const todayOutletDate = moment(outletOpenDate).format("YYYY-MM-DD");

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log("loginDetails-------------->", loginDetails);

  useEffect(() => {
    if (!loginDetails) {
      navigate("/");
    } else {
      console.log("Hi");
      dispatch(
        fetchBookingDetailsById(
          loginDetails?.logindata?.Token,
          bookingId,
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
                FullName: callback?.response?.Details.FullName,
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
            } else {
              console.log(callback.error);
              toast.error(callback.error);
            }
          }
        )
      );
  
    }
  }, []);

  const outletOpenDetails = useSelector((state) => state.auth?.outeltDetails);
  const bookingDetails = useSelector((state) => state.booking?.bookingDetails).Details;


  const activeDateOfOutlet = useSelector(
    (state) => state.users?.saveOutletDate?.Details
  );

  console.log(
    "outlet open Details-----------------|||||||||||||||||||||||||-->",
    outletOpenDetails?.Details
  );

  console.log(
    "activeDateOfOutlet------------------>",
    activeDateOfOutlet?.OutletStatus
  );

  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const [shiftDetails, setShiftDetails] = useState("");
  const [checkActiveOtlet, setCheckActiveOutlet] = useState();


  const [outletStatus, setOutletStatus] = useState();
  const [settledBy, setSettledBy] = useState(0);
  const today = moment().format("YYYY-MM-DD");

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

  const [localAgentDetails, setLocalAgentDetails] = useState("");
  const [localAgentId, setLocalAgentId] = useState();

  const [TravelAgentId, setTravelAgentId] = useState("");
  const [TravelDetails, setTravelDetails] = useState();

  const [Discountpercent, setDiscountpercent] = useState(bookingDetails?.PanelDiscount);

  useEffect(() => {
    const url = new URL(window.location.href);
    const userId = url.searchParams.get("UserId");
    console.log("userId++++", userId);

    if (userId != null) {
      dispatch(
        getUserById(userId, (callback) => {
          console.log("hii get user by Id>>callabck>>", callback);
          if (callback.status) {
            console.log(
              "callabck.response.details>>",
              callback?.response?.Details
            );
            if (callback?.response?.Details?.UserType == 8) {
              setLocalAgentId(callback?.response?.Details?.Id);
              setLocalAgentDetails(callback?.response?.Details);
            }

            if (callback?.response?.Details?.UserType == 5) {
              setTravelAgentId(callback?.response?.Details?.Id);
              setTravelDetails(callback?.response?.Details);
            }
          } else {
            toast.error(callback.error);
          }
        })
      );
    }

    const Discount = url.searchParams.get("Discountpercent");
    setDiscountpercent(Discount);
    setDiscountFigure(Discount);
  }, []);

  const [guestName, setGuestName] = useState(bookingDetails?.FullName);
  const [email, setEmail] = useState(bookingDetails?.Email);
  const [phone, setPhone] = useState(bookingDetails?.Phone);
  const [address, setAddress] = useState(bookingDetails?.Address);

  const [totalGuestCount, settoalGuestCount] = useState(bookingDetails?.TotalGuestCount);
  const [dateofbirth, setDateofbirth] = useState(bookingDetails?.DOB);
  const [numberofteens, setNumberofteens] = useState(bookingDetails?.NumOfTeens);
  const [settlementBycompany, setSettlementbycompany] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [governmentId, setgovernmentId] = useState("");
  const [gstNumber, setgstNumber] = useState(bookingDetails?.GSTNumber || "");
  const [amount, setamount] = useState(bookingDetails?.ActualAmount);
  const [packageIds, setPackageIds] = useState([]);
  const [packageGuestCount, setPackageGuestCount] = useState([]);
  const [amountAfterDiscount, setamountAfterDiscount] = useState(bookingDetails?.ActualAmount - ((bookingDetails?.ActualAmount * bookingDetails?.PanelDiscount)/100));
  const [couponId, setCouponId] = useState("");
  const [packageName, setPackageName] = useState([]);

  const [discountToggle, setDiscountToggle] = useState(false);
  const [couponToggle, setCouponToggle] = useState(false);
  const [referredByToggle, setReferredByToggle] = useState(false);

  const [panelDiscounts, setPanelDiscounts] = useState("");

  const [usedCouponArr, setUsedCouponArr] = useState([]);

  const [remainingCoupons, setRemainingCoupons] = useState();
  const [bookingData, setBookingData] = useState("");
  const [couponDiscount, setCouponDiscout] = useState("");
  const [totalteensPrice, setTotalTeensPrice] = useState("");

  const [teenpackageId, setTeenPackageId] = useState([]);

  console.log("teenpackageId------------------>", teenpackageId);

  const [totalTeensRate, setTotalTeensRate] = useState();
  const [totalTeensTax, setTotalTeensTax] = useState("");
  const [teenstaxPercentage, setTeensTaxPercentage] = useState("");
  const [teensTaxName, setTeensTaxName] = useState("");

  const [packageWeekdaysPrice, setPackageWeekdaysPrice] = useState([]);
  const [packageWeekendPrice, setPackageWeekendPrice] = useState([]);

  const [teensWeekdayPrice, setTeensWeekdayPrice] = useState("");
  const [teensWeekendPrice, setTeensWeekendPrice] = useState("");
  const [teensPackageName, setTeensPackageName] = useState("");

  const [cashAmount, setCashAmount] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [cardHoldersName, setcardHoldersName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");
  const [discountFigure, setDiscountFigure] = useState("");

  const [loader, setLoader] = useState(false);
  console.log("cardType------->", cardType);

  console.log("phone--------------->", phone);

  console.log("remainingCoupons------------>remaining", remainingCoupons);

  useEffect(() => {
    setGuestName(bookingDetails?.FullName);
    setEmail(bookingDetails?.Email);
    setPhone(bookingDetails?.Phone);
    setAddress(bookingDetails?.Address);
    settoalGuestCount(bookingDetails?.TotalGuestCount);
    setDateofbirth(bookingDetails?.DOB);
    setNumberofteens(bookingDetails?.NumOfTeens);
    setgstNumber(bookingDetails?.GSTNumber || "");
    setamount(bookingDetails?.ActualAmount);
    setamountAfterDiscount(bookingDetails?.AmountAfterDiscount);
    setPackageIds(bookingDetails?.packageId);
    setPackageGuestCount(bookingDetails?.packageGuestCount);
    setPackageName(bookingDetails?.packageNames);
    setPackageWeekendPrice(bookingDetails?.packageWeekendPrices);
    setPackageWeekdaysPrice(bookingDetails?.packageWeekdayPrices);
  }, [bookingDetails]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchUserByPhone = (phoneNumber) => {
      dispatch(
        getUserByPhone(loginDetails?.logindata?.Token, phoneNumber, (callback) => {
          if (callback.status) {
            const userData = callback?.response?.Details;
            console.log({userData});
            setGuestName(userData?.FullName);
            setEmail(userData?.Email);
            setAddress(userData?.Address);
            setgstNumber(userData?.GSTNumber);
            setDateofbirth(userData?.DOB);
            setSelectedState(State?.getStatesOfCountry(selectedCountry?.isoCode).filter((elem) => elem.name === userData?.State)[0])
  
            console.log("Callback---------get user details", callback?.response);
          }
        })
      );
    };
  
    const onPhoneNumberChange = useMemo(
      () =>
        debounce((phoneNumber) => {
          setPhone(phoneNumber);

          fetchUserByPhone(phoneNumber?.includes("+91") ? phoneNumber.replace("+91", "") : phoneNumber);
        }, DEBOUNCE_TIME_MS),
      [fetchUserByPhone]
     );


  console.log("couponCode--------------->", couponCode);

  const finalAmountofPackage =
    amount - amountAfterDiscount == amount ? amount : amountAfterDiscount;

  console.log("finalAmountofPackage------------>----->", finalAmountofPackage);

  // const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState({
    label: "India",
    name: "India",
    isoCode: "IN",
  });
  const [selectedState, setSelectedState] = useState(State?.getStatesOfCountry(selectedCountry?.isoCode).filter((elem) => elem.name === bookingDetails?.State)[0] || null);
  const [selectedCity, setSelectedCity] = useState(bookingDetails?.City || null);

  useEffect(() => {
    console.log(selectedCountry);
    console.log(selectedCountry?.isoCode);
    console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  }, [selectedCountry]);


  const fetchCouponCodes = () => {
    dispatch(
      getCouponsbyInitials(loginDetails?.logindata?.Token, 4, (callback) => {
        if (callback.status) {
          console.log("Callback---------get coupons", callback?.response);
        }
      })
    );
  };

  const fetchPanelDiscounts = () => {
    dispatch(
      getEnabledPanelDiscount(loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          setPanelDiscounts(callback?.response?.Details);
          console.log(
            "Panel Discounts----------------------->",
            callback?.response?.Details
          );
        }
      })
    );
  };

  const handleVoidBill = (voidBookingId, voidBillReason) => {
    const voidBillData = {
      bookingId: voidBookingId,
      voidBillReason: voidBillReason,
    };
    dispatch(
      voidBill(loginDetails?.logindata?.Token, voidBillData, (callback) => {
        if (callback.status) {
          
        } else {
          console.log("Callback--------voidt>>error", callback.error);
          toast.error(callback.error);
        }
      })
    );
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  console.log("Foramted Date------------------------------>", formattedDate);

  useEffect(() => {
    fetchCouponCodes();
    fetchPanelDiscounts();
  }, [dispatch]);

  console.log("usedCouponArr-------------->", usedCouponArr);

  console.log(
    "activeDateOfOutlet?.OutletDate-------------->",
    activeDateOfOutlet?.OutletDate
  );

  console.log("selectedCountry?.name", selectedCountry?.name);

  const handleShow = () => {
    // setShow(true)
    console.log("okuuuuu", gstNumber?.length);

    if (guestName == "" || phone === "" || address == "") {
      toast.warning("Please fill all the fields");
      setLoader(false);
      handleClose();
    } else if (gstNumber && gstNumber.length != 15) {
      toast.warning("Please enter a valid GST number");
      setLoader(false);
      handleClose();
    } else if (!isValidEmail(email) && loginDetails?.logindata?.UserType !== ROLES.GRE ) {
      toast.warning("Please enter a valid email address");
      setLoader(false);
      handleClose();
    } else if (guestName.length > 80) {
      toast.warning("Guest name is too long");
      setLoader(false);
      handleClose();
    } else if (guestName.address > 100) {
      toast.warning("Guest address is too long");
      setLoader(false);
      handleClose();
    }  else {
      setShow(true);
    }
  };

  const onsubmit = () => {
    const discountFigureToUse = discountToggle ? discountFigure : 0;
    const selectedOptionToUse = discountToggle ? selectedOption : null;

    setLoader(true);

    console.log("amountAfterDiscount--->", amountAfterDiscount);

    const teenpackageIdArray = [];

    teenpackageIdArray.push(teenpackageId);
    console.log("onsubmit>>>shiftDetails>>", shiftDetails);
    const data = {
      bookingId: +bookingId,
      isActive: 1,
      guestName: guestName,
      address: address,
      phone: phone,
      email: email,
      dob: dateofbirth,
      country: selectedCountry?.name,
      state: selectedState?.name,
      city: selectedCity,
      GSTNumber: gstNumber,
      totalGuestCount: totalGuestCount,
      packageId:
        packageIds.length == 0
          ? JSON.stringify(teenpackageIdArray)
          : JSON.stringify(packageIds),
      packageGuestCount: JSON.stringify(packageGuestCount),
      userId: loginDetails?.logindata?.userId,
      userTypeId: loginDetails?.logindata?.UserType,
      shiftId:
        shifts && shifts[1] && shifts[1][0]?.ShiftOpen === 1
          ? 1
          : shifts && shifts[2] && shifts[2][0]?.ShiftOpen === 1
          ? 2
          : shifts && shifts[3] && shifts[3][0]?.ShiftOpen === 1
          ? 3
          : 0,
      actualAmount: amount,
      governmentId: "",
      amountAfterDiscount: amount,
      packageName:
        packageIds.length == 0
          ? JSON.stringify(teensPackageName)
          : JSON.stringify(packageName),
      packageWeekdayPrice:
        packageIds.length == 0
          ? JSON.stringify(teensWeekdayPrice)
          : JSON.stringify(packageWeekdaysPrice),
      packageWeekendPrice:
        packageIds.length == 0
          ? JSON.stringify(teensWeekendPrice)
          : JSON.stringify(packageWeekendPrice),
      numOfTeens: numberofteens,
      teensPrice: totalteensPrice,
      teensRate: totalTeensRate,
      teensTax: teenstaxPercentage,
      teensTaxName: teensTaxName,
      paymentMode: "Cash",
      cashAmount: amount,
      cardAmount: 0,
      UPIAmount: 0,
    };
    console.log("Data from booking------->", data);

      dispatch(        
        updateBooking(loginDetails?.logindata?.Token, data, (callback) => {
          if (callback.status) {
            console.log(
              "update booking details --------------?",
              callback?.response?.Details
            );

            toast.success("Updated Booking details success");
              if (callback?.response?.Details?.IsBillGenerated == 1) {
                handleVoidBill(bookingId, "Updated Booking details");
                navigate("/GenerateBill", {
                  state: { userData: callback?.response?.Details },
                });
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
  };

  console.log("numberofteens-------------------->", numberofteens);

  const couponCodeAppend = () => {
    console.log("...usedCouponArr-------", typeof { ...usedCouponArr });
    console.log(
      "...usedCouponArr>>>>>",
      { ...usedCouponArr } == { 0: "" } ? true : false
    );
    const updatedCouponData = [...usedCouponArr, couponCode];
    const filteredUpdatedCouponData = updatedCouponData.filter(
      (item) => item !== ""
    ); // Filter out empty strings
    console.log("lets-->check-->updatedCouponData-->", updatedCouponData);
    // const dataArray = Array.from(
    //   { length: updatedCouponData.length },
    //   (_, index) => updatedCouponData[index]
    // );
    const dataArray = Array.from(
      { length: filteredUpdatedCouponData.length },
      (_, index) => filteredUpdatedCouponData[index]
    );
    console.log("dataArray--->", dataArray);
    const stringRepresentation = "[" + dataArray.join(",") + "]";
    const couponData = {
      couponId: couponId,
      usedCoupons: stringRepresentation,
      remainingCoupons: remainingCoupons,
    };
    console.log("check--->>couponData-->>", couponData);
    dispatch(
      EditUsedCoupon(couponData, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          toast.success("Coupon used updated");
          // navigate("/GenerateBill", { state: { userType: bookingData } });
          toast.error(callback.error);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const [selectedOption, setSelectedOption] = useState("");

  const [paymentOption, setPaymentOption] = useState(bookingDetails?.PaymentMode);

  console.log("Discount ----->", selectedOption);

  console.log("amountAfterDiscount-------->", amountAfterDiscount);


  console.log("Shift All details----------------->", shiftDetails?.ShiftOpen);
  console.log("Shift All details----------------->", shiftDetails?.ShiftTypeId);


  const shiftPageFn = () => {
    navigate("/Shifts");
  };

  console.log("Shift type ShiftOpen---------->", shiftDetails);
  console.log("Shift type ShiftTypeId---------->", shiftDetails);

  const handleFocus = (e) => {
    e.target.type = "date";
  };

  //new code for shifts messages
  const [shiftDetailsForUser, setSHiftDetaislForUser] = useState();
  const [recentShiftOpen, setRecentShiftOpen] = useState([]);

  const [shiftForUserOne, setShiftForUserOne] = useState(false);
  const checkShiftFn = () => {
    console.log("inside>>checkShiftFn>>>");
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
    console.log("hello>>inside>>shiftDetailsForUser>>", shiftDetailsForUser);
    shiftDetailsForUser.forEach((item) => {
      const { ShiftTypeId, OpenTime, CloseTime, ShiftOpen } = item;
      if (!shifts[ShiftTypeId]) {
        shifts[ShiftTypeId] = [];
      }
      shifts[ShiftTypeId].push({ ShiftTypeId, OpenTime, CloseTime, ShiftOpen });
    });
  }

  const handleOpenShift = () => {
    console.log("check shifts now>>", shifts);
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
            <p>Shift 1 is open</p>
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
            <p>Shift 1 is Closed</p>
          </div>
        );
      } else if (shifts && shifts[2] && shifts[2][0]?.ShiftOpen === 1) {
        console.log("Shift 2 is open");
        // setShiftDisable(false);
        return (
          <div>
            <p>Shift 2 is open</p>
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
            <p>Shift 2 is closed</p>
          </div>
        );
      } else if (shifts && shifts[3] && shifts[3][0]?.ShiftOpen === 1) {
        console.log("Shift 5 is open");
        // setShiftDisable(false);
        return (
          <div>
            <p>Shift 3 is open</p>
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
            <p>Open Shift 1</p>
          </div>
        );
      } else if (
        recentShiftOpen[0]?.ShiftTypeId === 1 &&
        recentShiftOpen[0]?.ShiftOpen === 0
      ) {
        return (
          <div>
            <p>Open shift 2</p>
          </div>
        );
      } else if (
        recentShiftOpen[0]?.ShiftTypeId === 3 &&
        recentShiftOpen[0]?.ShiftOpen === 1
      ) {
        return (
          <div>
            <p>Open shift 3</p>
          </div>
        );
      } else if (
        recentShiftOpen[0]?.ShiftTypeId === 2 &&
        recentShiftOpen[0]?.ShiftOpen === 1
      ) {
        return (
          <div>
            <p>Open shift 2</p>
          </div>
        );
      } else if (
        recentShiftOpen[0]?.ShiftTypeId === 2 &&
        recentShiftOpen[0]?.ShiftOpen === 0
      ) {
        console.log("Shift 8 is open");
        return (
          <div>
            <p>Open shift 3</p>
          </div>
        );
      }
    }

    console.log("Default case");

    return (
      <div>
        <p>Open the Shift to create a new booking </p>
      </div>
    );
  };


  const [scannedData, setScannedData] = useState("");
  const inputRef = useRef(null);
  const [scannerLoader, setScannerLoader] = useState(false);

  useEffect(() => {
    if (scannedData) {
      setScannerLoader(true);
    }

    const openTabTimer = setTimeout(() => {
      if (scannedData) {
        window.open(scannedData);
        setScannerLoader(false);
      }
    }, 1000);

    const closeTabTimer = setTimeout(() => {
      setScannedData("");
    }, 2000);

    return () => {
      clearTimeout(openTabTimer);
      clearTimeout(closeTabTimer);
    };
  }, [scannedData]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  console.log("cashAmount------>", cashAmount);
  console.log("finalAmountofPackage------------>", finalAmountofPackage);

  return (
    <div>
      <div>
        <input
          type="text"
          ref={inputRef}
          autoFocus // Set the autofocus attribute to focus the input
          style={{
            position: "absolute", // Hide the input using CSS
            left: "-9999px",
          }}
          value={scannedData}
          onChange={(e) => setScannedData(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!scannerLoader ? (
          <div></div>
        ) : (
          <RotatingLines
            strokeColor="#0095d4"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        )}
      </div>

      <ToastContainer />

      <div className="row">

        {/* <h3 className="mb-4">Create Booking</h3> */}

        <div className="container-fluid vh-5 d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-8 text-center">
            <div className="card p-4">
              <h3>Update Booking</h3>
            </div>
          </div>
          <ToastContainer />
        </div>
        <PackagesPage
          key={bookingDetails?.Id}
          setamount={setamount}
          setamountAfterDiscount={setamountAfterDiscount}
          setPackageIds={setPackageIds}
          Discountpercent={Discountpercent}
          setPackageGuestCount={setPackageGuestCount}
          setNumberofteens={setNumberofteens}
          settoalGuestCount={settoalGuestCount}
          amountAfterDiscount={amountAfterDiscount}
          couponDiscount={couponDiscount}
          setTotalTeensPrice={setTotalTeensPrice}
          setTeenPackageId={setTeenPackageId}
          setTotalTeensRate={setTotalTeensRate}
          setTotalTeensTax={setTotalTeensTax}
          setTeensTaxName={setTeensTaxName}
          setTeensTaxPercentage={setTeensTaxPercentage}
          setPackageName={setPackageName}
          setPackageWeekendPrice={setPackageWeekendPrice}
          setPackageWeekdaysPrice={setPackageWeekdaysPrice}
          setTeensWeekdayPrice={setTeensWeekdayPrice}
          setTeensWeekendPrice={setTeensWeekendPrice}
          setTeensPackageName={setTeensPackageName}
          outletDate={activeDateOfOutlet?.OutletDate}
          bookingDetails={bookingDetails}
        />
        <div className="col-lg-6 mt-3 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Guest Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2 "
            type="text"
            placeholder="Full Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Phone <span style={{ color: "red" }}>*</span>
          </label>

          <PhoneInput
            className="form-control mt-2 "
            placeholder="Enter phone number"
            onChange={onPhoneNumberChange}
            value={phone}
            defaultCountry="IN"
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label
            for="formGroupExampleInput "
            className="form_text"
            style={{ fontSize: "15px", fontWeight: "600" }}
          >
            Email {loginDetails?.logindata?.UserType !== ROLES.GRE && <span style={{ color: "red" }}>*</span>}
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text mb-2">
            Country
          </label>

          <Select
            options={Country.getAllCountries().map((country) => ({
              label: country.name,
              value: country.name,
              isoCode: country.isoCode,
            }))}
            getOptionLabel={(options) => options.label}
            getOptionValue={(options) => options.value}
            value={selectedCountry}
            defaultValue={selectedCountry}
            onChange={(item) => {
              setSelectedCountry(item);
            }}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text mb-2">
            State
          </label>
          {console.log({states: State?.getStatesOfCountry(selectedCountry?.isoCode)})}
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
            defaultValue={selectedState}
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
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            value={gstNumber}
            onChange={(e) => setgstNumber(e.target.value)}
          />
        </div>

        <div className="row mt-3">

          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Date of birth
            </label>
            <input
              class="form-control mt-2"
              type="date"
              placeholder="Enter Start Date"
              value={dateofbirth}
              onChange={(e) => setDateofbirth(e.target.value)}
              onFocus={handleFocus}
            />
          </div>

        </div>

      </div>
      <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
        <button
          style={{ paddingLeft: "100px", paddingRight: "100px" }}
          type="submit"
          className="btn btn_colour mt-5 btn-lg"
          onClick={handleShow}
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
              shifts[1] &&
              shifts[1][0]?.ShiftOpen === 0 &&
              shifts[2] &&
              shifts[2][0]?.ShiftOpen === 0 &&
              !shifts[3]) ||
            (shifts &&
              shifts[1] &&
              shifts[1][0]?.ShiftOpen === 0 &&
              !shifts[2]) ||
            (shifts &&
              shifts[1] &&
              shifts[1][0]?.ShiftOpen === 0 &&
              shifts[2] &&
              shifts[2][0]?.ShiftOpen === 0 &&
              shifts[3] &&
              shifts[3][0]?.ShiftOpen === 0) ||
            shiftForUserOne
          }
        >
          Generate Bill
        </button>
      </div>

      <div>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Body>
            <div className="row">
              <img
                src={checkcircle}
                alt="Check Circle"
                className="check-circle"
              />
              <p className="outletTitle">Update Booking </p>
              <p className="outletTex">
                Are you sure you want to update the booking ?
              </p>
            </div>
            <div className="row">
              <div>
                <Button
                  className="confirmbtn"
                  onClick={onsubmit}
                  disabled={loader}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!loader ? (
                    "Generate Bill"
                  ) : (
                    <Oval
                      height={20}
                      width={20}
                      color="black"
                      visible={true}
                      ariaLabel="oval-loading"
                      secondaryColor="black"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  )}
                </Button>
              </div>
              <div>
                <Button onClick={handleClose} className="cancelBtn">
                  No
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>

    
  );
};

export default UpdateBooking;
