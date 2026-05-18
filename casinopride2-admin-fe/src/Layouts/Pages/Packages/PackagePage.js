import React, { useState, useEffect } from "react";
import "../../../assets/packagePage.css";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OTPpackage } from "../../Components/OTPpackage";
import { getPackagesDetails } from "../../../Redux/actions/booking";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import NewBooking from "../../Components/NewBooking";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";

const PackagesPage = ({
  setamount,
  setamountAfterDiscount,
  setPackageIds,
  setPackageGuestCount,
  setNumberofteens,
  settoalGuestCount,
  amountAfterDiscount,
  couponDiscount,
  setTotalTeensPrice,
  setTeenPackageId,
  setTotalTeensTax,
  setTotalTeensRate,
  setTeensTaxPercentage,
  setTeensTaxName,
  setPackageName,
  setPackageWeekendPrice,
  setPackageWeekdaysPrice,
  setTeensWeekendPrice,
  setTeensWeekdayPrice,
  setTeensPackageName,
  Discountpercent,
  outletDate,
  bookingDetails = {}
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);

  console.log({bookingDetailsPackagePage: bookingDetails})

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );
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
    fetchPackageDetails();
  }, [dispatch]);

  console.log(
    "Package Detailsnew ------------------------------------>",
    packageDetails
  );

  const groupedData = packageDetails.map((packageDetail) => {
    const matchingPackageItems = itemDetails.filter(
      (itemDetail) => itemDetail.PackageId === packageDetail.Id
    );
    return {
      ...packageDetail,
      packageItems: matchingPackageItems,
    };
  });

  console.log(
    "********************groupedData***************************",
    groupedData[0]?.Id
  );


  const handleCounterChange = (
    packageId,
    counterType,
    increment,
    PackageWeekdayPrice,
    PackageWeekendPrice,
    PackageName,
    newValue // Add the new parameter for the value
  ) => {
    console.log('check>>>',newValue);
    setSelectedPackages((prevSelectedPackages) => {
      const updatedPackages = { ...prevSelectedPackages };
      const currentCount = updatedPackages[packageId]?.[counterType] || 0;
  
      console.log(
        "PackageName------------------------------<<>>>>>>>>>>><<<<<<<<<<>>>>>>>>>>>>",
        PackageName
      );
  
      console.log(
        "PackageWeekdayPrice------------------------------<<>>>>>>>>>>><<<<<<<<<<>>>>>>>>>>>>",
        PackageWeekdayPrice,
        PackageWeekendPrice
      );

      if (outletDate != undefined || outletDate != null) {  //checking if outlet date is set or not

        if (newValue != undefined || newValue != null) {
          updatedPackages[packageId] = {
            ...updatedPackages[packageId],
            [counterType]: parseInt(newValue, 10) || 0,
            PackageName,
            PackageWeekdayPrice,
            PackageWeekendPrice,
          };
        }
        else{
          // const currentCount = updatedPackages[packageId]?.[counterType] || 0;
          console.log('currentCount--->',currentCount);
          if (increment || currentCount > 0) {

            updatedPackages[packageId] = {
              ...updatedPackages[packageId],
              [counterType]: currentCount + (increment ? 1 : -1),
              PackageName,
              PackageWeekdayPrice,
              PackageWeekendPrice,
            };
    
            if (updatedPackages[packageId][counterType] <= 0) {
              delete updatedPackages[packageId];
            }
          } 
        }
  
      } else {
        toast.error("Please Check if the outlet is open");
      }
  

      return updatedPackages;
    });
  };
  const [selectedPackages, setSelectedPackages] = useState({});

  
  

  // const handleCounterChange = (
  //   packageId,
  //   counterType,
  //   increment,
  //   PackageWeekdayPrice,
  //   PackageWeekendPrice,
  //   PackageName
  // ) => {
  //   setSelectedPackages((prevSelectedPackages) => {
  //     const updatedPackages = { ...prevSelectedPackages };

  //     const currentCount = updatedPackages[packageId]?.[counterType] || 0;

  //     console.log(
  //       "PackageName------------------------------<<>>>>>>>>>>><<<<<<<<<<>>>>>>>>>>>>",
  //       PackageName
  //     );

  //     console.log(
  //       "PackageWeekdayPrice------------------------------<<>>>>>>>>>>><<<<<<<<<<>>>>>>>>>>>>",
  //       PackageWeekdayPrice,
  //       PackageWeekendPrice
  //     );
  //     if (outletDate != undefined || outletDate != null) {
  //       if (increment || currentCount > 0) {
  //         updatedPackages[packageId] = {
  //           ...updatedPackages[packageId],
  //           [counterType]: currentCount + (increment ? 1 : -1),
  //           PackageName,
  //           PackageWeekdayPrice,
  //           PackageWeekendPrice,
  //         };
  
  //         if (updatedPackages[packageId][counterType] <= 0) {
  //           delete updatedPackages[packageId];
  //         }
  //       } else {
  //         delete updatedPackages[packageId];
  //       }
  //     }
  //     else{
  //       toast.error("Please Check if outlet is open");
  //     }


  //     return updatedPackages;
  //   });
  // };

  const packageIds = [];
  const packageGuestCounts = [];
  const packagePrices = [];
  const PackageName = [];

  function isWeekday(date) {
    const day = date.getDay();

    return day >= 1 && day <= 4;
  }

  function isWeekday(date) {
    const day = date.getDay();

    return day >= 1 && day <= 4;
  }
  const today = new Date(outletDate);
  const isTodayWeekday = isWeekday(today);

  console.log(isTodayWeekday);

  console.log("selectedPackages----------->", selectedPackages);

  const packageNames = [];
  const packageWeekdayPrices = [];
  const packageWeekendPrices = [];

  useEffect(() => {
    if(!!bookingDetails && Object.keys(bookingDetails).length > 0 && JSON.parse(bookingDetails?.PackageId) && JSON.parse(bookingDetails?.PackageId).length > 0) {
    JSON.parse(bookingDetails?.PackageId)?.forEach((elem, index) => {
      console.log(elem);
      handleCounterChange(
        elem,
        "adults",
        false,
        JSON.parse(bookingDetails?.PackageWeekdayPrice)[index],
        JSON.parse(bookingDetails?.PackageWeekendPrice)[index],
        JSON.parse(bookingDetails?.PackageName)[index],
        JSON.parse(bookingDetails?.PackageGuestCount)[index]
      )
    });
  }
  }, [bookingDetails]);
  

  

  Object.keys(selectedPackages).forEach((packageId) => {
    const packageData = selectedPackages[packageId];
    packageIds.push(parseInt(packageId));
    packageGuestCounts.push(packageData.adults || 0);

    // Find the correct package detail based on packageId
    const groupedData = packageDetails.find(
      (detail) => detail.Id === parseInt(packageId)
    );

    if (groupedData) {
      console.log('packageData=====>',packageData)
      const packagePrice =
        (packageData.adults || 0) *
        (!isTodayWeekday
          ? groupedData.PackageWeekendPrice || 0
          : groupedData.PackageWeekdayPrice || 0);

      packagePrices.push(packagePrice);

      packageNames.push(packageData.PackageName);
      packageWeekdayPrices.push(packageData.PackageWeekdayPrice);
      packageWeekendPrices.push(packageData?.PackageWeekendPrice);
    }
  });

  const formattedData = {
    packageId: packageIds,
    packageGuestCount: packageGuestCounts,
    packageNames: packageNames,

    packageWeekdayPrices: packageWeekdayPrices,
    packageWeekendPrices: packageWeekendPrices,
  };

  console.log(
    "FORMATEDDDDDDDDDDDDDDDDD DATA____________------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
    formattedData
  );

  const handleBookNow = () => {
    console.log("Selected Packages:", selectedPackages);
  };

  const [teensCount, setTeensCount] = useState(0);
  const [teensPrice, setTeensPrice] = useState(0);

  const handleIncrement = () => {
    if (outletDate != undefined || outletDate != null) {
    setTeensCount((prevCount) => prevCount + 1);
      
    }
    else{
      toast.error("Please Check if outlet is open");
    }
  };

  const handleDecrement = () => {
    if (teensCount > 0) {
      setTeensCount((prevCount) => prevCount - 1);
      setNumberofteens((prevCount) => prevCount - 1);
    }
  };

  const TotalAmount = packagePrices.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const TotalAdultGustCount = formattedData.packageGuestCount.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const totalTeensPrice = teensCount * groupedData[0]?.PackageTeensPrice;

  const totalTeensRate = teensCount * groupedData[0]?.PackageTeensRate;

  console.log(
    "teensCount * groupedData[0]?.PackageTeensRate----------->",
    groupedData[0]
  );

  const teensTaxPercentage = groupedData[0]?.PackageTeensTax;

  const teensTaxName = groupedData[0]?.PackageTeensTaxName;

  const totalAmountOfAllPackages = totalTeensPrice + TotalAmount;

  const totalCountofCustomer = teensCount + TotalAdultGustCount;

  useEffect(() => {
    console.log("totalTeensRate------------------>", totalTeensRate);
    setamount(totalAmountOfAllPackages);
    setamountAfterDiscount(totalAmountOfAllPackages - ((totalAmountOfAllPackages * Discountpercent)/100));
    setPackageIds(formattedData.packageId);
    setPackageGuestCount(formattedData.packageGuestCount);
    settoalGuestCount(totalCountofCustomer);
    setNumberofteens(teensCount);
    setTotalTeensPrice(totalTeensPrice);
    setTeenPackageId(groupedData[0]?.Id);
    setTotalTeensTax();
    setTotalTeensRate(totalTeensRate);
    setTeensTaxPercentage(teensTaxPercentage);
    setTeensTaxName(teensTaxName);
    setPackageName(formattedData?.packageNames);
    setPackageWeekendPrice(formattedData?.packageWeekendPrices);
    setPackageWeekdaysPrice(formattedData?.packageWeekdayPrices);
    setTeensWeekendPrice(groupedData[0]?.PackageWeekendPrice);
    setTeensWeekdayPrice(groupedData[0]?.PackageWeekdayPrice);
    setTeensPackageName([groupedData[0]?.PackageName]);
  }, [TotalAmount, teensCount]);

  console.log("total amount-------->", TotalAmount);
  console.log(
    "total totalAmountOfAllPackages-------->",
    totalAmountOfAllPackages
  );

  console.log(
    "selectedPackages----------------------------------------->>>>",
    selectedPackages
  );

  console.log(
    "Formatted date-------------------|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||**********************>",
    formattedData
  );

  return (
    <div>
      <section class="mt-5 text-center"></section>

      {loading ? (
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
      ) : (
        <div class="container">
          <div class="tab-panel">
            <div class="tab-content">
              <div class="tab-pane active" id="tabs-1" role="tabpanel">
                <div class="row d-flex justify-content-center">
                  <div className="container mt-4 col-lg-7"></div>
                  <div className="row">
                    {groupedData.map((packageDetail, index) => (
                      <OTPpackage
                        key={index}
                        packageDetail={packageDetail}
                        handleCounterChange={handleCounterChange}
                        setSelectedPackages={setSelectedPackages}
                        selectedPackages={selectedPackages}
                        handleBookNow={handleBookNow}
                      />
                    ))}
                  </div>

                  <div className="p-4 col-lg-4 col-sm-10 col-md-8 mt-4 family-box">
                    <div className="row align-items-center justify-content-center ">
                      <div className="col-md-12 col-lg-3">
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
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                      <div className="pricing-item">
                        <h5 className="text-uppercase mb-1 text-center ">
                          {groupedData[0]?.PackageTeensPrice}
                        </h5>
                        <h6 className="primary-color text-uppercase font-weight-bold text-center ">
                          All Days
                        </h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="text-center col-lg-3 col-md-3 col-sm-3 col-3">
                          <button
                            onClick={handleDecrement}
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
                          <span
                            className="text-uppercase"
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                              verticalAlign: "center",
                              marginTop: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {/* Kids: {teensCount} */}
                            Kids: {""}
                          </span>
                              {/* Replace the paragraph with an editable input field */}
                            <input
                              type="text"
                              value={teensCount}
                              onChange={(e) => setTeensCount(parseInt(e.target.value, 10) || 0)}
                              style={{
                                width: "40px", // Adjust the width as needed
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "12px",
                                marginTop: "10px",
                                
                              }}
                                onKeyDown={(e) => {
                            // Clear input on backspace
                            if (e.key === 'Backspace') {
                              e.target.value = ''; // Clear the input value
                              if (e.target.value == '') {
                              setTeensCount(0);
                                
                              }
                            }
                          }}
                            />
                        </div>
                        <div className="text-center col-lg-3 col-md-3 col-sm-3 col-3">
                          <button
                            onClick={handleIncrement}
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

                  {/* {Object.keys(selectedPackages).length > 0 ? (
                    <div className="selected-packages row">
                      <div className="card col-12 mt-4">
                        <div className="card-body">
                          <h5 className="card-title">Selected Packages</h5>
                          {Object.entries(selectedPackages).map(
                            ([index, item]) => (
                              <div className="row" key={index}>
                                <div className="col">
                                  <p className="mb-0">
                                    <span className="detail">
                                      Package Name:
                                    </span>{" "}
                                    {item.PackageName}
                                  </p>
                                </div>
                                <div className="col">
                                  <p className="mb-0">
                                    <span className="detail">Adults:</span>{" "}
                                    {item.adults}
                                  </p>
                                </div>
                                <div className="col">
                                  <p className="mb-0">
                                    <span className="detail">Price:</span>{" "}
                                    {item.adults *
                                      (!isTodayWeekday
                                        ? item.PackageWeekendPrice
                                        : item.PackageWeekdayPrice)}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <div className="col mx-auto">
                          <p className="mb-0">
                            <span className="detail">Teens:</span> {teensCount}
                          </p>
                        </div>
                        <div className="col mx-auto">
                          <p className="mb-0">
                            <span className="detail">Total:</span>{" "}
                            {totalAmountOfAllPackages}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )} */}

                  {Object.keys(selectedPackages).length > 0 ||
                  teensCount > 0 ? (
                    <div className="selected-packages row">
                      <div className="card col-12 mt-4">
                        <div className="card-body">
                          <h5 className="card-title">Selected Packages</h5>
                          {Object.entries(selectedPackages).map(
                            ([index, item]) => (
                              console.log('item--->',item),
                              <div className="row package-item" key={index}>
                                <div className="col-4">
                                  <p className="mb-0 detail">
                                    <span className="detail">
                                      Package Name:
                                    </span>{" "}
                                    {item.PackageName}
                                  </p>
                                </div>
                                <div className="col-4">
                                  <p
                                    className="mb-0 detail"
                                    style={{ textAlign: "center" }}
                                  >
                                    <span className="detail">Adults:</span>{" "}
                                    {item.adults}
                                  </p>
                                </div>
                                <div className="col-4">
                                  <p
                                    className="mb-0 detail"
                                    style={{ textAlign: "right" }}
                                  >
                                    <span className="detail detail">
                                      Total Package Price:
                                    </span>
                                    {item.adults *
                                      (!isTodayWeekday
                                        ? item.PackageWeekendPrice
                                        : item.PackageWeekdayPrice)}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                          {teensCount > 0 ? (
                            <div className="row package-item">
                              <div className="col-4 ">
                                <p className="mb-0 detail">
                                  <span className="detail">Kids:</span>{" "}
                                  {teensCount}
                                </p>
                              </div>
                              <div className="col-4 ">
                                <p
                                  className="mb-0 detail"
                                  style={{ textAlign: "center" }}
                                >
                                  <span className="detail">Kids count:</span>{" "}
                                  {teensCount}
                                </p>
                              </div>
                              <div className="col-4 ">
                                <p
                                  className="mb-0 detail"
                                  style={{ textAlign: "right" }}
                                >
                                  <span className="detail">
                                    Total Kids Price:
                                  </span>
                                  {totalTeensPrice}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}

                          <div className="row package-item">
                            <div className="col-4 "></div>
                            <div className="col-4 "></div>
                            <div className="col-4 ">
                              <p
                                className="mb-0 detail"
                                style={{ textAlign: "right" }}
                              >
                                <span className="detail">Total Amount:</span>
                                {totalAmountOfAllPackages}
                              </p>
                            </div>
                          </div>

                          {amountAfterDiscount == "" ? (
                            <></>
                          ) : (
                            <div className="row package-item">
                              <div className="col-4 "></div>
                              <div className="col-4 "></div>
                              <div className="col-4 ">
                                <p
                                  className="mb-0 detail"
                                  style={{ textAlign: "right" }}
                                >
                                  <span className="detail">
                                    Amount After Discount :
                                  </span>
                                  {amountAfterDiscount}
                                </p>
                              </div>
                            </div>
                          )}

                          {(Discountpercent == "" || Discountpercent == null)? (
                            <></>
                          ) : (
                            <div className="row package-item">
                              <div className="col-4 "></div>
                              <div className="col-4 "></div>
                              <div className="col-4 ">
                                <p
                                  className="mb-0 detail"
                                  style={{ textAlign: "right" }}
                                >
                                  <span className="detail">
                                    Amount After Discount :
                                  </span>
                                  {totalAmountOfAllPackages -
                                    (totalAmountOfAllPackages *
                                      Discountpercent) /
                                      100}
                                </p>
                              </div>
                            </div>
                          )}

                          {couponDiscount == "" ? (
                            <></>
                          ) : (
                            <div className="row package-item">
                              <div className="col-4 "></div>
                              <div className="col-4 "></div>
                              <div className="col-4 ">
                                <p
                                  className="mb-0 detail"
                                  style={{ textAlign: "right" }}
                                >
                                  <span className="detail">
                                    Amount After Discount :
                                  </span>
                                  {couponDiscount}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {/* 
                  <div class="row justify-content-center">
                    <div class="col-md-8" onClick={handleMultiply}>
                      <p class="primary-btn gradient-btn d-block mb-4">
                        <Link to="/bookingpage"> Book now</Link>
                        Book Now
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesPage;
