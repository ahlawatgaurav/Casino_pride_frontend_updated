import React, { useState } from "react";
import "../../assets/Styles/style.css";
// import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

import DecemberPackages from "../Components/DecemberPackages";
import Title from "../Components/Title";
import FinalPackage from "../Components/FinalPackage";

const PackagesPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const packageDetails = [
    {
      title: "Regular Package",
      description: "UNLIMITED FOOD BUFFET",
      features: ["HOUSE BRAND DRINKS ON GAMING TABLE", "OTP'S WORTH 500"],
      images: [
        "https://www.casinoprideofficial.com/assets/images/red-carpet.png",
        "https://www.casinoprideofficial.com/assets/images/buffet.png",
        "https://www.casinoprideofficial.com/assets/images/bonus.png",
      ],
      pricing: [
        {
          type: "weekdays",
          price: "INR 2000 /-",
          days: "[mon - thu]",
        },
        {
          type: "weekends",
          price: "INR 3000 /-",
          days: "[fri - sun]",
        },
      ],
      teensPrice: "INR 1000 /-",
      kidsPrice: "INR 0 /-",
    },
    {
      title: "Premium package",
      description: "UNLIMITED FOOD BUFFET",
      features: ["HOUSE BRAND DRINKS ON GAMING TABLE", "OTP'S WORTH 500"],
      images: [
        "https://www.casinoprideofficial.com/assets/images/red-carpet.png",
        "https://www.casinoprideofficial.com/assets/images/buffet.png",
        "https://www.casinoprideofficial.com/assets/images/bonus.png",
      ],
      pricing: [
        {
          type: "weekdays",
          price: "INR 2500 /-",
          days: "[mon - thu]",
        },
        {
          type: "weekends",
          price: "INR 3500 /-",
          days: "[fri - sun]",
        },
      ],
      teensPrice: "INR 1000 /-",
      kidsPrice: "INR 0 /-",
    },
    {
      title: "Luxary package",
      description: "UNLIMITED FOOD BUFFET",
      features: ["HOUSE BRAND DRINKS ON GAMING TABLE", "OTP'S WORTH 500"],
      images: [
        "https://www.casinoprideofficial.com/assets/images/red-carpet.png",
        "https://www.casinoprideofficial.com/assets/images/buffet.png",
        "https://www.casinoprideofficial.com/assets/images/bonus.png",
      ],
      pricing: [
        {
          type: "weekdays",
          price: "INR 4000 /-",
          days: "[mon - thu]",
        },
        {
          type: "weekends",
          price: "INR 5000 /-",
          days: "[fri - sun]",
        },
      ],
      teensPrice: "INR 1000 /-",
      kidsPrice: "INR 0 /-",
    },
    {
      title: "VIP package",
      description: "UNLIMITED FOOD BUFFET",
      features: ["HOUSE BRAND DRINKS ON GAMING TABLE", "OTP'S WORTH 500"],
      images: [
        "https://www.casinoprideofficial.com/assets/images/red-carpet.png",
        "https://www.casinoprideofficial.com/assets/images/buffet.png",
        "https://www.casinoprideofficial.com/assets/images/bonus.png",
      ],
      pricing: [
        {
          type: "weekdays",
          price: "INR 7000 /-",
          days: "[mon - thu]",
        },
        {
          type: "weekends",
          price: "INR 9000 /-",
          days: "[fri - sun]",
        },
      ],
      teensPrice: "INR 1000 /-",
      kidsPrice: "INR 0 /-",
    },
  ];

  const [selectedPackages, setSelectedPackages] = useState({});

  const handleCounterChange = (packageName, counterType, increment) => {
    setSelectedPackages((prevSelectedPackages) => {
      const updatedPackages = { ...prevSelectedPackages };
      const currentCount = updatedPackages[packageName]?.[counterType] || 0;

      if (increment || currentCount > 0) {
        // Prevent negative counts
        updatedPackages[packageName] = {
          ...updatedPackages[packageName],
          [counterType]: currentCount + (increment ? 1 : -1),
        };
      }

      return updatedPackages;
    });
  };

  const handleBookNow = () => {
    console.log("Selected Packages------->:", selectedPackages);
    // Perform booking or further actions here
  };

  return (
    <div>
      <section class="mt-5 text-center">
        <div class="container">
          <h2 class="section-title text-capitalize">Package Title</h2>
          <p class="section-tag-line gradient-bottom-line">
            Package Title tagline
          </p>
          <div class="row justify-content-center">
            <div class="col-12">
              <h5 class="mt-4">
                We offer packages that suit every budget and requirement. All
                packages have a minimal entry fee per adult and, depending on
                which you choose, will have food, brand liquor, live
                entertainment, and even weather-deck access.{" "}
              </h5>
            </div>
          </div>
        </div>
      </section>

      <div class="container">
        <div class="tab-panel">
          <Title name={"CASINO PRIDE GOA"} size={6} />
          <div class="tab-content">
            <div class="tab-pane active" id="tabs-1" role="tabpanel">
              <div class="row d-flex justify-content-center">
                <div className="container mt-4 col-lg-7">
                  <div className="row">
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
                {/* <div className="row">
                  {packageDetails.map((packageDetail, index) => (
                    <OtpPackage
                      key={index}
                      packageDetail={packageDetail}
                      handleCounterChange={handleCounterChange}
                      setSelectedPackages={setSelectedPackages}
                      selectedPackages={selectedPackages}
                      handleBookNow={handleBookNow}
                    />
                  ))}
                </div> */}

                <div className="selected-packages">
                  {/* <h2>Selected Packages:</h2> */}
                  {Object.entries(selectedPackages).map(
                    ([packageName, counts], index) => (
                      // <FinalPackage
                      //   packageName={packageName}
                      //   adults={counts.adults || 0}
                      //   teens={counts.teens || 0}
                      //   kids={counts.kids || 0}
                      // />

                      <div
                        className="card package-card col-6 mx-auto"
                        key={index}
                      >
                        <div className="card-body">
                          <h5 className="card-title">{packageName}</h5>
                          <div className="row">
                            <div className="col">
                              <p className="mb-0">
                                <span className="detail">Adults:</span>{" "}
                                {counts.adults || 0}
                              </p>
                            </div>
                            <div className="col">
                              <p className="mb-0">
                                <span className="detail">Teens:</span>{" "}
                                {counts.teens || 0}
                              </p>
                            </div>
                            <div className="col">
                              <p className="mb-0">
                                <span className="detail">Kids:</span>{" "}
                                {counts.kids || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div class="row justify-content-center">
                  <div class="col-md-8" onClick={handleBookNow}>
                    <p class="primary-btn gradient-btn d-block mb-4">
                      {/* <Link to="/bookingpage"> Book now</Link> */}
                      Book Now
                    </p>
                  </div>
                </div>

                {/* <div class="col-lg-12 mt-4">
                  <Title
                    name={"December to Remember Packages"}
                    size={6}
                    text={"center"}
                  />
                </div> */}

                {/* <DecemberPackages />
                <DecemberPackages />
                <DecemberPackages />
                <DecemberPackages /> */}

                <div class="col-12 text-center mt-4">
                  <p>
                    Read the terms & conditions{" "}
                    <a href="termCondition.php" class="second-color">
                      here
                    </a>
                  </p>
                </div>
              </div>

              <div class="container text-center">
                <div class="row d-flex justify-content-center">
                  <div class="col-lg-9 col-md-12">
                    <div class="family-box">
                      <div class="h3 fw-bolder">
                        <strong class="text-danger">BEVERAGES</strong>
                      </div>
                      <table class="table">
                        <tr>
                          <td>
                            <ul>
                              <li>
                                <b>HOUSE BRANDS</b>
                              </li>
                              <li>Antiquity Blue</li>
                              <li>Blenders Pride</li>
                              <li>Royal Challenge</li>
                              <li>Royal Stag</li>
                              <li>Signature</li>
                              <li>Romanov</li>
                              <li>Blue Riband</li>
                              <li>Mc Dowell</li>
                              <li>Old Monk</li>
                              <li>Bacardi</li>
                              <li>Fenny</li>
                              <li>Kingfisher</li>
                            </ul>
                          </td>
                          <td>
                            <ul>
                              <li>
                                <b>IMFL</b>
                              </li>
                              <li>VAT 69</li>
                              <li>Black & White</li>
                              <li>Teacher's Highland</li>
                              <li>Black Dog 8 YO</li>
                              <li>Smirnoff</li>
                              <li>Brandy</li>
                              <li>Old Monk</li>
                              <li>Bacardi</li>
                              <li>Fenny</li>
                              <li>Breezers</li>
                              <li>Kingfisher Ultra</li>
                              <li>Heineken</li>
                              <li>Budweiser</li>
                              <li>White Wine</li>
                              <li>Red Wine</li>
                              <li>Canned juices</li>
                            </ul>
                          </td>
                          <td>
                            <ul>
                              <li>
                                <b>PREMIUM LIQUOR</b>
                              </li>
                              <li>Black Label</li>
                              <li>Glenlivet 12</li>
                              <li>Glenfiddich 12</li>
                              <li>Chivas Regal 12</li>
                              <li>Jack Daniels</li>
                              <li>Absolut</li>
                              <li>Grey Goose</li>
                              <li>Bombay Saphire</li>
                              <li>Baileys Irish Cream</li>
                              <li>El Charo</li>
                              <li>Corona Beer</li>
                              <li>Jacob Creek White</li>
                              <li>Sula Brut (sparkling wine)</li>
                            </ul>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div class="row d-flex justify-content-center">
                          <div class="col-lg-10 col-md-12">
                              <div class="family-box">
                                  <div class="h3  fw-bolder"><strong class="text-danger">
                                          BEVERAGES
                                      </strong>
                                  </div>
                                //   <table style="border:none" class="table">
                                      <tr>

                                          <td
                                            // //   style='text-decoration:none;margin-left:10px;margin-right:20px;list-style:none;'>
<ul>
                                              <li> <B>HOUSE BRANDS </B></li>
                                              <li> Antiquity Blue</li>
                                              <li> Blenders Pride</li>
                                              <li> Royal Challenge</li>
                                              <li> Royal Stag </li>
                                              <li>Signature </li>
                                              <li>Romanov </li>
                                              <li> Blue Riband </li>
                                              <li> Mc Dowell </li>
                                              <li>Old Monk
                                              </li>
                                              <li>Bacardi </li>
                                              <li> Fenny </li>
                                              <li> </li>
                                              <li> Kingfisher </li>

                                              </ul>
                                          </td>
                                        // //   <td style='text-decoration:none;list-style:none;'>
<ul>
                                              <li> <B>IMFL </B></li>
                                              <li> VAT 69 </li>
                                              <li> Black & White </li>
                                              <li>Teacher's Highland </li>
                                              <li> Black Dog 8 YO </li>
                                              <li> Smirnoff </li>
                                              <li> Brandy </li>
                                              <li> Old Monk </li>
                                              <li> Bacardi </li>
                                              <li> Fenny </li>
                                              <li>Breezers </li>
                                              <li> Kingfisher Ultra </li>
                                              <li> Heineken
                                              </li>
                                              <li> Budweiser </li>
                                              <li> White Wine </li>
                                              <li> Red Wine
                                              </li>
                                              <li> Canned juices
                                              </li>
                                              </ul>
                                          </td>
                                        // //   <td style='text-decoration:none;list-style:none;'>
                                            <ul>
                                              <li> <B>PREMIUM LIQUOR </B></li>
                                              <li> Black Label</li>
                                              <li> Glenlivet 12


                                              </li>
                                              <li> Glenfiddich 12</li>
                                              <li>Chivas Regal 12 </li>
                                              <li>Jack Daniels </li>
                                              <li>Absolut </li>
                                              <li> Grey Goose </li>
                                              <li> Bombay Saphire </li>
                                              <li>Baileys Irish Cream
                                              </li>
                                              <li> El Charo
                                              </li>
                                              <li> Corona Beer </li>
                                              <li> </li>
                                              <li> Jacob Creek White </li>
                                              <li>Sula Brut (sparkling wine) </li>
                                              </ul>
                              </div>
                          </div>

                      </div>
                      </td>
                      </tr>
                      </table>




                  </div> */}
              {/* <div class="col-lg-3 col-md-6">
                <div class="family-box">
                  <h5 class="text-uppercase m-0">Regular - Nepal</h5>
                  <div class="family-box-inner">
                    <p class="text-uppercase">only food</p>
                    <p class="text-uppercase">no liquor</p>
                    <p class="text-uppercase">no weather deck access</p>
                    <h6 class="text-uppercase text-left third-color mt-4">
                      inclusions
                    </h6>
                    <ul class="family-feature d-block d-md-flex align-items-center justify-content-center mb-4">
                      <li>
                        {" "}
                        <img src="assets/images/red-carpet.png" alt="" />
                        <h6 class="text-capitalize mt-1">
                          Events &amp; live <br />
                          Entertainment
                        </h6>
                      </li>
                      <li>
                        {" "}
                        <img src="assets/images/buffet.png" alt="" />
                        <h6 class="text-capitalize mt-1">
                          unlimited
                          <br />
                          Food &amp; Drinks
                        </h6>
                      </li>
                      <li>
                        {" "}
                        <img src="assets/images/bonus.png" alt="" />
                        <h6 class="text-capitalize mt-1">
                          Gaming
                          <br />
                          Offers
                        </h6>
                      </li>
                    </ul>
                    <ul class="d-block d-md-flex justify-content-around">
                      <li>
                        <p class="text-uppercase mb-1">INR 1000/-</p>
                        <h6 class="primary-color text-uppercase font-weight-bold">
                          weekdays
                        </h6>
                        <h6 class="second-color text-uppercase">[mon - thu]</h6>
                      </li>
                      <li>
                        <p class="text-uppercase mb-1">INR 1500/-</p>
                        <h6 class="primary-color text-uppercase font-weight-bold">
                          weekends
                        </h6>
                        <h6 class="second-color text-uppercase">[fri - sun]</h6>
                      </li>
                    </ul>
                  </div>
                  <a
                    href=""
                    class="primary-btn d-block gradient-btn"
                    data-toggle="modal"
                    data-target="#packageModal"
                  >
                    know more
                  </a>{" "}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
