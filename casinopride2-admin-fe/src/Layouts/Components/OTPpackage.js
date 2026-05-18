import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import "../../assets/packagePage.css";
import { Link } from "react-router-dom";

export const OTPpackage = ({
  packageDetail,
  handleCounterChange,
  setSelectedPackages,
  selectedPackages,
  handleBookNow,

}) => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [adultsCount, setAdultsCount] = useState(0);
  const [teensCount, setTeensCount] = useState(0);
  const [kidsCount, setKidsCount] = useState(0);

  const handleIncrement = (setter) => {
    setter((prevCount) => prevCount + 1);
  };

  const handleDecrement = (setter) => {
    setter((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  };

  const [isSelected, setIsSelected] = useState(false);

  // ...

  return (
    <div class="col-lg-3 col-md-6">
      <div class="family-box">
        <h5 class="text-uppercase m-0 text-center">
          {packageDetail?.PackageName}
        </h5>
        <div class="family-box-inner ">
          <p
            class="font-weight-bold text-center"
            style={{ fontWeight: "Medium" }}
          >
            {packageDetail?.PackageDescription}
          </p>
          <p class="font-weight-bold text-center"></p>
          <p class="font-weight-bold text-center"></p>

          <div className="container mt-4 ">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-6 col-lg-3">
                <div className="image-container d-flex flex-column align-items-center">
                  <img
                    src="https://www.casinoprideofficial.com/assets/images/red-carpet.png"
                    alt="Image 1"
                    className="img-fluid package_card_image"
                  />
                  <p
                    className="text-center"
                    style={{
                      fontSize: "8px",
                    }}
                  >
                    Events & Live Entertainment
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="image-container d-flex flex-column align-items-center">
                  <img
                    src="https://www.casinoprideofficial.com/assets/images/buffet.png"
                    alt="Image 2"
                    className="img-fluid package_card_image"
                  />
                  <p
                    className="text-center  "
                    style={{
                      fontSize: "8px",
                      lineHeight: "initial",
                    }}
                  >
                    Unlimited Food & Drinks
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="image-container d-flex flex-column align-items-center">
                  <img
                    src="https://www.casinoprideofficial.com/assets/images/bonus.png"
                    alt="Image 3"
                    className="img-fluid package_card_image"
                  />
                  <p
                    className="text-center "
                    style={{
                      fontSize: "8px",
                    }}
                  >
                    Gaming Offers
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="d-block d-md-flex justify-content-around">
            <div className="pricing-item">
              <h5 className="text-uppercase mb-1 text-center ">
                {packageDetail?.PackageWeekdayPrice}
              </h5>
              <h6 className="primary-color text-uppercase font-weight-bold text-center ">
                weekdays
              </h6>
              <h6 className="second-color text-uppercase text-center ">
                [mon - thu]
              </h6>
            </div>
            <div className="pricing-item">
              <h5 className="text-uppercase mb-1 text-center ">
                {packageDetail?.PackageWeekendPrice}
              </h5>
              <h6 className="primary-color text-uppercase font-weight-bold text-center ">
                weekends
              </h6>
              <h6 className="second-color text-uppercase text-center ">
                [fri - sun]
              </h6>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <div className="text-center">
              <h6 className="primary-color text-uppercase font-weight-bold">
                all days
              </h6>
              <h6 className="second-color text-uppercase">[mon - sun]</h6>
            </div>
          </div>
          <div className="col-lg-12">
            <div>
              <div className="family-box-inner">
                <div className=" align-items-center mb-2 row">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="text-center col-lg-3 col-md-3 col-sm-3 col-3">
                        <button
                          onClick={() =>
                            handleCounterChange(
                              packageDetail?.Id,
                              "adults",
                              false,
                              packageDetail?.PackageWeekdayPrice,
                              packageDetail?.PackageWeekendPrice,
                              packageDetail?.PackageName
                            )
                          }
                          style={{
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            color: "",
                            backgroundColor: "#cbb883",
                            border: "none",
                            padding: "0",
                            fontSize: "16px",
                            lineHeight: "40px",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                        >
                          -
                        </button>
                      </div>

                      <div className="text-center col-lg-6 col-md-6 col-sm-6 col-6">
                        <p
                          className="text-uppercase"
                          style={{
                            fontSize: "12px",
                            textAlign: "center",
                            verticalAlign: "center",
                            marginTop: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          Adults:{" "}
                          {/*Commented by manasi*/}
                          {/* {selectedPackages[packageDetail.Id]?.adults || 0} */}
                          {/* Replace the paragraph with an editable input field */}
                          <input
  type="text" // Change type to text to allow manual typing
  value={selectedPackages[packageDetail.Id]?.adults || 0}
onChange={(e) =>
  handleCounterChange(
    packageDetail.Id,
    "adults",
    true,
    packageDetail?.PackageWeekdayPrice,
    packageDetail?.PackageWeekendPrice,
    packageDetail?.PackageName,
    e.target.value // Pass the value from the input
  )
}

  // onInput={(e) =>
  //   handleCounterChange(
  //     packageDetail.Id,
  //     "adults",
  //     true,
  //     packageDetail?.PackageWeekdayPrice,
  //     packageDetail?.PackageWeekendPrice,
  //     packageDetail?.PackageName,
  //     e.target.value
  //   )
  // }
  // onBlur={(e) => {
  //   const newValue = parseInt(e.target.value, 10) || 0; // Parse input value as an integer or default to 0
  //   e.target.value = newValue.toString(); // Set the input value as a string
  //   console.log('newValue>.',newValue);
  //   handleCounterChange(
  //     packageDetail.Id,
  //     "adults",
  //     true,
  //     packageDetail?.PackageWeekdayPrice,
  //     packageDetail?.PackageWeekendPrice,
  //     packageDetail?.PackageName,
  //     newValue
  //   );
  // }}
  // onKeyDown={(e) => {
  //   // Allow only numeric keys, backspace, and enter
  //   if (
  //     !(
  //       (e.key >= '0' && e.key <= '9') ||
  //       e.key === 'Backspace' ||
  //       e.key === 'Enter' ||
  //       e.key === 'Tab'
  //     )
  //   ) {
  //     e.preventDefault();
  //   }

  //   // Clear input on backspace
  //   if (e.key === 'Backspace') {
  //     e.target.value = ''; // Clear the input value
  //   }
  // }}
  style={{
    width: "50px", // Adjust the width as needed
    textAlign: "center",
    fontWeight: "bold",
  }}
/>




                        </p>
                      </div>
                      <div className="text-center col-lg-3 col-md-3 col-sm-3 col-3">
                        <button
                          onClick={() =>
                            handleCounterChange(
                              packageDetail.Id,
                              "adults",
                              true,
                              packageDetail?.PackageWeekdayPrice,
                              packageDetail?.PackageWeekendPrice,
                              packageDetail?.PackageName
                            )
                          }
                          style={{
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            color: "",
                            backgroundColor: "#cbb883",
                            border: "none",
                            padding: "0",
                            fontSize: "16px",
                            lineHeight: "40px",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
