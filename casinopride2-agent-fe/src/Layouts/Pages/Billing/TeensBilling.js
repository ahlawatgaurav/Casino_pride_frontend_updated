import React, { useEffect, useState, useRef, useCallback } from "react";
import html2pdf from "html2pdf.js";
// import QRCode from "qrcode.react";
import "../../../assets/Billing.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../../../assets/Images/logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { usePDF } from "react-to-pdf";
import moment from "moment";
import "../../../assets/global.css";
import { uploadBillFile } from "../../../Redux/actions/billing";
import { toPng } from "html-to-image";
import htmlToImage from "html-to-image";
import { Oval } from "react-loader-spinner";
import QRCode from "qrcode";
import { PDFDocument, rgb } from "pdf-lib";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeensBilling = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;
  const { BookingDetails } = location.state;

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log(
    "BookingDetails[0]?.BookingId--------------------->",
    BookingDetails[0]?.BookingId
  );

  const [qrCodeImage, setQRCodeImage] = useState(null);

  const [loader, setLoader] = useState(true);

  // const generatePDFAndSend = async () => {
  //   const elements = document.querySelectorAll(".thermal-bill");

  //   if (elements.length === 0) {
  //     console.log("No elements found with the class 'thermal-bill'");
  //     return;
  //   }

  //   // Create a container div and clone the elements into it
  //   const container = document.createElement("div");
  //   elements.forEach((element) => {
  //     container.appendChild(element.cloneNode(true));
  //   });

  //   const opt = {
  //     margin: [10, 0, 0, 0],
  //     filename: "bill.pdf", // Change the filename as needed
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   };

  //   try {
  //     const pdfBlob = await html2pdf().from(container).set(opt).outputPdf();

  //     console.log("PDF Blob:::::::::::::::::::", pdfBlob);

  //     const formData = new FormData();
  //     formData.append(
  //       "File",
  //       new Blob([pdfBlob], { type: "application/pdf" }),
  //       "bill.pdf"
  //     );
  //     formData.append("bookingId", BookingDetails[0]?.BookingId);

  //     const callback = await new Promise((resolve, reject) => {
  //       dispatch(
  //         uploadBillFile(
  //           loginDetails?.logindata?.Token,
  //           formData,
  //           (callback) => {
  //             if (callback.status) {
  //               console.log(
  //                 "Callback pdf details---->",
  //                 callback?.response?.Details
  //               );
  //               resolve(callback);
  //             } else {
  //               toast.error(callback.error);
  //               reject(callback);
  //             }
  //           }
  //         )
  //       );
  //     });

  //     if (callback.status) {
  //       console.log("Upload successful.");
  //     } else {
  //       console.error("Upload failed:", callback.error);
  //     }
  //   } catch (error) {
  //     console.error("Error generating or uploading PDF:", error);
  //   }
  // };

  const elementRef = useRef(null);

  const [updatedQrcodeImage, setUpatedQrcodeImage] = useState("");

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

        // Create a FormData object and append the image blob
        const formData = new FormData();
        formData.append("File", imageBlob, "billing.png");
        formData.append("bookingId", BookingDetails[0]?.BookingId);

        // Make a POST request to your server to upload the image
        dispatch(
          uploadBillFile(
            loginDetails?.logindata?.Token,
            formData,
            (callback) => {
              if (callback.status) {
                console.log(
                  "Callback pdf details---->",
                  callback?.response?.Details
                );
                setUpatedQrcodeImage(
                  callback?.response?.Details[0]?.BillingFile
                );
                setLoader(false);

                // resolve(callback);
              } else {
                toast.error(callback.error);
                // reject(callback);
              }
            }
          )
        );

        // if (response.ok) {
        //   console.log("Image upload successful.");
        // } else {
        //   console.error("Image upload failed:", response.statusText);
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [elementRef]);

  const SendDetailsToUser = useCallback(() => {
    setLoader(true);
    if (elementRef.current === null) {
      return;
    }

    toPng(elementRef.current, { cacheBust: true })
      .then(async (dataUrl) => {
        // Convert the data URL to a blob
        const imageBlob = await dataURLtoBlob(dataUrl);

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

        // Create a FormData object and append the image blob
        const formData = new FormData();
        formData.append("File", imageBlob, "billing.png");
        formData.append("bookingId", BookingDetails[0]?.BookingId);

        // Make a POST request to your server to upload the image
        dispatch(
          uploadBillFile(
            loginDetails?.logindata?.Token,
            formData,
            (callback) => {
              if (callback.status) {
                console.log(
                  "Callback pdf details---->",
                  callback?.response?.Details
                );
                setUpatedQrcodeImage(
                  callback?.response?.Details[0]?.BillingFile
                );
                setLoader(false);

                const apiUrl = `https://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=7972709154&text=Thank%20you%20for%20choosing%20Casino%20Pride.%20View%20e-bill%20of%20Rs%20V@1%20at%20-%20V@2%0ALets%20Play%20with%20Pride%20!%0AGood%20luck%20!%0ACPGOAA`;
                fetch(apiUrl)
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json(); // Parse the JSON response
                  })
                  .then((data) => {
                    console.log(data); // Handle the parsed JSON data here
                  })
                  .catch((error) => {
                    console.error("Fetch error:", error);
                  });

                // resolve(callback);
              } else {
                toast.error(callback.error);
                // reject(callback);
              }
            }
          )
        );

        // if (response.ok) {
        //   console.log("Image upload successful.");
        // } else {
        //   console.error("Image upload failed:", response.statusText);
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [elementRef]);

  useEffect(() => {
    onButtonClick();
  }, []);

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
  const generateAndPrintPDF = async () => {
    const elements = document.querySelectorAll(".thermal-bill");
    const container = document.createElement("div");

    elements.forEach((element) => {
      container.appendChild(element.cloneNode(true));
    });

    document.body.appendChild(container);

    const opt = {
      margin: [10, 0, 0, 0],
      filename: "combined_bill.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const pdf = await html2pdf().from(container).set(opt).outputPdf();

    // Create a jsPDF instance and print the PDF
    const jsPDFInstance = new jsPDF();
    jsPDFInstance.output("datauristring", pdf);

    document.body.removeChild(container);
  };

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
        <></>
      )}
      <div className="container-fluid" ref={elementRef}>
        {BookingDetails && BookingDetails.length > 0 ? (
          BookingDetails?.map((item) => (
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
              H.No. 838/1(3), 2nd floor Edificio Da Silva E Menezes Near Holy Family church Porvorim Goa 403521 <br></br>Tel. + 91 9158885000
              </h5>
              <h5 style={{ fontSize: "15px" }}>
                Email : info@casinoprideofficial.com
              </h5>
              <h5 style={{ fontSize: "15px" }}>
                Website : www.casinoprideofficial.com
              </h5>
              <h5 style={{ fontSize: "15px" }}>Instagram : casinoprideofficial</h5>
              <h5 style={{ fontSize: "12px" }}>
                CIN No : U55101GA2005PTC004274{" "}
              </h5>
              <h5 style={{ fontSize: "12px" }}>PAN No : BACCG7450R</h5>

              <h3>TAX INVOICE</h3>
              <div className="row">
                <div className="col-6 bill-details">
                  <p className="BillPrintFont">
                    GUEST NAME :
                    <span className="BillPrintFont">{item.GuestName}</span>{" "}
                  </p>
                  {item.guestGSTIN ? (
                    <p className="BillPrintFont">
                      GUEST GSTIN :{" "}
                      <span className="BillPrintFont">{item.guestGSTIN}</span>
                    </p>
                  ) : (
                    <></>
                  )}
                  <p className="BillPrintFont">
                    GUEST Mobile :
                    <span className="guest-mobile BillPrintFont">
                      {item.Phone}
                    </span>
                  </p>
                  {item.guestState ? (
                    <p className="BillPrintFont">
                      GUEST STATE :
                      <span className="guest-state BillPrintFont">
                        {item.guestState}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}

                  <p className="BillPrintFont">
                    Total Number of Guests :{" "}
                    <span className="BillPrintFont">
                      {item.TotalGuestCount}
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
                    Date & Time:
                    <span
                      style={{ fontWeight: "bold" }}
                      className="BillPrintFont"
                    >
                      {" "}
                      {moment.utc(item?.BillingDate).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </p>

                  <p className="bill-number BillPrintFont">
                    BILL#: {item.BillNumber}
                  </p>
                </div>
                <hr />
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>ITEM NAME</th>
                      <th style={{ textAlign: "center" }}>Guest Count</th>

                      <th style={{ textAlign: "center" }}>RATE</th>
                      <th style={{ textAlign: "center" }}>VALUE</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <p className="BillPrintFont">Teens</p>
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {item?.TotalGuestCount}
                      </td>

                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {item?.TeensRate.toFixed(2)}
                      </td>

                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {item?.TeensRate.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="totals" style={{ textAlign: "right" }}>
                  <h6>Total Amount: {item?.TeensRate.toFixed(2)}</h6>

                  <h6>
                    {" "}
                    CGST: {item?.TeensTax / 2} % :{" "}
                    {(item?.TeensTaxBifurcation / 2).toFixed(2)}
                  </h6>
                  <h6>
                    {" "}
                    SGST: {item?.TeensTax / 2} % :{" "}
                    {(item?.TeensTaxBifurcation / 2).toFixed(2)}
                  </h6>

                  {item?.AmountAfterDiscount == 0 ? (
                    <h4>Bill Amountt: {item?.TeensPrice}</h4>
                  ) : (
                    <h4>
                      Bill Amountt:{" "}
                      {item?.TeensPrice -
                        (item?.ActualAmount - item?.AmountAfterDiscount)}
                    </h4>
                  )}
                </div>

                <div
                  className="terms"
                  style={{ marginTop: "20px", textAlign: "center" }}
                >
                  <h6
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    TERMS AND CONDITIONS
                  </h6>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:00PM TO
                    1:30AM DURING WEEKDAYS.
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (2) BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:00PM TO
                    2:00AM DURING WEEKEND.
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (3) ANY PERSON ABOVE 21 YEARS OLD INTEND TO PLAY MAY ENTER
                    GAMING AREA & PURCHASE CHIPS SEPARATELY.
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (4) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR, GAMING CHIPS
                    OR ANY OTHER SERVICES. HOWEVER, LIMITED COUPONS APPLIED ON
                    SELECTIVE LIQUOR PACKAGES.
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      <div className="row">
        <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
          <button
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
            type="submit"
            className="btn btn_colour mt-5 btn-lg"
            onClick={SendDetailsToUser}
            disabled={loader}
          >
            Send to user
          </button>
        </div>

        <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
          <button
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
            type="submit"
            className="btn btn_colour mt-5 btn-lg"
            onClick={generateAndPrintPDF}
            disabled={loader}
          >
            Generate Pdf
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeensBilling;
