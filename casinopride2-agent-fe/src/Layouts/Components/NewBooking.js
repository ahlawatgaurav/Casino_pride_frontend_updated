import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getCouponsbyInitials,
  getPanelDiscounts,
  EditUsedCoupon,
  getUserByPhone,
  checkActiveOutlet,
} from "../../Redux/actions/users";
import { AddBookingFn, SendBookingConfirmMail } from "../../Redux/actions/booking";
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
import "../../assets/packagePage.css";
import "../../assets/Styles/style.css";
import { fetchFutureBookingDates } from "../../Redux/actions/users";
import DatePicker from "react-datepicker";
import { getWebsiteDiscounts } from "../../Redux/actions/users";
import { Oval } from "react-loader-spinner";

import "react-datepicker/dist/react-datepicker.css";
import debounce from "lodash.debounce";
const DEBOUNCE_TIME_MS = 1000;
/*..*/


const NewBooking = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getInitialFutureDate = () => {
    const currentUrl = new URL(window.location.href);
    const routedDate =
      location?.state?.futureDate ||
      location?.state?.bookingDate ||
      currentUrl.searchParams.get("futureDate") ||
      currentUrl.searchParams.get("bookingDate");

    return moment(routedDate, "YYYY-MM-DD", true).isValid()
      ? routedDate
      : new Date().toLocaleDateString("en-CA");
  };

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log("loginDetails-------------->", loginDetails);

  const outletOpenDetails = useSelector((state) => state.auth?.outeltDetails);

  // Weekday/weekend pricing must follow the BUSINESS day, not the calendar day.
  // The 3rd shift runs past midnight, so the day changes when the outlet closes
  // (~3:30 AM), not at 12 AM. Advance bookings keep the date the agent picked.
  const [outletBusinessDate, setOutletBusinessDate] = useState("");
  useEffect(() => {
    const token = loginDetails?.logindata?.Token;
    if (!token) return;
    dispatch(
      checkActiveOutlet(token, (cb) => {
        const d = cb?.status ? cb?.response?.Details?.OutletDate : null;
        if (d && moment(d).isValid()) {
          setOutletBusinessDate(moment(d).format("YYYY-MM-DD"));
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginDetails?.logindata?.Token]);

  const hasRoutedDate = (() => {
    try {
      const u = new URL(window.location.href);
      return !!(
        location?.state?.futureDate ||
        location?.state?.bookingDate ||
        u.searchParams.get("futureDate") ||
        u.searchParams.get("bookingDate")
      );
    } catch (e) {
      return false;
    }
  })();

  console.log(
    "outlet open Details-----------------|||||||||||||||||||||||||-->",
    outletOpenDetails
  );

  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const [maxAgentDiscount, setMaxAgentDiscount] = useState(0);
  // Call Centre gets per-package discounts; resolved from the logged-in user's category.
  const [isCallCenter, setIsCallCenter] = useState(false);
  const [packageDiscounts, setPackageDiscounts] = useState([]);
  const [agentDiscountPercent, setAgentDiscountPercent] = useState(
    Number(validateDetails?.Details?.DiscountPercent) || 0
  );

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const userIdValue = currentUrl.searchParams.get("UserId");
    setUserId(userIdValue);
  }, []);

  // The default Agent Discount must reflect the agent's CURRENT saved discount
  // (changed on the Discounts page). validateDetails is cached at login and goes
  // stale, so fetch the latest DiscountPercent fresh from the server on mount.
  useEffect(() => {
    const agentId = loginDetails?.logindata?.userId;
    const token = loginDetails?.logindata?.Token;
    if (!agentId) return;
    (async () => {
      try {
        const { default: api } = await import("../../Service/api");
        const res = await api.CORE_PORT.get(
          `/core/getUserById?userId=${agentId}`,
          { headers: token ? { AuthToken: token } : {} }
        );
        const d = res.data?.Details;
        if (d && d.DiscountPercent != null) {
          setAgentDiscountPercent(Number(d.DiscountPercent) || 0);
        }
      } catch (e) {}
    })();
  }, [loginDetails?.logindata?.userId, loginDetails?.logindata?.Token]);

  useEffect(() => {
    const categoryId = validateDetails?.Details?.CategoryId;
    const token = loginDetails?.logindata?.Token;
    if (!categoryId) return;

    const fetchMax = async () => {
      try {
        const { default: api } = await import("../../Service/api");
        const res = await api.CORE_PORT.get("/core/categories", {
          headers: token ? { AuthToken: token } : {},
        });
        const cats = res.data?.Details || [];
        const match = cats.find((c) => Number(c.Id) === Number(categoryId));
        if (match && match.DiscountPercent > 0) {
          setMaxAgentDiscount(Number(match.DiscountPercent));
        }
        if (match) {
          const nm = String(match.Name || match.Category || "").toLowerCase();
          setIsCallCenter(nm.includes("call cent"));
        }
      } catch (e) {}
    };

    fetchMax();
  }, [validateDetails?.Details?.CategoryId, loginDetails?.logindata?.Token]);

  console.log(
    "userId--------------------------||||||||||||||||||________------------->",
    userId
  );

  const [shiftDetails, setShiftDetails] = useState("");

  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");

  const [totalGuestCount, settoalGuestCount] = useState("");
  const [futureDate, setFutureDate] = useState(getInitialFutureDate);
  const [numberofteens, setNumberofteens] = useState("");
  const [hasKids, setHasKids] = useState(0);
  const [numOfKids, setNumOfKids] = useState(0);
  const [settlementBycompany, setSettlementbycompany] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [governmentId, setgovernmentId] = useState("");
  const [amount, setamount] = useState("");
  const [packageIds, setPackageIds] = useState([]);
  const [packageGuestCount, setPackageGuestCount] = useState([]);
  const [amountAfterDiscount, setamountAfterDiscount] = useState("");
  const [referredBy, setreferredBy] = useState("");
  const [couponId, setCouponId] = useState("");
  const [packageName, setPackageName] = useState("");

  const [discountToggle, setDiscountToggle] = useState(false);
  const [couponToggle, setCouponToggle] = useState(false);
  const [referredByToggle, setReferredByToggle] = useState(false);

  const [panelDiscounts, setPanelDiscounts] = useState("");

  const [usedCouponArr, setUsedCouponArr] = useState([]);

  const [remainingCoupons, setRemainingCoupons] = useState("");
  const [bookingData, setBookingData] = useState("");
  const [couponDiscount, setCouponDiscout] = useState("");
  const [totalteensPrice, setTotalTeensPrice] = useState("");

  const [teenpackageId, setTeenPackageId] = useState([]);

  console.log("teenpackageId------------------>", teenpackageId);

  const [totalTeensRate, setTotalTeensRate] = useState();
  const [totalTeensTax, setTotalTeensTax] = useState("");
  const [teenstaxPercentage, setTeensTaxPercentage] = useState("");
  const [teensTaxName, setTeensTaxName] = useState("");

  const [teensWeekdayPrice, setTeensWeekdayPrice] = useState("");
  const [teensWeekendPrice, setTeensWeekendPrice] = useState("");
  const [teensPackageName, setTeensPackageName] = useState("");
  const [customerCategoryId, setCustomerCategoryId] = useState(null);

  const [loader, setLoader] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUserByPhone = (phoneNumber) => {
    dispatch(
      getUserByPhone(loginDetails?.logindata?.Token, phoneNumber, (callback) => {
        if (callback.status) {
          const userData = callback?.response?.Details;
          // Only prefill the name if the looked-up customer actually has one —
          // never overwrite a typed name with null/blank.
          if (userData?.FullName) setGuestName(userData.FullName);
          setCustomerCategoryId(
            userData?.CategoryId ? Number(userData.CategoryId) : null
          );
          console.log("Callback---------get user details", callback?.response);
        }
      })
    );
  };

  const onPhoneNumberChange = useMemo(
    () =>
      debounce((phoneNumber) => {
        setPhone(phoneNumber);
        fetchUserByPhone(phoneNumber.includes("+91") ? phoneNumber.replace("+91", "") : phoneNumber);
      }, DEBOUNCE_TIME_MS),
    [fetchUserByPhone]
   );

  const [packageWeekdaysPrice, setPackageWeekdaysPrice] = useState("");
  const [packageWeekendPrice, setPackageWeekendPrice] = useState("");

  const handleToggle = (field) => {
    if (field === "discount") {
      setDiscountToggle(!discountToggle);
      if (!discountToggle) {
        setCouponToggle(false);
        setReferredByToggle(false);
        setCouponCode("");
        setSelectedOption("");
        setamountAfterDiscount("");
      } else if (discountToggle) {
        setamountAfterDiscount("");
        setCouponDiscout("");
      }
    } else if (field === "coupon") {
      setCouponToggle(!couponToggle);
      if (!couponToggle) {
        setDiscountToggle(false);
        setReferredByToggle(false);
        setCouponCode("");
        setSelectedOption("");
        setamountAfterDiscount("");
      } else if (couponToggle) {
        setCouponDiscout("");
      }
    } else if (field === "referredBy") {
      setReferredByToggle(!referredByToggle);
      if (!referredByToggle) {
        setDiscountToggle(false);
        setCouponToggle(false);
        setCouponCode("");
        setSelectedOption("");
      }
    }
  };

  console.log("couponCode--------------->", couponCode);

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
      getPanelDiscounts(loginDetails?.logindata?.Token, (callback) => {
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

  const [startDate, setStarteDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [amountAfterWebsiteDiscount, setAmountAfterWebsiteDiscount] =
    useState("");

  const fetchFutureBookingDatesFn = () => {
    dispatch(
      fetchFutureBookingDates((callback) => {
        if (callback.status) {
          console.log(
            "Future booking dates-------***************************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------->",
            callback?.response?.Details
          );
          setStarteDate(callback?.response?.Details?.StartDate);
          setEndDate(callback?.response?.Details?.EndDate);
          setBlockedDates(callback?.response?.Details?.BlockedDates || []);
        }
      })
    );
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const [websiteDicount, setWebsiteDiscount] = useState("");

  const fetchDiscountDetails = () => {
    dispatch(
      getWebsiteDiscounts((callback) => {
        if (callback.status) {
          console.log(
            "Callback---------get discountssssssssss----------******************************************8------------------->",
            callback?.response
          );
          setWebsiteDiscount(callback?.response?.Details[0]?.Discount);
        }
      })
    );
  };

  useEffect(() => {
    fetchCouponCodes();
    fetchPanelDiscounts();
    fetchFutureBookingDatesFn();
    fetchDiscountDetails();
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

              const discount =
                (amount * callback?.response?.Details?.CouponDiscount) / 100;
              const discountedAmount = amount - discount;
              setCouponDiscout(discountedAmount);

              setRemainingCoupons(
                callback?.response?.Details?.RemainingCoupons
              );
              setCouponId(callback?.response?.Details?.Id);
              setUsedCouponArr(
                callback?.response?.Details?.UsedCoupons.slice(1, -1).split(",")
              );

              const inputString = callback?.response?.Details?.UsedCoupons;
              const stringWithoutBrackets = inputString.slice(1, -1);
              const arrayFromString = stringWithoutBrackets.split(",");
              const isCouponUsed = arrayFromString.includes(couponCode);
              console.log("isCouponUsed-------------->", isCouponUsed);

              if (isCouponUsed) {
                toast.error("Coupon code is already used");
              } else {
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

  console.log("usedCouponArr-------------->", usedCouponArr);

  const onsubmit = () => {
    setLoader(true);
    console.log("Package ID ------->", [teenpackageId]);
    console.log("Package ID ------->", packageIds);
    const teenpackageIdArray = [];

    teenpackageIdArray.push(teenpackageId);
    if (!guestName || String(guestName).trim() === "" || phone === "") {
      toast.warning("Please fill all the fields");
      setLoader(false);
    } else if (futureDate == "") {
      toast.warning("Please select a date");
      setLoader(false);
    } else if (getBlockedPeriodForDate(futureDate)) {
      const blockedPeriod = getBlockedPeriodForDate(futureDate);
      toast.error(
        blockedPeriod.DateType === "sold_out"
          ? "This date is sold out. Please contact admin."
          : "This date is blacked out. Please contact admin."
      );
      setLoader(false);
    } else if (getBookingWindowMessage()) {
      toast.warning(getBookingWindowMessage());
      setLoader(false);
    } else if (
      moment(futureDate).isBefore(moment(minBookingDate), "day") ||
      moment(futureDate).isAfter(moment(formattedEndDate), "day")
    ) {
      toast.warning(
        `Please select a date between ${minBookingDate} and ${formattedEndDate}`
      );
      setLoader(false);
    } else if (hasKids == 1 && Number(numOfKids || 0) < 1) {
      toast.warning("Please enter number of kids");
      setLoader(false);
    } else {
      const agentDiscountedAmount = agentDiscountPercent > 0
        ? amount - (amount * agentDiscountPercent / 100)
        : null;

      const finalAmountAfterDiscount = isCallCenter
        ? (amountAfterDiscount !== "" && amountAfterDiscount !== null
            ? amountAfterDiscount
            : amount)
        : couponDiscount !== "" && couponDiscount !== null
          ? couponDiscount
          : agentDiscountedAmount !== null
          ? agentDiscountedAmount
          : amountAfterDiscount !== "" && amountAfterDiscount !== null
          ? amountAfterDiscount
          : amount;
      const data = {
        guestName: guestName,
        phone: phone,
        governmentId: governmentId,
        totalGuestCount: totalGuestCount,
        hasKids: hasKids,
        numOfKids: numOfKids,
        numOfTeens: 0,
        teensPrice: totalteensPrice,
        teensRate: totalTeensRate,
        teensTax: teenstaxPercentage,
        teensTaxName: teensTaxName,
        // discountId:2,
        bookingDate: futureDate,
        futureDate: futureDate,
        panelDiscountId: selectedOption,
        couponId: couponId,
        referredBy: referredBy,
        settledByCompany: 0,
        packageId:
          packageIds.length == 0
            ? JSON.stringify(teenpackageIdArray)
            : JSON.stringify(packageIds),
        packageGuestCount: JSON.stringify(packageGuestCount),
        packageDiscounts: JSON.stringify(packageDiscounts || []),
        userId: loginDetails?.logindata?.userId,
        userTypeId: loginDetails?.logindata?.UserType,
        // travelAgentName: Discountpercent
        // ? localAgentDetails?.Name || TravelDetails?.Name
        // : "",
        travelAgentId: loginDetails?.logindata?.userId,
        shiftId: 0,
        actualAmount: amount,
        paymentMode: "",
        amountAfterDiscount: finalAmountAfterDiscount,
        packageName: JSON.stringify(packageName),
        packageWeekdayPrice: JSON.stringify(packageWeekdaysPrice),
        packageWeekendPrice: JSON.stringify(packageWeekendPrice),
        isBookingWebsite: 0,
        isActive: 1,
        payAtCounter: paymentOption == 1 ? 1 : 0,
        travelAgentName:validateDetails?.Details?.Name
      };

      console.log("Data from booking ------->", data);

      dispatch(
        AddBookingFn(loginDetails?.logindata?.Token, data, (callback) => {
          if (callback.status) {
            console.log(
              "booking details --------------?",
              callback?.response?.Details
            );
            setLoader(false);
            setBookingData(callback?.response?.Details);

            toast.success("Booking details success");

            if (couponToggle) {
              couponCodeAppend();
            }
            if (paymentOption != 1) {
              const internalMailData = {
                amount, 
                packageName: JSON.stringify(packageName),
                guestCount: totalGuestCount,
                hasKids: hasKids,
                numOfKids: numOfKids,
                numOfTeens: 0,
                fullName: guestName,
                phone: phone, 
                governmentId:governmentId,
                bookingDate: new Date().toISOString().slice(0,10),
                eventDate: futureDate,
              }
              // dispatch(SendBookingConfirmMail(internalMailData));
              navigate("/GenerateBill", {
                state: { userData: callback?.response?.Details },
              });
            } else {
              navigate("/SendAck", {
                state: { userData: callback?.response?.Details },
              });
            }

            toast.error(callback.error);
          } else {
            toast.error(callback.error);
            setLoader(false);
          }
        })
      );
    }
  };

  console.log("numberofteens-------------------->", numberofteens);

  const couponCodeAppend = () => {
    const updatedCouponData = [...usedCouponArr, couponCode];
    const dataArray = Array.from(
      { length: updatedCouponData.length },
      (_, index) => updatedCouponData[index]
    );
    const stringRepresentation = "[" + dataArray.join(",") + "]";
    const couponData = {
      couponId: couponId,
      usedCoupons: stringRepresentation,
      remainingCoupons: remainingCoupons,
    };

    dispatch(
      EditUsedCoupon(couponData, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          toast.success("Coupon used updated");

          toast.error(callback.error);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const [selectedOption, setSelectedOption] = useState("");

  const [paymentOption, setPaymentOption] = useState("1");

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    console.log("Discount valueeeeeeeeeee", e.target.value);

    const selectedPanelDiscount = panelDiscounts.find(
      (item) => item.Id == selectedValue
    );

    console.log(
      "selectedPanelDiscount------------------------------------->",
      selectedPanelDiscount
    );

    setSelectedOption(e.target.value);
    const discount = (amount * selectedPanelDiscount?.PanelDiscount) / 100;
    const discountedAmount = amount - discount;
    setamountAfterDiscount(discountedAmount);
  };

  console.log("Discount ----->", selectedOption);

  console.log("amountAfterDiscount-------->", amountAfterDiscount);

  const handlePaymentSelection = (event) => {
    setPaymentOption(event.target.value);
  };

  console.log("paymentOption---------------->", paymentOption);

  console.log("Shift All details----------------->", shiftDetails?.ShiftOpen);
  console.log("Shift All details----------------->", shiftDetails?.ShiftTypeId);

  const [isOutletOpen, setIsOutletOpen] = useState(true);

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
          return "Shift 1 is closed";
        case 2:
          return "Shift 2 is closed";
        case 3:
          return "Shift 3 is closed";
        default:
          return "Unknown shift is closed";
      }
    } else {
      return "Open the outlet";
    }
  };

  const shiftPageFn = () => {
    navigate("/Shifts");
  };

  console.log("Shift type ShiftOpen---------->", shiftDetails);
  console.log("Shift type ShiftTypeId---------->", shiftDetails);

  useEffect(() => {
    // Get the current URL
    const url = new URL(window.location.href);

    // Get the TransactionId and PaymentId parameters
    const transactionId = url.searchParams.get("TransactionId");
    const paymentId = url.searchParams.get("PaymentId");

    console.log(
      "TransactionId+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++==:",
      transactionId
    );
    console.log("PaymentId:", paymentId);
  }, []);

  const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
  const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

  const tomorrowDate = moment().format("YYYY-MM-DD");
  const minBookingDate =
    formattedStartDate && formattedStartDate !== "Invalid date"
      ? moment.max(moment(formattedStartDate), moment(tomorrowDate)).format(
          "YYYY-MM-DD"
        )
      : tomorrowDate;

  const getBookingWindowMessage = () => {
    if (!formattedStartDate || !formattedEndDate) return null;
    if (
      formattedStartDate === "Invalid date" ||
      formattedEndDate === "Invalid date" ||
      moment(formattedStartDate).isAfter(moment(formattedEndDate), "day")
    ) {
      return "Booking window is not configured correctly.";
    }
    return null;
  };

  const normalizeBlockedDate = (dateValue) => {
    if (!dateValue) return "";
    return moment.utc(dateValue).utcOffset(330).format("YYYY-MM-DD");
  };

  const getBlockedPeriodForDate = (dateValue) => {
    const selectedDate = moment(dateValue, "YYYY-MM-DD", true).format(
      "YYYY-MM-DD"
    );

    if (!selectedDate || selectedDate === "Invalid date") return null;

    return (blockedDates || []).find((period) => {
      const startDate = normalizeBlockedDate(period.StartDate);
      const endDate = normalizeBlockedDate(period.EndDate);
      return selectedDate >= startDate && selectedDate <= endDate;
    });
  };

  const handleFutureDateChange = (dateValue) => {
    const blockedPeriod = getBlockedPeriodForDate(dateValue);
    if (blockedPeriod) {
      toast.error(
        blockedPeriod.DateType === "sold_out"
          ? "This date is sold out. Please contact admin."
          : "This date is blacked out. Please contact admin."
      );
      setFutureDate("");
      return;
    }

    setFutureDate(dateValue);
  };

  useEffect(() => {
    if (!futureDate || blockedDates.length === 0) return;

    const blockedPeriod = getBlockedPeriodForDate(futureDate);
    if (!blockedPeriod) return;

    toast.error(
      blockedPeriod.DateType === "sold_out"
        ? "This date is sold out. Please contact admin."
        : "This date is blacked out. Please contact admin."
    );
    setFutureDate("");
  }, [blockedDates, futureDate]);

  const [isFlashing, setIsFlashing] = useState(false);
  const discountText = `${websiteDicount}% OFF for all the users `;

  // useEffect(() => {
  //   // Start the flashing animation when the component mounts
  //   const intervalId = setInterval(() => {
  //     setIsFlashing((prevIsFlashing) => !prevIsFlashing);
  //   }, 1000);

  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);

  const cardStyle = {
    backgroundColor: isFlashing ? "#4a85f6" : "#f06a6b",
    color: "#fff",
    padding: "10px",
    // borderRadius: "5px",
    textAlign: "center",
    fontSize: "18px",
  };

  console.log("Amount-------------------------------------->", amount);

  console.log("numberofteens----------------->", numberofteens);

  return (
    console.log('packageIds?.length>>',packageIds?.length),
    console.log('numberofteens-->>',numberofteens),
    <div class="container">
      <div class="tab-panel">
        <div class="tab-content">
          <div class="tab-pane active" id="tabs-1" role="tabpanel">
            <div class="row d-flex justify-content-center">
              <ToastContainer />
              <section class="mt-5 text-center">
                <div class="container">
                  <h2 class="section-title text-capitalize">Packages</h2>
                  <p class="section-tag-line gradient-bottom-line">
                    Get extra value for money spent with the best packages ever
                    offered
                  </p>
                  <div class="row justify-content-center">
                    <div class="col-12">
                      <h5 class="mt-4">
                        We offer packages that suit every budget and
                        requirement. All packages have a minimal entry fee per
                        adult and, depending on which you choose, will have
                        food, brand liquor, live entertainment, and even
                        weather-deck access.{" "}
                      </h5>
                    </div>
                  </div>
                </div>
              </section>

              {/* <div className="mt-5 col-6">
                <div style={cardStyle}>{discountText}</div>
              </div> */}

              {/* <div>
                <ul
                  class="nav nav-tabs row justify-content-center mt-4"
                  role="tablist"
                >
                  <li className={`nav-item col-lg-6`}>
                    <p
                      class="nav-link active "
                      data-toggle="tab"
                      href="#tabs-1"
                      role="tab"
                      style={{
                        textAlign: "center",
                        backgroundColor: "#cbb883",
                        borderRadius: "0px",
                        marginBottom: "10px",
                      }}
                    >
                      Casino Pride Goa
                    </p>
                  </li>
                </ul>
              </div> */}

              <div className="row">
                <div className="col-lg-6 mx-auto">
                  <p
                    class="nav-link active "
                    data-toggle="tab"
                    href="#tabs-1"
                    role="tab"
                    style={{
                      textAlign: "center",
                      backgroundColor: "#cbb883",
                      borderRadius: "0px",
                      marginBottom: "10px",
                      marginTop: "40px",
                    }}
                  >
                    Casino Pride Goa
                  </p>
                </div>
              </div>

              <div className="container mt-5 col-lg-7">
                <div className="row">
                  <div className="col-md-6 col-lg-3">
                    <div className="image-container d-flex flex-column align-items-center">
                      <img
                        src="/assets/images/red-carpet.png"
                        alt="Image 1"
                        className="img-fluid"
                      />
                      <p className="text-center mt-2">
                        Events & Live Entertainment
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="image-container d-flex flex-column align-items-center">
                      <img
                        src="/assets/images/buffet.png"
                        alt="Image 2"
                        className="img-fluid"
                      />
                      <p className="text-center mt-2">
                        Unlimited Food & Drinks
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="image-container d-flex flex-column align-items-center">
                      <img
                        src="/assets/images/bonus.png"
                        alt="Image 3"
                        className="img-fluid"
                      />
                      <p className="text-center mt-2">Gaming Offers</p>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="image-container d-flex flex-column align-items-center">
                      <img
                        src="/assets/images/headphones.png"
                        alt="Image 4"
                        className="img-fluid"
                      />
                      <p className="text-center mt-2">
                        Full Music & Name Announcement
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="container-fluid vh-5 d-flex justify-content-center align-items-center">
                  <div className="col-lg-4 col-md-6 col-sm-8 text-center mt-4">
                    <div className="card p-4">
                      <h3>Create Booking</h3>
                      <input
                        class="form-control mt-2"
                        type="date"
                        placeholder="Enter Start Date"
                        value={futureDate}
                        min={minBookingDate}
                        max={formattedEndDate}
                        onChange={(e) => handleFutureDateChange(e.target.value)}
                      />
                    </div>
                  </div>
                  <ToastContainer />
                </div>
                <PackagesPage
                  key={futureDate || "no-date"}
                  setamount={setamount}
                  isCallCenter={isCallCenter}
                  setamountAfterDiscount={setamountAfterDiscount}
                  setPackageDiscounts={setPackageDiscounts}
                  setPackageIds={setPackageIds}
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
                  websiteDicount={websiteDicount}
                  setAmountAfterWebsiteDiscount={setAmountAfterWebsiteDiscount}
                  setPackageWeekendPrice={setPackageWeekendPrice}
                  setPackageWeekdaysPrice={setPackageWeekdaysPrice}
                  setTeensWeekdayPrice={setTeensWeekdayPrice}
                  setTeensWeekendPrice={setTeensWeekendPrice}
                  setTeensPackageName={setTeensPackageName}
                  setHasKids={setHasKids}
                  setNumOfKids={setNumOfKids}
                  futureDate={
                    hasRoutedDate ? futureDate : outletBusinessDate || futureDate
                  }
                  categoryId={
                    customerCategoryId ||
                    (validateDetails?.Details?.CategoryId
                      ? Number(validateDetails.Details.CategoryId)
                      : null)
                  }
                />
                <div className="col-lg-6 mt-3 mt-3">
                  <label for="formGroupExampleInput " className="form_text">
                    Guest Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    class="form-control mt-2 "
                    type="text"
                    value={guestName || ""}
                    placeholder="Full Name"
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
                    style={{ display: "block" }}
                    limitMaxLength
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

                <div className="col-lg-6 mt-3">
                  <label className="form_text">
                    Agent Discount <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    className="form-control mt-2"
                    type="number"
                    min="0"
                    max={maxAgentDiscount || 100}
                    placeholder="Enter discount %"
                    value={agentDiscountPercent}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (maxAgentDiscount > 0 && val > maxAgentDiscount) val = maxAgentDiscount;
                      if (val < 0) val = 0;
                      setAgentDiscountPercent(val);
                    }}
                  />
                </div>

                <div className="row mt-3">
                  {discountToggle ? (
                    <div className="col-lg-6 mt-3">
                      <label
                        for="formGroupExampleInput mt-3"
                        className="form_text"
                      >
                        Discount
                      </label>
                      <select
                        className="form-select form-control mt-2"
                        value={selectedOption}
                        onChange={handleSelectChange}
                      >
                        <option value="">Select an option</option>
                        {panelDiscounts.map((item, index) => (
                          <option key={index} value={item?.Id}>
                            {item?.PanelDiscount}
                          </option>
                        ))}
                      </select>
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

                    <option value="1"> Pay At Counter</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
                <button
                  style={{ paddingLeft: "100px", paddingRight: "100px" }}
                  type="submit"
                  className="btn btn-primary mt-5 btn-lg"
                  onClick={onsubmit}
                  // disabled={(!loader && (packageIds?.length == 0 || numberofteens == "")) ? true : false}
                  disabled = { loader ? true : packageIds?.length == 0 ? true : false }
                >
                  {!loader ? (
                    "Confirm Booking"
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBooking;
