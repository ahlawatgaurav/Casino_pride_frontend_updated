import React, { useState, useEffect } from "react";
import { AddPackageDetails, editPackage } from "../../Redux/actions/users";
import { useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cancel from "../../assets/Images/cancel.png";
import moment from "moment";

const AddPackage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;
  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [loading, setLoading] = useState(false);
const [startDate, setStartDate] = useState(userData?.PackageStartDate ?? moment().format('YYYY-MM-DD'));

  const formattedData = userData?.packageItems.map((item) => ({
    itemId: item?.Id,
    itemRef: item?.Ref,
    itemName: item.ItemName,
    itemWeekdayPrice: item.ItemWeekdayPrice,
    itemWeekendPrice: item.ItemWeekendPrice,
    itemWeekdayRate: item?.ItemWeekdayRate,
    itemWeekendRate: item?.ItemWeekendRate,
    itemTax: item.ItemTax,
    itemTaxName: item.ItemTaxName,
    isDeductable: item.IsDeductable,
    taxDiffWeekday: item?.TaxDiffWeekday,
    taxDiffWeekend: item?.TaxDiffWeekend,
  }));

  const todayDate = moment().format("YYYY-MM-DD");

  const [packageName, setPackageName] = useState(
    userData?.PackageName ? userData?.PackageName : ""
  );
  const [packageDescription, setPackageDescription] = useState(
    userData?.PackageDescription ? userData?.PackageDescription : ""
  );
  const [packageWeekdayPrice, setPackageWeekdayPrice] = useState(
    userData?.PackageWeekdayPrice ? userData?.PackageWeekdayPrice : 0
  );
  const [packageWeekendPrice, setPackageWeekendPrice] = useState(
    userData?.PackageWeekendPrice ? userData?.PackageWeekendPrice : 0
  );
  const [packageItems, setPackageItems] = useState(
    formattedData ? formattedData : []
  );
  const [packageTeensPrice, setPackageTeensPrice] = useState(
    userData?.PackageTeensPrice ? userData?.PackageTeensPrice : ""
  );

  const [packageTeensTax, setPackageTeensTax] = useState(
    userData?.PackageTeensTaxName ? userData?.PackageTeensTaxName : ""
  );

  const [packageTeensPercentage, setPackageTeensPercentage] = useState(
    userData?.PackageTeensTax ? userData?.PackageTeensTax : ""
  );

  const [packageEnabled, setPackageEnabled] = useState(
    userData?.packageEnabled ? userData?.packageEnabled : 0
  );

  const actualTeensRate =
    packageTeensPrice / (1 + packageTeensPercentage / 100);

  console.log("actualRate----------->", actualTeensRate);

  console.log("PackageTeensTaxName--------------->", packageTeensTax);

  const [packageActive, setPackageActive] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [itemWeekendPrice, setItemWeekendPrice] = useState();
  const [itemWeekdayPrice, setItemWeekdayPrice] = useState();
  const [itemName, setItemName] = useState();
  const [itemTax, setItemTax] = useState();

  const handleAddItem = () => {
    setPackageItems([
      ...packageItems,
      {
        itemName: "",
        itemWeekdayPrice: 0,
        itemWeekendPrice: 0,
        itemTax: 0,
        isDeductable: 0,
        itemWeekdayRate: 0,
        itemWeekendRate: 0,
        itemTaxName: "",
      },
    ]);
  };

  const handleItemInputChange = (index, field, value) => {
    const updatedItems = [...packageItems];
    updatedItems[index][field] = value;

    if (
      field === "itemWeekdayPrice" ||
      field === "itemWeekendPrice" ||
      field === "itemTax"
    ) {
      const { itemWeekdayPrice, itemWeekendPrice, itemTax } =
        updatedItems[index];
      const calculatedWeekdayRate = calculateInvoiceAmount(
        itemWeekdayPrice,
        itemTax
      );
      const calculatedWeekendRate = calculateInvoiceAmount(
        itemWeekendPrice,
        itemTax
      );

      console.log("calculatedWeekdayRate----------->", calculatedWeekdayRate);
      console.log("calculatedWeekendRate----------->", calculatedWeekendRate);

      updatedItems[index].itemWeekdayRate = (calculatedWeekdayRate * 100) / 100;
      updatedItems[index].itemWeekendRate = (calculatedWeekendRate * 100) / 100;

      updatedItems[index].taxDiffWeekday =
        itemWeekdayPrice - calculatedWeekdayRate;
      updatedItems[index].taxDiffWeekend =
        itemWeekendPrice - calculatedWeekendRate;
    }
    console.log("updatedItems------------->", updatedItems);
    setPackageItems(updatedItems);
  };

  const areFieldsFilled = () => {
    return (
      packageName !== "" &&
      packageDescription !== "" &&
      packageItems.length > 0 &&
      packageItems[0]?.itemName !== "" &&
      packageItems[0]?.itemWeekdayPrice !== 0 &&
      packageItems[0]?.itemWeekendPrice !== 0 &&
      packageItems[0]?.itemTax !== 0 &&
      packageWeekdayPrice !== "" &&
      packageWeekendPrice !== "" && !!startDate
    );
  };

  useEffect(() => {
    setIsButtonDisabled(!areFieldsFilled());
  }, [
    packageName,
    packageDescription,
    packageItems,
    packageWeekdayPrice,
    packageWeekendPrice,
  ]);

  const [isChecked, setIsChecked] = useState(
    userData?.IsPackageEnabled ? userData?.IsPackageEnabled : 0
  );

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  function calculateInvoiceAmount(packagePrice, taxRate) {
    const invoiceAmount = (packagePrice * 100) / (100 + taxRate);
    console.log("<---------------invoiceAmount------------->", invoiceAmount);
    return invoiceAmount;
  }

  const handleSubmit = () => {
    if (
      packageName == "" ||
      packageDescription == "" ||
      packageItems == "" ||
      packageWeekdayPrice == "" ||
      packageWeekendPrice == ""
    ) {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        packageName: packageName,
        packageDescription: packageDescription,
        packageWeekdayPrice: parseInt(packageWeekdayPrice),
        packageWeekendPrice: parseInt(packageWeekendPrice),
        numOfItems: packageItems.length,
        packageItems: packageItems,
        packageTeensPrice: packageTeensPrice,
        packageTeensRate: actualTeensRate,
        packageTeensTax: packageTeensPercentage,
        packageTeensTaxName: packageTeensTax,
        isPackageEnabled: startDate === new Date().toISOString().substring(0,10) ? 1 : 0,
        startDate: startDate
      };
      console.log("Data-------->", data);

      setLoading(true);
      dispatch(
        AddPackageDetails(data, loginDetails?.logindata?.Token, (callback) => {
          if (callback.status) {
            setLoading(false);
            toast.success("Package Added");
            navigate(-1);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };
  const handlePackageEdit = () => {
    const data = {
      packageId: userData?.Id,
      packageRef: userData?.Ref,
      packageName: packageName,
      packageDescription: packageDescription,
      packageWeekdayPrice: parseInt(packageWeekdayPrice),
      packageWeekendPrice: parseInt(packageWeekendPrice),
      numOfItems: packageItems.length,
      packageItems: packageItems,
      packageTeensPrice: packageTeensPrice,
      packageTeensRate: actualTeensRate,
      packageTeensTax: packageTeensPercentage,
      packageTeensTaxName: packageTeensTax,
      isPackageEnabled: isChecked == "1" ? 1 : 0,
    };
    console.log("dataaaaa------------>", data);
    console.log(
      "<------------packageItems----------->",
      loginDetails?.logindata?.Token
    );

    dispatch(
      editPackage(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          toast.success("Package Edited");
          navigate(-1);
          toast.error(callback.error);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const handleRemoveItem = (indexToRemove) => {
    console.log("Handle remove item", indexToRemove);
    const updatedItems = packageItems.filter(
      (_, index) => index !== indexToRemove
    );
    setPackageItems(updatedItems);
    console.log("Updated Items------------------>", updatedItems);
  };

  console.log("packageItems---->", packageItems);

  return (
    <div>
      {" "}
      <div className="row">
        <ToastContainer />
        <h3 className="mb-4">Add Package</h3>
        <div className="col-lg-6 mt-3 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Package Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2 "
            type="text"
            placeholder="Package Name"
            disabled={userData ? true : false}
            onChange={(e) => setPackageName(e.target.value)}
            defaultValue={userData?.PackageName}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label
            for="formGroupExampleInput "
            className="form_text"
            style={{ fontSize: "15px", fontWeight: "600" }}
          >
            Package Description <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter Description"
            onChange={(e) => setPackageDescription(e.target.value)}
            defaultValue={userData?.PackageDescription}
          />
        </div>
        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Package Weekdays Price <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            onWheel={(e) => e.target.blur()}
            type="number"
            min={0}
            placeholder="Package Weekdays Price"
            onChange={(e) => setPackageWeekdayPrice(e.target.value)}
            defaultValue={userData?.PackageWeekdayPrice}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Package Weekend Price <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            type="number"
            onWheel={(e) => e.target.blur()}
            min={0}
            placeholder="Package Weekend Price"
            onChange={(e) => setPackageWeekendPrice(e.target.value)}
            defaultValue={userData?.PackageWeekendPrice}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Teens Price <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            type="number"
            min={0}
            onWheel={(e) => e.target.blur()}
            placeholder="Teens Price"
            onChange={(e) => setPackageTeensPrice(e.target.value)}
            defaultValue={userData?.PackageTeensPrice}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Teens Tax Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            type="text"
            value={packageTeensTax.toUpperCase()}
            placeholder="Teens Tax Name"
            onChange={(e) => setPackageTeensTax(e.target.value.toUpperCase())}
            defaultValue={userData?.PackageTeensTaxName}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Teens Tax % <span style={{ color: "red" }}>*</span>
          </label>
          <input
            min={0}
            onWheel={(e) => e.target.blur()}
            class="form-control mt-2"
            type="number"
            placeholder="Teens Tax %"
            onChange={(e) => setPackageTeensPercentage(e.target.value)}
            defaultValue={userData?.PackageTeensTax}
          />
        </div>

        <div className="col-lg-6 mt-3">
      
            <label for="formGroupExampleInput " className="form_text">
              Start Date <span style={{ color: "red" }}>*</span>
            </label>
            <input
              class="form-control mt-2"
              type="date"
              placeholder="Enter Start Date"
              onChange={(e) => {
                setStartDate(e.target.value)}}
              disabled={userData}
              value={startDate}
              // defaultValue={moment(userData?.StartDate).format("YYYY-MM-DD")}
              min={todayDate}
            />
          
        </div>

        {userData ? (
          <div className="col-lg-6 mt-5">
            <div className="form-check form-switch">
              <label for="formGroupExampleInput " className="form_text">
                Is package active
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="switch"
                checked={isChecked}
                onChange={handleToggle}
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        {!userData ? (
          <div className="row mt-4">
            {packageItems.map((item, index) => (
              <div key={index} className="col-lg-6 mb-5">
                <div className="row">
                  <div className="col-lg-6">
                    <h4 className="mb-3">Item {index + 1} </h4>
                  </div>
                  <div className="col-lg-6 d-flex justify-content-end">
                    <img
                      src={cancel}
                      className="cancel_img"
                      onClick={() => handleRemoveItem(index)}
                    />
                  </div>
                </div>

                <label for="formGroupExampleInput " className="form_text">
                  Item Name <span style={{ color: "red" }}>*</span>
                </label>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Item Name"
                  value={item.itemName}
                  onChange={(e) =>
                    handleItemInputChange(index, "itemName", e.target.value)
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Weekday Price <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  onWheel={(e) => e.target.blur()}
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Weekday Price"
                  min={0}
                  value={item.itemWeekdayPrice}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemWeekdayPrice",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Weekend Price <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  onWheel={(e) => e.target.blur()}
                  className="form-control mb-2"
                  placeholder="Item Weekend Price"
                  value={item.itemWeekendPrice}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemWeekendPrice",
                      parseFloat(e.target.value)
                    )
                  }
                />

                <label for="formGroupExampleInput " className="form_text">
                  Tax Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Item Tax Name"
                  value={item.itemTaxName.toUpperCase()}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemTaxName",
                      e.target.value.toUpperCase()
                    )
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Tax % <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  onWheel={(e) => e.target.blur()}
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Tax"
                  value={item.itemTax}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemTax",
                      parseFloat(e.target.value)
                    )
                  }
                />

                <label for="formGroupExampleInput " className="form_text">
                  Discount to be deducted
                </label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={item.isDeductable}
                    onChange={(e) =>
                      handleItemInputChange(
                        index,
                        "isDeductable",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                  <label className="form-check-label">Deductable</label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}

        {userData ? (
          <div className="row mt-4">
            {packageItems?.map((item, index) => (
              <div key={index} className="col-lg-6 mb-5">
                <div className="row">
                  <div className="col-lg-6">
                    <h4 className="mb-3">Item {index + 1}</h4>
                  </div>
                  {!userData ? (
                    <div className="col-lg-6 d-flex justify-content-end">
                      <img
                        src={cancel}
                        className="cancel_img"
                        onClick={() => handleRemoveItem(index)}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <label for="formGroupExampleInput " className="form_text">
                  Item Name
                </label>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Item Name"
                  defaultValue={item.itemName}
                  onChange={(e) =>
                    handleItemInputChange(index, "itemName", e.target.value)
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  weekday Price
                </label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Weekday Price"
                  defaultValue={item.itemWeekdayPrice}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemWeekdayPrice",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Weekend Price
                </label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Weekend Price"
                  defaultValue={item.itemWeekendPrice}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemWeekendPrice",
                      parseFloat(e.target.value)
                    )
                  }
                />

                <label for="formGroupExampleInput " className="form_text">
                  Tax Name
                </label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Item Tax Name"
                  value={item.itemTaxName}
                  onChange={(e) =>
                    handleItemInputChange(index, "itemTaxName", e.target.value)
                  }
                />
                <label for="formGroupExampleInput " className="form_text">
                  Tax %
                </label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Item Tax"
                  defaultValue={item.itemTax}
                  onChange={(e) =>
                    handleItemInputChange(
                      index,
                      "itemTax",
                      parseFloat(e.target.value)
                    )
                  }
                />

                <label for="formGroupExampleInput " className="form_text">
                  Discount to be deducted
                </label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked={item?.isDeductable == 1 ? true : false}
                    onChange={(e) =>
                      handleItemInputChange(
                        index,
                        "IsDeductable",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                  <label className="form-check-label">Deductable</label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}

        {!userData ? (
          <div className="col-lg-12 mt-3">
            <button
              type="button"
              className="btn btn_colour mb-3"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>
        ) : (
          <></>
        )}

        {!userData ? (
          <div className="row mx-auto">
            <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
              <button
                style={{ paddingLeft: "150px", paddingRight: "150px" }}
                type="submit"
                className="btn btn_colour mt-5 btn-lg"
                onClick={handleSubmit}
                disabled={isButtonDisabled || loading}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="row mx-auto">
            <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
              <button
                style={{ paddingLeft: "150px", paddingRight: "150px" }}
                type="submit"
                className="btn btn_colour mt-5 btn-lg"
                onClick={handlePackageEdit}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPackage;
