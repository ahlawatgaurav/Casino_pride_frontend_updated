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
  isCallCenter = false,
  setPackageDiscounts,
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
  setHasKids,
  setNumOfKids,
  futureDate,
  categoryId = null,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [packageDetails, setPackageDetails] = useState([]);
  const [filterPackageDetails, setFilterPackageDetails] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const fetchPackageDetails = (catId = null) => {
    dispatch(
      getPackagesDetails(loginDetails?.logindata?.Token, 4, catId, (callback) => {
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
    fetchPackageDetails(categoryId);
  }, [dispatch, categoryId]);

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
  const [selectedPackages, setSelectedPackages] = useState({});
  // Per-package discount % (call-centre only), keyed by packageId.
  const [pkgDiscounts, setPkgDiscounts] = useState({});
  const handlePackageDiscountChange = (packageId, value) => {
    let v = parseFloat(value);
    if (isNaN(v) || v < 0) v = 0;
    if (v > 100) v = 100;
    setPkgDiscounts((prev) => ({ ...prev, [packageId]: v }));
  };

  const handleCounterChange = (
    packageId,
    counterType,
    increment,
    PackageWeekdayPrice,
    PackageWeekendPrice,
    PackageName
  ) => {
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

      if (futureDate != "") {
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
        } else {
          delete updatedPackages[packageId];
        }
      } else {
        toast.error("Please Select the date");
      }

      return updatedPackages;
    });
  };

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

  const today = new Date(futureDate);
  const isTodayWeekday = isWeekday(today);

  console.log(isTodayWeekday);

  console.log("selectedPackages----------->", selectedPackages);

  const packageNames = [];
  const packageWeekdayPrices = [];
  const packageWeekendPrices = [];

  Object.keys(selectedPackages).forEach((packageId) => {
    const packageData = selectedPackages[packageId];
    packageIds.push(parseInt(packageId));
    packageGuestCounts.push(packageData.adults || 0);

    // Find the correct package detail based on packageId
    const groupedData = packageDetails.find(
      (detail) => detail.Id === parseInt(packageId)
    );

    if (groupedData) {
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

  const [kidsIncluded, setKidsIncluded] = useState(false);
  const [kidsCount, setKidsCount] = useState(0);

  const handleKidsIncludedChange = (event) => {
    const checked = event.target.checked;
    setKidsIncluded(checked);
    setKidsCount(checked ? 1 : 0);
  };

  const handleKidsCountChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    setKidsCount(value);
  };

  const TotalAmount = packagePrices.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const TotalAdultGustCount = formattedData.packageGuestCount.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const totalTeensPrice = 0;

  const totalTeensRate = 0;

  console.log(
    "teensCount * groupedData[0]?.PackageTeensRate----------->",
    groupedData[0]
  );

  const teensTaxPercentage = groupedData[0]?.PackageTeensTax;

  const teensTaxName = groupedData[0]?.PackageTeensTaxName;

  const totalAmountOfAllPackages = TotalAmount;

  // Per-package discount (call-centre): net = sum of each package price minus its own discount %.
  const packageDiscountArray = [];
  let callCenterPackagesNet = 0;
  packageIds.forEach((pid, i) => {
    const disc = Number(pkgDiscounts[pid] || 0);
    packageDiscountArray.push(disc);
    callCenterPackagesNet += (packagePrices[i] || 0) * (1 - disc / 100);
  });

  const normalizedKidsCount = Number(kidsCount || 0);
  const totalCountofCustomer = normalizedKidsCount + TotalAdultGustCount;

  useEffect(() => {
    console.log("totalTeensRate------------------>", totalTeensRate);
    setamount(totalAmountOfAllPackages);
    if (isCallCenter) {
      if (setamountAfterDiscount) setamountAfterDiscount(callCenterPackagesNet);
      if (setPackageDiscounts) setPackageDiscounts(packageDiscountArray);
    }
    setPackageIds(formattedData.packageId);
    setPackageGuestCount(formattedData.packageGuestCount);
    settoalGuestCount(totalCountofCustomer);
    setNumberofteens(0);
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
    setHasKids(kidsIncluded ? 1 : 0);
    setNumOfKids(kidsIncluded ? normalizedKidsCount : 0);
  }, [TotalAmount, kidsIncluded, kidsCount, JSON.stringify(pkgDiscounts), isCallCenter]);

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
                        isCallCenter={isCallCenter}
                        packageDiscounts={pkgDiscounts}
                        onDiscountChange={handlePackageDiscountChange}
                      />
                    ))}
                  </div>

                  <div className="p-4 col-lg-4 col-sm-10 col-md-8 mt-4 family-box">
                    <div className="card-body">
                      <div className="form-check d-flex justify-content-center align-items-center gap-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="kidsIncluded"
                          checked={kidsIncluded}
                          onChange={handleKidsIncludedChange}
                        />
                        <label className="form-check-label fw-bold" htmlFor="kidsIncluded">
                          Kids Included
                        </label>
                      </div>
                      {kidsIncluded ? (
                        <div className="mt-3">
                          <label className="form_text" htmlFor="kidsCount">
                            Number of Kids
                          </label>
                          <input
                            id="kidsCount"
                            className="form-control mt-2"
                            type="text"
                            inputMode="numeric"
                            value={kidsCount}
                            onChange={handleKidsCountChange}
                            placeholder="Enter number of kids"
                          />
                        </div>
                      ) : (
                        <></>
                      )}
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

                  {Object.keys(selectedPackages).length > 0 ? (
                    <div className="selected-packages row">
                      <div className="card col-12 mt-4">
                        <div className="card-body">
                          <h5 className="card-title">Selected Packages</h5>
                          {Object.entries(selectedPackages).map(
                            ([index, item]) => (
                              <div className="row package-item" key={index}>
                                <div className="col-4">
                                  <p className="mb-0 detail">
                                    <span className="detail">
                                      Package Name :
                                    </span>{" "}
                                    {item.PackageName}
                                  </p>
                                </div>
                                <div className="col-4">
                                  <p
                                    className="mb-0 detail"
                                    style={{ textAlign: "center" }}
                                  >
                                    <span className="detail">
                                      Adults Count :
                                    </span>{" "}
                                    {item.adults}
                                  </p>
                                </div>
                                <div className="col-4">
                                  <p
                                    className="mb-0 detail"
                                    style={{ textAlign: "right" }}
                                  >
                                    <span className="detail detail">
                                      Total Package Price :
                                    </span>{" "}
                                    {item.adults *
                                      (!isTodayWeekday
                                        ? item.PackageWeekendPrice
                                        : item.PackageWeekdayPrice)}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                          <div className="row package-item">
                            <div className="col-4 "></div>
                            <div className="col-4 "></div>
                            <div className="col-4 ">
                              <p
                                className="mb-0 detail"
                                style={{ textAlign: "right" }}
                              >
                                <span className="detail">Total Amount :</span>{" "}
                                {totalAmountOfAllPackages}
                              </p>
                            </div>
                          </div>

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
                                  </span>{" "}
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
