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
import { toPng } from "html-to-image";
import { uploadBillFile } from "../../../Redux/actions/billing";
import { Oval } from "react-loader-spinner";
import QRCode from "qrcode";
import { PDFDocument, rgb } from "pdf-lib";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { shortenUrl } from "../../../Redux/actions/users";

const BillingDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;
  const { BookingDetails } = location.state;
  const [loader, setLoader] = useState(false);

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log(
    "Actual amount---------------------->",
    BookingDetails[0]?.AmountAfterDiscount > 0 ? true : false
  );

  console.log(
    "Data to be passed as sms------------------->",
    BookingDetails[0]
  );

  const [totalDiscount, setTotalDiscount] = useState(0);

  useEffect(() => {
    if (BookingDetails[0]?.AmountAfterDiscount == 0) {
      setTotalDiscount(0);
    } else {
      setTotalDiscount(
        BookingDetails[0]?.ActualAmount - BookingDetails[0]?.AmountAfterDiscount
      );
    }
  }, []);

  console.log(
    "totalDiscount-----------------||||||||||||||||||||||||||||||||||||||||||||||||||>",
    totalDiscount
  );

  const Bookinglink = "https://bit.ly/3trchox";

  const generatePDF = async () => {
    const elements = document.querySelectorAll(".thermal-bill");
    const container = document.createElement("div");

    elements.forEach((element) => {
      container.appendChild(element.cloneNode(true));
    });

    document.body.appendChild(container);

    // let pdfWindow = window.open("PDF Report", "_blank");
    // pdfWindow.document.write(elements);
    // pdfWindow.document.close();
    // pdfWindow.focus();
    // setTimeout(() => {
    //   pdfWindow.print();
    // }, 20);

    const opt = {
      margin: [10, 0, 0, 0],
      filename: `${BookingDetails[0]?.BillingId}bill.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .from(container)
      .set(opt)
      .save()
      .then((res) => {
        console.log("res ==>", res);
      });

    document.body.removeChild(container);
  };

  // const generatePDF = async () => {
  //   const elements = document.querySelectorAll(".thermal-bill");
  //   const container = document.createElement("div");

  //   elements.forEach((element) => {
  //     container.appendChild(element.cloneNode(true));
  //   });

  //   document.body.appendChild(container);

  //   const opt = {
  //     margin: [10, 0, 0, 0],
  //     filename: `${BookingDetails[0]?.BillingId}bill.pdf`,
  //     image: { type: "jpeg", quality: 1 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   };

  //   // Generate the PDF and save it as a data URI
  //   const pdfBlob = await html2pdf().from(container).set(opt).outputPdf();

  //   // Create a hidden iframe
  //   const iframe = document.createElement("iframe");
  //   iframe.style.display = "none";

  //   // Set the source of the iframe to the generated PDF
  //   iframe.src = URL.createObjectURL(
  //     new Blob([pdfBlob], { type: "application/pdf" })
  //   );

  //   // Append the iframe to the document
  //   document.body.appendChild(iframe);

  //   // Print the PDF
  //   iframe.contentWindow.print();

  //   // Remove the iframe after printing
  //   iframe.onload = () => {
  //     document.body.removeChild(iframe);
  //   };

  //   document.body.removeChild(container);
  // };

  const [qrCodeImage, setQRCodeImage] = useState(null);

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
        formData.append(
          "File",
          imageBlob,
          `${BookingDetails[0]?.BillingId}billing.png`
        );
        formData.append("bookingId", BookingDetails[0]?.BookingId);

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
                // setUpatedQrcodeImage(
                //   callback?.response?.Details[0]?.BillingFile
                // );

                const data = {
                  longURL: callback?.response?.Details[0]?.BillingFile,
                };

                dispatch(
                  shortenUrl(
                    data,
                    loginDetails?.logindata?.Token,
                    (callback) => {
                      if (callback.status) {
                        console.log(
                          "post shorten url------------->",
                          callback?.response
                        );
                        setUpatedQrcodeImage(callback?.response?.shortUrl);
                        setLoader(false);
                      } else {
                        toast.error(callback.error);
                      }
                    }
                  )
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

                const data = {
                  longURL: callback?.response?.Details[0]?.BillingFile,
                };

                dispatch(
                  shortenUrl(
                    data,
                    loginDetails?.logindata?.Token,
                    (callback) => {
                      if (callback.status) {
                        console.log(
                          "post shorten url------------->",
                          callback?.response?.shortUrl
                        );
                        setUpatedQrcodeImage(callback?.response?.shortUrl);

                        let shortUrl = callback?.response?.shortUrl;

                        const apiUrl = `https://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${BookingDetails[0]?.Phone}&text=Thank%20you%20for%20choosing%20Casino%20Pride.%20View%20e-bill%20of%20Rs%20${BookingDetails[0]?.ActualAmount}%20at%20-%20${shortUrl}%0ALets%20Play%20with%20Pride%20!%0AGood%20luck%20!%0ACPGOAA`;

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
                    }
                  )
                );

                // const apiUrl = `http://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${BookingDetails[0]?.Phone}&text=Thank%20you%20for%20choosing%20Casino%20Pride.%20View%20e-bill%20of%20Rs%20${BookingDetails[0]?.ActualAmount}%20at%20-%20${Bookinglink}%0ALets%20Play%20with%20Pride%20!%0AGood%20luck%20!%0ACPGOAA`;
                // fetch(apiUrl)
                //   .then((response) => {
                //     if (!response.ok) {
                //       throw new Error(`HTTP error! Status: ${response.status}`);
                //     }
                //     return response.json(); // Parse the JSON response
                //   })
                //   .then((data) => {
                //     console.log(data); // Handle the parsed JSON data here
                //     toast.success("Details sent to customer");
                //   })
                //   .catch((error) => {
                //     console.error("Fetch error:", error);
                //     toast.success("Details sent to customer");
                //   });

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

  return (
    <div>
      <ToastContainer />
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
        {BookingDetails &&
          BookingDetails?.map((item) => (
            <div
              className="thermal-bill"
              style={{
                height: "1120px",
                backgroundColor: "white",
                width: "100%",
                padding: "2%",
              }}
            >
              <div className="row">
                <div className="col-lg-4">
                  <h5 style={{ textAlign: "left", fontSize: "12px" }}>
                    CIN No: U55101GA2005PTC004274{" "}
                  </h5>
                  <h5 style={{ textAlign: "left", fontSize: "12px" }}>
                    PAN No: BACCG7450R
                  </h5>
                </div>
                <div className="col-lg-4">
                  <div className="text-center">
                    <img
                      src={logo}
                      alt="Casino Pride Logo"
                      className="logo-image"
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <h5 style={{ textAlign: "right", fontSize: "12px" }}>
                    TIN No : 30220106332
                  </h5>
                  <h5 style={{ textAlign: "right", fontSize: "12px" }}>
                    GSTIN : 30AACCG7450R1ZO
                  </h5>
                </div>
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
              H.No. 838/1(3), 2nd floor Edificio Da Silva E Menezes Near Holy Family church Porvorim Goa 403521<br></br>Tel. + 91 9158885000
              </h5>
              <h5 style={{ fontSize: "15px" }}>
                Email : casinopride2020@gmail.com
              </h5>
              <h3>TAX INVOICE</h3>
              <div className="row">
                <div className="col-6 bill-details">
                  <p className="BillPrintFont">
                    GUEST NAME :
                    <span style={{ fontWeight: "bold" }}>{item.GuestName}</span>{" "}
                  </p>
                  {item.guestGSTIN ? (
                    <p className="BillPrintFont">
                      GUEST GSTIN :{" "}
                      <span
                        style={{ fontWeight: "bold" }}
                        className="BillPrintFont"
                      >
                        {item.guestGSTIN}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}
                  <p className="BillPrintFont">
                    GUEST Mobile :
                    <span
                      className="guest-mobile"
                      style={{ fontWeight: "bold" }}
                    >
                      {item.Phone}
                    </span>
                  </p>
                  {item.guestState ? (
                    <p className="BillPrintFont">
                      GUEST STATE :
                      <span
                        className="guest-state BillPrintFont"
                        style={{ fontWeight: "bold" }}
                      >
                        {item.guestState}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}

                  <p className="BillPrintFont">
                    Number of Adults :{" "}
                    <span
                      style={{ fontWeight: "bold" }}
                      className="BillPrintFont"
                    >
                      {item.TotalGuestCount - BookingDetails[0].NumOfTeens}
                    </span>
                  </p>

                  {!BookingDetails[0].NumOfTeens == 0 ? (
                    <p className="BillPrintFont">
                      Number of Teens :{" "}
                      <span
                        style={{ fontWeight: "bold" }}
                        className="BillPrintFont"
                      >
                        {BookingDetails[0].NumOfTeens}
                      </span>
                    </p>
                  ) : (
                    <></>
                  )}

                  <p className="BillPrintFont">
                    Total Number of Guests :{" "}
                    <span
                      style={{ fontWeight: "bold" }}
                      className="BillPrintFont"
                    >
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
                      <th
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        ITEM NAME
                      </th>
                      <th
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        GUEST COUNT
                      </th>

                      <th
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        RATE
                      </th>
                      <th
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        VALUE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        {item?.ItemDetails &&
                          item?.ItemDetails?.ItemName.map((item) => (
                            <p>{item}</p>
                          ))}
                      </td>

                      <td
                        style={{ textAlign: "center" }}
                        className="BillPrintFont"
                      >
                        {item?.TotalGuestCount - item?.NumOfTeens}
                      </td>

                      <td
                        style={{ textAlign: "right" }}
                        className="BillPrintFont"
                      >
                        {item?.ItemDetails &&
                          item?.ItemDetails?.Rate.map((item) => (
                            <p>{parseFloat(item).toFixed(2)}</p>
                          ))}
                      </td>

                      {/* <td
                        style={{ textAlign: "right" }}
                        className="BillPrintFont"
                      >
                        {item?.ItemDetails?.Rate.map((itemRate, index) => {
                          const PanelDiscount = item?.PanelDiscount;
                          const discountedRate =
                            (itemRate * (100 - PanelDiscount)) / 100;

                          return <p key={index}>{discountedRate.toFixed(2)}</p>;
                        })}
                      </td> */}

                      <td
                        style={{ textAlign: "right" }}
                        className="BillPrintFont"
                      >
                        {item?.ItemDetails &&
                          item?.ItemDetails?.packageGuestCount.map(
                            (count, index) => (
                              <p key={index}>
                                {parseFloat(
                                  count * item?.ItemDetails?.Rate[index]
                                ).toFixed(2)}
                              </p>
                            )
                          )}
                      </td>
                    </tr>

                    {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                      item?.TeensPrice > 0 && (
                        <tr>
                          <td
                            style={{ textAlign: "center" }}
                            className="BillPrintFont"
                          >
                            <p>Teens</p>
                          </td>

                          <td
                            style={{ textAlign: "center" }}
                            className="BillPrintFont"
                          >
                            {item?.NumOfTeens}
                          </td>

                          <td
                            style={{ textAlign: "right" }}
                            className="BillPrintFont"
                          >
                            {item?.TeensRate.toFixed(2)}
                          </td>

                          <td
                            style={{ textAlign: "right" }}
                            className="BillPrintFont"
                          >
                            {item?.TeensRate.toFixed(2)}
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>

                <div className="totals" style={{ textAlign: "right" }}>
                  {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                  item?.TeensPrice > 0 ? (
                    <h6 className="BillPrintFont ">
                      Total Amount:{" "}
                      {item?.ItemDetails && item?.TeensRate && (
                        <span className="BillPrintFont">
                          {(
                            parseFloat(
                              item?.ItemDetails?.packageGuestCount.reduce(
                                (acc, count, index) => {
                                  return (
                                    acc + count * item?.ItemDetails?.Rate[index]
                                  );
                                },
                                0
                              )
                            ) + item?.TeensRate
                          ).toFixed(2)}
                        </span>
                      )}
                    </h6>
                  ) : (
                    <h6 className="BillPrintFont">
                      Total Amount:
                      {item?.ItemDetails && (
                        <span className="BillPrintFont">
                          {parseFloat(
                            item?.ItemDetails?.packageGuestCount
                              .reduce((acc, count, index) => {
                                return (
                                  acc + count * item?.ItemDetails?.Rate[index]
                                );
                              }, 0)
                              .toFixed(2)
                          )}
                        </span>
                      )}
                    </h6>
                  )}

                  {/* {item?.ItemDetails && item?.TeensPrice > 0 ? (
  // First condition
  <h6 className="BillPrintFont">
    Total Amount:{" "}
    {item?.ItemDetails && item?.TeensRate && (
      <span className="BillPrintFont">
        {(
          parseFloat(
            item?.ItemDetails?.packageGuestCount.reduce(
              (acc, count, index) => {
                return acc + count * item?.ItemDetails?.Rate[index];
              },
              0
            )
          ) + item?.TeensRate
        ).toFixed(2)}
      </span>
    )}
  </h6>
) : item?.NewItemCondition ? (
  
  <h6 className="BillPrintFont">
  
  </h6>
) : (
  // Default condition
  <h6 className="BillPrintFont">
    Total Amount:
    {item?.ItemDetails && (
      <span className="BillPrintFont">
        {parseFloat(
          item?.ItemDetails?.packageGuestCount
            .reduce((acc, count, index) => {
              return acc + count * item?.ItemDetails?.Rate[index];
            }, 0)
            .toFixed(2)
        )}
      </span>
    )}
  </h6>
)} */}

                  {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                  item?.TeensPrice > 0 ? (
                    <>
                      {console.log(
                        "item?.ItemDetails?.TaxDiffWeekend-------+++++++++++++++++++++++**************88",
                        item?.ItemDetails?.packageGuestCount[0]
                      )}
                      <>
                        <h6 className="BillPrintFont">
                          CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                          {(
                            (item?.ItemDetails?.TaxDiffWeekend *
                              item?.ItemDetails?.packageGuestCount[0]) /
                            2
                          ).toFixed(2)}
                        </h6>
                        <h6 className="BillPrintFont">
                          SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                          {(
                            (item?.ItemDetails?.TaxDiffWeekend *
                              item?.ItemDetails?.packageGuestCount[0]) /
                            2
                          ).toFixed(2)}
                        </h6>{" "}
                      </>

                      <h6 className="BillPrintFont">
                        CGST {item?.TeensTax / 2} %:{" "}
                        {((item?.TeensPrice - item?.TeensRate) / 2).toFixed(2)}
                      </h6>
                      <h6 className="BillPrintFont">
                        SGST {item?.TeensTax / 2} %:
                        {((item?.TeensPrice - item?.TeensRate) / 2).toFixed(2)}
                      </h6>

                      <h6 className="BillPrintFont">
                        Bill Amount :{" "}
                        {item?.ItemDetails && (
                          <span>
                            {parseFloat(
                              item?.ItemDetails?.packageGuestCount.reduce(
                                (acc, count, index) => {
                                  return (
                                    acc +
                                    count * item?.ItemDetails?.Price[index]
                                  );
                                },
                                0
                              ) +
                                (item?.TeensPrice || 0) -
                                totalDiscount
                            ).toFixed(2)}
                          </span>
                        )}
                      </h6>
                    </>
                  ) : (
                    <>
                      {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
                        <>
                          <h6 className="BillPrintFont">
                            CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                            {(item?.ItemDetails?.TaxDiffWeekend[0] *
                              item?.ItemDetails?.packageGuestCount) /
                              2}
                          </h6>
                          <h6 className="BillPrintFont">
                            SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                            {(item?.ItemDetails?.TaxDiffWeekend[0] *
                              item?.ItemDetails?.packageGuestCount) /
                              2}
                          </h6>
                        </>
                      ) : item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
                        <h6 className="BillPrintFont">
                          {item?.ItemDetails?.ItemTaxName[0]}{" "}
                          {item?.ItemDetails.ItemTax} %:{" "}
                          {(
                            item?.ItemDetails?.TaxDiffWeekend[0] *
                            item?.ItemDetails?.packageGuestCount
                          ).toFixed(2)}
                        </h6>
                      ) : (
                        <h6 className="BillPrintFont">
                          {item?.ItemDetails?.ItemTaxName[0]}{" "}
                          {item?.ItemDetails.ItemTax} %:{" "}
                          {(
                            item?.ItemDetails?.TaxDiffWeekend[0] *
                            item?.ItemDetails?.packageGuestCount
                          ).toFixed(2)}
                        </h6>
                      )}

                      {item?.ItemDetails?.IsDeductable[0] === 1 &&
                      BookingDetails[0]?.AmountAfterDiscount > 0 ? (
                        <>
                          <h6 className="BillPrintFont">
                            Bill Amount :{" "}
                            {item?.ItemDetails && (
                              <span>
                                {parseFloat(
                                  item?.ItemDetails?.packageGuestCount.reduce(
                                    (acc, count, index) => {
                                      return (
                                        acc +
                                        count * item?.ItemDetails?.Price[index]
                                      );
                                    },
                                    0
                                  ) -
                                    (item?.ActualAmount -
                                      item?.AmountAfterDiscount)
                                ).toFixed(2)}
                              </span>
                            )}
                          </h6>
                        </>
                      ) : totalDiscount == 0 ? (
                        <h6 className="BillPrintFont">
                          Bill Amount :{" "}
                          {item?.ItemDetails && (
                            <span>
                              {parseFloat(
                                item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Price[index]
                                    );
                                  },
                                  0
                                )
                              ).toFixed(2)}
                            </span>
                          )}
                        </h6>
                      ) : (
                        <h6 className="BillPrintFont">
                          Bill Amount :{" "}
                          {item?.ItemDetails && (
                            <span>
                              {parseFloat(
                                item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Price[index]
                                    );
                                  },
                                  0
                                ) + (item?.TeensPrice || 0)
                              ).toFixed(2)}
                            </span>
                          )}
                        </h6>
                      )}

                      {/* {item?.ItemDetails?.IsDeductable[0] === 1 &&
                      BookingDetails[0]?.AmountAfterDiscount > 0 ? (
                        <h6 className="BillPrintFont">
                          Bill Amount 2:{" "}
                          {item?.ItemDetails && (
                            <span>
                              {parseFloat(
                                item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Price[index]
                                    );
                                  },
                                  0
                                ) +
                                  (item?.TeensPrice || 0) -
                                  (item?.ActualAmount -
                                    item?.AmountAfterDiscount)
                              ).toFixed(2)}
                            </span>
                          )}
                        </h6>
                      ) : (
                        <></>
                      )} */}
                      {/* 
                      {item?.ItemDetails?.IsDeductable[0] === 1 &&
                      !BookingDetails[0]?.AmountAfterDiscount > 0 ? (
                        <>
                          <h6 className="BillPrintFont">
                            Bill Amount 3:{" "}
                            {item?.ItemDetails && (
                              <span>
                                {parseFloat(
                                  item?.ItemDetails?.packageGuestCount.reduce(
                                    (acc, count, index) => {
                                      return (
                                        acc +
                                        count * item?.ItemDetails?.Price[index]
                                      );
                                    },
                                    0
                                  ) + (item?.TeensPrice || 0)
                                ).toFixed(2)}
                              </span>
                            )}
                          </h6>
                        </>
                      ) : (
                        <></>
                      )} */}
                    </>
                  )}

                  {/* {item?.ItemDetails?.IsDeductable[0] === 1 &&
                  totalDiscount == 0 &&
                  !item?.TeensPrice > 0 ? (
                    <h6 className="BillPrintFont">
                      Bill Amount 4:{" "}
                      {item?.ItemDetails && (
                        <span>
                          {parseFloat(
                            item?.ItemDetails?.packageGuestCount.reduce(
                              (acc, count, index) => {
                                return (
                                  acc + count * item?.ItemDetails?.Price[index]
                                );
                              },
                              0
                            ) + (item?.TeensPrice || 0)
                          ).toFixed(2)}
                        </span>
                      )}
                    </h6>
                  ) : (
                    <></>
                  )} */}

                  {/* {item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
                    <>
                      <h6 className="BillPrintFont">
                        Bill Amount 5:{" "}
                        {item?.ItemDetails && (
                          <span>
                            {parseFloat(
                              (
                                item?.ItemDetails?.packageGuestCount.reduce(
                                  (acc, count, index) => {
                                    return (
                                      acc +
                                      count * item?.ItemDetails?.Rate[index]
                                    );
                                  },
                                  0
                                ) *
                                (1 + item?.ItemDetails.ItemTax / 100)
                              ).toFixed(0)
                            )}
                          </span>
                        )}
                      </h6>
                    </>
                  ) : (
                    <></>
                  )} */}
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
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                    (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:00PM TO
                    1:30AM DURING WEEKDAYS.
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                    (2) BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:00PM TO
                    2:00AM DURING WEEKEND.
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                    (3) ANY PERSON ABOVE 21 YEARS OLD INTEND TO PLAY MAY ENTER
                    GAMING AREA & PURCHASE CHIPS SEPARATELY.
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                    (4) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR, GAMING CHIPS
                    OR ANY OTHER SERVICES. HOWEVER, LIMITED COUPONS APPLIED ON
                    SELECTIVE LIQUOR PACKAGES.
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
        <button
          style={{ paddingLeft: "100px", paddingRight: "100px" }}
          type="submit"
          className="btn btn_colour mt-5 btn-lg"
          onClick={SendDetailsToUser}
          disabled={loader}
        >
          Generate Bill
        </button>
      </div>

      {/* <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
        <button
          style={{ paddingLeft: "100px", paddingRight: "100px" }}
          type="submit"
          className="btn btn_colour mt-5 btn-lg"
          onClick={generatePDF}
          disabled={loader}
        >
          Generate Pdf
        </button>
      </div> */}
    </div>
  );
};

export default BillingDetails;
