import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AddDiscountOnPanelFn,
  AddagentDiscountsFn,
  EditPanelDiscounts,
  EditagentDiscountsFn,
  uploadAgentDiscountQRFileFn,
} from "../../Redux/actions/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/global.css";
import moment from "moment";
import QRCode from "qrcode";

const AddDiscountAgent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state || {};
  const { userData } = location.state || {};
  const todayDate = moment().format("YYYY-MM-DD");

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [usedCoupons, setusedCoupons] = useState([]);
  const [remainingCoupons, setremainingCoupons] = useState("");
  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const [discountTitle, setDiscountTitle] = useState(
    userData?.PanelDiscountTitle ? userData?.PanelDiscountTitle : ""
  );
  const [discountAmount, setDiscountAmount] = useState(
    userData?.DiscountPercent ? userData?.DiscountPercent : ""
  );

  const [isChecked, setIsChecked] = useState(
    userData?.IsAgentDiscountEnabled ? userData?.IsAgentDiscountEnabled : 0
  );

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleDiscountChange = (e) => {
    let inputValue = parseFloat(e.target.value);

    if (isNaN(inputValue) || inputValue < 0) {
      inputValue = "";
    } else if (inputValue > validateDetails?.Details?.DiscountPercent) {
      //checking if the discount that is added is more than the discount percent of the agent
      inputValue = validateDetails?.Details?.DiscountPercent;
    }
    setDiscountAmount(inputValue);
  };

  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  const onsubmit = () => {
    if (discountAmount == "") {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        agentDiscountPercent: discountAmount,
        userId: loginDetails?.logindata?.userId,
        // userTypeId: loginDetails?.logindata?.userTypeId,
        userTypeId: loginDetails?.logindata?.UserType,
        isAgentDiscountEnabled: 1,
        isActive: 1,
      };
      dispatch(
        AddagentDiscountsFn(
          data,
          loginDetails?.logindata?.Token,
          (callback) => {
            if (callback.status) {
              var newCanvas = document.createElement("canvas");
              newCanvas.id = "dynamicCanvas";

              QRCode.toCanvas(
                newCanvas,
                callback?.response?.Details?.QRLink,
                {
                  margin: 20
                },
                (error, canvas) => {
                  if (error) {
                    console.error("QR code generation error:", error);
                  } else {
                    var ctx = canvas.getContext("2d");
                    const imgWidth = 150;
                    var centerX = canvas.width / 2;
                    ctx.font='bold 12px Arial';
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";
                    const img = document.getElementById("casinoPrideLogo");
                    ctx.drawImage(img, centerX - imgWidth / 2, 10, imgWidth, 50);
                    
                    ctx.fillText(
                      `Discount Percentage: ${discountAmount}%`,
                      centerX,
                      canvas.height - 40
                    );
                    ctx.fillText(
                      `Discount Code: ${callback?.response?.Details?.DiscountCode}`,
                      centerX,
                      canvas.height - 25
                    );

                    const qrCodeDataURL = canvas.toDataURL("image/png");

                    // Convert the data URL to a blob
                    const imageBlob = dataURLtoBlob(qrCodeDataURL);
                    // setQRCodeImage(qrCodeDataURL);
                    const formData = new FormData();
                    formData.append(
                      "File",
                      imageBlob,
                      `${callback?.response?.Details?.Id}Agentdiscount.png`
                    );
                    formData.append(
                      "agentDiscountId",
                      callback?.response?.Details?.Id
                    );

                    dispatch(
                      uploadAgentDiscountQRFileFn(
                        formData,
                        loginDetails?.logindata?.Token,

                        (callback) => {
                          if (callback.status) {
                            console.log("uploadQRFile>>callback>>", callback);
                            toast.success("Discount Added");
                            navigate(-1);
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  }
                }
              );
            } else {
              toast.error(callback.error);
            }
          }
        )
      );
    }
  };

  return (
    <div>
      {" "}
      <ToastContainer />{" "}
      <div className="row">
        <h3 className="mb-4">Add Agents Discount</h3>

        <div className="col-lg-6 mt-3">
          <label
            for="formGroupExampleInput "
            className="form_text"
            style={{ fontSize: "15px", fontWeight: "600" }}
          >
            Discount Percent <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2"
            value={discountAmount}
            type="number"
            placeholder="Enter Discount % "
            onChange={(e) => handleDiscountChange(e)}
            defaultValue={userData?.DiscountPercent}
          />
        </div>

        {userData ? (
          <div className="col-lg-6 mt-5">
            <div className="form-check form-switch">
              <label for="formGroupExampleInput " className="form_text">
                Is Discount active?
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
          <div className="mt-5">
            <button onClick={onsubmit} className="btn btn-primary">
              Add Discount
            </button>
          </div>
        ) : (
          <div className="mt-5">Update Discount</div>
        )}
      </div>
    </div>
  );
};

export default AddDiscountAgent;
