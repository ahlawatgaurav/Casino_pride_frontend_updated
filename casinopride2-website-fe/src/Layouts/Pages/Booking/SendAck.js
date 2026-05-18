import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { updateBookingId } from "../../../Redux/actions/billing";
import { useDispatch } from "react-redux";
import moment from "moment";
import logo from "../../../assets/Images/logo.png";
import { UploadAckFile } from "../../../Redux/actions/billing";
import html2pdf from "html2pdf.js";
// import QRCode from "qrcode.react";
import "../../../assets/Billing.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { usePDF } from "react-to-pdf";
import "../../../assets/global.css";
import { uploadBillFile } from "../../../Redux/actions/billing";
import { toPng } from "html-to-image";
import htmlToImage from "html-to-image";
import { Oval } from "react-loader-spinner";
import QRCode from "qrcode";
import { sendEmail } from "../../../Redux/actions/billing";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { shortenUrl } from "../../../Redux/actions/users";
import { getAcknowledgementLinkFn } from "../../../Redux/actions/booking";
import { countDriverBookings } from "../../../Redux/actions/users";
import { sendAckEmail } from "../../../Redux/actions/booking";

import booking from "../../../Redux/reducers/booking";
import { compose } from "@reduxjs/toolkit";

import { AddupdateAgentSettlementFordriver } from "../../../Redux/actions/booking";

const SendAck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const BookingDetails = useSelector(
    (state) => state.booking?.userDetailsAfterBooking
  );

  const driverDetails = useSelector((state) => state.users?.saveDriverDetails);

  console.log("driverDetails----------->", driverDetails?.Details);

  const elementRef = useRef(null);

  console.log(
    "BookingDetails-----------------|||||||||||||||---------------------->",
    BookingDetails
  );

  const formattedDatetime = moment(BookingDetails?.CreatedOn).format(
    "YYYY-MM-DD HH:mm"
  );
  console.log(formattedDatetime);
  const [qrCodeImage, setQRCodeImage] = useState(null);

  const [disabledLoader, setDisabledLoader] = useState(true);

  const [shortUrl, setShortUrl] = useState("");

  const [loader, setLoader] = useState(false);
  const [updatedQrcodeImage, setUpatedQrcodeImage] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);

    const parameterString = url.searchParams.get("TransactionId");

    const [transactionId, paymentId] = parameterString?.split(",") || [
      undefined,
      undefined,
    ];

    const paymentIdValue = paymentId?.split("=")[1] || undefined;

    console.log("TransactionId:", transactionId);
    console.log("PaymentId:", paymentIdValue);

    const data = {
      paymentId: +paymentIdValue,
      transactionId: transactionId,
      bookingId: BookingDetails?.Id
    };
    dispatch(
      updateBookingId(data, (callback) => {
        if (callback.status) {
          console.log(
            "Callback Updated booking  details---->",
            callback?.response?.Details
          );

          setLoader(false);

          // resolve(callback);
        } else {
          toast.error(callback.error);
          // reject(callback);
        }
      })
    );

    dispatch(
      getAcknowledgementLinkFn(BookingDetails?.Id, (callback) => {
        if (callback.status) {
          console.log(
            "Get ack file link---------->>",
            callback?.response?.acknowledgementLink
          );
          setUpatedQrcodeImage(callback?.response?.acknowledgementLink);
        } else {
          toast.error(callback.error);
        }
      })
    );

    if (elementRef.current === null) {
      return;
    }

    toPng(elementRef.current, { cacheBust: true })
      .then(async (dataUrl) => {
        // Convert the data URL to a blob
        function dataURLtoBlob(dataURL) {
          const arr = dataURL?.split(",");
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], { type: mime });
        }
        const imageBlob = await dataURLtoBlob(dataUrl);
        console.log("imageBlob-------->", imageBlob);

        const formData = new FormData();
        if (imageBlob) {
          formData.append("File", imageBlob, `${BookingDetails?.Id}ack.png`);
        }

        const bookingId = BookingDetails?.Id;
        console.log("BookingId-------->", bookingId);

        if (bookingId) {
          formData.append("bookingId", bookingId);
        }

        console.log("Formdata for upload ack=-===========>", formData);

        dispatch(
          UploadAckFile(formData, (callback) => {
            if (callback.status) {
              console.log(
                "Callback upload ack details---->",
                callback?.response?.Details
              );
              setDisabledLoader(false);
              // setUpatedQrcodeImage(callback?.response?.Details?.ACKFile);

              // const data = {
              //   longURL: callback?.response?.Details?.ACKFile,
              // };

              // dispatch(
              //   shortenUrl(data, (callback) => {
              //     if (callback.status) {
              //       console.log(
              //         "post shorten url------------->",
              //         callback?.response?.shortUrl
              //       );
              //       setShortUrl(callback?.response?.shortUrl);
              //       setDisabledLoader(false);

              //       // setUpatedQrcodeImage(callback?.response?.shortUrl);

              //       setLoader(false);
              //     } else {
              //       toast.error(callback.error);
              //     }
              //   })
              // );

              setLoader(false);

              // resolve(callback);
            } else {
              toast.error(callback.error);
              // reject(callback);
            }
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [elementRef]);

  const onButtonClick = useCallback(() => {
    setLoader(true);
    if (elementRef.current === null) {
      return;
    }

    toPng(elementRef.current, { cacheBust: true })
      .then(async (dataUrl) => {
        // Convert the data URL to a blob
        const imageBlob = await dataURLtoBlob(dataUrl);

        function dataURLtoBlob(dataURL) {
          const arr = dataURL?.split(",");
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], { type: mime });
        }

        // Create a FormData object and append the image blob
        const formData = new FormData();
        formData.append("File", imageBlob, `${BookingDetails?.Id}ack.png`);
        formData.append("bookingId", BookingDetails?.Id);

        // Make a POST request to your server to upload the image
        dispatch(
          UploadAckFile(formData, (callback) => {
            if (callback.status) {
              console.log(
                "Callback pdf details-------------------------------------------------------------------------------------------HIIIIIIIIIIIIIIIiiii>",
                callback?.response?.Details?.ACKFile
              );

              const data = {
                // longURL: callback?.response?.Details?.ACKFile,
                longURL: callback?.response?.Details?.Acknowledgement,
              };

              dispatch(
                shortenUrl(data, (callback) => {
                  if (callback.status) {
                    console.log(
                      "post shorten url------------->",
                      callback?.response?.shortUrl
                    );
                    // setShortUrl(callback?.response?.shortUrl);
                    setDisabledLoader(false);

                    const data = {
                      receiverEmail: BookingDetails?.Email,
                      amount:
                        BookingDetails.ActualAmount -
                          BookingDetails?.AmountAfterDiscount ==
                        0
                          ? BookingDetails.ActualAmount
                          : BookingDetails?.AmountAfterDiscount,
                      ackFile: callback?.response?.shortUrl,
                    };

                    dispatch(
                      sendAckEmail(data, (callback) => {
                        if (callback.status) {
                          toast.success("Email sent");

                          console.log(
                            "Calback from email------------------------>",
                            callback
                          );
                          setLoader(false);
                          navigate("/NewBooking");

                          toast.error(callback.error);
                        } else {
                          toast.error(callback.error);
                          setLoader(false);
                        }
                      })
                    );

                    let shortUrl = callback?.response?.shortUrl;

                    // setUpatedQrcodeImage(callback?.response?.shortUrl);
                    const apiUrl = `https://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${BookingDetails?.Phone.replace("+91", "")}&text=Dear%20Sir,%0AGreetings%20from%20Casino%20Pride%0AWe%20would%20love%20to%20inform%20you%20that%20we%20have%20received%20your%20booking%20for%20${shortUrl}.%20Kindly%20follow%20the%20link%20and%20show%20the%20QR%20code%20to%20the%20Front%20Office%20at%20the%20time%20of%20your%20arrival%20for%20hassle%20free%20entry.%0APlease%20make%20sure%20that%20people%20are%20above%2021%20years%20of%20age%20and%20are%20following%20the%20dress%20code%20that%20is%20smart%20casuals%20or%20formals.%20For%20men%20slippers,%20shorts,%20cut%20sleeves%20and%20caps%20are%20not%20allowed.%0APlease%20note%20that%20the%20booking%20amount%20is%20not%20refundable%20or%20transferable.%0AWe%20would%20love%20to%20have%20you%20onboard%20Casino%20Pride.%0ALet%27s%20play%20with%20PRIDE%20!!%0AThanks%20%26%20Regards%0A24x7%20helpline%20-%209158885000%0ATeam%20Casino%20Pride%20-%20CPGOAA`
                    
                    fetch(apiUrl)
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error(
                            `HTTP error! Status: ${response.status}`
                          );
                        }
                        return response.json(); // Parse the JSON response
                      })
                      .then((data) => {
                        console.log(data); // Handle the parsed JSON data here
                        toast.success("Details sent to customer");
                      })
                      .catch((error) => {
                        console.error("Fetch error:", error);
                        toast.success("Details sent to customer");
                      });

                    setLoader(false);
                  } else {
                    toast.error(callback.error);
                  }
                })
              );

              setLoader(false);
              toast.success("Booking Confirmed");

              window.open(callback?.response?.Details?.ACKFile, "_blank");

              // resolve(callback);
            } else {
              toast.error(callback.error);
              // reject(callback);
            }
          })
        );

        if (driverDetails?.Details) {
          const AgentSettlementAmount =
            (BookingDetails?.ActualAmount *
              driverDetails?.Details?.DiscountPercent) /
            100;

          console.log(
            "AgentSettlementAmount------------>",
            AgentSettlementAmount
          );

          const driverAgentData = {
            userId: driverDetails?.Details?.Id,
            userTypeId: driverDetails?.Details?.UserType,
            agentName: driverDetails?.Details?.Name,
            settlementAmount: AgentSettlementAmount,
            bookingDate: BookingDetails?.CreatedOn,
            bookingId: BookingDetails?.Id,
          };
          dispatch(
            AddupdateAgentSettlementFordriver(
              driverAgentData,

              (callback) => {
                if (callback.status) {
                  console.log(
                    "Callback add update details of agent discount seetlement amopunt---->",
                    callback?.response?.Details
                  );
                } else {
                  toast.error(callback.error);
                  // reject(callback);
                }
              }
            )
          );

          const driverDetailsData = {
            userId: driverDetails?.Details?.Id,
            userType: driverDetails?.Details?.UserType,
          };
          dispatch(
            countDriverBookings(
              driverDetailsData,

              (callback) => {
                if (callback.status) {
                  console.log(
                    "Callback count Driver Bookings---->",
                    callback?.response?.Details
                  );
                } else {
                  toast.error(callback.error);
                  // reject(callback);
                }
              }
            )
          );
        }

        const QrBillLink = JSON.stringify(updatedQrcodeImage);
        console.log(
          "Above image data email------------------------------------------->",
          QrBillLink
        );
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("shortUrl----->", shortUrl);
  }, [elementRef]);

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

  return (
    <div>
      <ToastContainer />
      <div ref={elementRef}>
        <div
          className="thermal-bill"
          style={{
            backgroundColor: "white",
            width: "100%",
            padding: "2%",
          }}
        >
          <div className="row">
            <div className="col-lg-4"></div>
            <div className="col-lg-4">
              <div className="text-center">
                <img
                  src={logo}
                  alt="Casino Pride Logo"
                  className="logo-image"
                />
              </div>
            </div>
            <div className="col-lg-4"></div>
          </div>
          <p
            style={{
              marginBottom: "5px",
            }}
            className="BillPrintFont"
          >
            A unit of Goa Coastal Resorts & Recreation Pvt.Ltd
          </p>
          <h5 style={{ fontSize: "15px" }}>
          H.No. 838/1(3), 2nd floor Edificio Da Silva E Menezes Near Holy Family church Porvorim Goa 403521{" "}
            <br></br>Tel. + 91 9158885000
          </h5>
          <h5 style={{ fontSize: "15px" }}>
            Email : info@casinoprideofficial.com
          </h5>
          <h5 style={{ fontSize: "15px" }}>
            Website : www.casinoprideofficial.com
          </h5>
          <h5 style={{ fontSize: "15px" }}>Instagram : casinoprideofficial</h5>
          <h5 style={{ fontSize: "12px" }}>CIN No : U55101GA2005PTC004274 </h5>
          <h5 style={{ fontSize: "12px" }}>PAN No : AACCG7450R</h5>

          <div className="row">
            <div className="col-6 bill-details">
              <p className="BillPrintFont">
                Gusest Name :
                <span className="BillPrintFont">{BookingDetails.FullName}</span>{" "}
              </p>
              {BookingDetails.guestGSTIN ? (
                <p className="BillPrintFont">
                  Guest GSTIN :{" "}
                  <span className="BillPrintFont">
                    {BookingDetails.guestGSTIN}
                  </span>
                </p>
              ) : (
                <></>
              )}
              <p className="BillPrintFont">
                Guest Mobile :
                <span className="guest-mobile BillPrintFont">
                  {BookingDetails.Phone}
                </span>
              </p>
              {BookingDetails.guestState ? (
                <p className="BillPrintFont">
                  Guest State :
                  <span className="guest-state BillPrintFont">
                    {BookingDetails.guestState}
                  </span>
                </p>
              ) : (
                <></>
              )}

              <p className="BillPrintFont">
                Total Number of Guests :{" "}
                <span className="BillPrintFont">
                  {BookingDetails.TotalGuestCount}
                </span>
              </p>

              <p className="BillPrintFont">
                Total Amount :{" "}
                <span className="BillPrintFont">
                  {BookingDetails.ActualAmount -
                    BookingDetails?.AmountAfterDiscount ==
                  0
                    ? BookingDetails.ActualAmount
                    : BookingDetails?.AmountAfterDiscount}
                </span>
              </p>

              <p className="BillPrintFont">
                Event Date :
                <span style={{ fontWeight: "bold" }} className="BillPrintFont">
                  {BookingDetails?.FutureDate}
                </span>
              </p>
            </div>
            <div className="col-6">
              <div className="d-flex justify-content-end qr-code">
                {qrCodeImage && (
                  <div className="qr-code-image">
                    <img src={qrCodeImage} alt="QR Code" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bill-details">
            <div className="date-time-bill-row">
              <p className="BillPrintFont">
                Acknowledgement Date :
                <span style={{ fontWeight: "bold" }} className="BillPrintFont">
                  {formattedDatetime}
                </span>
              </p>

              <p
                className="bill-number BillPrintFont"
                style={{ marginRight: "20px" }}
              >
                Booking Id : {BookingDetails.Id}
              </p>
            </div>
            <hr />
          </div>
        </div>
      </div>

      <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
        <button
          style={{ paddingLeft: "100px", paddingRight: "100px" }}
          type="submit"
          className="btn btn-primary bg-golden mt-5 btn-lg"
          onClick={onButtonClick}
          disabled={disabledLoader}
        >
          {!loader ? (
            "Confirm"
          ) : (
            <Oval
              height={30}
              width={30}
              color="#4fa94d"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default SendAck;

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useSelector } from "react-redux";
// import { updateBookingId } from "../../../Redux/actions/billing";
// import { useDispatch } from "react-redux";
// import moment from "moment";
// import logo from "../../../assets/Images/logo.png";
// import { UploadAckFile } from "../../../Redux/actions/billing";
// import html2pdf from "html2pdf.js";
// // import QRCode from "qrcode.react";
// import "../../../assets/Billing.css";
// import { useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { usePDF } from "react-to-pdf";
// import "../../../assets/global.css";
// import { uploadBillFile } from "../../../Redux/actions/billing";
// import { toPng } from "html-to-image";
// import htmlToImage from "html-to-image";
// import { Oval } from "react-loader-spinner";
// import QRCode from "qrcode";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { shortenUrl } from "../../../Redux/actions/users";
// import { AddupdateAgentSettlement } from "../../../Redux/actions/users";
// import booking from "../../../Redux/reducers/booking";
// import { compose } from "@reduxjs/toolkit";
// import { sendEmail } from "../../../Redux/actions/booking";
// import { getAcknowledgementLinkFn } from "../../../Redux/actions/booking";

// const SendAck = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const BookingDetails = useSelector(
//     (state) => state.booking?.userDetailsAfterBooking
//   );
//   const elementRef = useRef(null);

//   console.log(
//     "BookingDetails-----------------|||||||||||||||---------------------->",
//     BookingDetails?.IsBookingWebsite
//   );

//   const loginDetails = useSelector(
//     (state) => state.auth?.userDetailsAfterLogin.Details
//   );

//   const validateDetails = useSelector(
//     (state) => state.auth?.userDetailsAfterValidation
//   );

//   const AgentSettlemetDiscount =
//     validateDetails?.Details?.DiscountPercent -
//     BookingDetails?.AgentPanelDiscount;

//   const AgentSettlementAmount =
//     (BookingDetails?.ActualAmount * AgentSettlemetDiscount) / 100;

//   console.log("Agent settlement amount log--------->", AgentSettlementAmount);

//   console.log("Login Details------------------->", loginDetails?.logindata);
//   console.log("Login Details------------------->", validateDetails?.Details);

//   const formattedDatetime = moment(BookingDetails?.CreatedOn).format(
//     "YYYY-MM-DD HH:mm"
//   );
//   console.log(formattedDatetime);
//   const [qrCodeImage, setQRCodeImage] = useState(null);

//   const [disabledLoader, setDisabledLoader] = useState(true);

//   const [loader, setLoader] = useState(false);

//   const [updatedQrcodeImage, setUpatedQrcodeImage] = useState("");
//   console.log(
//     "updatedQrcodeImage--------------------------------------------------------------------------------------------------------->",
//     updatedQrcodeImage
//   );

//   useEffect(() => {
//     const url = new URL(window.location.href);

//     const parameterString = url.searchParams.get("TransactionId");

//     const [transactionId, paymentId] = parameterString.split(",");

//     const paymentIdValue = paymentId.split("=")[1];

//     console.log("TransactionId:", transactionId);
//     console.log("PaymentId:", paymentIdValue);

//     const data = {
//       paymentId: paymentIdValue,
//       transactionId: transactionId,
//       bookingId: BookingDetails?.Id,
//     };
//     dispatch(
//       updateBookingId(data, (callback) => {
//         if (callback.status) {
//           console.log(
//             "Callback Updated booking  details---->",
//             callback?.response?.Details
//           );

//           setLoader(false);

//           // resolve(callback);
//         } else {
//           toast.error(callback.error);
//           // reject(callback);
//         }
//       })
//     );

//     dispatch(
//       getAcknowledgementLinkFn(BookingDetails?.Id, (callback) => {
//         if (callback.status) {
//           console.log(
//             "Get ack file link---------->>",
//             callback?.response?.acknowledgementLink
//           );
//           setUpatedQrcodeImage(callback?.response?.acknowledgementLink);
//         } else {
//           toast.error(callback.error);
//         }
//       })
//     );

//     if (elementRef.current === null) {
//       return;
//     }

//     toPng(elementRef.current, { cacheBust: true })
//       .then(async (dataUrl) => {
//         // Convert the data URL to a blob
//         const imageBlob = await dataURLtoBlob(dataUrl);

//         function dataURLtoBlob(dataURL) {
//           const arr = dataURL.split(",");
//           const mime = arr[0].match(/:(.*?);/)[1];
//           const bstr = atob(arr[1]);
//           let n = bstr.length;
//           const u8arr = new Uint8Array(n);
//           while (n--) {
//             u8arr[n] = bstr.charCodeAt(n);
//           }
//           return new Blob([u8arr], { type: mime });
//         }
//         console.log("imageBlob-------->", imageBlob);

//         const formData = new FormData();
//         if (imageBlob) {
//           formData.append("File", imageBlob, "billing.png");
//         }

//         const bookingId = BookingDetails?.Id;
//         console.log("BookingId-------->", bookingId);

//         if (bookingId) {
//           formData.append("bookingId", bookingId);
//         }

//         console.log("Formdata for upload ack=-===========>", formData);

//         dispatch(
//           UploadAckFile(formData, (callback) => {
//             if (callback.status) {
//               console.log(
//                 "Callback upload ack details---->",
//                 callback?.response?.Details
//               );

//               const data = {
//                 longURL: callback?.response?.Details?.ACKFile,
//               };

//               // dispatch(
//               //   shortenUrl(data, (callback) => {
//               //     if (callback.status) {
//               //       console.log(
//               //         "post shorten url------------->",
//               //         callback?.response?.shortUrl
//               //       );
//               //       setUpatedQrcodeImage(callback?.response?.shortUrl);

//               //       setLoader(false);
//               //     } else {
//               //       toast.error(callback.error);
//               //     }
//               //   })
//               // );

//               setDisabledLoader(false);
//               setLoader(false);

//               // resolve(callback);
//             } else {
//               toast.error(callback.error);
//               // reject(callback);
//             }
//           })
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [elementRef, updatedQrcodeImage]);

//   const AgentSettlemetFn = () => {
//     console.log("Called here in agent");
//     const agentData = {
//       userId: loginDetails?.logindata?.userId,
//       agentName: validateDetails?.Details?.Name,
//       userTypeId: loginDetails?.logindata?.UserType,
//       settlementAmount: AgentSettlementAmount,
//       bookingDate: BookingDetails?.CreatedOn,
//       bookingId: BookingDetails?.Id,
//     };
//     dispatch(
//       AddupdateAgentSettlement(
//         agentData,
//         loginDetails?.logindata?.Token,
//         (callback) => {
//           if (callback.status) {
//             console.log(
//               "Callback add update details of agent discount seetlement amopunt---->",
//               callback?.response?.Details
//             );

//             setLoader(false);

//             // resolve(callback);
//           } else {
//             toast.error(callback.error);
//             // reject(callback);
//           }
//         }
//       )
//     );
//   };

//   const sendSmsFn = () => {
//     AgentSettlemetFn();
//     setLoader(true);
//     // const data = {
//     //   receiverEmail: BookingDetails?.Email,
//     //   amount:
//     //     BookingDetails.ActualAmount - BookingDetails?.AmountAfterDiscount == 0
//     //       ? BookingDetails.ActualAmount
//     //       : BookingDetails?.AmountAfterDiscount,
//     //   ackFile: updatedQrcodeImage,
//     // };

//     // dispatch(
//     //   sendEmail(data, (callback) => {
//     //     setLoader(true);
//     //     if (callback.status) {
//     //       toast.success("Email sent");

//     //       console.log("Calback from email------------------------>", callback);
//     //       setLoader(false);

//     //       toast.error(callback.error);
//     //     } else {
//     //       toast.error(callback.error);
//     //     }
//     //   })
//     // );

//     if (elementRef.current === null) {
//       return;
//     }

//     toPng(elementRef.current, { cacheBust: true })
//       .then(async (dataUrl) => {
//         // Convert the data URL to a blob
//         const imageBlob = await dataURLtoBlob(dataUrl);

//         function dataURLtoBlob(dataURL) {
//           const arr = dataURL.split(",");
//           const mime = arr[0].match(/:(.*?);/)[1];
//           const bstr = atob(arr[1]);
//           let n = bstr.length;
//           const u8arr = new Uint8Array(n);
//           while (n--) {
//             u8arr[n] = bstr.charCodeAt(n);
//           }
//           return new Blob([u8arr], { type: mime });
//         }

//         // Create a FormData object and append the image blob
//         const formData = new FormData();
//         formData.append("File", imageBlob, "billing.png");
//         formData.append("bookingId", BookingDetails?.Id);

//         // Make a POST request to your server to upload the image
//         dispatch(
//           UploadAckFile(formData, (callback) => {
//             if (callback.status) {
//               console.log(
//                 "Callback pdf details-------------------------------------------------------------------------------------------HIIIIIIIIIIIIIIIiiii>",
//                 callback?.response
//               );

//               setLoader(false);
//               toast.success("Booking Confirmed");

//               const data = {
//                 longURL: callback?.response?.Details?.ACKFile,
//               };
//               dispatch(
//                 shortenUrl(data, (callback) => {
//                   if (callback.status) {
//                     console.log(
//                       "post shorten url------------->",
//                       callback?.response?.shortUrl
//                     );
//                     // setShortUrl(callback?.response?.shortUrl);
//                     setDisabledLoader(false);

//                     // const apiUrl = `http://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${BookingDetails?.Phone}&text=Dear%20Sir,%0AGreetings%20from%20Casino%20Pride%0AWe%20would%20love%20to%20inform%20you%20that%20we%20have%20received%20your%20booking%20for%20200%20Kindly%20follow%20the%20link%20and%20show%20the%20QR%20code%20to%20the%20Front%20Office%20at%20the%20time%20of%20your%20arrival%20for%20hassle%20free%20entry.%0APlease%20make%20sure%20that%20people%20are%20above%2021%20years%20of%20age%20and%20are%20following%20the%20dress%20code%20that%20is%20smart%20casuals%20or%20formals.%20For%20men%20slippers,%20shorts,%20cut%20sleeves%20and%20caps%20are%20not%20allowed.%0APlease%20note%20that%20the%20booking%20amount%20is%20not%20refundable%20or%20transferable.%0AWe%20would%20love%20to%20have%20you%20onboard%20Casino%20Pride.%20%0ADo%20let%20us%20know%20your%20valuable%20feedback%20at%20feedback@casinoprideofficial.com%0ALet%27s%20play%20with%20PRIDE%20!!%0AThanks%20%26%20Regards%0A24x7%20helpline%20-%20%2B91%2091%205888%205000%0ATeam%20Casino%20Pride%20-%20CPGOAA`;
//                     const apiUrl2 = `http://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${BookingDetails?.Phone}&text=Dear%20Sir,%0AGreetings%20from%20Casino%20Pride%0AWe%20would%20love%20to%20inform%20you%20that%20we%20have%20received%20your%20booking%20for%20${callback?.response?.shortUrl}%20Kindly%20follow%20the%20link%20and%20show%20the%20QR%20code%20to%20the%20Front%20Office%20at%20the%20time%20of%20your%20arrival%20for%20hassle%20free%20entry.%0APlease%20make%20sure%20that%20people%20are%20above%2021%20years%20of%20age%20and%20are%20following%20the%20dress%20code%20that%20is%20smart%20casuals%20or%20formals.%20For%20men%20slippers,%20shorts,%20cut%20sleeves%20and%20caps%20are%20not%20allowed.%0APlease%20note%20that%20the%20booking%20amount%20is%20not%20refundable%20or%20transferable.%0AWe%20would%20love%20to%20have%20you%20onboard%20Casino%20Pride.%20%0ADo%20let%20us%20know%20your%20valuable%20feedback%20at%20feedback@casinoprideofficial.com%0ALet%27s%20play%20with%20PRIDE%20!!%0AThanks%20%26%20Regards%0A24x7%20helpline%20-%20%2B91%2091%205888%205000%0ATeam%20Casino%20Pride%20-%20CPGOAA`;
//                     fetch(apiUrl2)
//                       .then((response) => {
//                         if (!response.ok) {
//                           throw new Error(
//                             `HTTP error! Status: ${response.status}`
//                           );
//                         }
//                         return response.json();
//                       })
//                       .then((data) => {
//                         console.log(data);
//                         toast.success("Details sent to customer");
//                       })
//                       .catch((error) => {
//                         console.error("Fetch error:", error.message);
//                       });

//                     const data = {
//                       receiverEmail: BookingDetails?.Email,
//                       amount:
//                         BookingDetails.ActualAmount -
//                           BookingDetails?.AmountAfterDiscount ==
//                         0
//                           ? BookingDetails.ActualAmount
//                           : BookingDetails?.AmountAfterDiscount,
//                       ackFile: callback?.response?.shortUrl,
//                     };

//                     console.log("HIIIIIIIIIII for not showing--------->", data);

//                     dispatch(
//                       sendEmail(data, (callback) => {
//                         setLoader(true);
//                         if (callback.status) {
//                           toast.success("Email sent");

//                           console.log(
//                             "Calback from email------------------------>",
//                             callback
//                           );

//                           if (BookingDetails?.IsBookingWebsite == 1) {
//                             window.open(
//                               "http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:5858/"
//                             );
//                           } else {
//                             // navigate("/NewBooking");
//                             window.open(
//                               "http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:6868/"
//                             );
//                           }
//                           setLoader(false);

//                           toast.error(callback.error);
//                         } else {
//                           toast.error(callback.error);
//                           setLoader(false);
//                         }
//                       })
//                     );

//                     setLoader(false);
//                   } else {
//                     toast.error(callback.error);
//                   }
//                 })
//               );

//               // navigate("/NewBooking");

//               // const apiUrl = `http://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${callback?.response?.Details?.Phone}&text=Dear%20Sir,%0AGreetings%20from%20Casino%20Pride%0AWe%20would%20love%20to%20inform%20you%20that%20we%20have%20received%20your%20booking%20for%20${updatedQrcodeImage}.%20Kindly%20follow%20the%20link%20and%20show%20the%20QR%20code%20to%20the%20Front%20Office%20at%20the%20time%20of%20your%20arrival%20for%20hassle%20free%20entry.%0APlease%20make%20sure%20that%20people%20are%20above%2021%20years%20of%20age%20and%20are%20following%20the%20dress%20code%20that%20is%20smart%20casuals%20or%20formals.%20For%20men%20slippers,%20shorts,%20cut%20sleeves%20and%20caps%20are%20not%20allowed.%0APlease%20note%20that%20the%20booking%20amount%20is%20not%20refundable%20or%20transferable.%0AWe%20would%20love%20to%20have%20you%20onboard%20Casino%20Pride.%20%0ADo%20let%20us%20know%20your%20valuable%20feedback%20at%20feedback@casinoprideofficial.com%0ALet%27s%20play%20with%20PRIDE%20!!%0AThanks%20%26%20Regards%0A24x7%20helpline%20-%20%2B91%2091%205888%205000%0ATeam%20Casino%20Pride%20-%20CPGOAA`;
//               // fetch(apiUrl)
//               //   .then((response) => {
//               //     if (!response.ok) {
//               //       throw new Error(`HTTP error! Status: ${response.status}`);
//               //     }
//               //     return response.json(); // Parse the JSON response
//               //   })
//               //   .then((data) => {
//               //     console.log(data); // Handle the parsed JSON data here
//               //     toast.success("Details sent to customer");
//               //   })
//               //   .catch((error) => {
//               //     console.error("Fetch error:", error);
//               //     toast.success("Details sent to customer");
//               //   });

//               window.open(callback?.response?.Details?.ACKFile, "_blank");

//               // resolve(callback);
//             } else {
//               toast.error(callback.error);
//               // reject(callback);
//             }
//           })
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const onButtonClick = useCallback(() => {
//     sendSmsFn();
//     AgentSettlemetFn();
//     setLoader(true);
//   }, []);

//   useEffect(() => {
//     QRCode.toCanvas(
//       document.createElement("canvas"),
//       updatedQrcodeImage,
//       (error, canvas) => {
//         if (error) {
//           console.error("QR code generation error:", error);
//         } else {
//           const qrCodeDataURL = canvas.toDataURL("image/png");
//           setQRCodeImage(qrCodeDataURL);
//         }
//       }
//     );
//   }, [updatedQrcodeImage]);

//   return (
//     <div>
//       <ToastContainer />
//       <div ref={elementRef}>
//         <div
//           className="thermal-bill"
//           style={{
//             backgroundColor: "white",
//             width: "100%",
//             padding: "2%",
//           }}
//         >
//           <div className="row">
//             <div className="col-lg d-flex justify-content-center align-items-center">
//               <div>
//                 <img
//                   src={logo}
//                   alt="Casino Pride Logo"
//                   className="logo-image"
//                 />
//               </div>
//             </div>
//           </div>
//           <p
//             style={{
//               marginBottom: "5px",
//             }}
//             className="BillPrintFont"
//           >
//             A unit of Goa Coastal Resorts & Recreation Pvt.Ltd
//           </p>
//           <h5 style={{ fontSize: "15px" }}>
//             Hotel Neo Majestic, Plot No. 104/1A, Porvorim, Bardez, Goa - 403 521{" "}
//             <br></br>Tel. + 91 9158885000
//           </h5>
//           <h5 style={{ fontSize: "15px" }}>
//             Email : info@casinoprideofficial.com
//           </h5>
//           <h5 style={{ fontSize: "15px" }}>
//             Website : www.casinoprideofficial.com
//           </h5>
//           <h5 style={{ fontSize: "15px" }}>Instagram :</h5>
//           <h5 style={{ fontSize: "12px" }}>CIN No: U55101GA2005PTC004274 </h5>
//           <h5 style={{ fontSize: "12px" }}>PAN No: AACCG7450R</h5>
//           <h5 style={{ fontSize: "12px" }}>GSTIN : 30AACCG7450R1ZC</h5>
//           <h5 style={{ fontSize: "12px" }}>TIN No : 30220106332</h5>

//           <div className="row">
//             <div className="col-6 bill-details">
//               <p className="BillPrintFont">
//                 Gusest Name :
//                 <span className="BillPrintFont">{BookingDetails.FullName}</span>{" "}
//               </p>
//               {BookingDetails.guestGSTIN ? (
//                 <p className="BillPrintFont">
//                   Guest GSTIN :{" "}
//                   <span className="BillPrintFont">
//                     {BookingDetails.guestGSTIN}
//                   </span>
//                 </p>
//               ) : (
//                 <></>
//               )}
//               <p className="BillPrintFont">
//                 Guest Mobile :
//                 <span className="guest-mobile BillPrintFont">
//                   {BookingDetails.Phone}
//                 </span>
//               </p>
//               {BookingDetails.guestState ? (
//                 <p className="BillPrintFont">
//                   Guest State :
//                   <span className="guest-state BillPrintFont">
//                     {BookingDetails.guestState}
//                   </span>
//                 </p>
//               ) : (
//                 <></>
//               )}

//               <p className="BillPrintFont">
//                 Total Number of Guests :{" "}
//                 <span className="BillPrintFont">
//                   {BookingDetails.TotalGuestCount}
//                 </span>
//               </p>

//               <p className="BillPrintFont">
//                 Total Amount :{" "}
//                 <span className="BillPrintFont">
//                   {BookingDetails.ActualAmount -
//                     BookingDetails?.AmountAfterDiscount ==
//                   0
//                     ? BookingDetails.ActualAmount
//                     : BookingDetails?.AmountAfterDiscount}
//                 </span>
//               </p>
//             </div>
//             <div className="col-6">
//               <div className="d-flex justify-content-end qr-code">
//                 {qrCodeImage && (
//                   <div className="qr-code-image">
//                     <img src={qrCodeImage} alt="QR Code" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="bill-details">
//             <div className="date-time-bill-row">
//               <p className="BillPrintFont">
//                 Date :
//                 <span style={{ fontWeight: "bold" }} className="BillPrintFont">
//                   {/* {" "}
//                 {moment
//                   .utc(BookingDetails?.BillingDate)
//                   .format("DD/MM/YYYY HH:mm")} */}
//                   {formattedDatetime}
//                 </span>
//               </p>

//               <p
//                 className="bill-number BillPrintFont"
//                 style={{ marginRight: "25px" }}
//               >
//                 Booking Id: {BookingDetails.Id}
//               </p>
//             </div>
//             <hr />
//           </div>
//         </div>
//       </div>

//       <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
//         <button
//           style={{ paddingLeft: "100px", paddingRight: "100px" }}
//           type="submit"
//           className="btn btn-primary mt-5 btn-lg"
//           // onClick={onButtonClick}
//           onClick={sendSmsFn}
//           disabled={disabledLoader}
//         >
//           {!loader ? (
//             "Confirm"
//           ) : (
//             <Oval
//               height={30}
//               width={30}
//               color="#4fa94d"
//               visible={true}
//               ariaLabel="oval-loading"
//               secondaryColor="#4fa94d"
//               strokeWidth={2}
//               strokeWidthSecondary={2}
//             />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SendAck;
