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
import { saveOutletDetails } from "../../../Redux/reducers/auth";
import { checkCurrentOutletFn } from "../../../Redux/actions/users";
import { Oval } from "react-loader-spinner";
import { checkActiveOutlet } from "../../../Redux/actions/users";
import { cashierReport, generateCSVReport } from "../../../Redux/actions/billing";
import { cashierReportShiftWise } from "../../../Redux/actions/billing";

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

  const today = moment().format("YYYY-MM-DD");

  const [loader, setLoader] = useState(true);

  const formattedDate = moment().format("YYYY-MM-DD");

  const parsedDate = moment(activeDateOfOutlet?.OutletDate);
  const outletFormattedData = parsedDate?.format("YYYY-MM-DD");

  const [outletOpen, setOutletOpen] = useState(false);
  //from api integration ---------------->

  const [checkOutletOpen, setCheckOutletOpen] = useState(false);

  const [checkShift1Open, setCheckShift1Open] = useState(0);
  const [checkShift1Close, setCheckShift1Close] = useState(false);
  const [checkShift2Open, setCheckShift2open] = useState(false);
  const [checShift2Close, setCheckShift2Close] = useState(false);
  const [checkShift3Open, setCheckShift3Open] = useState(false);
  const [checkShift3Close, setCheckShift3Close] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [outletModalOpen, setOutletModalOpen] = useState(false);

  const [shiftDetails, setShiftDetails] = useState("");
  const [outletDetails, setOutletDetails] = useState("");
  const [mainOutletId, setMainOutletId] = useState("");

  //reopen logic----------------->
  const [reopenShift1, setReopenShift1] = useState(false);
  const [reopenShift2, setReopenShift2] = useState(false);
  const [reopenShift3, setReopenShift3] = useState(false);

  const [defaultShift1, setDefaultShift1] = useState(false);
  const [shiftDetailsForUser, setSHiftDetaislForUser] = useState();
  const [openCloseOtletModal, setOpenCloseOutletModal] = useState(false);
  const [showGenerateCashierModal, setShowGenerateCashierModal] = useState(false);

  const [showShiftReportModal, setShowShiftReportModal] = useState(false);

  const [shiftId, setShiftId] = useState(0);


  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [showOpenShiftModal, setShowOpenShiftModal] = useState(false);
  const [checkActiveOtlet, setCheckActiveOutlet] = useState();
  const [recentShiftOpen, setRecentShiftOpen] = useState([]);
  const shifts = {};

  const date = moment(); // Current date and time
  const time = date.format("HH:mm");


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

  useEffect(() => {
    dispatch(
      checkActiveOutlet(loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("check active outlet--->", callback?.response?.Details);
          setOutletId(callback?.response?.Details?.Id);
          if (callback?.response?.Details == null) {
            setCheckActiveOutlet(false);
            setLoader(false);
          } else {
            setCheckActiveOutlet(
              callback?.response?.Details?.OutletDate == today ? true : false
            );
            setOutletId(callback?.response?.Details?.Id);
          }
        } else {
          toast.error(callback.error);
        }
      })
    );

    dispatch(
      checkShiftForUser(
        checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
        validateDetails?.Details?.Id,
        validateDetails?.Details?.UserType,
        loginDetails?.logindata?.Token,
        (callback) => {
          if (callback) {
            console.log('callback?.response?.Details>>', callback?.response?.Details);
            console.log(
              "Callback from shifts for user -----------***********************8--->",
              callback?.response?.Details
            );
            if (
              callback?.response?.Details == null ||
              callback?.response?.Details.length == 0
            ) {
              dispatch(
                recentShiftForOutlet(
                  !checkActiveOtlet ? activeDateOfOutlet?.OutletDate : today,
                  loginDetails?.logindata?.Token,
                  (callback) => {
                    if (callback) {
                      console.log('recent shift for outlet>>callback>>', callback);
                      console.log(
                        "Recent shift for outlet----------------------------------*********************************----- ->",
                        callback?.response?.Details
                      );

                      if (callback?.response?.Details?.length == 0) {
                        setDefaultShift1(true);
                        setSHiftDetaislForUser(callback?.response?.Details);
                        setLoader(false);
                      } else {
                        console.log(
                          "Else condition for recent shift open",
                          callback?.response?.Details
                        );
                        setRecentShiftOpen(callback?.response?.Details);

                        setLoader(false);
                      }
                    } else {
                      // toast.error(callback.error);
                    }
                  }
                )
              );
            } else {
              console.log(
                "Else for check shift for user",
                callback?.response?.Details
              );
              setSHiftDetaislForUser(callback?.response?.Details);

              setLoader(false);
            }

            // toast.error(callback.error);
          } else {
            // toast.error(callback.error);
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
            dispatch(saveOutletDetails(callback?.response));
          } else {
            // toast.error(callback.error);
          }
        }
      )
    );

  }, [checkActiveOtlet]);



  const openShiftOne = () => {
    console.log("Shift one open");
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
          console.log(
            "Open shitft 1 called------------->",
            callback?.response?.Details
          );

          setCheckOutletOpen(false);

          dispatch(
            checkShiftForUser(
              checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
              validateDetails?.Details?.Id,
              validateDetails?.Details?.UserType,
              loginDetails?.logindata?.Token,
              (callback) => {
                if (callback) {
                  console.log(
                    "Callback from shifts for user -----------***********************8--->",
                    callback?.response?.Details
                  );
                  if (
                    callback?.response?.Details == null ||
                    callback?.response?.Details.length == 0
                  ) {
                    dispatch(
                      recentShiftForOutlet(
                        !checkActiveOtlet
                          ? activeDateOfOutlet?.OutletDate
                          : today,
                        loginDetails?.logindata?.Token,
                        (callback) => {
                          if (callback) {
                            console.log(
                              "Recent shift for outlet----------------------------------*********************************----- ->",
                              callback?.response?.Details
                            );

                            if (callback?.response?.Details?.length == 0) {
                              setDefaultShift1(true);
                              setSHiftDetaislForUser(
                                callback?.response?.Details
                              );
                              setLoader(false);
                              window.location.reload();
                            } else {
                              console.log(
                                "Else condition for recent shift open",
                                callback?.response?.Details
                              );
                              setRecentShiftOpen(callback?.response?.Details);
                              window.location.reload();

                              setLoader(false);
                            }
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  } else {
                    console.log(
                      "Else for check shift for user",
                      callback?.response?.Details
                    );
                    setSHiftDetaislForUser(callback?.response?.Details);
                    window.location.reload();

                    setLoader(false);
                  }

                  toast.error(callback.error);
                } else {
                  toast.error(callback.error);
                }
              }
            )
          );

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
          console.log(
            "Close shift called------------->",
            callback?.response?.Details[0]
          );
          setCheckShift1Close(true);
          setShiftDetails(callback?.response?.Details[0]);
          setShiftId(1);
          setCheckShift2open(true);
          // setShowShiftReportModal(true);

          toast.success("Shift 1 is Closed");
          dispatch(
            checkShiftForUser(
              checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
              validateDetails?.Details?.Id,
              validateDetails?.Details?.UserType,
              loginDetails?.logindata?.Token,
              (callback) => {
                if (callback) {
                  console.log(
                    "Callback from shifts for user -----------***********************8--->",
                    callback?.response?.Details
                  );
                  if (
                    callback?.response?.Details == null ||
                    callback?.response?.Details.length == 0
                  ) {
                    dispatch(
                      recentShiftForOutlet(
                        !checkActiveOtlet
                          ? activeDateOfOutlet?.OutletDate
                          : today,
                        loginDetails?.logindata?.Token,
                        (callback) => {
                          if (callback) {
                            console.log(
                              "Recent shift for outlet----------------------------------*********************************----- ->",
                              callback?.response?.Details
                            );

                            if (callback?.response?.Details?.length == 0) {
                              setDefaultShift1(true);
                              setSHiftDetaislForUser(
                                callback?.response?.Details
                              );
                              setLoader(false);
                              setShowShiftReportModal(true);
                              // window.location.reload();
                            } else {
                              console.log(
                                "Else condition for recent shift open",
                                callback?.response?.Details
                              );
                              setRecentShiftOpen(callback?.response?.Details);
                              // window.location.reload();
                              setShowShiftReportModal(true);

                              setLoader(false);
                            }
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  } else {
                    console.log(
                      "Else for check shift for user",
                      callback?.response?.Details
                    );
                    setSHiftDetaislForUser(callback?.response?.Details);
                    // window.location.reload();
                    setShowShiftReportModal(true);

                    setLoader(false);
                  }

                  toast.error(callback.error);
                } else {
                  toast.error(callback.error);
                }
              }
            )
          );
          console.log("Hereeee");
          // window.location.reload();
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const openShiftTwo = () => {
    console.log("Called open shift 2");
    const data = {
      outletDate: activeDateOfOutlet?.OutletDate,
      shiftTypeId: 2,
      userType: validateDetails?.Details?.UserType,
      userId: validateDetails?.Details?.Id,
      openTime: time,
    };
    console.log('openShiftTwo>>data>>', data);
    dispatch(
      openShiftFn(data, loginDetails?.logindata?.Token, (callback) => {
        if (callback.status) {
          console.log("Open shift 2  called------------->", callback);
          setShiftDetails(callback?.response?.Details);
          setCheckShift2open(false);
          setReopenShift1(true);
          toast.success("Shift 2 is opened");

          dispatch(
            checkShiftForUser(
              checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
              validateDetails?.Details?.Id,
              validateDetails?.Details?.UserType,
              loginDetails?.logindata?.Token,
              (callback) => {
                if (callback) {
                  console.log(
                    "Callback from shifts for user -----------***********************8--->",
                    callback?.response?.Details
                  );
                  if (
                    callback?.response?.Details == null ||
                    callback?.response?.Details.length == 0
                  ) {
                    dispatch(
                      recentShiftForOutlet(
                        !checkActiveOtlet
                          ? activeDateOfOutlet?.OutletDate
                          : today,
                        loginDetails?.logindata?.Token,
                        (callback) => {
                          if (callback) {
                            console.log(
                              "Recent shift for outlet----------------------------------*********************************----- ->",
                              callback?.response?.Details
                            );

                            if (callback?.response?.Details?.length == 0) {
                              setDefaultShift1(true);
                              setSHiftDetaislForUser(
                                callback?.response?.Details
                              );
                              setLoader(false);
                              window.location.reload();
                            } else {
                              console.log(
                                "Else condition for recent shift open",
                                callback?.response?.Details
                              );
                              setRecentShiftOpen(callback?.response?.Details);
                              window.location.reload();

                              setLoader(false);
                            }
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  } else {
                    console.log(
                      "Else for check shift for user",
                      callback?.response?.Details
                    );
                    setSHiftDetaislForUser(callback?.response?.Details);
                    window.location.reload();

                    setLoader(false);
                  }

                  toast.error(callback.error);
                } else {
                  toast.error(callback.error);
                }
              }
            )
          );
        } else {
          toast.error(callback.error);
        }
      })
    );
  };



  const closeShiftTwo = () => {
    console.log("outletId----->", outletId);
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
          setShiftId(2);
          setCheckShift2Close(false);
          setCheckShift3Open(true);
          setReopenShift2(true);
          toast.success("Shift 2 is Closed");
          // setShowShiftReportModal(true);

          dispatch(
            checkShiftForUser(
              checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
              validateDetails?.Details?.Id,
              validateDetails?.Details?.UserType,
              loginDetails?.logindata?.Token,
              (callback) => {
                if (callback) {
                  console.log(
                    "Callback from shifts for user -----------***********************8--->",
                    callback?.response?.Details
                  );
                  if (
                    callback?.response?.Details == null ||
                    callback?.response?.Details.length == 0
                  ) {
                    dispatch(
                      recentShiftForOutlet(
                        !checkActiveOtlet
                          ? activeDateOfOutlet?.OutletDate
                          : today,
                        loginDetails?.logindata?.Token,
                        (callback) => {
                          if (callback) {
                            console.log(
                              "Recent shift for outlet----------------------------------*********************************----- ->",
                              callback?.response?.Details
                            );

                            if (callback?.response?.Details?.length == 0) {
                              setDefaultShift1(true);
                              setSHiftDetaislForUser(
                                callback?.response?.Details
                              );
                              setShowShiftReportModal(true);
                              setLoader(false);
                              // window.location.reload();
                            } else {
                              console.log(
                                "Else condition for recent shift open",
                                callback?.response?.Details
                              );
                              setRecentShiftOpen(callback?.response?.Details);
                              // window.location.reload();
                              setShowShiftReportModal(true);

                              setLoader(false);
                            }
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  } else {
                    console.log(
                      "Else for check shift for user",
                      callback?.response?.Details
                    );
                    setSHiftDetaislForUser(callback?.response?.Details);
                    // window.location.reload();
                    setShowShiftReportModal(true);

                    setLoader(false);
                  }

                  toast.error(callback.error);
                } else {
                  toast.error(callback.error);
                }
              }
            )
          );

          // window.location.reload();
          console.log("Hereeee");

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

          dispatch(
            checkShiftForUser(
              checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
              validateDetails?.Details?.Id,
              validateDetails?.Details?.UserType,
              loginDetails?.logindata?.Token,
              (callback) => {
                if (callback) {
                  console.log(
                    "Callback from shifts for user -----------***********************8--->",
                    callback?.response?.Details
                  );
                  if (
                    callback?.response?.Details == null ||
                    callback?.response?.Details.length == 0
                  ) {
                    dispatch(
                      recentShiftForOutlet(
                        !checkActiveOtlet
                          ? activeDateOfOutlet?.OutletDate
                          : today,
                        loginDetails?.logindata?.Token,
                        (callback) => {
                          if (callback) {
                            console.log(
                              "Recent shift for outlet----------------------------------*********************************----- ->",
                              callback?.response?.Details
                            );

                            if (callback?.response?.Details?.length == 0) {
                              setDefaultShift1(true);
                              setSHiftDetaislForUser(
                                callback?.response?.Details
                              );
                              setLoader(false);
                              window.location.reload();
                            } else {
                              console.log(
                                "Else condition for recent shift open",
                                callback?.response?.Details
                              );
                              setRecentShiftOpen(callback?.response?.Details);
                              window.location.reload();

                              setLoader(false);
                            }
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  } else {
                    console.log(
                      "Else for check shift for user",
                      callback?.response?.Details
                    );
                    setSHiftDetaislForUser(callback?.response?.Details);
                    window.location.reload();

                    setLoader(false);
                  }

                  toast.error(callback.error);
                } else {
                  toast.error(callback.error);
                }
              }
            )
          );
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
          setShiftId(3);

          dispatch(
            checkShiftForUser(
              checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
              validateDetails?.Details?.Id,
              validateDetails?.Details?.UserType,
              loginDetails?.logindata?.Token,
              (callback) => {
                if (callback) {
                  console.log(
                    "Callback from shifts for user -----------***********************8--->",
                    callback?.response?.Details
                  );
                  if (
                    callback?.response?.Details == null ||
                    callback?.response?.Details.length == 0
                  ) {
                    dispatch(
                      recentShiftForOutlet(
                        !checkActiveOtlet
                          ? activeDateOfOutlet?.OutletDate
                          : today,
                        loginDetails?.logindata?.Token,
                        (callback) => {
                          if (callback) {
                            console.log(
                              "Recent shift for outlet----------------------------------*********************************----- ->",
                              callback?.response?.Details
                            );

                            if (callback?.response?.Details?.length == 0) {
                              setDefaultShift1(true);
                              setSHiftDetaislForUser(
                                callback?.response?.Details
                              );
                              setShowShiftReportModal(true);
                              setLoader(false);
                              // window.location.reload();
                            } else {
                              console.log(
                                "Else condition for recent shift open",
                                callback?.response?.Details
                              );
                              setRecentShiftOpen(callback?.response?.Details);
                              // window.location.reload();
                              setShowShiftReportModal(true);

                              setLoader(false);
                            }
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  } else {
                    console.log(
                      "Else for check shift for user",
                      callback?.response?.Details
                    );
                    setSHiftDetaislForUser(callback?.response?.Details);
                    // window.location.reload();
                    setShowShiftReportModal(true);

                    setLoader(false);
                  }

                  toast.error(callback.error);
                } else {
                  toast.error(callback.error);
                }
              }
            )
          );
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
          toast.success("Outlet  is Closed");
          setShowGenerateCashierModal(true);
          // window.location.reload();
        } else {
          toast.error(callback.error);
        }
      })
    );
  };

  const OpenCLoseOutletModalFn = () => {
    setOpenCloseOutletModal(true);
  };

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
          window.location.reload();
          toast.success("Outlet is opened");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };




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

          dispatch(
            checkShiftForUser(
              checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
              validateDetails?.Details?.Id,
              validateDetails?.Details?.UserType,
              loginDetails?.logindata?.Token,
              (callback) => {
                if (callback) {
                  console.log(
                    "Callback from shifts for user -----------***********************8--->",
                    callback?.response?.Details
                  );
                  if (
                    callback?.response?.Details == null ||
                    callback?.response?.Details.length == 0
                  ) {
                    dispatch(
                      recentShiftForOutlet(
                        !checkActiveOtlet
                          ? activeDateOfOutlet?.OutletDate
                          : today,
                        loginDetails?.logindata?.Token,
                        (callback) => {
                          if (callback) {
                            console.log(
                              "Recent shift for outlet----------------------------------*********************************----- ->",
                              callback?.response?.Details
                            );

                            if (callback?.response?.Details?.length == 0) {
                              setDefaultShift1(true);
                              setSHiftDetaislForUser(
                                callback?.response?.Details
                              );
                              setLoader(false);
                              window.location.reload();
                            } else {
                              console.log(
                                "Else condition for recent shift open",
                                callback?.response?.Details
                              );
                              setRecentShiftOpen(callback?.response?.Details);
                              window.location.reload();

                              setLoader(false);
                            }
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  } else {
                    console.log(
                      "Else for check shift for user",
                      callback?.response?.Details
                    );
                    setSHiftDetaislForUser(callback?.response?.Details);
                    window.location.reload();

                    setLoader(false);
                  }

                  toast.error(callback.error);
                } else {
                  toast.error(callback.error);
                }
              }
            )
          );
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

          dispatch(
            checkShiftForUser(
              checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
              validateDetails?.Details?.Id,
              validateDetails?.Details?.UserType,
              loginDetails?.logindata?.Token,
              (callback) => {
                if (callback) {
                  console.log(
                    "Callback from shifts for user -----------***********************8--->",
                    callback?.response?.Details
                  );
                  if (
                    callback?.response?.Details == null ||
                    callback?.response?.Details.length == 0
                  ) {
                    dispatch(
                      recentShiftForOutlet(
                        !checkActiveOtlet
                          ? activeDateOfOutlet?.OutletDate
                          : today,
                        loginDetails?.logindata?.Token,
                        (callback) => {
                          if (callback) {
                            console.log(
                              "Recent shift for outlet----------------------------------*********************************----- ->",
                              callback?.response?.Details
                            );

                            if (callback?.response?.Details?.length == 0) {
                              setDefaultShift1(true);
                              setSHiftDetaislForUser(
                                callback?.response?.Details
                              );
                              setLoader(false);
                              window.location.reload();
                            } else {
                              console.log(
                                "Else condition for recent shift open",
                                callback?.response?.Details
                              );
                              setRecentShiftOpen(callback?.response?.Details);
                              window.location.reload();

                              setLoader(false);
                            }
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  } else {
                    console.log(
                      "Else for check shift for user",
                      callback?.response?.Details
                    );
                    setSHiftDetaislForUser(callback?.response?.Details);
                    window.location.reload();

                    setLoader(false);
                  }

                  toast.error(callback.error);
                } else {
                  toast.error(callback.error);
                }
              }
            )
          );
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

          dispatch(
            checkShiftForUser(
              checkActiveOtlet == true ? today : activeDateOfOutlet?.OutletDate,
              validateDetails?.Details?.Id,
              validateDetails?.Details?.UserType,
              loginDetails?.logindata?.Token,
              (callback) => {
                if (callback) {
                  console.log(
                    "Callback from shifts for user -----------***********************8--->",
                    callback?.response?.Details
                  );
                  if (
                    callback?.response?.Details == null ||
                    callback?.response?.Details.length == 0
                  ) {
                    dispatch(
                      recentShiftForOutlet(
                        !checkActiveOtlet
                          ? activeDateOfOutlet?.OutletDate
                          : today,
                        loginDetails?.logindata?.Token,
                        (callback) => {
                          if (callback) {
                            console.log(
                              "Recent shift for outlet----------------------------------*********************************----- ->",
                              callback?.response?.Details
                            );

                            if (callback?.response?.Details?.length == 0) {
                              setDefaultShift1(true);
                              setSHiftDetaislForUser(
                                callback?.response?.Details
                              );
                              setLoader(false);
                              window.location.reload();
                            } else {
                              console.log(
                                "Else condition for recent shift open",
                                callback?.response?.Details
                              );
                              setRecentShiftOpen(callback?.response?.Details);
                              window.location.reload();

                              setLoader(false);
                            }
                          } else {
                            toast.error(callback.error);
                          }
                        }
                      )
                    );
                  } else {
                    console.log(
                      "Else for check shift for user",
                      callback?.response?.Details
                    );
                    setSHiftDetaislForUser(callback?.response?.Details);
                    window.location.reload();

                    setLoader(false);
                  }

                  toast.error(callback.error);
                } else {
                  toast.error(callback.error);
                }
              }
            )
          );
          toast.success("Shift 3 is Re-opened");
        } else {
          toast.error(callback.error);
        }
      })
    );
  };


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
      console.log("Passrd and username does match");
      toast.error("Username and Password does not match");
    }
  };



  const handleCloseShift = () => setShowCloseShiftModal(false);
  const handleShowShift = () => setShowCloseShiftModal(true);



  const handleOpenShift = () => {
    handleCloseOpenShift();

    console.log("Shift open button called");
    console.log("outletDetails----->", outletDetails);
    console.log("shiftDetailsForUser------>", shiftDetailsForUser);

    if (
      shiftDetailsForUser &&
      shiftDetailsForUser?.length > 0 &&
      recentShiftOpen &&
      recentShiftOpen?.length == 0
    ) {
      console.log('pkpkpkpkpk');
      if (shifts && shifts[1] && shifts[1][0]?.ShiftOpen == 1) {
        closeShiftOne();
      } else if (
        shifts &&
        shifts[1] &&
        shifts[1][0]?.ShiftOpen == 0 &&
        !shifts[2]
      ) {
        console.log('open>>shift>>2>>');
        openShiftTwo();
      } else if (shifts && shifts[2] && shifts[2][0]?.ShiftOpen == 1) {
        closeShiftTwo();
      } else if (
        shifts &&
        shifts[2] &&
        shifts[2][0]?.ShiftOpen == 0 &&
        !shifts[3]
      ) {
        openSHiftThree();
      } else if (shifts && shifts[3] && shifts[3][0]?.ShiftOpen == 1) {
        closeSHiftThree();
      }
    } else if (
      Object.keys(shifts).length === 0 &&
      recentShiftOpen?.length > 0
    ) {
      console.log('yarrrrrrrrrrrr', recentShiftOpen);
      if (
        recentShiftOpen[0]?.ShiftTypeId == 1 &&
        recentShiftOpen[0]?.ShiftOpen == 1
      ) {
        console.log('11111');
        openShiftOne();
      } else if (
        recentShiftOpen[0]?.ShiftTypeId == 3 &&
        recentShiftOpen[0]?.ShiftOpen == 1
      ) {
        console.log('22222');
        openSHiftThree();
      } else if (
        recentShiftOpen[0]?.ShiftTypeId == 2 &&
        recentShiftOpen[0]?.ShiftOpen == 1
      ) {
        console.log('33333');
        openShiftTwo();
      }
      else if (
        recentShiftOpen[0]?.ShiftTypeId == 1 &&
        recentShiftOpen[0]?.ShiftOpen == 0) {
        openShiftTwo()
      }
      else if (
        recentShiftOpen[0]?.ShiftTypeId == 2 &&
        recentShiftOpen[0]?.ShiftOpen == 0) {
        openSHiftThree()
      }
    } else {
      console.log('444444');
      openShiftOne();
    }
  };

  const generateReportFn = (shiftId) => {
    const reportData = {
      userId: loginDetails.logindata?.UserType === 1 ? 0 : loginDetails.logindata.userId,
      billDate: new Date().toJSON().slice(0, 10),
      futureDate: "",
      shiftId: shiftId,
      fromDate: "",
      toDate: "",
      reportTypeId: "3",
    };

    dispatch(
      generateCSVReport(
        loginDetails?.logindata?.Token,
        reportData,
        (callback) => {
          if (callback.status) {
            console.log(
              "Callback------generate report",
              callback?.response?.Details?.ReportFile
            );
            window.open(callback?.response?.Details?.ReportFile, "_blank");
            handleClose();
          } else {
            console.log("Callback------generate report error", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const handleClose = () => {
    handleCloseShift();

    if (
      shiftDetailsForUser &&
      shiftDetailsForUser?.length > 0 &&
      recentShiftOpen &&
      recentShiftOpen?.length == 0
    ) {
      if (shifts && shifts[1] && shifts[1][0]?.ShiftOpen == 1) {
        closeShiftOne();
      } else if (
        shifts &&
        shifts[1] &&
        shifts[1][0]?.ShiftOpen == 0 &&
        !shifts[2]
      ) {
        openShiftTwo();
      } else if (shifts && shifts[2] && shifts[2][0]?.ShiftOpen == 1) {
        closeShiftTwo();
      } else if (
        shifts &&
        shifts[2] &&
        shifts[2][0]?.ShiftOpen == 0 &&
        !shifts[3]
      ) {
        openSHiftThree();
        console.log("HELOOOO SIRRRR");
      } else if (shifts && shifts[3] && shifts[3][0]?.ShiftOpen == 1) {
        closeSHiftThree();
        console.log("HELOOOO NOT SO SIRRRRRRRRRRRr");
      }
    } else if (
      shiftDetailsForUser &&
      shiftDetailsForUser?.length == 0 &&
      recentShiftOpen &&
      recentShiftOpen?.length > 0
    ) {
    } else {
      openShiftOne();
    }
  };

  const handleCloseOpenShift = () => setShowOpenShiftModal(false);
  const handleShowOpenShift = () => setShowOpenShiftModal(true);

  console.log("Recent shift open---recent---->", recentShiftOpen);

  console.log("shift Details For User------->", shiftDetailsForUser);

  console.log("outletDetails-------->", outletDetails);

  if (shiftDetailsForUser) {
    shiftDetailsForUser.forEach((item) => {
      console.log('inside shiftDetailsForUser>>item>>', item);
      const { ShiftTypeId, OpenTime, CloseTime, ShiftOpen } = item;
      if (!shifts[ShiftTypeId]) {
        shifts[ShiftTypeId] = [];
      }
      shifts[ShiftTypeId].push({ ShiftTypeId, OpenTime, CloseTime, ShiftOpen });
    });
  }

  console.log("Shift 1:-------------->", shifts[1]); // Contains data for ShiftTypeId 1
  console.log("Shift 2:-------------->", shifts[2]);
  console.log("Shift 3:-------------->", shifts[3]);

  console.log("length check sd", recentShiftOpen && recentShiftOpen.length);
  console.log("length check", shiftDetailsForUser);

  console.log("Shifts---->", shifts);

  const shiftOneComponent = ({
    recentShiftOpen,
    shiftDetailsForUser,
    shifts,
  }) => {
    console.log('shifts---->tareefan>>>', shifts);
    console.log('inside shiftOneComponent-->recentShiftOpen-->', recentShiftOpen);
    console.log('inside shiftOneComponent-->shiftDetailsForUser===>', shiftDetailsForUser);
    if (
      shiftDetailsForUser &&
      shiftDetailsForUser?.length > 0 &&
      recentShiftOpen &&
      recentShiftOpen?.length == 0
    ) {
      console.log("reached in first condition", shifts);

      if (Object.keys(shifts).length != 0 && shifts && shifts[1] && shifts[1][0]?.ShiftOpen == 1) {
        console.log('Log 11', shifts);
        return (
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
                  <button
                    className="btn btn-primary mr-2"
                    onClick={handleConfirmShow}
                    style={{ width: "100%" }}
                  >
                    Close
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Open
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (
        Object.keys(shifts).length != 0 &&
        shifts &&
        shifts[1] &&
        shifts[1][0]?.ShiftOpen == 0 &&
        !shifts[2]
      ) {
        console.log("Reached hereeeeee for shift 2", shifts);
        return (
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftOneFn}
                    style={{ width: "100%" }}
                  >
                    Reopen
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                  >
                    Open
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      else if (Object.keys(shifts).length != 0 && shifts && shifts[2] && shifts[2][0]?.ShiftOpen == 1) {
        console.log('log 12', shifts);
        return (
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftOneFn}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Reopen
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleConfirmShow}
                    style={{ width: "100%" }}
                  >
                    close
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (
        Object.keys(shifts).length != 0 &&
        shifts &&
        shifts[2] &&
        shifts[2][0]?.ShiftOpen == 0
        &&
        !shifts[3]
      ) {
        console.log('Log 13', shifts);
        return (
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
                  {/* <button
                    className="btn btn-secondary mr-2"
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    open
                  </button> */}
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftOneFn}
                    style={{ width: "100%" }}
                  // disabled={true}
                  >
                    Reopen
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftTwoFn}
                    style={{ width: "100%" }}
                  >
                    Reopen
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (Object.keys(shifts).length != 0 && shifts && shifts[3] && shifts[3][0]?.ShiftOpen == 1) {
        console.log('Log 14', shifts);
        return (
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
                  <button
                    className="btn btn-secondary mr-2"
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    open
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftTwoFn}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Reopen
                  </button>
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
                  <button
                    className="btn btn-primary mr-2"
                    onClick={handleConfirmShow}
                    style={{ width: "100%" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (Object.keys(shifts).length != 0 && shifts && shifts[3] && shifts[3][0]?.ShiftOpen == 0) {
        console.log('Log 15', shifts);
        return (
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
                  <button
                    className="btn btn-secondary mr-2"
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    open
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftTwoFn}
                    style={{ width: "100%" }}
                  >
                    Reopen
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftThreeFn}
                    style={{ width: "100%" }}
                  >
                    Reopen
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    } else if (
      Object.keys(shifts).length === 0 &&
      recentShiftOpen?.length > 0
    ) {
      console.log("Reached in second conditon", shifts);
      console.log("recentShiftOpen", recentShiftOpen);
      if (
        recentShiftOpen[0]?.ShiftTypeId == 1 &&
        recentShiftOpen[0]?.ShiftOpen == 1
      ) {
        console.log('log 160');
        return (
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                  >
                    Open
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Open
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      else if (recentShiftOpen[0]?.ShiftTypeId == 2 &&
        recentShiftOpen[0]?.ShiftOpen == 0) {
        console.log('checkingggg>>>');
        return (
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftOneFn}
                    style={{ width: "100%" }}
                  >
                    Reopen
                  </button>
                </div>

                {/* <button
                className="btn btn-primary mr-2"
                onClick={handleConfirmShow}
                style={{ width: "100%" }}
              >
                Close
              </button> */}
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftTwoFn}
                    style={{ width: "100%" }}
                  >
                    Reopen
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      else if (
        (recentShiftOpen[0]?.ShiftTypeId == 2 &&
          recentShiftOpen[0]?.ShiftOpen == 1) ||
        (recentShiftOpen[0]?.ShiftTypeId == 1 &&
          recentShiftOpen[0]?.ShiftOpen == 0 &&
          recentShiftOpen[0]?.OpenTime != "" &&
          recentShiftOpen[0]?.CloseTime != "")
      ) {
        console.log('log 200');
        return (
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftOneFn}
                    style={{ width: "100%" }}
                  >
                    Reopen
                  </button>
                </div>

                {/* <button
              className="btn btn-primary mr-2"
              onClick={handleConfirmShow}
              style={{ width: "100%" }}
            >
              Close
            </button> */}
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                  >
                    Open
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      else if (
        (recentShiftOpen[0]?.ShiftTypeId == 3 &&
          recentShiftOpen[0]?.ShiftOpen == 1) ||
        (recentShiftOpen[0]?.ShiftTypeId == 2 &&
          recentShiftOpen[0]?.ShiftOpen == 0 &&
          recentShiftOpen[0]?.OpenTime != "" &&
          recentShiftOpen[0]?.CloseTime != "")

      ) {
        console.log('log 445');
        return (
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
                  <button
                    className="btn btn-secondary mr-2"
                    style={{ width: "100%" }}
                    disabled={true}
                  >
                    open
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={reopenShiftTwoFn}
                    style={{ width: "100%" }}
                  >
                    Reopen
                  </button>
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
                  <button
                    className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                      } mr-2`}
                    onClick={handleShowOpenShift}
                    style={{ width: "100%" }}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    } else {
      console.log("Reached in 3rd condition", shifts);
      return (
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
                <button
                  className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                    } mr-2`}
                  onClick={handleShowOpenShift}
                  style={{ width: "100%" }}
                  disabled={!outletDetails ? true : false}
                >
                  Open
                </button>
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
                <button
                  className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                    } mr-2`}
                  onClick={handleShowOpenShift}
                  style={{ width: "100%" }}
                  disabled={true}
                >
                  Open
                </button>
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
                <button
                  className={`btn ${outletDetails === 1 ? "btn-primary" : "btn-secondary"
                    } mr-2`}
                  onClick={handleShowOpenShift}
                  style={{ width: "100%" }}
                  disabled={true}
                >
                  Open
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const generateCashierReport = () => {
    dispatch(
      cashierReport(
        loginDetails?.logindata?.Token,
        outletFormattedData,
        (callback) => {
          if (callback.status) {
            // setLoading(false);
            console.log("cashierReport--->>", callback?.response);
            window.open(callback?.response?.Details?.ReportFile, "_blank");
            setShowGenerateCashierModal(false);
            window.location.reload();
          } else {
            console.log("cashierReport>>>Callback------", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const generateCashierReportShiftWise = () => {
    console.log("Shiftttt", outletFormattedData, shiftId);
    dispatch(
      cashierReportShiftWise(
        loginDetails?.logindata?.Token,
        outletFormattedData,
        shiftId,

        (callback) => {
          if (callback.status) {
            console.log("cashierReport---shift wise>>", callback?.response);
            window.open(callback?.response?.Details?.ReportFile, "_blank");

            // window.location.reload();
            setShowShiftReportModal(false);
          } else {
            console.log("cashierReport>>>Callback------", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const generateCashierReportShiftWiseWithShiftId = (paramShiftId) => {
    console.log("Shiftttt", outletFormattedData, paramShiftId);
    dispatch(
      cashierReportShiftWise(
        loginDetails?.logindata?.Token,
        outletFormattedData,
        paramShiftId,

        (callback) => {
          if (callback.status) {
            console.log("cashierReport---shift wise>>", callback?.response);
            window.open(callback?.response?.Details?.ReportFile, "_blank");

            // window.location.reload();
            setShowShiftReportModal(false);
          } else {
            console.log("cashierReport>>>Callback------", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  const closeCashierReportModal = () => {
    setShowGenerateCashierModal(false);
    window.location.reload();
  };

  const closeShiftReportModal = () => {
    setShowShiftReportModal(false);
  };
  return (
    console.log(
      "activeDateOfOutlet?.OutletDate>>",
      activeDateOfOutlet?.OutletDate
    ),
    console.log('return-->>recentShiftOpen>>', recentShiftOpen),
    console.log('return>>shiftDetailsForUser>>', shiftDetailsForUser),
    console.log('return==>shifts>>>>', shifts),
    (
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
          <div
            className="container mt-5"
          // style={{ backgroundColor: "green" }}
          >
            <h5 style={{ marginBottom: "8px" }}>Welcome, {validateDetails?.Details?.Name}</h5>
            {(activeDateOfOutlet?.OutletDate != undefined ||
              activeDateOfOutlet?.OutletDate != null) && (
                <div>

                  <h5 className="mb-0" style={{ paddingBottom: "20px" }}>
                    Outlet Date :{" "}
                    {activeDateOfOutlet?.OutletDate != undefined ||
                      activeDateOfOutlet?.OutletDate != null
                      ? activeDateOfOutlet?.OutletDate
                      : ""}
                  </h5>

                </div>
              )}
            <div className="row d-flex justify-content-end">
              <div>
                <div className="d-flex justify-content-end">
                  <Button variant="outline-primary" className="mb-5" onClick={() => generateCashierReport()}>
                    Generate outlet report
                  </Button>
                  {!outletOpenDetails?.Details[0]?.OutletStatus == 1 &&
                    !outletDetails == 1 ? (
                    <div className="mb-5 d-flex justify-content-end" style={{ marginLeft: "1rem" }}>
                      <Button variant="primary" onClick={openOutletModal}>
                        Open Outlet
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                  {outletDetails == 1 &&
                    shifts &&
                    ((shifts[3] &&
                      shifts[3][0]?.ShiftOpen === 0 &&
                      shifts[3][0]?.ShiftTypeId == 3) ||
                      (shifts[3] &&
                        shifts[3][0]?.ShiftOpen === 0 &&
                        shifts[3][0]?.ShiftTypeId == 3 &&
                        shifts[2][0]?.ShiftOpen === 0)) ? (
                    <div className="mb-5 d-flex justify-content-end" style={{ marginLeft: "1rem" }}>
                      <Button variant="danger" onClick={OpenCLoseOutletModalFn}>
                        Close Outlet
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

              </div>


            </div>

            {shiftOneComponent({
              recentShiftOpen,
              shiftDetailsForUser,
              shifts,
            })}
            <div className="row mt-3 mx-auto">
              <div className="col-lg mx-auto d-flex text-center justify-content-around">
                <div className="d-flex justify-content-center align-items-center" style={{ flexBasis: "33.33%" }}>
                  {shifts[1]?.[0]?.CloseTime || recentShiftOpen?.filter((elem) => elem.ShiftTypeId === 1)?.[0]?.CloseTime ? <button
                    className="btn btn-primary m-2 p-2"
                    onClick={() => generateCashierReportShiftWiseWithShiftId(1)}
                  >
                    Generate Report
                  </button> : <div />}
                </div>
                <div className="d-flex justify-content-center align-items-center" style={{ flexBasis: "33.33%" }}>
                  {shifts[2]?.[0]?.CloseTime || recentShiftOpen?.filter((elem) => elem.ShiftTypeId === 2)?.[0]?.CloseTime ? <button
                    className="btn btn-primary m-2 p-2"
                    onClick={() => generateCashierReportShiftWiseWithShiftId(2)}
                  >
                    Generate Report
                  </button> : <div />}
                </div>
                <div className="d-flex justify-content-center align-items-center" style={{ flexBasis: "33.33%" }}>
                  {shifts[3]?.[0]?.CloseTime || recentShiftOpen?.filter((elem) => elem.ShiftTypeId === 3)?.[0]?.CloseTime ? <button
                    className="btn btn-primary m-2 p-2"
                    onClick={() => generateCashierReportShiftWiseWithShiftId(3)}
                  >
                    Generate Report
                  </button> : <div />}
                </div>
              </div>
            </div>

            <div className="row mt-5 mx-auto">
              <div className="col-lg mx-auto text-center">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    className="btn btn-primary m-4 p-4"
                    onClick={() => navigate("/NewBooking")}
                  >
                    Create New Booking
                  </button>
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

        <Modal
          show={showGenerateCashierModal}
          onHide={closeCashierReportModal}
          centered
        >
          <Modal.Body>
            <div className="row">
              <p className="outletTitle">Generate Cashier Report</p>
              <p className="outletTex">Generate Cashier Report</p>
            </div>
            <div className="row">
              <div>
                <Button
                  onClick={generateCashierReport}
                  className="closeConfirmBtn"
                >
                  Generate
                </Button>
              </div>
              <div>
                <Button
                  onClick={closeCashierReportModal}
                  className="closecancelBtn"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={showShiftReportModal}
          onHide={closeShiftReportModal}
          centered
        >
          <Modal.Body>
            <div className="row">
              <p className="outletTitle">Generate Shift Report</p>
              <p className="outletTex">Generate Shift Report</p>
            </div>
            <div className="row">
              <div>
                <Button
                  onClick={generateCashierReportShiftWise}
                  className="closeConfirmBtn"
                >
                  Generate
                </Button>
              </div>
              <div>
                <Button
                  onClick={closeShiftReportModal}
                  className="closecancelBtn"
                >
                  Cancel
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
    )
  );
};

export default Shifts;
