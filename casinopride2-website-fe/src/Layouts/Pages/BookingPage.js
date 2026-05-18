import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import "react-phone-number-input/style.css";

import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import "react-datepicker/dist/react-datepicker.css";
import ReCAPTCHA from "react-google-recaptcha";
import Title from "../Components/Title";
import FinalPackage from "../Components/FinalPackage";

const BookingPage = () => {
  const customStyles = {
    // Custom styles for the container (main wrapper)
    container: (provided) => ({
      ...provided,
    }),

    // Custom styles for the control (input and dropdown button)
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #D3AA1A",
      padding: "9px",
      borderRadius: "0px",
    }),

    // Custom styles for the menu (dropdown options)
    menu: (provided) => ({
      ...provided,
    }),

    // Custom styles for the options
    option: (provided, state) => ({
      ...provided,
    }),

    // Custom styles for the single-value (selected value)
    singleValue: (provided) => ({
      ...provided,
      color: "#333",
    }),
  };
  const [value, onChange] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const maxSelectableDate = new Date(2023, 7, 31);

  const formatDate = (date) => {
    if (date instanceof Date) {
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
      };
      return date.toLocaleDateString("en-US", options);
    }
    return "";
  };

  const [adultsCount, setAdultsCount] = useState(0);
  const [teensCount, setTeensCount] = useState(0);
  const [kidsCount, setKidsCount] = useState(0);

  const handleIncrement = (type) => {
    if (type === "adults") {
      setAdultsCount((prevCount) => prevCount + 1);
    } else if (type === "teens") {
      setTeensCount((prevCount) => prevCount + 1);
    } else if (type === "kids") {
      setKidsCount((prevCount) => prevCount + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === "adults") {
      setAdultsCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    } else if (type === "teens") {
      setTeensCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    } else if (type === "kids") {
      setKidsCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }
  };

  const tileClassName = ({ date }) => {
    // Add the "blurred-date" class to dates before today and after the maxSelectableDate
    if (date < new Date() || date > maxSelectableDate) {
      return "blurred-date";
    }
    return null;
  };

  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [governmentId, setGovernmentId] = useState("Aadhaar Card");
  const [governmentIdNumber, setGovernmentIdNumber] = useState("");
  const [MobileValue, setMobileValue] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "first_name":
        setFirstName(value);
        break;
      case "last_name":
        setLastName(value);
        break;
      case "country_code":
        setCountryCode(value);
        break;
      case "mobile_number":
        setMobileNumber(value);
        break;
      case "government_id":
        setGovernmentId(value);
        break;
      case "government_id_number":
        setGovernmentIdNumber(value);
        break;
      default:
        break;
    }
  };

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  useEffect(() => {
    console.log(selectedCountry);
    console.log(selectedCountry?.isoCode);
    console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  }, [selectedCountry]);

  console.log("Country--->", selectedCountry);
  console.log("Sate--->", selectedState);
  console.log("City--->", selectedCity);

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setIsCaptchaVerified(true);
  };

  return (
    <div class="container">
      <img src="assets/images/packages-border-design.png" alt="" />
      <h2 class="section-title text-capitalize mt-3">Confirm Booking</h2>

      <form id="sectional" name="sectional" method="post" action="">
        <input type="hidden" id="udf5" name="udf5" value="PayUBiz_PHP7_Kit" />
        <input
          type="hidden"
          name="package_selected"
          value="<?php echo $getting_select; ?>"
        />

        <fieldset class="collapsed-individual">
          {/* <legend class="btn">Confirm Guests</legend> */}
          {/* <Title name={"confirm Guests"} size={12} />
          <div className="row">
            <div className="col-md-4">
              <div className="filter-type-inner mt-2">
                <div className="counter-div required-field">
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ marginBottom: "10px" }} // Add margin below the adults count
                  >
                    <div />
                    <span
                      style={{
                        marginBottom: "15px", // Add margin below the adultsCount
                        borderBottom: "2px solid #D3AA1A",
                        width: "90%",
                        display: "block",
                        textAlign: "center",
                        paddingBottom: "10px",
                      }}
                    >
                      {adultsCount}
                    </span>
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "100%" }} // Set width to 100% to occupy the full width of the container
                    >
                      <span
                        className="minus"
                        onClick={() => handleDecrement("adults")}
                        style={{ cursor: "pointer" }}
                      >
                        -
                      </span>
                      <h6 className="primary-color text-uppercase m-0">
                        Adults
                      </h6>
                      <span
                        className="plus"
                        onClick={() => handleIncrement("adults")}
                        style={{ cursor: "pointer" }}
                      >
                        +
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="filter-type-inner mt-2">
                <div className="counter-div required-field">
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ marginBottom: "10px" }} // Add margin below the adults count
                  >
                    <div />
                    <span
                      style={{
                        marginBottom: "15px", // Add margin below the adultsCount
                        borderBottom: "2px solid #D3AA1A",
                        width: "90%",
                        display: "block",
                        textAlign: "center",
                        paddingBottom: "10px",
                      }}
                    >
                      {teensCount}
                    </span>
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "100%" }} // Set width to 100% to occupy the full width of the container
                    >
                      <span
                        className="minus"
                        onClick={() => handleDecrement("teens")}
                        style={{ cursor: "pointer" }}
                      >
                        -
                      </span>
                      <h6 className="primary-color text-uppercase m-0">
                        TEENS (10-21 YEARS)
                      </h6>
                      <span
                        className="plus"
                        onClick={() => handleIncrement("teens")}
                        style={{ cursor: "pointer" }}
                      >
                        +
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="filter-type-inner mt-2">
                <div className="counter-div required-field">
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ marginBottom: "10px" }} // Add margin below the adults count
                  >
                    <div />
                    <span
                      style={{
                        marginBottom: "15px", // Add margin below the adultsCount
                        borderBottom: "2px solid #D3AA1A",
                        width: "90%",
                        display: "block",
                        textAlign: "center",
                        paddingBottom: "10px",
                      }}
                    >
                      {kidsCount}
                    </span>
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "100%" }} // Set width to 100% to occupy the full width of the container
                    >
                      <span
                        className="minus"
                        onClick={() => handleDecrement("kids")}
                        style={{ cursor: "pointer" }}
                      >
                        -
                      </span>
                      <h6 className="primary-color text-uppercase m-0">
                        KIDS (0-9 YEARS)
                      </h6>
                      <span
                        className="plus"
                        onClick={() => handleIncrement("kids")}
                        style={{ cursor: "pointer" }}
                      >
                        +
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </fieldset>
        <fieldset class="collapsed-individual">
          <Title name={"Confirm Dates"} size={12} />
          <div class="form-section">
            <div class="row">
              <div className="col-lg-6 d-flex justify-content-center">
                <div
                  id="myCalendar"
                  className="vanilla-calendar"
                  style={{ marginBottom: "20px" }}
                >
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    minDate={new Date()}
                    maxDate={maxSelectableDate}
                    formatLongDate={formatDate}
                    tileClassName={tileClassName}
                  />
                </div>
              </div>
              <div class="col-lg-6 mt-4 mt-lg-0">
                <h5 class="label-title">Guests</h5>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex">
                    <h6 class="text-capitalize">
                      <b class="mr-3" id="adults_no"></b>
                      {adultsCount} adults
                    </h6>
                  </div>
                  <div class="d-flex">
                    <h6 class="text-capitalize">
                      <b class="mr-3" id="teens_no"></b>
                      {teensCount} Teens
                    </h6>
                  </div>
                  <div class="d-flex">
                    <h6 class="text-capitalize">
                      <b class="mr-3" id="kids_no"></b>
                      {kidsCount} kids
                    </h6>
                  </div>
                </div>
                <hr />
                <h5 class="label-title">Dates</h5>
                <h6 class="text-capitalize">
                  <p>{formatDate(selectedDate)}</p>
                </h6>
                <hr />
                <h5 class="label-title">
                  *Prices are different on special date
                </h5>
                <h6 class="text-capitalize">Christmas, New Year </h6>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset class="collapsed-individual">
          <Title name={"Enter Details"} size={12} />
          <div class="form-section">
            <div className="row">
              <div className="col-lg-8">
                <h5 className="label-title">Fill in your details</h5>
                <small className="third-color">
                  We will share the details to this account
                </small>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group required-field">
                      <label htmlFor="email_address">Email Address</label>
                      <input
                        type="email"
                        className="form-control custom-input"
                        placeholder="Enter Here..."
                        id="email_address"
                        name="email_address"
                        required
                        value={email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* <div className="col-lg-2">
                    <div className="form-group required-field">
                      <label htmlFor="title"></label>
                      <select
                        className="custom-select d-block w-100 form-control"
                        id="title"
                        name="title"
                        required
                        value={title}
                        onChange={handleChange}
                      >
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Miss">Miss</option>
                      </select>
                    </div>
                  </div> */}
                  <div className="col-lg-6">
                    <div className="form-group required-field">
                      <label htmlFor="first_name">Full Name</label>
                      <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="Enter Here..."
                        id="first_name"
                        name="first_name"
                        required
                        value={firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group required-field">
                      <label htmlFor="mobile_number">Mobile Number</label>
                      <div>
                        {/* <PhoneInput
                          containerStyle={{
                            border: "10px solid black",
                          }}
                          inputStyle={{
                            background: "lightblue",
                          }}
                          placeholder="Enter phone number"
                          value={MobileValue}
                          onChange={setMobileValue}
                        /> */}

                        <PhoneInput
                          country={"in"}
                          value={MobileValue}
                          onChange={setMobileValue}
                          containerStyle={{
                            border: "1px solid #D3AA1A",
                            padding: "10px 0px",
                            marginLeft: "0px",
                            borderRadius: "0",
                          }}
                          inputStyle={{
                            padding: "15px",
                            border: "none",
                            marginLeft: "30px",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="form-group required-field">
                      <label htmlFor="mobile_number">Address</label>
                      <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="Enter Here..."
                        id="mobile_number"
                        name="mobile_number"
                        required
                        value={mobileNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-4">
                      <Select
                        styles={customStyles}
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
                    <div className="col-lg-4">
                      <Select
                        styles={customStyles}
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
                      />
                    </div>
                    <div className="col-lg-4">
                      {/* <Select
                        options={City.getCitiesOfState(
                          selectedState?.countryCode,
                          selectedState?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedCity}
                        onChange={(item) => {
                          setSelectedCity(item);
                        }}
                      /> */}

                      <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="Enter city"
                        id="mobile_number"
                        name="mobile_number"
                        required
                        value={mobileNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* <div className="col-lg-5">
                    <div className="form-group required-field">
                      <label htmlFor="last_name">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Here..."
                        id="last_name"
                        name="last_name"
                        required
                        value={lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div> */}
                </div>
                <div className="row mt-4">
                  <div className="col-md-6">
                    <label htmlFor="country_code">GST Details</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Enter Here..."
                      id="mobile_number"
                      name="mobile_number"
                      required
                      value={mobileNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="country_code">Company Name</label>

                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Enter Here..."
                      id="mobile_number"
                      name="mobile_number"
                      required
                      value={mobileNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <label htmlFor="country_code">Date of birth</label>
                  <div className="col-md-6 ">
                    <DatePicker
                      className="custom-input"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </div>
                </div>

                {/* <div className="form-row">
                  <div className="col-md-3">
                    <div className="form-group required-field">
                      <label htmlFor="government_id">Government ID</label>
                      <select
                        className="custom-select d-block w-100 form-control"
                        id="government_id"
                        name="government_id"
                        required
                        value={governmentId}
                        onChange={handleChange}
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="Driving Licence">Driving Licence</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Passport">Passport</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="form-group required-field">
                      <label htmlFor="government_id_number">
                        Enter Government ID Card
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Aadhaar Card Number"
                        id="government_id_number"
                        name="government_id_number"
                        required
                        value={governmentIdNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div> */}
                <div className="form-group required-field"></div>
                <div className="form-group required-field"></div>
                {/* <div className="form-group required-field">
                  <ReCAPTCHA
                    sitekey="6LdafHwnAAAAAFNETTQz8oT2XIO4hlrVJCPjQ_gR"
                    onChange={handleCaptchaChange}
                  />
                  <button type="submit" disabled={!isCaptchaVerified}>
                    Submit
                  </button>
                </div> */}
              </div>
              <div className="col-lg-4">
                <div className="d-flex">
                  <h5 className="fontAwesome-icon mr-2"></h5>
                  <h6>
                    <b>Data security:</b> We respect data protection and pass
                    your data only to our contractual partners and never to
                    third parties.
                  </h6>
                </div>
              </div>
              <div className="col-12 text-center mt-5"></div>
            </div>
          </div>
        </fieldset>

        <fieldset class="collapsed-individual">
          <Title name={"Confirm Package"} size={12} />

          <FinalPackage />

          <hr />
        </fieldset>
        {/* 
        <div class="d-flex justify-content-center mb-5">
          <input type="hidden" name="senddata" id="senddata" value="paynow" />
          <input
            type="hidden"
            name="token"
            value="<?php echo $token_payment_data; ?>"
          />
          <button
            type="submit"
            name="submit"
            id="submit"
            class="primary-btn big-btn gradient-btn"
          >
            go to payment
          </button>

          <fieldset class="collapsed-individual mb-5">
            <legend class="btn">Add On-OTP Packages</legend>
            <div class="row d-flex"></div>
          </fieldset>

        
        </div> */}
        <div class="row text-left mt-5 mb-5">
          <div class="col-md-6">
            <h6>
              <b class="third-color">Safe and secure SSL data connection</b>
            </h6>
            <p class="mt-2">
              Your data is encrypted with SSL technology and are therefore not
              readable by unauthorized third parties.{" "}
            </p>
          </div>
          <div class="col-md-6">
            <h6>
              <b class="third-color">We're here to help </b>
            </h6>

            <p class="mt-2">
              Our service team is there for you personally. Contact us{" "}
              <a href="tel:9158885000">+91 91 5888 5000 </a> or email at{" "}
              <a
                href="mailto:info@casinoprideofficial.com"
                class="primary-color"
              >
                info@casinoprideofficial.com
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingPage;
