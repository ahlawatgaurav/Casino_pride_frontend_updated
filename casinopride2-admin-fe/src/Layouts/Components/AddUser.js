import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  AddUserDetails,
  EditUserDetails,
  addQrCodeLink,
} from "../../Redux/actions/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/global.css";
import QRCode from "qrcode";
import { uploadQRFile } from "../../Redux/actions/users";

const AddUser = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;

  console.log("<--------userType------->", userType);

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const [fullName, setFullName] = useState(
    userData?.Name ? userData?.Name : ""
  );
  const [address, setAddress] = useState(
    userData?.Address ? userData?.Address : ""
  );
  const [email, setEmail] = useState(userData?.Email ? userData?.Email : "");
  const [phone, setPhone] = useState(userData?.Phone ? userData?.Phone : "");
  const [userName, setUsername] = useState(
    userData?.Username ? userData?.Username : ""
  );
  const [password, setPassword] = useState(
    userData?.Password ? userData?.Password : ""
  );
  const [discountPercent, setDiscountPercent] = useState(
    userData?.DiscountPercent ? userData?.DiscountPercent : 0
  );
  const [monthlysettlement, setMonrhtlysettlement] = useState(
    userData?.MonthlySettlement ? userData?.MonthlySettlement : 0
  );

  const [isChecked, setIsChecked] = useState(
    userData?.IsUserEnabled ? userData?.IsUserEnabled : 0
  );

  const [disableAddUserButton, setDisableAddUserButton] = useState(false);

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const phonePattern = /^\d{1,10}$/;
    return phonePattern.test(phone);
  };

  console.log(
    "userData?.isUserEnabled-------------->",
    userData?.IsUserEnabled
  );

  const isValidPassword = (password) => {
    // At least one uppercase letter, one digit, and one special character
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };
  const onsubmit = () => {
    setDisableAddUserButton(true);
    console.log("onsubmit", email);
    if (fullName == "") {
      toast.warning("Please fill all the fields");
      setDisableAddUserButton(false);
    } else if (!isValidEmail(email) && email != "") {
      console.log("isValidEmail");
      toast.warning("Please enter a valid email address");
      setDisableAddUserButton(false);
    } else if (
      (userType == 2 && userName == "") ||
      (userType == 2 && password == "") ||
      (userType == 3 && userName == "") ||
      (userType == 3 && password == "") ||
      (userType == 4 && userName == "") ||
      (userType == 4 && password == "") ||
      (userType == 5 && userName == "") ||
      (userType == 5 && password == "") ||
      (userType == 6 && discountPercent == "") ||
      (userType == 7 && userName == "") ||
      (userType == 7 && password == "")
    ) {
      toast.warning("Please enter all the fields");
      setDisableAddUserButton(false);
    }

    // else if (phone.length > 10 || phone.length < 10) {
    //   toast.warning("Please enter a valid phone number (up to 10 digits)");
    // }
    // else if (!isValidPassword(password)) {
    //   toast.warning(
    //     "Password must contain at least one uppercase letter, one digit, and one special character"
    //   );
    // }
    else {
      const data = {
        firebaseUUID: "9876590",
        name: fullName,
        address: address,
        email: email,
        phone: phone,
        userName: userName,
        password: password,
        userType: userType,
        discountPercent: discountPercent,
        monthlySettlement: monthlysettlement,
        isUserEnabled: 1,
        isActive: 1,
      };

      dispatch(
        AddUserDetails(data, loginDetails?.logindata?.Token, (callback) => {
          if (callback.status) {
            if (
              callback?.response?.Details?.UserType == 6 ||
              callback?.response?.Details?.UserType == 8
            ) {
              setDisableAddUserButton(true);
              dispatch(
                addQrCodeLink(
                  loginDetails?.logindata?.Token,
                  callback?.response?.Details?.Id,
                  callback?.response?.Details?.UserType,
                  (callback) => {
                    if (callback.status) {
                      QRCode.toCanvas(
                        document.createElement("canvas"),
                        callback?.response?.Details?.QRLink,
                        (error, canvas) => {
                          if (error) {
                            console.error("QR code generation error:", error);
                          } else {
                            const qrCodeDataURL = canvas.toDataURL("image/png");
                            console.log(
                              "check qrCodeDataURL>>>.",
                              qrCodeDataURL
                            );
                            console.log(
                              "callback?.response?.Details?.Id>>>.",
                              callback?.response?.Details?.Id
                            );
                            // Convert the data URL to a blob
                            const imageBlob = dataURLtoBlob(qrCodeDataURL);
                            console.log("imageBlob>>", imageBlob);
                            // setQRCodeImage(qrCodeDataURL);
                            const formData = new FormData();
                            formData.append(
                              "File",
                              imageBlob,
                              `${callback?.response?.Details?.Id}user.png`
                            );
                            formData.append(
                              "userId",
                              callback?.response?.Details?.Id
                            );

                            dispatch(
                              uploadQRFile(
                                loginDetails?.logindata?.Token,
                                formData,
                                (callback) => {
                                  if (callback.status) {
                                    console.log(
                                      "uploadQRFile>>callback>>",
                                      callback
                                    );
                                    toast.success("User Added");
                                    setDisableAddUserButton(false);
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
                    }
                  }
                )
              );
            } else {
              navigate(-1);
              setDisableAddUserButton(false);
              toast.success("User Added");
            }

            toast.error(callback.error);
          } else {
            toast.error(callback.error);
            setDisableAddUserButton(false);
          }
        })
      );
    }
  };

  function dataURLtoBlob(dataURL) {
    console.log("dataURLtoBlob>>>dataURL>>>", dataURL);
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

  const onSubmitEdit = () => {
    setDisableAddUserButton(true);
    if (fullName == "") {
      toast.warning("Please fill all the fields");
    } else {
      const data = {
        userId: userData?.Id,
        firebaseUUID: "9876590",
        name: fullName,
        address: address,
        email: email,
        phone: phone,
        userName: userName,
        password: password,
        userType: userData?.UserType,
        discountPercent: discountPercent,
        monthlySettlement: monthlysettlement,
        QRLink: userData?.QRLink,
        NumOfBookings: userData?.NumOfBookings,
        userRef: userData?.Ref,
        isUserEnabled: isChecked,
        isActive: 1,
      };

      dispatch(
        EditUserDetails(data, loginDetails?.logindata?.Token, (callback) => {
          if (callback.status) {
            toast.success("User Edited");
            navigate(-1);
            setDisableAddUserButton(false);
            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        })
      );
    }
  };

  const [disabled, setDisabled] = useState(true);

  const handleToggle = () => {
    setIsChecked((prevValue) => (prevValue === 0 ? 1 : 0));
  };

  console.log("isChecked---->", isChecked);

  console.log(
    "userData?.UserType--------------------------->",
    userData?.UserType
  );

  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [updatedQrcodeImage, setUpatedQrcodeImage] = useState("");

  useEffect(() => {
    QRCode.toCanvas(
      document.createElement("canvas"),
      updatedQrcodeImage,
      (error, canvas) => {
        if (error) {
          console.error("QR code generation error:", error);
        } else {
          const qrCodeDataURL = canvas.toDataURL("image/png");
          setQRCodeImage(qrCodeDataURL);
        }
      }
    );
  }, [updatedQrcodeImage]);

  const open = (imageUrl) => {
    // window.open("_blank")
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "downloaded-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Use a regular expression to check if the input contains only alphabets
    const isValidInput = /^[a-zA-Z\s]*$/.test(inputValue);
    console.log("kho gaye>>", isValidInput);
    if (!isValidInput) {
      console.log("!isValidInput");
      // setFullName(inputValue);
      e.preventDefault();
    } else {
      setFullName(inputValue);
    }
  };

  // const handleInputChange = (e) => {
  //   const inputText = e.target.value;
  //   // Use regular expression to match only numbers and limit to 2 digits
  //   const regex = /^[0-9]{0,2}$/;
  //   if (regex.test(inputText)) {
  //     if (
  //       inputText === "" ||
  //       (parseInt(inputText, 10) >= 0 && parseInt(inputText, 10) <= 99)
  //     ) {
  //       // setcouponDiscount(inputText);
  //     }
  //   }
  // };

  return (
    <div>
      <ToastContainer />
      <div className="row">
        {userType == 2 ? (
          <h3 className="mb-4">{userData ? "Edit Manager" : "Add Manager"}</h3>
        ) : (
          <></>
        )}
        {userType == 3 ? (
          <h3 className="mb-4">{userData ? "Edit GRE" : "Add GRE"}</h3>
        ) : (
          <></>
        )}
        {userType == 4 ? (
          <h3 className="mb-4">
            {userData ? "Edit Master Agent" : "Add Master Agent"}
          </h3>
        ) : (
          <></>
        )}

        {userType == 5 ? (
          <h3 className="mb-4">
            {userData ? "Edit  Travel Agent" : "Add Travel Agent"}
          </h3>
        ) : (
          <></>
        )}
        {userType == 6 ? (
          <h3 className="mb-4">
            {userData ? "Edit Taxi Agent " : "Add Taxi Agent"}
          </h3>
        ) : (
          <></>
        )}

        {userType == 7 ? (
          <h3 className="mb-4">
            {userData ? "Edit Accounts" : "Add Accounts"}
          </h3>
        ) : (
          <></>
        )}
        {userType == 8 ? (
          <h3 className="mb-4">
            {userData ? "Edit Local Agent" : "Add Local Agent"}
          </h3>
        ) : (
          <></>
        )}

        <div className="col-lg-6 mt-3 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Full Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            class="form-control mt-2 "
            type="text"
            disabled={userData ? disabled : ""}
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            // onChange={(e) => handleInputChange(e)}
            // onkeydown={(event) => {
            //   // if (event.key == "." || event.key === "-") {
            //   if (event.key == /^[0-9]{0,2}$/) {
            //     event.preventdefault();
            //   }
            // }}
            defaultValue={userData?.Name}
          />
        </div>

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Phone
            {/* <span style={{ color: "red" }}>*</span> */}
          </label>
          <input
            class="form-control mt-2"
            type="number"
            // disabled={userData ? disabled : ""}
            disabled={userData?.Phone != null ? disabled : ""}
            placeholder="Enter phone"
            onChange={(e) => setPhone(e.target.value)}
            defaultValue={userData?.Phone}
            maxLength="10"
          />
        </div>
        {userType == 6 || userType == 8 ? (
          <></>
        ) : (
          <div className="col-lg-6 mt-3">
            <label
              for="formGroupExampleInput "
              className="form_text"
              style={{ fontSize: "15px", fontWeight: "600" }}
            >
              Email
              {/* <span style={{ color: "red" }}>*</span> */}
            </label>
            <input
              class="form-control mt-2"
              type="text"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              defaultValue={userData?.Email}
            />
          </div>
        )}

        <div className="col-lg-6 mt-3">
          <label for="formGroupExampleInput " className="form_text">
            Address
            {/* <span style={{ color: "red" }}>*</span> */}
          </label>
          <input
            class="form-control mt-2"
            type="text"
            placeholder="Enter your address"
            onChange={(e) => setAddress(e.target.value)}
            defaultValue={userData?.Address}
          />
        </div>

        {userType == 6 || userType == 8 ? (
          <></>
        ) : (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Username <span style={{ color: "red" }}>*</span>
            </label>
            <input
              class="form-control mt-2"
              type="text"
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
              defaultValue={userData?.Username}
            />
          </div>
        )}

        {userType == 6 || userType == 8 ? (
          <></>
        ) : (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Password <span style={{ color: "red" }}>*</span>
            </label>
            <input
              class="form-control mt-2"
              type="text"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              defaultValue={userData?.Password}
            />
          </div>
        )}

        {userType == "5" ||
        userType == "6" ||
        userData?.UserType == "5" ||
        userData?.UserType == "6" ? (
          <div className="col-lg-6 mt-3">
            {userType == "5" || userData?.UserType == "5" ? (
              <label for="formGroupExampleInput " className="form_text">
                Travel Agent Commission <span style={{ color: "red" }}>*</span>
              </label>
            ) : (
              <label for="formGroupExampleInput " className="form_text">
                Discount Percentage <span style={{ color: "red" }}>*</span>
              </label>
            )}
            <input
              class="form-control mt-2"
              type="number"
              placeholder="Discount Percentage"
              onChange={(e) => setDiscountPercent(e.target.value)}
              defaultValue={userData?.DiscountPercent}
            />
          </div>
        ) : (
          <></>
        )}
        {userType == "5" ||
        userData?.UserType == "5" ||
        userData?.UserType == "6" ? (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Monthly settlement
            </label>
            <input
              class="form-control mt-2"
              type="text"
              // disabled={!userData}
              disabled={true}
              placeholder="0"
              onChange={(e) => setMonrhtlysettlement(e.target.value)}
              defaultValue={userData?.MonthlySettlement}
            />
          </div>
        ) : (
          <></>
        )}

        {(userData && userType == 6) || (userData && userType == 8) ? (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              QR Link <span style={{ color: "red" }}>*</span>
            </label>
            {/* <input
              class="form-control mt-2"
              type="text"
              placeholder="password"
              disabled
              defaultValue={userData?.QRLink}
            /> */}
            <p style={{ marginTop: "20px", fontSize: "15px" }}>
              {userData?.QRLink}
            </p>
          </div>
        ) : (
          <></>
        )}

        {userData ? (
          <div className="col-lg-6 mt-5">
            <div className="form-check form-switch">
              <label for="formGroupExampleInput " className="form_text">
                Is user enabled?
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="switch"
                checked={isChecked === 1}
                onChange={handleToggle}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
        {userData?.QRFile != null ? (
          <div className="col-lg-6 mt-3">
            <label for="formGroupExampleInput " className="form_text">
              Click to download QR Code <span style={{ color: "red" }}>*</span>
            </label>
            <div
              onClick={() => {
                open(userData?.QRFile);
              }}
            >
              {" "}
              <img src={userData?.QRFile} alt="Description of the image" />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {!userData ? (
        <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
          <button
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
            type="submit"
            className="btn btn_colour mt-5 btn-lg"
            onClick={onsubmit}
            disabled={disableAddUserButton}
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
          <button
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
            type="submit"
            className="btn btn_colour mt-5 btn-lg"
            onClick={onSubmitEdit}
            disabled={disableAddUserButton}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
