import React, { useState, useMemo, useRef } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getCouponsbyInitials,
  getPanelDiscounts,
  EditUsedCoupon,
  getUserByPhone,
  getDiscountsUsingDiscountCode,
} from "../../Redux/actions/users";
import { AddBookingFn } from "../../Redux/actions/booking";
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
} from "../../Redux/actions/billing";
import { checkActiveOutlet } from "../../Redux/actions/users";
import { getUserById } from "../../Redux/actions/users";
import { countDriverBookings } from "../../Redux/actions/users";
import { ROLES } from "../../constants/roles";

import debounce from "lodash.debounce";
const DEBOUNCE_TIME_MS = 1000;

// import { QrReader } from "react-qr-reader";
const NewBooking = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { userType } = location.state;

  const [show, setShow] = useState(false);
  const [shiftOneOpen, setShiftOneOpen] = useState(false);
  const [shiftTwoOpen, setShiftTwoOpen] = useState(false);
  const [shiftThreeOpen, setShiftThreeOpen] = useState(false);
  const [toggleCounter, setToggleCounter] = useState(0); 
  const handleClose = () => setShow(false);

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log("loginDetails-------------->", loginDetails);

  useEffect(() => {
    if (!loginDetails) {
      navigate("/");
    } else {
      console.log("Hi");
    }
  }, []);

  const outletOpenDetails = useSelector((state) => state.auth?.outeltDetails);

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

  const parsedDate = moment(
    outletOpenDetails &&
      outletOpenDetails?.Details &&
      outletOpenDetails?.Details[0]?.Date
  );
  const outletFormattedData = parsedDate.format("YYYY-MM-DD");

  const [shiftDetails, setShiftDetails] = useState("");
  const [checkActiveOtlet, setCheckActiveOutlet] = useState();

  const [shiftDisable, setShiftDisable] = useState(true);

  const [outletStatus, setOutletStatus] = useState();
  const [settledBy, setSettledBy] = useState(0);
  const today = moment().format("YYYY-MM-DD");

  useEffect(() => {
    // dispatch(
    //   checkShiftForUser(
    //     activeDateOfOutlet?.OutletDate,
    //     loginDetails?.logindata?.userId,
    //     loginDetails?.logindata?.UserType,
    //     loginDetails?.logindata?.Token,
    //     (callback) => {
    //       if (callback) {
    //         console.log(
    //           "Callback from shifts for user NEW BOOKING-------------->",
    //           callback?.response?.Details
    //         );
    //         setShiftDetails(callback?.response?.Details);

    //         if (callback?.response?.Details == null) {
    //           dispatch(
    //             recentShiftForOutlet(
    //               activeDateOfOutlet?.OutletDate,

    //               loginDetails?.logindata?.Token,
    //               (callback) => {
    //                 if (callback) {
    //                   console.log(
    //                     "Recent shift for outlet       NEW BOOKING-------------------------------------- ->",
    //                     callback?.response?.Details
    //                   );
    //                   setShiftDetails(callback?.response?.Details);

    //                   toast.error(callback.error);
    //                 } else {
    //                   toast.error(callback.error);
    //                 }
    //               }
    //             )
    //           );
    //         }

    //         toast.error(callback.error);
    //       } else {
    //         toast.error(callback.error);
    //       }
    //     }
    //   )
    // );

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

  const [Discountpercent, setDiscountpercent] = useState("");
  const [showDiscountCodeField, setShowDiscountCodeField] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const userId = loginDetails?.logindata?.userId;
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
            if([1, 3, 5, 8].includes(+callback?.response?.Details?.UserType)){
              setShowDiscountCodeField(true);
            }

          } else {
            toast.error(callback.error);
          }
        })
      );
    }

    const Discount = url.searchParams.get("Discountpercent");
    const DiscountCodeURL  = url.searchParams.get("DiscountCode");
    if(DiscountCodeURL) {
      setDiscountCodeToggle(true);
      setDiscountCode(DiscountCodeURL);
      setToggleCounter(toggleCounter + 1);
      
    }
    setDiscountpercent(Discount);
    setDiscountFigure(Discount);
  }, []);

  useEffect(() => {
    if(toggleCounter)
    handleDiscountCode()
  }, [toggleCounter])
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [totalGuestCount, settoalGuestCount] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [numberofteens, setNumberofteens] = useState("");
  const [settlementBycompany, setSettlementbycompany] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [governmentId, setgovernmentId] = useState("");
  const [gstNumber, setgstNumber] = useState("");
  const [amount, setamount] = useState("");
  const [packageIds, setPackageIds] = useState([]);
  const [packageGuestCount, setPackageGuestCount] = useState([]);
  const [amountAfterDiscount, setamountAfterDiscount] = useState(0);
  const [referredBy, setreferredBy] = useState("");
  const [couponId, setCouponId] = useState("");
  const [packageName, setPackageName] = useState("");

  const [discountToggle, setDiscountToggle] = useState(false);
  const [discountCodeToggle, setDiscountCodeToggle] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const [couponToggle, setCouponToggle] = useState(false);
  const [referredByToggle, setReferredByToggle] = useState(false);

  const [panelDiscounts, setPanelDiscounts] = useState("");

  const [usedCouponArr, setUsedCouponArr] = useState([]);

  const [remainingCoupons, setRemainingCoupons] = useState();
  const [bookingData, setBookingData] = useState("");
  const [couponDiscount, setCouponDiscout] = useState("");
  const [discountCodeDiscount, setDiscountCodeDiscount] = useState(""); 
  const [totalteensPrice, setTotalTeensPrice] = useState("");

  const [teenpackageId, setTeenPackageId] = useState([]);

  console.log("teenpackageId------------------>", teenpackageId);

  const [totalTeensRate, setTotalTeensRate] = useState();
  const [totalTeensTax, setTotalTeensTax] = useState("");
  const [teenstaxPercentage, setTeensTaxPercentage] = useState("");
  const [teensTaxName, setTeensTaxName] = useState("");

  const [packageWeekdaysPrice, setPackageWeekdaysPrice] = useState("");
  const [packageWeekendPrice, setPackageWeekendPrice] = useState("");

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchUserByPhone = (phoneNumber) => {
      dispatch(
        getUserByPhone(loginDetails?.logindata?.Token, phoneNumber, (callback) => {
          if (callback.status) {
            const userData = callback?.response?.Details;
            setGuestName(userData?.FullName);
            setEmail(userData?.Email);
            setAddress(userData?.Address);
            setgstNumber(userData?.GSTNumber)
            setSelectedCity(userData?.City);
            let countrySelected = Country.getAllCountries().filter((country) => country.name === userData?.Country)?.[0];
            setSelectedCountry({
              label: countrySelected?.name,
              value: countrySelected?.name,
              isoCode: countrySelected?.isoCode
            });
            let stateSelected = State?.getStatesOfCountry(countrySelected?.isoCode || selectedCountry?.isoCode).filter((state) => state.name === userData?.State)?.[0];
            setSelectedState(stateSelected);
            setDateofbirth(userData?.DOB);
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

  const handleToggle = (field) => {
    const DiscountedAmount =
      amount - amountAfterDiscount == amount ? amount : amountAfterDiscount;
    if (paymentOption == "Cash") {
      setCashAmount(DiscountedAmount);
    } else if (paymentOption == "UPI") {
      setUpiAmount(DiscountedAmount);
    } else if (paymentOption == "Card") {
      setCardAmount(DiscountedAmount);
    }

    if (field === "discount") {
      setDiscountToggle(!discountToggle);
      if (!discountToggle) {
        console.log("Called Here----12>");
        setCouponToggle(false);
        setReferredByToggle(false);
        setCouponCode("");
        setSelectedOption("");
        setamountAfterDiscount("");
        setDiscountCodeDiscount("");
        setCouponDiscout("");
        setSettledBy(0);
        // if (paymentOption == "Cash") {
        //   setCashAmount(DiscountedAmount);
        // } else if (paymentOption == "UPI") {
        //   setCardAmount(DiscountedAmount);
        // } else if (paymentOption == "Card") {
        //   setUpiAmount(DiscountedAmount);
        // }

        //newww code
      } else if (discountToggle) {
        console.log("Called Here----11>");
        console.log("inside discountToggle");
        setamountAfterDiscount("");
        setCouponDiscout("");
        setDiscountCodeDiscount("");
        setCouponCode("");
        setSettledBy(0);
        // if (paymentOption == "Cash") {
        //   setCashAmount(DiscountedAmount);
        // } else if (paymentOption == "UPI") {
        //   setCardAmount(DiscountedAmount);
        // } else if (paymentOption == "Card") {
        //   setUpiAmount(DiscountedAmount);
        // }

        if (paymentOption == "Cash") {
          setCashAmount(amount);
        } else if (paymentOption == "UPI") {
          setUpiAmount(amount);
        } else if (paymentOption == "Card") {
          setCardAmount(amount);
        }
      }
    } else if(field === "discountCode") {
        setDiscountCodeToggle(!discountCodeToggle);
        if (!discountCodeToggle) {
          console.log("Called Here----12>");
          setCouponToggle(false);
          setReferredByToggle(false);
          setDiscountToggle(false);
          setCouponCode("");
          setSelectedOption("");
          setamountAfterDiscount("");
          setCouponDiscout("");
          setSettledBy(0);
          // if (paymentOption == "Cash") {
          //   setCashAmount(DiscountedAmount);
          // } else if (paymentOption == "UPI") {
          //   setCardAmount(DiscountedAmount);
          // } else if (paymentOption == "Card") {
          //   setUpiAmount(DiscountedAmount);
          // }
  
          //newww code
        } else if (discountCodeToggle) {
          console.log("Called Here----11>");
          console.log("inside discountCodeToggle");
          setamountAfterDiscount("");
          setSelectedOption("");
          setCouponDiscout("");
          setCouponCode("");
          setSettledBy(0);
          // if (paymentOption == "Cash") {
          //   setCashAmount(DiscountedAmount);
          // } else if (paymentOption == "UPI") {
          //   setCardAmount(DiscountedAmount);
          // } else if (paymentOption == "Card") {
          //   setUpiAmount(DiscountedAmount);
          // }
  
          if (paymentOption == "Cash") {
            setCashAmount(amount);
          } else if (paymentOption == "UPI") {
            setUpiAmount(amount);
          } else if (paymentOption == "Card") {
            setCardAmount(amount);
          }
        }
      
    } else if (field === "coupon") {
      console.log("couponToggle>>", couponToggle);
      setCouponToggle(!couponToggle);
      if (!couponToggle) {
        setDiscountToggle(false);
        setReferredByToggle(false);
        setDiscountCodeToggle(false);
        setCouponCode("");
        setSelectedOption("");
        setamountAfterDiscount("");
        setSettledBy(0);
        // if (paymentOption == "Cash") {
        //   setCashAmount(amount);
        // } else if (paymentOption == "UPI") {
        //   setCardAmount(amount);
        // } else if (paymentOption == "Card") {
        //   setUpiAmount(amount);
        // }
      } else if (couponToggle) {
        setCouponDiscout("");
        setSettledBy(0);
        if (paymentOption == "Cash") {
          setCashAmount(DiscountedAmount);
        } else if (paymentOption == "UPI") {
          setUpiAmount(DiscountedAmount);
        } else if (paymentOption == "Card") {
          setCardAmount(DiscountedAmount);
        }
      }
    } else if (field === "referredBy") {
      setSettledBy(1);
      setReferredByToggle(!referredByToggle);
      if (!referredByToggle) {
        setDiscountToggle(false);
        setCouponToggle(false);
        setDiscountCodeToggle(false);
        setCouponCode("");
        setCouponDiscout("");
        setSettledBy(1);
        // if (paymentOption == "Cash") {
        //   setCashAmount(amount);
        // } else if (paymentOption == "UPI") {
        //   setCardAmount(amount);
        // } else if (paymentOption == "Card") {
        //   setUpiAmount(amount);
        // }
      } else if (referredByToggle) {
        setSelectedOption("");
        setCouponDiscout("");
        setamountAfterDiscount("");
        setSettledBy(0);
        // if (paymentOption == "Cash") {
        //   setCashAmount(DiscountedAmount);
        // } else if (paymentOption == "UPI") {
        //   setCardAmount(DiscountedAmount);
        // } else if (paymentOption == "Card") {
        //   setUpiAmount(DiscountedAmount);
        // }
      }
    }
  };

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
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [partCash, setPartCash] = useState("");
  const [partCard, setPartCard] = useState("");
  const [upiId, setUpiId] = useState("");

  console.log(
    "Selected city-------------------------------------------->",
    selectedCity
  );

  console.log("selectedCountry------------->", selectedCountry);

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

  const separateInitials = () => {
    console.log("couponCode---------------->", couponCode);
    if (!couponCode) {
      toast.error("Coupon code is empty.");
      return;
    }

    const initialsMatch = couponCode.match(/^[A-Za-z]+/);
    const numericMatch = couponCode.match(/\d+$/);

    if (initialsMatch && numericMatch) {
      const initials = initialsMatch[0];
      const numericPart = numericMatch[0];
      dispatch(
        getCouponsbyInitials(
          loginDetails?.logindata?.Token,
          initials,
          numericPart,
          formattedDate,
          (callback) => {
            if (callback.status) {
              console.log(
                "Coupon Details ---------->",
                callback?.response?.Details
              );

              const inputString = callback?.response?.Details?.UsedCoupons;
              const stringWithoutBrackets = inputString.slice(1, -1);
              const arrayFromString = stringWithoutBrackets.split(",");
              const isCouponUsed = arrayFromString.includes(couponCode);
              console.log("isCouponUsed-------------->", isCouponUsed);

              if (isCouponUsed) {
                toast.error("Coupon code is already used");
              } else {
                const discount =
                  (amount * callback?.response?.Details?.CouponDiscount) / 100;
                const discountedAmount = amount - discount;
                setCouponDiscout(discountedAmount);

                if (paymentOption == "Cash") {
                  setCashAmount(discountedAmount);
                } else if (paymentOption == "UPI") {
                  setUpiAmount(discountedAmount);
                } else if (paymentOption == "Card") {
                  setCardAmount(discountedAmount);
                }

                setDiscountFigure(callback?.response?.Details?.CouponDiscount);
                console.log(
                  "remaing------------------->length------------->",
                  callback?.response?.Details?.UsedCoupons
                );

                const usedCouponsArray =
                  callback?.response?.Details?.UsedCoupons?.substring(
                    1,
                    callback?.response?.Details?.UsedCoupons?.length - 1
                  ).split(",");
                // Remove double quotes from each element of the array
                const sanitizedUsedCouponsArray = usedCouponsArray.map(
                  (coupon) => coupon.replace(/"/g, "")
                );
                // let usedCoupons = callback?.response?.Details?.UsedCoupons.replace(/^"(.*)"$/, '$1');
                // console.log('jhumka-->',usedCoupons.length);
                // console.log('parsinggg>>',JSON.parse(callback?.response?.Details?.UsedCoupons));
                console.log(
                  "Used Coupon length-->",
                  callback?.response?.Details?.UsedCoupons?.length
                );
                if (
                  sanitizedUsedCouponsArray?.length === 1 &&
                  sanitizedUsedCouponsArray[0] === ""
                ) {
                  setRemainingCoupons(
                    callback?.response?.Details?.TotalCoupons - 1
                  );
                } else {
                  setRemainingCoupons(
                    callback?.response?.Details?.TotalCoupons -
                      sanitizedUsedCouponsArray?.length -
                      1
                  );
                }
                // console.log('Check remaining======>',callback?.response?.Details?.TotalCoupons - JSON.parse(callback?.response?.Details?.UsedCoupons)?.length);
                // setRemainingCoupons(
                //   callback?.response?.Details?.TotalCoupons -
                //     callback?.response?.Details?.UsedCoupons?.length
                // );
                setCouponId(callback?.response?.Details?.Id);
                setUsedCouponArr(
                  callback?.response?.Details?.UsedCoupons.slice(1, -1).split(
                    ","
                  )
                );
                toast.success("Coupon code is available");
              }
            } else {
              toast.error("This Coupon does not exists");
            }
          }
        )
      );
    } else {
      toast.error("Coupon code format is invalid.");
    }
  };

  const handleDiscountCode = () => {
    if (!discountCode) {
      toast.error("Discount code is empty.");
      return;
    }

    dispatch(getDiscountsUsingDiscountCode(
      loginDetails?.logindata?.Token,
      discountCode,
      (callback) => {
        if (callback.status) {
        console.log(
          "Discount Code Details ---------->",
          callback?.response?.Details
        );
        const discount =
                  (amount * callback?.response?.Details?.DiscountPercent) / 100;
                const discountedAmount = amount - discount;
                setDiscountCodeDiscount(discountedAmount);

                if (paymentOption == "Cash") {
                  setCashAmount(discountedAmount);
                } else if (paymentOption == "UPI") {
                  setUpiAmount(discountedAmount);
                } else if (paymentOption == "Card") {
                  setCardAmount(discountedAmount);
                }

                dispatch(
                  getUserById(callback?.response?.Details?.UserId, (callback) => {
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

                

                setDiscountFigure(callback?.response?.Details?.DiscountPercent);
                setDiscountpercent(callback?.response?.Details?.DiscountPercent);

                toast.success("Discount code is Applied");
              } else {
                toast.error("Discount code is invalid.");
              }
      }));
      
  }

  console.log(
    "discountFigure_____________________(((((((((((((((((((((((((({{{{{{{{{{{{{{{}}}}}}}}}}}}}}}______________________------------>>>>>>>>>>>>>",
    discountFigure
  );

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue == "") {
      setamountAfterDiscount("");
    } else {
      console.log("Discount valueeeeeeeeeee", e.target.value);

      const selectedPanelDiscount = panelDiscounts.find(
        (item) => item.Id == selectedValue
      );

      console.log(
        "selectedPanelDiscount-----------------------********************************8-------------->",
        selectedPanelDiscount?.PanelDiscount
      );
      setDiscountFigure(selectedPanelDiscount?.PanelDiscount);

      setSelectedOption(e.target.value);
      const discount = (amount * selectedPanelDiscount?.PanelDiscount) / 100;
      const discountedAmount = amount - discount;
      setamountAfterDiscount(discountedAmount);

      const DiscountedAmount =
        amount - discountedAmount == amount ? amount : discountedAmount;
      if (paymentOption == "Cash") {
        setCashAmount(DiscountedAmount);
        setUpiAmount("");
        setCardAmount("");
      } else if (paymentOption == "UPI") {
        setUpiAmount(DiscountedAmount);
        setCashAmount("");
        setCardAmount("");
      } else if (paymentOption == "Card") {
        setCardAmount(DiscountedAmount);
        setCashAmount("");
        setUpiAmount("");
      } else if (paymentOption == "Part Card / Part Cash") {
        setCardAmount("");
        setCashAmount("");
      } else if (paymentOption == "Part Card / Part UPI") {
        setCardAmount("");
        setUpiAmount("");
      } else if (paymentOption == "Part Cash / Part UPI") {
        setCashAmount("");
        setUpiAmount("");
      }
    }
  };

  console.log("usedCouponArr-------------->", usedCouponArr);

  console.log(
    "activeDateOfOutlet?.OutletDate-------------->",
    activeDateOfOutlet?.OutletDate
  );

  // const handlePaymentOption = () => {
  //   console.log("paymentOption--->", paymentOption);
  //   if (paymentOption == "Cash") {
  //     setCashAmount(
  //       amount - amountAfterDiscount == 0 ? amount : amountAfterDiscount
  //     );
  //   } else if (paymentOption == "UPI") {
  //     setCardAmount(
  //       amount - amountAfterDiscount == 0 ? amount : amountAfterDiscount
  //     );
  //   } else if (paymentOption == "Card") {
  //     setUpiAmount(
  //       amount - amountAfterDiscount == 0 ? amount : amountAfterDiscount
  //     );
  //   }
  // };

  console.log("selectedCountry?.name", selectedCountry?.name);

  const handleShow = () => {
    // setShow(true)
    console.log("okuuuuu", gstNumber?.length);

    if (guestName == "" || phone === "" || address == "") {
      toast.warning("Please fill all the fields");
      setLoader(false);
      handleClose();
    } else if (paymentOption == "") {
      toast.warning("Please select the payment option");
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
    } else if (
      paymentOption === "Card" &&
      (!cardType  ||
      !cardNumber ||
      !cardHoldersName ||
      !cardAmount)
    ) {
      toast.warning("Please enter all card details");
      setLoader(false);
      handleClose();
    } else if (paymentOption == "UPI" && upiAmount == "") {
      toast.warning("Please enter upi details");
      setLoader(false);
      handleClose();
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
      handleClose();
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
      handleClose();
    } else if (
      paymentOption == "Part Cash / Part UPI" &&
      cashAmount == "" &&
      upiAmount == ""
    ) {
      toast.warning("Please enter all the details");
      setLoader(false);
      handleClose();
    } else if (paymentOption == "Cash" && cashAmount == "") {
      toast.warning("Please enter the cash amount");
      setLoader(false);
      handleClose();
    } else {
      setShow(true);
    }
  };

  const onsubmit = () => {
    const discountFigureToUse = (discountToggle || discountCodeToggle) ? discountFigure : 0;
    const selectedOptionToUse = discountToggle ? selectedOption : null;

    setLoader(true);

    console.log("amountAfterDiscount--->", amountAfterDiscount);

    const teenpackageIdArray = [];

    teenpackageIdArray.push(teenpackageId);
    console.log("onsubmit>>>shiftDetails>>", shiftDetails);
    const data = {
      guestName: guestName,
      address: address,
      phone: phone,
      email: email,
      dob: dateofbirth,
      country: selectedCountry?.name,
      state: selectedState?.name,
      city: selectedCity,
      GSTNumber: gstNumber,
      governmentId: governmentId,
      totalGuestCount: totalGuestCount,
      numOfTeens: numberofteens,
      teensPrice: totalteensPrice,
      teensRate: totalTeensRate,
      teensTax: teenstaxPercentage,
      teensTaxName: teensTaxName,
      bookingDate: activeDateOfOutlet?.OutletDate,
      futureDate: activeDateOfOutlet?.OutletDate,
      discount: discountFigureToUse,
      panelDiscountId: selectedOptionToUse,
      couponId: couponId,
      referredBy: referredBy,
      // settledByCompany: 0,
      settledByCompany:
        settledBy == 1 || paymentOption == "Company Settlement" ? 1 : 0,
      agentPanelDiscount: Discountpercent != "" ? Discountpercent : 0,
      packageId:
        packageIds.length == 0
          ? JSON.stringify(teenpackageIdArray)
          : JSON.stringify(packageIds),
      packageGuestCount: JSON.stringify(packageGuestCount),
      userId: loginDetails?.logindata?.userId,
      userTypeId: loginDetails?.logindata?.UserType,
      localAgentId:
        localAgentId != null || localAgentId != undefined ? localAgentId : 0,
      travelAgentName: Discountpercent
        ? localAgentDetails?.Name || TravelDetails?.Name
        : "",
      travelAgentId:
        TravelDetails?.Name != undefined || TravelDetails?.Name != null
          ? TravelAgentId
          : 0,
      // shiftId:
      //   shiftDetails?.ShiftTypeId === 1 && shiftDetails?.ShiftOpen === 1
      //     ? 1
      //     : shiftDetails?.ShiftTypeId === 2 && shiftDetails?.ShiftOpen === 1
      //     ? 2
      //     : shiftDetails?.ShiftTypeId === 3 && shiftDetails?.ShiftOpen === 1
      //     ? 3
      //     : 0,
      shiftId:
        shifts && shifts[1] && shifts[1][0]?.ShiftOpen === 1
          ? 1
          : shifts && shifts[2] && shifts[2][0]?.ShiftOpen === 1
          ? 2
          : shifts && shifts[3] && shifts[3][0]?.ShiftOpen === 1
          ? 3
          : 0,
      actualAmount: amount,
      paymentMode: paymentOption,
      cardAmount: cardAmount,
      // amountAfterDiscount: Discountpercent
      //   ? amount - (amount * Discountpercent) / 100
      //   : amountAfterDiscount !== 0
      //   ? amountAfterDiscount
      //   : couponDiscount !== ""
      //   ? couponDiscount
      //   : amount,
      amountAfterDiscount:
        Discountpercent != "" && Discountpercent != null
          ? amount - (amount * Discountpercent) / 100
          : amountAfterDiscount != 0
          ? amountAfterDiscount
          : couponDiscount != ""
          ? couponDiscount
          : amount,
      // amountAfterDiscount: Discountpercent != ""
      // ? amount - (amount * Discountpercent) / 100
      // : amountAfterDiscount != 0
      // ? amountAfterDiscount
      // : couponDiscount != ""
      // ? couponDiscount
      // : amount,
      packageName:
        packageIds.length == 0
          ? JSON.stringify(teensPackageName)
          : JSON.stringify(packageName),
      isActive: 1,
      partCash: partCash,
      partCard: partCard,
      isBookingWebsite: 0,
      packageWeekdayPrice:
        packageIds.length == 0
          ? JSON.stringify(teensWeekdayPrice)
          : JSON.stringify(packageWeekdaysPrice),
      packageWeekendPrice:
        packageIds.length == 0
          ? JSON.stringify(teensWeekendPrice)
          : JSON.stringify(packageWeekendPrice),

      cashAmount: cashAmount,
      cardAmount: cardAmount,
      UPIAmount: upiAmount,
      cardHoldersName: cardHoldersName,
      cardNumber: cardNumber,
      cardType: cardType,
      localAgentName: localAgentDetails?.Name,
      UPIId: upiId,
    };
    console.log("Data from booking------->", data);

    dispatch(
      AddBookingFn(loginDetails?.logindata?.Token, data, (callback) => {
        if (callback.status) {
          console.log(
            "booking details --------------?",
            callback?.response?.Details
          );

          setBookingData(callback?.response?.Details);

          toast.success("Booking details success");

          if (couponToggle && couponDiscount != "") {
            couponCodeAppend();
          }

          const data = {
            bookingId: callback?.response?.Details?.Id,
            packageId: callback?.response?.Details?.PackageId,
            packageGuestCount: callback?.response?.Details?.PackageGuestCount,
            totalGuestCount: callback?.response?.Details?.TotalGuestCount,
            // bookingDate: callback?.response?.Details?.CreatedOn?.slice(0, 10),
            bookingDate:
              callback?.response?.Details?.BookingDate != null
                ? moment(callback?.response?.Details?.BookingDate).format(
                    "YYYY-MM-DD"
                  )
                : moment(callback?.response?.Details?.FutureDate).format(
                    "YYYY-MM-DD"
                  ),
            billingDate: activeDateOfOutlet?.OutletDate,
            teensCount: callback?.response?.Details?.NumOfTeens,
            actualAmount: callback?.response?.Details?.ActualAmount,
            amountAfterDiscount:
              callback?.response?.Details?.AmountAfterDiscount,
            discount: callback?.response?.Details?.PanelDiscount
              ? callback?.response?.Details?.PanelDiscount
              : callback?.response?.Details?.CouponDiscount
              ? callback?.response?.Details?.CouponDiscount
              : Discountpercent,
            packageWeekdayPrice:
              callback?.response?.Details?.PackageWeekdayPrice,
            packageWeekendPrice:
              callback?.response?.Details?.PackageWeekendPrice,
          };

          console.log("data------------>", data);

          /// settlement if Discountpercent
          if (Discountpercent) {
            console.log("Inside if Discountpercent--->");
            let perc = localAgentId
              ? localAgentDetails?.DiscountPercent
              : TravelAgentId
              ? TravelDetails?.DiscountPercent
              : 0;

            const AgentSettlemetDiscount = perc - Discountpercent;

            console.log(
              "AgentSettlemetDiscount-------->",
              AgentSettlemetDiscount
            );

            const calculateAmountAfterDiscount =
              data?.actualAmount * (1 - AgentSettlemetDiscount / 100);

            console.log(
              "calculateAmountAfterDiscount",
              calculateAmountAfterDiscount
            );

            // const AgentSettlementAmount =
            //   (calculateAmountAfterDiscount * AgentSettlemetDiscount) /
            //   100;

            const AgentSettlementAmount =
              (AgentSettlemetDiscount / 100) * data?.amountAfterDiscount;
            const agentData = {
              userId: localAgentDetails?.Id || TravelDetails?.Id || loginDetails?.logindata?.userId,
              agentName: localAgentDetails?.Name || TravelDetails?.Name || validateDetails?.Details?.Name,
              userTypeId:
                localAgentDetails?.UserType || TravelDetails?.UserType || loginDetails?.logindata?.UserType,
              settlementAmount: AgentSettlementAmount,
              bookingDate:
                callback?.response?.Details?.BookingDate != null
                  ? moment(callback?.response?.Details?.BookingDate).format(
                      "YYYY-MM-DD"
                    )
                  : moment(callback?.response?.Details?.FutureDate).format(
                      "YYYY-MM-DD"
                    ),
              bookingId: callback?.response?.Details?.Id,
            };
            dispatch(
              AddupdateAgentSettlement(
                agentData,
                loginDetails?.logindata?.Token,
                (callback2) => {
                  if (callback2?.status) {
                    dispatch(
                      AddBillingDetails(
                        loginDetails?.logindata?.Token,
                        data,
                        (callback5) => {
                          if (callback5.status) {
                            console.log(
                              "Generate Bill --------------?",
                              callback5?.response?.Details[0]?.NumOfTeens,
                              callback5?.response?.Details
                            );

                            if (localAgentId) {
                              const agentDetails = {
                                userId: localAgentDetails?.Id,
                                userType: localAgentDetails?.UserType,
                                localAgentName: localAgentDetails?.Name,
                              };
                              dispatch(
                                countDriverBookings(
                                  agentDetails,

                                  (callback) => {
                                    if (callback.status) {
                                      console.log(
                                        "Callback count local agent bookings---->",
                                        callback?.response?.Details
                                      );
                                    } else {
                                      toast.error(callback.error);
                                      // reject(callback);
                                    }
                                  }
                                )
                              );
                            }

                            if (
                              callback5?.response?.Details[0]?.NumOfTeens -
                                callback5?.response?.Details[0]
                                  ?.TotalGuestCount ==
                              0
                            ) {
                              navigate("/TeensBilling", {
                                state: {
                                  BookingDetails: callback5?.response?.Details,
                                },
                              });
                              setLoader(false);
                            } else {
                              navigate("/BillingDetails", {
                                state: {
                                  BookingDetails: callback5?.response?.Details,
                                },
                              });
                              setLoader(false);
                            }

                            toast.error(callback5.error);
                          } else {
                            toast.error(callback5.error);
                            setLoader(false);
                          }
                        }
                      )
                    );
                  } else {
                    toast.error(callback2.error);
                  }
                }
              )
            );
          } else {
            console.log("inside else of Discountpercent======>");
            dispatch(
              AddBillingDetails(
                loginDetails?.logindata?.Token,
                data,
                (callback) => {
                  if (callback.status) {
                    console.log(
                      "Generate Bill --------------?",
                      callback?.response?.Details[0]?.NumOfTeens,
                      callback?.response?.Details
                    );

                    if (localAgentId) {
                      const agentDetails = {
                        userId: localAgentDetails?.Id,
                        userType: localAgentDetails?.UserType,
                        localAgentName: localAgentDetails?.Name,
                      };
                      dispatch(
                        countDriverBookings(
                          agentDetails,

                          (callback) => {
                            if (callback.status) {
                              console.log(
                                "Callback count local agent bookings---->",
                                callback?.response?.Details
                              );
                            } else {
                              toast.error(callback.error);
                              // reject(callback);
                            }
                          }
                        )
                      );
                    }

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
          }

          // navigate("/GenerateBill", {
          //   state: { userData: callback?.response?.Details },
          // });
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

  const [paymentOption, setPaymentOption] = useState("");

  console.log("Discount ----->", selectedOption);

  console.log("amountAfterDiscount-------->", amountAfterDiscount);

  // useEffect(() => {
  //   handlePaymentSelection();
  // }, [selectedOption]);

  const handlePaymentSelection = (event) => {
    // Update the selected option when the user makes a selection
    setPaymentOption(event.target.value);

    const DiscountedAmount = Discountpercent
      ? amount - (amount * Discountpercent) / 100
      : couponDiscount != ""
      ? couponDiscount
      : amount - amountAfterDiscount == amount
      ? amount
      : amountAfterDiscount;
    // const DiscountedAmount = Discountpercent
    // ? amount - (amount * Discountpercent) / 100
    // : amountAfterDiscount != 0
    // ? amountAfterDiscount
    // : couponDiscount != ""
    // ? couponDiscount
    // : amount;
    console.log("check==>DiscountedAmount==>", DiscountedAmount);
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

  console.log("paymentOption---------------->", paymentOption);

  console.log("Shift All details----------------->", shiftDetails?.ShiftOpen);
  console.log("Shift All details----------------->", shiftDetails?.ShiftTypeId);

  const [isOutletOpen, setIsOutletOpen] = useState(true); // Initialize button state

  const getShiftStatusMessage = () => {
    if (shiftDetails?.ShiftOpen === 1) {
      switch (shiftDetails?.ShiftTypeId) {
        case 1:
          return "Shift 1 is open";
        case 2:
          return "Shift 2 is open";
        case 3:
          return "Shift 3 is open";
        default:
          return "Unknown shift is open";
      }
    } else if (shiftDetails?.ShiftOpen === 0) {
      switch (shiftDetails?.ShiftTypeId) {
        case 1:
          return (
            <div>
              Shift 1 is closed.
              <br />
              <p style={{ fontSize: "15px", color: "red" }}>
                Open next shift to create a new booking
              </p>
            </div>
          );
        case 2:
          return (
            <div>
              Shift 2 is closed.
              <br />
              <p style={{ fontSize: "15px", color: "red" }}>
                Open next shift to create a new booking
              </p>
            </div>
          );
        case 3:
          return <div>Shift 3 is closed.</div>;
        default:
          return "Unknown shift is closed";
      }
    } else {
      return (
        <div>
          <p style={{ fontSize: "15px", color: "red" }}>
            Open the outlet & Shift to create a new booking
          </p>
        </div>
      );
    }
  };

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

  const [inputValue, setInputValue] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const [secretInput, setSecretInput] = useState("");
  const [buttonColor, setButtonColor] = useState("red");

  // const handleRedButtonClick = () => {
  //   setButtonColor("green");
  //   const input = scannerRef.current.value;
  //   window.open(input, "_blank");
  // };

  // const [scannedData, setScannedData] = useState("");
  // const inputRef = useRef(null);
  // const [scannerLoader, setScannerLoader] = useState(false);

  // useEffect(() => {
  //   const openTabTimer = setTimeout(() => {
  //     setScannerLoader(true);
  //     if (scannedData) {
  //       window.open(scannedData, "_blank");
  //       setScannerLoader(false);
  //     }
  //   }, 2000);

  //   return () => {
  //     clearTimeout(openTabTimer);
  //     setScannerLoader(false);
  //   };
  // }, [scannedData]);

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

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

  const handlePartCard = (e) => {
    const DiscountedAmount = Discountpercent
      ? amount - (amount * Discountpercent) / 100
      : couponDiscount != ""
      ? couponDiscount
      : amount - amountAfterDiscount == amount
      ? amount
      : amountAfterDiscount;

    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
    }

    // if (inputValue > parseFloat(finalAmountofPackage)) {
    if (inputValue > parseFloat(DiscountedAmount)) {
      //checking if the discount that is added is more than the discount percent of the agent
      // inputValue = finalAmountofPackage;
      inputValue = DiscountedAmount;
    }

    if (paymentOption === "Part Card / Part Cash") {
      // setCashAmount(parseFloat(finalAmountofPackage) - inputValue);
      setCashAmount(parseFloat(DiscountedAmount) - inputValue);
      setUpiAmount("");
    }

    if (paymentOption === "Part Card / Part UPI") {
      // setUpiAmount(parseFloat(finalAmountofPackage) - inputValue);
      setUpiAmount(parseFloat(DiscountedAmount) - inputValue);
      setCashAmount("");
    }

    setCardAmount(inputValue);
  };

  const handlePartCash = (e) => {
    const DiscountedAmount = Discountpercent
      ? amount - (amount * Discountpercent) / 100
      : couponDiscount != ""
      ? couponDiscount
      : amount - amountAfterDiscount == amount
      ? amount
      : amountAfterDiscount;
    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
      // } else if (inputValue > parseFloat(finalAmountofPackage)) {
    } else if (inputValue > parseFloat(DiscountedAmount)) {
      //checking if the discount that is added is more than the discount percent of the agent
      // inputValue = finalAmountofPackage;
      inputValue = DiscountedAmount;
    }

    if (paymentOption === "Part Card / Part Cash") {
      // setCardAmount(parseFloat(finalAmountofPackage) - inputValue);
      setCardAmount(parseFloat(DiscountedAmount) - inputValue);
      setUpiAmount("");
    }

    if (paymentOption === "Part Cash / Part UPI") {
      // setUpiAmount(parseFloat(finalAmountofPackage) - inputValue);
      setUpiAmount(parseFloat(DiscountedAmount) - inputValue);
      setCardAmount("");
    }

    setCashAmount(inputValue);
  };

  const handlePartUPI = (e) => {
    const DiscountedAmount = Discountpercent
      ? amount - (amount * Discountpercent) / 100
      : couponDiscount != ""
      ? couponDiscount
      : amount - amountAfterDiscount == amount
      ? amount
      : amountAfterDiscount;
    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
      // } else if (inputValue > parseFloat(finalAmountofPackage)) {
    } else if (inputValue > parseFloat(DiscountedAmount)) {
      //checking if the discount that is added is more than the discount percent of the agent
      // inputValue = finalAmountofPackage;
      inputValue = DiscountedAmount;
    }

    if (paymentOption === "Part Card / Part UPI") {
      // setCardAmount(parseFloat(finalAmountofPackage) - inputValue);
      setCardAmount(parseFloat(DiscountedAmount) - inputValue);
      setCashAmount("");
    }

    if (paymentOption === "Part Cash / Part UPI") {
      // setCashAmount(parseFloat(finalAmountofPackage) - inputValue);
      setCashAmount(parseFloat(DiscountedAmount) - inputValue);
      setCardAmount("");
    }

    setUpiAmount(inputValue);
  };

  // const handlePartCard = (e) => {
  //   let inputValue = parseFloat(e.target.value);

  //   if (isNaN(inputValue) || inputValue < 0) {
  //     inputValue = "";
  //   } else if (inputValue > finalAmountofPackage) {
  //     //checking if the discount that is added is more than the discount percent of the agent
  //     inputValue =finalAmountofPackage;
  //   }

  //   setCardAmount(inputValue);
  // };
  // const handlePartCash= (e) => {
  //   let inputValue = parseFloat(e.target.value);

  //   if (isNaN(inputValue) || inputValue < 0) {
  //     inputValue = "";
  //   } else if (inputValue > finalAmountofPackage) {
  //     //checking if the discount that is added is more than the discount percent of the agent
  //     inputValue =finalAmountofPackage;
  //   }
  //   console.log('okkkk',inputValue);
  //   setCashAmount(inputValue);
  // };
  // const handlePartUPI= (e) => {
  //   let inputValue = parseFloat(e.target.value);

  //   if (isNaN(inputValue) || inputValue < 0) {
  //     inputValue = "";
  //   } else if (inputValue > finalAmountofPackage) {
  //     //checking if the discount that is added is more than the discount percent of the agent
  //     inputValue =finalAmountofPackage;
  //   }
  //   setUpiAmount(inputValue);
  // };

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
        <div className="container-fluid vh-20 d-flex justify-content-end align-items-center">
          <button
            className="col-lg-3 col-md-6 col-sm-8 text-right"
            onClick={shiftPageFn}
          >
            <div className="card p-4">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="card-title">Go to Shifts</h6>
                <img
                  src={logo}
                  alt="Right Arrow"
                  style={{
                    height: "40px",
                    width: "40px",

                    marginBottom: "15px",
                  }}
                  className="ml-auto"
                />
              </div>
              {/* <p className="card_title_shifts">{getShiftStatusMessage()}</p> */}
              <p className="card_title_shifts">{handleOpenShift()}</p>
            </div>
          </button>
        </div>

        {/* <h3 className="mb-4">Create Booking</h3> */}

        <div className="container-fluid vh-5 d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-8 text-center">
            <div className="card p-4">
              <h3>Create Booking</h3>
            </div>
          </div>
          <ToastContainer />
        </div>
        <PackagesPage
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
          {/* <input
            class="form-control mt-2"
            type="number"
            placeholder="Enter phone"
            onChange={(e) => setPhone(e.target.value)}
      
          /> */}

          <PhoneInput
            className="form-control mt-2 "
            placeholder="Enter phone number"
            onChange={onPhoneNumberChange}
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
          {/* <Select
      
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
          /> */}

          <Select
            options={Country.getAllCountries().map((country) => ({
              label: country.name,
              name: country.name,
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
        {/* <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Refrrred by
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder=" Refrrred by"
            onChange={(e) => settoalGuestCount(e.target.value)}
          />
        </div> */}

        {/* date of birth */}
        {/* <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Date of birth
          </label>
          <input
            class="form-control mt-2"
            type="date"
            placeholder="Enter Start Date"
            onChange={(e) => setDateofbirth(e.target.value)}
            onFocus={handleFocus}
          />
        </div> */}

        {/* <div className="col-lg-6 mt-3">
          <label htmlFor="formGroupExampleInput" className="form_text">
            Date of birth
          </label>
          <input
            className="form-control mt-2"
            type="date"
            placeholder="Enter Start Date"
            value={dateofbirth}
            onChange={(e) => setDateofbirth(e.target.value)}
          />
        </div> */}

        {localAgentDetails ? (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Local Agent Details
            </label>
            <input
              class="form-control mt-2"
              type="text"
              placeholder="Enter Start Date"
              value={localAgentDetails?.Name}
              disabled={true}
            />
          </div>
        ) : (
          <></>
        )}

        {TravelDetails ? (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Travel Agent Details
            </label>
            <input
              class="form-control mt-2"
              type="text"
              placeholder="Enter Start Date"
              value={TravelDetails?.Name}
              disabled={true}
            />
          </div>
        ) : (
          <></>
        )}
        {Discountpercent ? (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Agent Discount Percent
            </label>
            <input
              class="form-control mt-2"
              type="text"
              placeholder="Enter Start Date"
              value={Discountpercent}
              disabled={true}
            />
          </div>
        ) : (
          <></>
        )}

        <div className="row mt-3">
          {!Discountpercent && (
            <div className="col-lg-6 mt-3">
              <div className="row">
                <div className="col-3">
                  <label for="formGroupExampleInput " className="form_text">
                    Discount
                  </label>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="discountSwitch"
                      checked={discountToggle}
                      onChange={() => handleToggle("discount")}
                    />
                  </div>
                </div>

                {
                showDiscountCodeField && <div className="col-3">
                  <label for="formGroupExampleInput " className="form_text">
                    Agent Reference
                  </label>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="discountSwitch"
                      checked={discountCodeToggle}
                      onChange={() => handleToggle("discountCode")}
                    />
                  </div>
                </div>
}

                <div className="col-3">
                  <label for="formGroupExampleInput " className="form_text">
                    Coupon
                  </label>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="couponSwitch"
                      checked={couponToggle}
                      onChange={() => handleToggle("coupon")}
                    />
                  </div>
                </div>

                <div className="col-3">
                  <label for="formGroupExampleInput " className="form_text">
                    Settled by company
                  </label>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="referredBySwitch"
                      checked={referredByToggle}
                      onChange={() => handleToggle("referredBy")}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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

          <div className="row">
            {couponToggle ? (
              <div className="col-lg-6 mt-3">
                <div className="input-group">
                  <input
                    className="form-control mt-2"
                    type="text"
                    placeholder="Coupon Code"
                    onChange={(e) => setCouponCode(e.target.value)}
                    value={couponCode}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "8px" }}
                    type="button"
                    onClick={separateInitials}
                  >
                    Check
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="row">
            {discountCodeToggle ? (
              <div className="col-lg-6 mt-3">
                <div className="input-group">
                  <input
                    className="form-control mt-2"
                    type="text"
                    placeholder="Discount Code"
                    onChange={(e) => setDiscountCode(e.target.value)}
                    value={discountCode}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "8px" }}
                    type="button"
                    onClick={handleDiscountCode}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          {discountToggle || referredByToggle ? (
            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput mt-3" className="form_text">
                Discount
              </label>
              <select
                className="form-select form-control mt-2"
                value={selectedOption}
                onChange={handleSelectChange}
              >
                <option value="">Select an option</option>
                {panelDiscounts &&
                  panelDiscounts.map((item, index) => (
                    <option key={index} value={item?.Id}>
                      {item?.PanelDiscount}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <></>
          )}

          {referredByToggle || discountToggle ? (
            <div className="col-lg-6 mt-3">
              <label for="formGroupExampleInput " className="form_text">
                Referred By <span style={{ color: "red" }}>*</span>
              </label>
              <input
                class="form-control mt-2"
                type="text"
                placeholder="Referred By"
                onChange={(e) => setreferredBy(e.target.value)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="col-lg-6 mt-3">
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
            <option value="Part Card / Part Cash">Part Card / Part Cash</option>
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
                // onChange={(e) => setCardAmount(e.target.value)}
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
                // onChange={(e) => setUpiAmount(e.target.value)}
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
                Part Online(UPI) Amount <span style={{ color: "red" }}>*</span>
              </label>
              <input
                class="form-control mt-2"
                type="number"
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
                type="number"
                placeholder="Enter the amount"
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
                type="number"
                placeholder="Enter the amount"
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
            // (shifts &&
            //   shifts[2] &&
            //   shifts[2][0]?.ShiftOpen === 0 &&
            //   !shifts[3]) ||
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
              <p className="outletTitle">Confirm Booking </p>
              <p className="outletTex">
                Are you sure you want to confirm the booking ?
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

export default NewBooking;
