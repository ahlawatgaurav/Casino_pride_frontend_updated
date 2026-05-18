import React, { useEffect, useState } from "react";
import "../../../assets/global.css";
import checkcircle from "../../../assets/Images/checkcircle.png";
import xcircle from "../../../assets/Images/xcircle.png";

import { Card, Button, Modal, Form } from "react-bootstrap";
import { openOutletFunction } from "../../../Redux/actions/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { checkShiftForUser } from "../../../Redux/actions/users";
import { recentShiftForOutlet } from "../../../Redux/actions/users";
import { openShiftFn } from "../../../Redux/actions/users";
import { closeShiftFn } from "../../../Redux/actions/users";
import { closeOutletFunction } from "../../../Redux/actions/users";
import { reopenShiftFunction } from "../../../Redux/actions/users";
import api from "../../../Service/api";
import { saveOutletDetails } from "../../../Redux/reducers/auth";
import { checkCurrentOutletFn } from "../../../Redux/actions/users";
import { Oval } from "react-loader-spinner";
import { checkActiveOutlet } from "../../../Redux/actions/users";

const Shifts = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  const validateDetails = useSelector(
    (state) => state.auth?.userDetailsAfterValidation
  );

  const activeDateOfOutlet = useSelector(
    (state) => state.users?.saveOutletDate?.Details
  );
  const [outletId, setOutletId] = useState("");

  const outletOpenDetails = useSelector((state) => state.auth?.outeltDetails);

  console.log(
    "Outelt details-----------------------||||||||||||||||||||||||--------------------------->",
    outletOpenDetails
  );

  console.log(
    "validateDetails----------------------------->",
    validateDetails?.Details?.Password,
    validateDetails?.Details?.Username
  );
  const today = moment().format("YYYY-MM-DD");

  const [loader, setLoader] = useState(true);

  console.log(
    "TODAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY-------------------------->",
    today
  );

  console.log(
    "activeDateOfOutlet-----------------------------------------------<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<>>>>>>>>>>>>>>..----------------***************************************************************8-->",
    activeDateOfOutlet?.OutletDate
  );

  useEffect(() => {
    api.CORE_PORT.get(
      `/core/checkCurrentOutlet?outletDate=${
        !checkActiveOtlet ? activeDateOfOutlet?.OutletDate : today
      }`,
      {
        headers: {
          AuthToken: loginDetails?.logindata?.Token,
        },
      }
    ).then((response) => {
      console.log(
        "checkCurrentOutlet-------------------------------------------------->>>>>> -->",
        response.data
      );
      setOutletId(response.data?.Details[0]?.Id);
    });
  }, []);

  const formattedDate = moment().format("YYYY-MM-DD");

  const parsedDate = moment(outletOpenDetails?.Details[0]?.Date);
  const outletFormattedData = parsedDate.format("YYYY-MM-DD");

  const [outletOpen, setOutletOpen] = useState(false);

  const [shift1close, setShift1close] = useState(false);
  const [shift2Close, setShift2Close] = useState(false);
  const [shift3Close, setShift3close] = useState(false);

  //from api integration ---------------->

  const [checkOutletOpen, setCheckOutletOpen] = useState(false);

  const [checkShift1Open, setCheckShift1Open] = useState(false);
  const [checkShift1Close, setCheckShift1Close] = useState(false);
  const [checkShift2Open, setCheckShift2open] = useState(false);
  const [checShift2Close, setCheckShift2Close] = useState(false);
  const [checkShift3Open, setCheckShift3Open] = useState(false);
  const [checkShift3Close, setCheckShift3Close] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [outletModalOpen, setOutletModalOpen] = useState(false);

  const [shiftDetails, setShiftDetails] = useState("");
  const [outletDetails, setOutletDetails] = useState("");

  //reopen logic----------------->
  const [reopenShift1, setReopenShift1] = useState(false);
  const [reopenShift2, setReopenShift2] = useState(false);
  const [reopenShift3, setReopenShift3] = useState(false);

  const openOutletModal = () => {
    setOutletModalOpen(true);
  };

  const closeOutletModal = () => {
    setOutletModalOpen(false);
  };

  const openOutletFn = () => {
    setOutletOpen(true);
    setOutletModalOpen(false);
    onsubmit();
  };

  const date = moment(); // Current date and time
  const time = date.format("HH:mm");

  const openShiftOne = () => {
    const data = {
      outletDate: activeDateOfOutlet?.OutletDate,
      shiftTypeId: 1,
      userType: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
      openTime: time,
    };

    dispatch(
      openShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Ope outlet called------------->", callback);
          setCheckShift1Open(true);
          setCheckOutletOpen(false);
          setShiftDetails(callback?.response?.Details);
          toast.success("Shift 1 is opened");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const closeShiftOne = () => {
    const data = {
      outletId: outletId,
      shiftId: 1,
      closeTime: time,
      userTypeId: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
    };

    dispatch(
      closeShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Close shift called------------->", callback);
          setCheckShift1Close(true);
          setShiftDetails(callback?.response?.Details[0]);
          setCheckShift2open(true);
          toast.success("Shift 1 is Closed");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const openShiftTwo = () => {
    const data = {
      outletDate: activeDateOfOutlet?.OutletDate,
      shiftTypeId: 2,
      userType: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
      openTime: time,
    };

    dispatch(
      openShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Open shift 2  called------------->", callback);
          setShiftDetails(callback?.response?.Details);
          setCheckShift2open(false);
          setReopenShift1(true);
          toast.success("Shift 2 is opened");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const [checkActiveOtlet, setCheckActiveOutlet] = useState();

  console.log(
    "CHECK IF TRUEEEEEEEEEEEEEEEEEEE ORRRRRRRRRRRRRRRRRRRR FALSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS---------->",
    checkActiveOtlet
  );

  const closeShiftTwo = () => {
    const data = {
      outletId: outletId,
      shiftId: 2,
      closeTime: time,
      userTypeId: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
    };

    dispatch(
      closeShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Close 2 shift called------------->", callback);

          setShiftDetails(callback?.response?.Details[0]);
          setCheckShift2Close(false);
          setCheckShift3Open(true);
          setReopenShift2(true);
          toast.success("Shift 2 is Closed");

          setReopenShift1(false);
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const openSHiftThree = () => {
    const data = {
      outletDate: activeDateOfOutlet?.OutletDate,
      shiftTypeId: 3,
      userType: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
      openTime: time,
    };

    dispatch(
      openShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Open shift 2  called------------->", callback);

          setShiftDetails(callback?.response?.Details);
          setCheckShift3Open(true);
          setCheckShift2open(false);
          toast.success("Shift 3 is opened");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const closeSHiftThree = () => {
    const data = {
      outletId: outletId,
      shiftId: 3,
      closeTime: time,
      userTypeId: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
    };

    dispatch(
      closeShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Close shift called------------->", callback);
          setCheckShift3Close(true);
          setShiftDetails(callback?.response?.Details[0]);
        } else {
          toast.error(callback.error);
          toast.success("Shift 3 is Closed");
        }
      })
    );
  };

  const closeOutletFn = () => {
    const data = {
      outletId: outletId,
    };

    dispatch(
      closeOutletFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Close outlet called------------->", callback);
          setOpenCloseOutletModal(false);
          setShiftDetails("");
          setOutletDetails(callback?.response?.Details?.OutletStatus);
          toast.success("Outlet  is Closed")();
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  console.log("shift3Close", shift3Close);
  console.log("outletOpen", outletOpen);

  const [openCloseOtletModal, setOpenCloseOutletModal] = useState(false);

  const OpenCLoseOutletModalFn = () => {
    setOpenCloseOutletModal(true);
  };

  console.log("Todays Date-->", formattedDate);
  console.log("Todays Date-->", today);
  console.log("Todays Date-->", outletFormattedData);

  const onsubmit = () => {
    const data = {
      outletDate: formattedDate,
    };

    dispatch(
      openOutletFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log(
            "Open outlet called-------------------------------------------------->",
            callback
          );
          setOutletId(callback?.response?.Details?.Id);
          setCheckOutletOpen(true);
          setOutletDetails(callback?.response?.Details?.OutletStatus);
          toast.success("Outlet is opened");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const [recentShiftOpen, setRecentShiftOpen] = useState([]);

  useEffect(() => {
    console.log("Hi called over here, useeffect is working------------->");

    dispatch(
      checkActiveOutlet(loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log(
            "check Active outlet---------------------<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<>>>>>>>>>>>>>>>..------->",

            callback?.response?.Details
          );

          console.log(
            "today-------------------->",
            callback?.response?.Details?.OutletDate
          );
          console.log(
            "check Active outlet---------------------------->",

            callback?.response?.Details?.OutletDate == today
              ? "Truee"
              : "Falsee"
          );
          setCheckActiveOutlet(
            callback?.response?.Details?.OutletDate == [] ? true : false
          );
        } else {
          toast.error(callback.error);
        }
      })
    );

    dispatch(
      checkShiftForUser(
        !checkActiveOtlet ? activeDateOfOutlet?.OutletDate : today,
        validateDetails?.Details?.Id,
        validateDetails?.Details?.UserType,
        loginDetails?.logindata?.Token,
        (callback) => {
          if (callback) {
            console.log(
              "Callback from shifts for user -----------***********************8--->",
              callback?.response?.Details
            );

            setShiftDetails(callback?.response?.Details);
            setLoader(false);

            if (callback?.response?.Details == null) {
              dispatch(
                recentShiftForOutlet(
                  !checkActiveOtlet ? activeDateOfOutlet?.OutletDate : today,

                  loginDetails?.logindata?.Token,
                  (callback) => {
                    if (callback) {
                      console.log(
                        "Recent shift for outlet----------------------------------*********************************----- ->",
                        callback?.response?.Details[0]
                      );
                      setRecentShiftOpen(callback?.response?.Details);
                      setShiftDetails(callback?.response?.Details[0]);
                      setLoader(false);

                      toast.error(callback.error);
                    } else {
                      toast.error(callback.error);
                    }
                  }
                )
              );
            }

            toast.error(callback.error);
          } else {
            toast.error(callback.error);
          }
        }
      )
    );

    dispatch(
      checkCurrentOutletFn(
        !checkActiveOtlet ? activeDateOfOutlet?.OutletDate : today,
        loginDetails?.logindata?.Token,
        (callback) => {
          if (callback.status) {
            console.log(
              "check current outlet called---******************************************8---------->",
              callback?.response?.Details[0]?.OutletStatus
            );
            setOutletDetails(callback?.response?.Details[0]?.OutletStatus);
          } else {
            toast.error(callback.error);
          }
        }
      )
    );
  }, []);

  console.log("Outlet ID------------------>", outletOpenDetails);

  console.log(
    "Outlet id from outlet open-------||||||||||||||||||||||||||||||||||||||||-------->",
    outletId
  );

  const reopenShiftOneFn = () => {
    const data = {
      userId: validateDetails?.Details?.Id,
      outletId: outletId,
      shiftId: 1,
      userTypeId: validateDetails?.Details?.UserType,
      reopenTime: time,
    };

    dispatch(
      reopenShiftFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log(
            "Reopen  shift 1 called------------->",
            callback?.response?.Details[0]
          );

          setShiftDetails(callback?.response?.Details[0]);
          toast.success("Shift 1 is Re-opened");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const reopenShiftTwoFn = () => {
    const data = {
      userId: validateDetails?.Details?.Id,
      outletId: outletId,
      shiftId: 2,
      userTypeId: validateDetails?.Details?.UserType,
      reopenTime: time,
    };

    dispatch(
      reopenShiftFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Reopen  shift 2 called------------->", callback);

          setShiftDetails(callback?.response?.Details[0]);
          toast.success("Shift 2 is Re-opened");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const reopenShiftThreeFn = () => {
    const data = {
      userId: validateDetails?.Details?.Id,
      outletId: outletId,
      shiftId: 3,
      userTypeId: validateDetails?.Details?.UserType,
      reopenTime: time,
    };

    dispatch(
      reopenShiftFunction(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Reopen  shift 3 called------------->", callback);

          setShiftDetails(callback?.response?.Details[0]);
          toast.success("Shift 3 is Re-opened");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  console.log(
    "shiftDetails--------------------**************************________________________>>>",
    shiftDetails
  );

  console.log(
    "outletDetails---------------------------------||||||||||||||||||||||||||||||||||||||||||||||>",
    outletDetails
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleConfirmClose = () => setShowConfirmModal(false);
  const handleConfirmShow = () => setShowConfirmModal(true);

  const handleLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);

    if (
      validateDetails?.Details?.Password == password &&
      validateDetails?.Details?.Username == username
    ) {
      handleConfirmClose();
      handleShowShift();
      console.log("Password and username match");
    } else {
      console.log("Passowrd and username does match");
    }
  };

  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);

  const handleCloseShift = () => setShowCloseShiftModal(false);
  const handleShowShift = () => setShowCloseShiftModal(true);

  const handleClose = () => {
    handleCloseShift();

    if (shiftDetails?.ShiftOpen == 1 && shiftDetails?.ShiftTypeId == 1) {
      closeShiftOne();
    } else if (shiftDetails?.ShiftOpen == 1 && shiftDetails?.ShiftTypeId == 2) {
      closeShiftTwo();
    } else if (shiftDetails?.ShiftOpen == 1 && shiftDetails?.ShiftTypeId == 3) {
      closeSHiftThree();
    }
  };

  const [showOpenShiftModal, setShowOpenShiftModal] = useState(false);

  const handleOpenShift = () => {
    handleCloseOpenShift();

    if (outletDetails === 1 && shiftDetails?.length == 0) {
      openShiftOne();
    } else if (shiftDetails?.ShiftOpen == 0 && shiftDetails?.ShiftTypeId == 1) {
      openShiftTwo();
    } else if (shiftDetails?.ShiftOpen == 0 && shiftDetails?.ShiftTypeId == 2) {
      openSHiftThree();
    }
  };

  const handleCloseOpenShift = () => setShowOpenShiftModal(false);
  const handleShowOpenShift = () => setShowOpenShiftModal(true);

  console.log("shiftDetails?.ShiftOpen--------->", shiftDetails?.ShiftOpen);
  console.log("shiftDetails?.ShiftOpen--------->", shiftDetails?.ShiftOpen);

  return (
    <div>
      {loader ? (
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
        <div className="container mt-5">
          <div className="row d-flex justify-content-end">
            {!outletOpenDetails?.Details[0]?.OutletStatus == 1 &&
            !outletDetails == 1 ? (
              <div className="col-md-4 mb-5 d-flex justify-content-end">
                <Button variant="primary" onClick={openOutletModal}>
                  Open Outlet
                </Button>
              </div>
            ) : (
              <></>
            )}

            {outletDetails == 1 &&
            shiftDetails?.ShiftOpen == 0 &&
            shiftDetails?.ShiftTypeId == 3 ? (
              <div className="col-md-4 mb-5 d-flex justify-content-end">
                <Button
                  variant="danger"
                  disabled={!checkShift3Close}
                  onClick={OpenCLoseOutletModalFn}
                >
                  Close Outlet
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="row">
            <div className="col-md-4">
              <div class="Shiftcard">
                <p className="outletTex">Shift One</p>
              </div>
              <div className={`card ${isOpen ? "open" : "closed"}`}>
                <div className="card-header">
                  <h5 className="mb-0">Open the shift one</h5>
                </div>

                <div className="card-footer">
                  {shiftDetails?.ShiftOpen == 1 &&
                  shiftDetails?.ShiftTypeId == 1 ? (
                    <button
                      className="btn btn-primary mr-2"
                      onClick={handleConfirmShow}
                      style={{ width: "100%" }}
                      disabled={
                        shiftDetails?.ShiftOpen == 0 &&
                        shiftDetails?.ShiftTypeId == 0
                      }
                    >
                      Close
                    </button>
                  ) : (
                    <></>
                  )}

                  {outletDetails === 1 && shiftDetails?.length == 0 ? (
                    <button
                      className={`btn ${
                        outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                      onClick={handleShowOpenShift}
                      style={{ width: "100%" }}
                      disabled={
                        shiftDetails?.ShiftOpen == 0 &&
                        shiftDetails?.ShiftTypeId == 0
                      }
                    >
                      Open
                    </button>
                  ) : (
                    <></>
                  )}

                  {(shiftDetails?.ShiftOpen == 0 &&
                    shiftDetails?.ShiftTypeId == 1) ||
                  (shiftDetails?.ShiftOpen == 1 &&
                    shiftDetails?.ShiftTypeId == 2) ||
                  (shiftDetails?.ShiftOpen == 0 &&
                    shiftDetails?.ShiftTypeId == 2) ? (
                    <button
                      className={`btn ${
                        outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                      onClick={reopenShiftOneFn}
                      style={{ width: "100%" }}
                      disabled={reopenShift1}
                    >
                      Reopen
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div class="Shiftcard">
                <p className="outletTex">Shift Two</p>
              </div>
              <div className={`card ${isOpen ? "open" : "closed"}`}>
                <div className="card-header">
                  <h5 className="mb-0">Open the shift Two</h5>
                </div>

                <div className="card-footer">
                  {shiftDetails?.ShiftOpen == 1 &&
                  shiftDetails?.ShiftTypeId == 2 ? (
                    <button
                      className="btn btn-primary mr-2"
                      onClick={handleConfirmShow}
                      style={{ width: "100%" }}
                      disabled={
                        shiftDetails?.ShiftOpen == 0 &&
                        shiftDetails?.ShiftTypeId == 0
                      }
                    >
                      Close
                    </button>
                  ) : (
                    <></>
                  )}

                  {shiftDetails?.ShiftOpen == 0 &&
                  shiftDetails?.ShiftTypeId == 1 ? (
                    <button
                      className={`btn ${
                        outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                      onClick={handleShowOpenShift}
                      style={{ width: "100%" }}
                      disabled={
                        shiftDetails?.ShiftOpen == 0 &&
                        shiftDetails?.ShiftTypeId == 0
                      }
                    >
                      Open
                    </button>
                  ) : (
                    <></>
                  )}

                  {(shiftDetails?.ShiftOpen == 1 &&
                    shiftDetails?.ShiftTypeId == 2 &&
                    checkShift2Open) ||
                  (shiftDetails?.ShiftOpen == 1 &&
                    shiftDetails?.ShiftTypeId == 3) ||
                  (shiftDetails?.ShiftOpen == 0 &&
                    shiftDetails?.ShiftTypeId == 2) ||
                  (shiftDetails?.ShiftOpen == 0 &&
                    shiftDetails?.ShiftTypeId == 3) ? (
                    <button
                      className={`btn ${
                        outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                      onClick={reopenShiftTwoFn}
                      style={{ width: "100%" }}
                      disabled={
                        shiftDetails?.ShiftOpen == 1 &&
                        shiftDetails?.ShiftTypeId == 3
                      }
                    >
                      Reopen
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div class="Shiftcard">
                <p className="outletTex">Shift Three</p>
              </div>
              <div className={`card ${isOpen ? "open" : "closed"}`}>
                <div className="card-header">
                  <h5 className="mb-0">Open the shift Three</h5>
                </div>

                <div className="card-footer">
                  {shiftDetails?.ShiftOpen == 1 &&
                  shiftDetails?.ShiftTypeId == 3 ? (
                    <button
                      className="btn btn-primary mr-2"
                      onClick={handleConfirmShow}
                      style={{ width: "100%" }}
                      disabled={
                        shiftDetails?.ShiftOpen == 0 &&
                        shiftDetails?.ShiftTypeId == 0
                      }
                    >
                      Close
                    </button>
                  ) : (
                    <></>
                  )}

                  {shiftDetails?.ShiftOpen == 0 &&
                  shiftDetails?.ShiftTypeId == 2 ? (
                    <button
                      className={`btn ${
                        outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                      onClick={handleShowOpenShift}
                      style={{ width: "100%" }}
                      disabled={
                        shiftDetails?.ShiftOpen == 0 &&
                        shiftDetails?.ShiftTypeId == 0
                      }
                    >
                      Open
                    </button>
                  ) : (
                    <></>
                  )}

                  {shiftDetails?.ShiftOpen == 0 &&
                  shiftDetails?.ShiftTypeId == 3 ? (
                    <button
                      className={`btn ${
                        outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                      onClick={reopenShiftThreeFn}
                      style={{ width: "100%" }}
                      disabled={
                        outletDetails === 0 ||
                        (shiftDetails?.ShiftOpen == 1 &&
                          shiftDetails?.ShiftTypeId == 3)
                      }
                    >
                      Reopen
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal show={outletModalOpen} onHide={closeOutletModal} centered>
        <Modal.Body>
          <div className="row">
            <img
              src={checkcircle}
              alt="Check Circle"
              className="check-circle"
            />
            <p className="outletTitle">Open Outlet </p>
            <p className="outletTex">
              Are you sure you want to open the outlet ?
            </p>
          </div>
          <div className="row">
            <div>
              <Button onClick={openOutletFn} className="confirmbtn">
                Yes
              </Button>
            </div>
            <div>
              <Button onClick={closeOutletModal} className="cancelBtn">
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openCloseOtletModal}
        onHide={OpenCLoseOutletModalFn}
        centered
      >
        <Modal.Body>
          <div className="row">
            <img src={xcircle} alt="Check Circle" className="check-circle" />
            <p className="outletTitle">Close Outlet </p>
            <p className="outletTex">
              Are you sure you want to close the outlet ?
            </p>
          </div>
          <div className="row">
            <div>
              <Button onClick={closeOutletFn} className="closeConfirmBtn">
                Yes
              </Button>
            </div>
            <div>
              <Button onClick={closeOutletModal} className="closecancelBtn">
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmModal} onHide={handleConfirmClose}>
        <Modal.Header>
          <Modal.Title style={{ fontSize: "18px", textAlign: "center" }}>
            Enter your credentials to close the shift
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        <Modal show={showCloseShiftModal} onHide={handleCloseShift}>
          <Modal.Header>
            <Modal.Title>Close Shift</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to close the shift?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseShift}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Modal show={showOpenShiftModal} onHide={handleCloseOpenShift}>
        <Modal.Header>
          <Modal.Title>Open Shift</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to open the shift?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOpenShift}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleOpenShift}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Shifts;
