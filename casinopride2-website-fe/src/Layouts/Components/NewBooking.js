import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getCouponsbyInitials,
  getPanelDiscounts,
  EditUsedCoupon,
} from "../../Redux/actions/users";
import {
  AddBookingFn,
  SendBookingConfirmMail,
  AddupdateAgentSettlementFordriver,
} from "../../Redux/actions/booking";
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
import { getWebsiteDiscounts, getUserById } from "../../Redux/actions/users";
import { Oval } from "react-loader-spinner";

import "react-datepicker/dist/react-datepicker.css";

const NewBooking = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log("loginDetails-------------->", loginDetails);

  const outletOpenDetails = useSelector((state) => state.auth?.outeltDetails);

  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const [userId, setUserId] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [isGstValid, setIsGstValid] = useState(true);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const userIdValue = currentUrl.searchParams.get("UserId");
    console.log("userIdValue>>", userIdValue);
    setUserId(userIdValue);

    if (userIdValue != null) {
      dispatch(
        getUserById(userIdValue, (callback) => {
          console.log("hii get user by Id>>callabck>>", callback);
          if (callback.status) {
            console.log(
              "callabck.response.details>>",
              callback?.response?.Details
            );
            setDriverDetails(callback?.response?.Details);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  }, []);

  console.log(
    "userId--------------------------||||||||||||||||||________------------->",
    userId
  );

  const [shiftDetails, setShiftDetails] = useState("");

  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [totalGuestCount, settoalGuestCount] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [futureDate, setFutureDate] = useState("");
  const [numberofteens, setNumberofteens] = useState("");
  const [settlementBycompany, setSettlementbycompany] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [governmentId, setgovernmentId] = useState("");
  const [gstNumber, setgstNumber] = useState("");
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

  console.log("phone--------------->", phone);

  const [packageWeekdaysPrice, setPackageWeekdaysPrice] = useState("");
  const [packageWeekendPrice, setPackageWeekendPrice] = useState("");

  const [websiteDicount, setWebsiteDiscount] = useState("");
  const [displayWebsiteDiscount, setDisplayWebsiteDiscount] = useState(false);
  const [websiteDiscountDetails, setWebsiteDiscountDetails] = useState(null);

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
  const [loader, setLoader] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState({
    label: "India",
    name: "India",
    isoCode: "IN",
  });
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

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
  const [amountAfterWebsiteDiscount, setAmountAfterWebsiteDiscount] =
    useState("");

  const fetchFutureBookingDatesFn = () => {
    dispatch(
      fetchFutureBookingDates((callback) => {
        if (callback.status) {
          console.log('Zhuthh-->',callback?.response?.Details);
          console.log(
            "Future booking dates-------***************************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------->",
            callback?.response?.Details
          );
          setStarteDate(callback?.response?.Details?.StartDate);
          setEndDate(callback?.response?.Details?.EndDate);
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

  const fetchDiscountDetails = () => {
    console.log("gal mitthi?>>", userId);
    dispatch(
      getWebsiteDiscounts((callback) => {
        if (callback.status) {
          console.log(
            "Callback---------get discountssssssssss----------******************************************8------------------->",
            callback?.response
          );
          if (
            callback?.response?.Details?.length > 0 &&
            callback?.response?.Details[0]?.EndDate >=
              moment().format("YYYY-MM-DD") &&
            userId == null
          ) {
            console.log("okurrrr");
            setWebsiteDiscountDetails(callback?.response?.Details[0]);

            setWebsiteDiscount(callback?.response?.Details[0]?.Discount);
            setDisplayWebsiteDiscount(true);
          } else {
            setWebsiteDiscountDetails(null);
            setWebsiteDiscount("");
            setDisplayWebsiteDiscount(false);
          }
        }
      })
    );
  };

  useEffect(() => {
    fetchCouponCodes();
    fetchPanelDiscounts();
    fetchFutureBookingDatesFn();
    fetchDiscountDetails();
  }, [dispatch && userId]);

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

  console.log("websiteDicount>>>>", websiteDicount);

  const onsubmit = () => {
    setLoader(true);
    console.log("Package ID ------->", [teenpackageId]);
    console.log("Package ID ------->", packageIds);
    const teenpackageIdArray = [];

    teenpackageIdArray.push(teenpackageId);
    if (guestName == "" || phone === "" || address == "") {
      toast.warning("Please fill all the fields");
      setLoader(false);
    } else if (!isValidEmail(email)) {
      toast.warning("Please enter a valid email address");
      setLoader(false);
    } else if (futureDate == "") {
      toast.warning("Please select a date");
      setLoader(false);
    } else if (!isGstValid) {
      toast.warning("Please enter a valid gst number");
      setLoader(false);
    } else {
      const data = {
        guestName: guestName,
        address: address,
        phone: phone,
        email: email,
        dob: dateofbirth,
        country: selectedCountry?.name,
        state: selectedState?.name,
        city: selectedCity?.name,
        GSTNumber: gstNumber,
        governmentId: governmentId,
        totalGuestCount: totalGuestCount,
        numOfTeens: numberofteens,
        teensPrice: totalteensPrice,
        teensRate: totalTeensRate,
        teensTax: teenstaxPercentage,
        teensTaxName: teensTaxName,
        discountId:
          websiteDiscountDetails != null ? websiteDiscountDetails?.Id : 0,
        bookingDate: new Date()?.toLocaleDateString('en-CA'),
        futureDate: futureDate?.toLocaleDateString('en-CA'),
        panelDiscountId: selectedOption,
        couponId: couponId,
        discount: websiteDicount != "" ? websiteDicount : 0,
        // discount:userId != null ? (),
        referredBy: referredBy,
        settledByCompany: 0,
        packageId:
          packageIds.length == 0
            ? JSON.stringify(teenpackageIdArray)
            : JSON.stringify(packageIds),
        packageGuestCount: JSON.stringify(packageGuestCount),
        userId: userId ? userId : 0,
        // userTypeId: 0,
        userTypeId: userId != null ? 6 : 0,

        shiftId: 0,
        actualAmount: amount,
        paymentMode: paymentOption,
        amountAfterDiscount: amountAfterWebsiteDiscount,
        packageName: JSON.stringify(packageName),
        packageWeekdayPrice: JSON.stringify(packageWeekdaysPrice),
        packageWeekendPrice: JSON.stringify(packageWeekendPrice),
        isBookingWebsite: 1,
        isActive: 0,
      };
      console.log("allah maaf kare", data);
      console.log("Data from booking ------->", data);

      dispatch(
        AddBookingFn(data, (callback) => {
          if (callback.status) {
            console.log(
              "Booking details>>callback?.response?.Details>>",
              callback?.response?.Details
            );
            setLoader(false);

            setBookingData(callback?.response?.Details);

            toast.success("Booking details success");
            if (userId != null) {
              navigate("/GenerateBill", {
                state: { userData: callback?.response?.Details },
              });
            } else {
              if (couponToggle) {
                couponCodeAppend();
              }

              const internalMailData = {
                amount, 
                packageName: JSON.stringify(packageName),
                guestCount: totalGuestCount,
                bookingDate: new Date().toISOString().slice(0,10),
                eventDate: futureDate,
              }
              // dispatch(SendBookingConfirmMail(internalMailData));

              navigate("/GenerateBill", {
                state: { userData: callback?.response?.Details },
              });

              toast.error(callback.error);
            }
          } else {
            console.log("yeh fitoorr");
            toast.error(callback.error);
          }
        })
      );
    }
  };

  const AgentSettlemetFnForDrivertFnForDriver = (
    BookingDetails,
    AgentSettlementAmount
  ) => {
    const driverAgentData = {
      userId: driverDetails?.Id,
      agentName: driverDetails?.Name,
      userTypeId: driverDetails?.UserType,
      settlementAmount: AgentSettlementAmount,
      bookingDate: BookingDetails?.CreatedOn,
      bookingId: BookingDetails?.Id,
    };
    dispatch(
      AddupdateAgentSettlementFordriver(
        driverAgentData,
        // loginDetails?.logindata?.Token,
        (callback) => {
          if (callback.status) {
            console.log(
              "Callback add update details of agent discount seetlement amopunt---->",
              callback?.response?.Details
            );

            // setLoader(false);

            // navigate("/GenerateBill", {
            //   state: { userData: callback?.response?.Details },
            // });
            // resolve(callback);
          } else {
            toast.error(callback.error);
            // reject(callback);
          }
        }
      )
    );
  };

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

  const [paymentOption, setPaymentOption] = useState("OnlinePayu");

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
  // const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
  const formattedEndDate = moment(endDate).toDate();

  const tomorrowDate = moment().add(1, "day").format("YYYY-MM-DD");

  const [isFlashing, setIsFlashing] = useState(false);
  const discountText = `${websiteDicount}% OFF for all the Guests `;

  useEffect(() => {
    // Start the flashing animation when the component mounts
    const intervalId = setInterval(() => {
      setIsFlashing((prevIsFlashing) => !prevIsFlashing);
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const cardStyle = {
    backgroundColor: isFlashing ? "#4a85f6" : "#f06a6b",
    color: "#fff",
    padding: "10px",
    // borderRadius: "5px",
    textAlign: "center",
    fontSize: "18px",
  };

  const handleGstChange = (e) => {
    const newGstNumber = e.target.value;
    setgstNumber(newGstNumber);

    if (e.target.value.length == 0) {
      setIsGstValid(true);
    } else if (e.target.value?.length != 0 && e.target.value?.length == 15) {
      setgstNumber(e.target.value);
      setIsGstValid(true);
    } else {
      setIsGstValid(false);
    }
  };

  return (
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
                      <h5 class="mt-4 section-title-body">
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

              {displayWebsiteDiscount == true && (
                <div className="mt-5 col-6">
                  <div style={cardStyle}>{discountText}</div>
                </div>
              )}

              <div>
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
                        backgroundColor: "#D3AA1A",
                        borderRadius: "0px",
                        marginBottom: "10px",
                        paddingLeft: "20px",
                      }}
                    >
                      Casino Pride Goa
                    </p>
                  </li>
                </ul>
              </div>

              <div className="container mt-5 col-lg-7">
                <div className="row" style={{filter: "invert(100%)", "-webkit-filter": "invert(100%)"}}>
                  <div className="col-md-6 col-lg-3">
                    <div className="image-container d-flex flex-column align-items-center">
                      <img
                        src="https://www.casinoprideofficial.com/assets/images/red-carpet.png"
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
                        src="https://www.casinoprideofficial.com/assets/images/buffet.png"
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
                        src="https://www.casinoprideofficial.com/assets/images/bonus.png"
                        alt="Image 3"
                        className="img-fluid"
                      />
                      <p className="text-center mt-2">Gaming Offers</p>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="image-container d-flex flex-column align-items-center">
                      <img
                        src="https://www.casinoprideofficial.com/assets/images/headphones.png"
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
                  <div className="col-lg-4 col-md-6 col-sm-8 text-center">
                    <div className="card p-4 create-booking-card">
                      <h3>Create Booking</h3>
                      {/* <input
                        class="form-control mt-2"
                        type="date"
                        placeholder="Enter Start Date"
                        min={tomorrowDate}
                        max={formattedEndDate}
                        onChange={(e) => setFutureDate(e.target.value)}
                      /> */}
                          <DatePicker
                          className="form-control mt-2"
                          selected={futureDate}
                          onChange={(date) => setFutureDate(date)}
                          minDate={new Date(moment().add(1, "day"))}
                          maxDate={formattedEndDate}
                          dateFormat={'dd-MM-yyyy'}
                          // maxDate={endDate}
                          placeholderText="Enter the Date"/>
                    </div>
                  </div>
                  <ToastContainer />
                </div>
                <PackagesPage
                  setamount={setamount}
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
                  futureDate={futureDate}
                />
                <div className="col-lg-6 mt-3 mt-3">
                  <label for="formGroupExampleInput " className="form_text">
                    Guest Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    class="form-control mt-2 "
                    type="text"
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
                    onChange={setPhone}
                    defaultCountry="IN"
                    style={{ display: "block" }}
                  />
                </div>
                <div className="col-lg-6 mt-3">
                  <label
                    for="formGroupExampleInput "
                    className="form_text"
                    style={{ fontSize: "15px", fontWeight: "600" }}
                  >
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    class="form-control mt-2"
                    type="text"
                    placeholder="Enter Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-lg-6 mt-3">
                  <label
                    for="formGroupExampleInput "
                    className="form_text mb-2"
                  >
                    Country
                  </label>
                  {/* <Select
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
                  /> */}

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
                    className="react-select-input"
                  />
                </div>
                <div className="col-lg-6 mt-3">
                  <label
                    for="formGroupExampleInput "
                    className="form_text mb-2"
                  >
                    State
                  </label>
                  <Select
                    // className="form-control"
                    options={State?.getStatesOfCountry(
                      selectedCountry?.isoCode
                    )}
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
                    className="react-select-input"
                  />
                </div>
                <div className="col-lg-6 mt-3 ">
                  <label
                    for="formGroupExampleInput "
                    className="form_text mb-2"
                  >
                    City
                  </label>

                  <input
                    class="form-control "
                    type="text"
                    placeholder="Enter your city"
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
                    maxLength={15}
                    // onChange={(e) => setgstNumber(e.target.value)}
                    onChange={handleGstChange}
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

                <div className="row">
                  <div className="col-lg-6 mt-3 ">
                    <label for="formGroupExampleInput " className="form_text">
                      Date of birth
                    </label>
                    <input
                      class="form-control mt-2"
                      type="date"
                      placeholder="Enter Start Date"
                      onChange={(e) => setDateofbirth(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6 mt-3 ">
                    <div className="row mx-auto">
                      {/* <div className="col-6 mt-3">
                        <label
                          for="formGroupExampleInput "
                          className="form_text"
                        >
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
                      </div> */}

                      {/* {couponToggle ? (
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
                      )} */}
                    </div>
                  </div>
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
              </div>
              <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
                <button
                  style={{ paddingLeft: "100px", paddingRight: "100px" }}
                  type="submit"
                  className="btn btn-primary bg-golden mt-5 btn-lg"
                  onClick={onsubmit}
                  // disabled={loader}
                  disabled = { loader ? true : (packageIds?.length == 0 && numberofteens == "") ? true : false }
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
