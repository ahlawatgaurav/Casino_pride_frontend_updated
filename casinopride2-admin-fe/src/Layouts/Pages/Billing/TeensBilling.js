// import React, { useEffect, useState, useRef, useCallback } from "react";
// import html2pdf from "html2pdf.js";
// // import QRCode from "qrcode.react";
// import "../../../assets/Billing.css";
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import logo from "../../../assets/Images/logo.png";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { usePDF } from "react-to-pdf";
// import moment from "moment";
// import "../../../assets/global.css";
// import { uploadBillFile } from "../../../Redux/actions/billing";
// import { toPng } from "html-to-image";
// import htmlToImage from "html-to-image";
// import { Oval } from "react-loader-spinner";
// import QRCode from "qrcode";
// import { PDFDocument, rgb } from "pdf-lib";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { shortenUrl } from "../../../Redux/actions/users";

// const TeensBilling = () => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userType } = location.state;
//   const { userData } = location.state;
//   const { BookingDetails } = location.state;

//   const loginDetails = useSelector(
//     (state) => state.auth?.userDetailsAfterLogin.Details
//   );

//   console.log(
//     "BookingDetails[0]?.BookingId--------------------->",
//     BookingDetails[0]?.BookingId
//   );

//   const [qrCodeImage, setQRCodeImage] = useState(null);

//   const [loader, setLoader] = useState(true);

//   // const generatePDFAndSend = async () => {
//   //   const elements = document.querySelectorAll(".thermal-bill");

//   //   if (elements.length === 0) {
//   //     console.log("No elements found with the class 'thermal-bill'");
//   //     return;
//   //   }

//   //   // Create a container div and clone the elements into it
//   //   const container = document.createElement("div");
//   //   elements.forEach((element) => {
//   //     container.appendChild(element.cloneNode(true));
//   //   });

//   //   const opt = {
//   //     margin: [10, 0, 0, 0],
//   //     filename: "bill.pdf", // Change the filename as needed
//   //     image: { type: "jpeg", quality: 0.98 },
//   //     html2canvas: { scale: 2 },
//   //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//   //   };

//   //   try {
//   //     const pdfBlob = await html2pdf().from(container).set(opt).outputPdf();

//   //     console.log("PDF Blob:::::::::::::::::::", pdfBlob);

//   //     const formData = new FormData();
//   //     formData.append(
//   //       "File",
//   //       new Blob([pdfBlob], { type: "application/pdf" }),
//   //       "bill.pdf"
//   //     );
//   //     formData.append("bookingId", BookingDetails[0]?.BookingId);

//   //     const callback = await new Promise((resolve, reject) => {
//   //       dispatch(
//   //         uploadBillFile(
//   //           loginDetails?.logindata?.Token,
//   //           formData,
//   //           (callback) => {
//   //             if (callback.status) {
//   //               console.log(
//   //                 "Callback pdf details---->",
//   //                 callback?.response?.Details
//   //               );
//   //               resolve(callback);
//   //             } else {
//   //               toast.error(callback.error);
//   //               reject(callback);
//   //             }
//   //           }
//   //         )
//   //       );
//   //     });

//   //     if (callback.status) {
//   //       console.log("Upload successful.");
//   //     } else {
//   //       console.error("Upload failed:", callback.error);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error generating or uploading PDF:", error);
//   //   }
//   // };

//   const elementRef = useRef(null);

//   const [updatedQrcodeImage, setUpatedQrcodeImage] = useState("");

//   const onButtonClick = useCallback(() => {
//     setLoader(true);
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
//         formData.append("bookingId", BookingDetails[0]?.BookingId);

//         // Make a POST request to your server to upload the image
//         dispatch(
//           uploadBillFile(
//             loginDetails?.logindata?.Token,
//             formData,
//             (callback) => {
//               if (callback.status) {
//                 console.log(
//                   "Callback pdf details---->",
//                   callback?.response?.Details
//                 );
//                 setUpatedQrcodeImage(
//                   callback?.response?.Details[0]?.BillingFile
//                 );
//                 setLoader(false);

//                 // resolve(callback);
//               } else {
//                 toast.error(callback.error);
//                 // reject(callback);
//               }
//             }
//           )
//         );

//         // if (response.ok) {
//         //   console.log("Image upload successful.");
//         // } else {
//         //   console.error("Image upload failed:", response.statusText);
//         // }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [elementRef]);

//   const SendDetailsToUser = useCallback(() => {
//     setLoader(true);
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
//         formData.append("bookingId", BookingDetails[0]?.BookingId);

//         // Make a POST request to your server to upload the image
//         dispatch(
//           uploadBillFile(
//             loginDetails?.logindata?.Token,
//             formData,
//             (callback) => {
//               if (callback.status) {
//                 console.log(
//                   "Callback pdf details---->",
//                   callback?.response?.Details
//                 );
//                 setUpatedQrcodeImage(
//                   callback?.response?.Details[0]?.BillingFile
//                 );
//                 setLoader(false);

//                 const apiUrl = `http://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=7972709154&text=Thank%20you%20for%20choosing%20Casino%20Pride.%20View%20e-bill%20of%20Rs%20V@1%20at%20-%20V@2%0ALets%20Play%20with%20Pride%20!%0AGood%20luck%20!%0ACPGOAA`;
//                 fetch(apiUrl)
//                   .then((response) => {
//                     if (!response.ok) {
//                       throw new Error(`HTTP error! Status: ${response.status}`);
//                     }
//                     return response.json(); // Parse the JSON response
//                   })
//                   .then((data) => {
//                     console.log(data); // Handle the parsed JSON data here
//                   })
//                   .catch((error) => {
//                     console.error("Fetch error:", error);
//                   });

//                 // resolve(callback);
//               } else {
//                 toast.error(callback.error);
//                 // reject(callback);
//               }
//             }
//           )
//         );

//         // if (response.ok) {
//         //   console.log("Image upload successful.");
//         // } else {
//         //   console.error("Image upload failed:", response.statusText);
//         // }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [elementRef]);

//   useEffect(() => {
//     onButtonClick();
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
//   const generateAndPrintPDF = async () => {
//     const elements = document.querySelectorAll(".thermal-bill");
//     const container = document.createElement("div");

//     elements.forEach((element) => {
//       container.appendChild(element.cloneNode(true));
//     });

//     document.body.appendChild(container);

//     const opt = {
//       margin: [10, 0, 0, 0],
//       filename: "combined_bill.pdf",
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };

//     const pdf = await html2pdf().from(container).set(opt).outputPdf();

//     // Create a jsPDF instance and print the PDF
//     const jsPDFInstance = new jsPDF();
//     jsPDFInstance.output("datauristring", pdf);

//     document.body.removeChild(container);
//   };

//   return (
//     <div>
//       {loader ? (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100%",
//           }}
//         >
//           <Oval
//             height={80}
//             width={50}
//             color="#4fa94d"
//             visible={true}
//             ariaLabel="oval-loading"
//             secondaryColor="#4fa94d"
//             strokeWidth={2}
//             strokeWidthSecondary={2}
//           />
//         </div>
//       ) : (
//         <></>
//       )}
//       <div className="container-fluid" ref={elementRef}>
//         {BookingDetails && BookingDetails.length > 0 ? (
//           BookingDetails?.map((item) => (
//             <div
//               className="thermal-bill"
//               style={{
//                 backgroundColor: "white",
//                 width: "100%",
//                 padding: "2%",
//               }}
//             >
//               <div className="row">
//                 <div className="col-lg-4"></div>
//                 <div className="col-lg-4">
//                   <div className="text-center">
//                     <img
//                       src={logo}
//                       alt="Casino Pride Logo"
//                       className="logo-image"
//                     />
//                   </div>
//                 </div>
//                 <div className="col-lg-4"></div>
//               </div>
//               <p
//                 style={{
//                   marginBottom: "5px",
//                 }}
//                 className="BillPrintFontPrint"
//               >
//                 A unit of Goa Coastal Resorts & Recreation Pvt.Ltd
//               </p>
//               <h5 style={{ fontSize: "15px" }}>
//                 Hotel Neo Majestic, Plot No. 104/14, Porvorim, Barder, Goa - 403
//                 521 <br></br>Tel. + 91 9158885000
//               </h5>
//               <h5 style={{ fontSize: "15px" }}>
//                 Email : info@casinoprideofficial.com
//               </h5>
//               <h5 style={{ fontSize: "15px" }}>
//                 Website : www.casinoprideofficial.com
//               </h5>
//               <h5 style={{ fontSize: "15px" }}>Instagram :</h5>
//               <h5 style={{ fontSize: "12px" }}>
//                 CIN No: U55101GA2005PTC004274{" "}
//               </h5>
//               <h5 style={{ fontSize: "12px" }}>PAN No: AACCG7450R</h5>

//               <h3>TAX INVOICE</h3>
//               <div className="row">
//                 <div className="col-6 bill-details">
//                   <p className="BillPrintFont">
//                     GUEST NAME :
//                     <span className="BillPrintFont">{item.GuestName}</span>{" "}
//                   </p>
//                   {item.guestGSTIN ? (
//                     <p className="BillPrintFont">
//                       GUEST GSTIN :{" "}
//                       <span className="BillPrintFont">{item.guestGSTIN}</span>
//                     </p>
//                   ) : (
//                     <></>
//                   )}
//                   <p className="BillPrintFont">
//                     GUEST Mobile :
//                     <span className="guest-mobile BillPrintFont">
//                       {item.Phone}
//                     </span>
//                   </p>
//                   {item.guestState ? (
//                     <p className="BillPrintFont">
//                       GUEST STATE :
//                       <span className="guest-state BillPrintFont">
//                         {item.guestState}
//                       </span>
//                     </p>
//                   ) : (
//                     <></>
//                   )}

//                   <p className="BillPrintFont">
//                     Total Number of Guests :{" "}
//                     <span className="BillPrintFont">
//                       {item.TotalGuestCount}
//                     </span>
//                   </p>
//                 </div>
//                 <div className="col-6">
//                   <div className="d-flex justify-content-end qr-code">
//                     {qrCodeImage && (
//                       <div className="qr-code-image">
//                         <img src={qrCodeImage} alt="QR Code" />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="bill-details">
//                 <div className="date-time-bill-row">
//                   <p className="BillPrintFont">
//                     Date & Time:
//                     <span
//                       style={{ fontWeight: "bold" }}
//                       className="BillPrintFont"
//                     >
//                       {" "}
//                       {moment.utc(item?.BillingDate).format("DD/MM/YYYY HH:mm")}
//                     </span>
//                   </p>

//                   <p className="bill-number BillPrintFont">
//                     BILL#: {item.BillNumber}
//                   </p>
//                 </div>
//                 <hr />
//                 <table className="table table-bordered">
//                   <thead>
//                     <tr>
//                       <th style={{ textAlign: "center" }}>ITEM NAME</th>
//                       <th style={{ textAlign: "center" }}>Guest Count</th>

//                       <th style={{ textAlign: "center" }}>RATE</th>
//                       <th style={{ textAlign: "center" }}>VALUE</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     <tr>
//                       <td style={{ textAlign: "center" }}>
//                         <p className="BillPrintFont">Teens</p>
//                       </td>

//                       <td
//                         style={{
//                           textAlign: "center",
//                           fontWeight: "bold",
//                           fontSize: "18px",
//                         }}
//                       >
//                         {item?.TotalGuestCount}
//                       </td>

//                       <td
//                         style={{
//                           textAlign: "right",
//                           fontWeight: "bold",
//                           fontSize: "18px",
//                         }}
//                       >
//                         {item?.TeensRate.toFixed(2)}
//                       </td>

//                       <td
//                         style={{
//                           textAlign: "right",
//                           fontWeight: "bold",
//                           fontSize: "18px",
//                         }}
//                       >
//                         {item?.TeensRate.toFixed(2)}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>

//                 <div className="totals" style={{ textAlign: "right" }}>
//                   <h6>Total Amount: {item?.TeensRate.toFixed(2)}</h6>

//                   <h6>
//                     {" "}
//                     CGST: {item?.TeensTax / 2} % :{" "}
//                     {(item?.TeensTaxBifurcation / 2).toFixed(2)}
//                   </h6>
//                   <h6>
//                     {" "}
//                     SGST: {item?.TeensTax / 2} % :{" "}
//                     {(item?.TeensTaxBifurcation / 2).toFixed(2)}
//                   </h6>

//                   {item?.AmountAfterDiscount == 0 ? (
//                     <h4>Bill Amountt: {item?.TeensPrice}</h4>
//                   ) : (
//                     <h4>
//                       Bill Amountt:{" "}
//                       {item?.TeensPrice -
//                         (item?.ActualAmount - item?.AmountAfterDiscount)}
//                     </h4>
//                   )}
//                 </div>

//                 <div
//                   className="terms"
//                   style={{ marginTop: "20px", textAlign: "center" }}
//                 >
//                   <h6
//                     style={{
//                       textAlign: "center",
//                       fontSize: "16px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     TERMS AND CONDITIONS
//                   </h6>
//                   <p style={{ fontSize: "12px", fontWeight: "bold" }}>
//                     (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:00PM TO
//                     1:30AM DURING WEEKDAYS.
//                   </p>
//                   <p style={{ fontSize: "12px", fontWeight: "bold" }}>
//                     (2) BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:00PM TO
//                     2:00AM DURING WEEKEND.
//                   </p>
//                   <p style={{ fontSize: "12px", fontWeight: "bold" }}>
//                     (3) ANY PERSON ABOVE 21 YEARS OLD INTEND TO PLAY MAY ENTER
//                     GAMING AREA & PURCHASE CHIPS SEPARATELY.
//                   </p>
//                   <p style={{ fontSize: "12px", fontWeight: "bold" }}>
//                     (4) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR, GAMING CHIPS
//                     OR ANY OTHER SERVICES. HOWEVER, LIMITED COUPONS APPLIED ON
//                     SELECTIVE LIQUOR PACKAGES.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <></>
//         )}
//       </div>
//       <div className="row">
//         <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
//           <button
//             style={{ paddingLeft: "100px", paddingRight: "100px" }}
//             type="submit"
//             className="btn btn_colour mt-5 btn-lg"
//             onClick={SendDetailsToUser}
//             disabled={loader}
//           >
//             Send to user
//           </button>
//         </div>

//         <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
//           <button
//             style={{ paddingLeft: "100px", paddingRight: "100px" }}
//             type="submit"
//             className="btn btn_colour mt-5 btn-lg"
//             onClick={generateAndPrintPDF}
//             disabled={loader}
//           >
//             Generate Pdf
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeensBilling;

import React, { useEffect, useState, useRef, useCallback } from "react";
import html2pdf from "html2pdf.js";
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
import { uploadBillFile, sendEmail } from "../../../Redux/actions/billing";
import { Oval } from "react-loader-spinner";
import QRCode from "qrcode";
import { PDFDocument, rgb } from "pdf-lib";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { shortenUrl } from "../../../Redux/actions/users";
import "../../../assets/print.css";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import { updateItemDetailsBillFn } from "../../../Redux/actions/billing";

const TeensBilling = () => {
  const printableContentRef = useRef();
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

  console.log("Data to be passed as sms------------------->", BookingDetails);

  const DiscountedAmount =
    BookingDetails[0]?.ActualAmount - BookingDetails[0]?.AmountAfterDiscount;

  const FinalAmount = BookingDetails[0]?.ActualAmount - DiscountedAmount;

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

  const dummyLink = "http://13.235.27.91:5858/p/4r4";
  const Bookinglink = "https://bit.ly/3trchox";

  const generatePDF = async () => {
    const elements = document.querySelectorAll(".thermal-bill");
    const container = document.createElement("div");

    elements.forEach((element) => {
      container.appendChild(element.cloneNode(true));
    });

    document.body.appendChild(container);

    let pdfWindow = window.open("PDF Report", "_blank");
    pdfWindow.document.write(elements);
    pdfWindow.document.close();
    pdfWindow.focus();
    setTimeout(() => {
      pdfWindow.print();
    }, 20);

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
      .outputPdf()
      .then((res) => {
        console.log("res ==>", res);
      });

    document.body.removeChild(container);
  };

  const generateAndPrintPDF = async () => {
    const elements = document.querySelectorAll(".thermal-bill");
    const container = document.createElement("div");

    elements.forEach((element) => {
      container.appendChild(element.cloneNode(true));
    });

    document.body.appendChild(container);

    const opt = {
      margin: [10, 0, 0, 0],
      filename: `${BookingDetails[0]?.BillingId}bill.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const pdf = await html2pdf().from(container).set(opt).save();

    const jsPDFInstance = new jsPDF();
    jsPDFInstance.output("datauristring", pdf);

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

  console.log(
    "updatedQrcodeImage----------------------------------------------->",
    updatedQrcodeImage
  );

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

        console.log(
          "BookingDetails[0]?.BillingId-------->",
          BookingDetails[0]?.BookingId
        );

        const formData = new FormData();
        formData.append(
          "File",
          imageBlob,
          `${BookingDetails[0]?.BillingId}bill.png`
        );
        formData.append("bookingId", BookingDetails[0]?.BookingId);

        dispatch(
          uploadBillFile(
            loginDetails?.logindata?.Token,
            formData,
            (callback) => {
              if (callback.status) {
                const data = {
                  longURL: callback?.response?.Details[0]?.Bill,
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
              } else {
                toast.error(callback.error);
              }
            }
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [elementRef]);

  const sendPrintFn = () => {
    console.log("Hiiiiiiiii");
  };

  const SendDetailsToUser = useCallback(() => {
    // updateReportsItemDetails();
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

        const formData = new FormData();
        formData.append(
          "File",
          imageBlob,
          `${BookingDetails[0]?.BillingId}bill.png`
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
                  longURL: callback?.response?.Details[0]?.Bill,
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

                        const data = {
                          receiverMail: JSON.stringify(
                            BookingDetails[0]?.Email
                          ),
                          amount: FinalAmount,
                          billFile: JSON.stringify(
                            callback?.response?.shortUrl
                          ),
                        };

                        dispatch(
                          sendEmail(data, (callback) => {
                            if (callback.status) {
                              toast.success("Email sent");
                              navigate("/NewBooking");

                              toast.error(callback.error);
                            } else {
                              toast.error(callback.error);
                            }
                          })
                        );

                        const apiUrl = `https://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${BookingDetails[0]?.Phone}&text=Thank%20you%20for%20choosing%20Casino%20Pride.%20View%20e-bill%20of%20Rs%20${FinalAmount}%20at%20-%20${callback?.response?.shortUrl}%0ALets%20Play%20with%20Pride%20!%0AGood%20luck%20!%0ACPGOAA`;
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

                setLoader(false);

                // resolve(callback);
              } else {
                toast.error(callback.error);
                // reject(callback);
              }
            }
          )
        );

        console.log(
          "bllling file------------------------{{{{{{{{}}}}}}}}}}}}}}}}}----->",
          updatedQrcodeImage
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
    updateReportsItemDetails();
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

  // useEffect(() => {
  //   QRCode.toCanvas(
  //     document.createElement("canvas"),
  //     dummyLink,
  //     (error, canvas) => {
  //       if (error) {
  //         console.error("QR code generation error:", error);
  //       } else {
  //         const qrCodeDataURL = canvas.toDataURL("image/png");
  //         setQRCodeImage(qrCodeDataURL);
  //       }
  //     }
  //   );
  // }, [dummyLink]);

  const [printLoader, setPrintLoader] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => printableContentRef.current,

    onBeforeGetContent: () => {
      SendDetailsToUser();
    },
  });

  const [finalUseState, setFinalUseState] = useState("");

  useEffect(() => {
    console.log("Calculations for package guest count-->", BookingDetails);
    const finalDetails = BookingDetails.reduce((total, item) => {
      const guestCountData = item?.ItemDetails.packageGuestCount || [];
      const calculatedTotal = guestCountData.reduce(
        (count, num) => count + num,
        0
      );
      return calculatedTotal;
    }, 0);

    console.log("finalDetails--------->", finalDetails);
    setFinalUseState(finalDetails);
  }, []);

  console.log("Booking Details-------------------->", BookingDetails);

  // const updatededBillDetails = {
  //   updatedItemDetails: BookingDetails.map((item) => {
  //     const Rate = item?.ItemDetails?.Rate;
  //     const packageGuestCount = item?.ItemDetails?.packageGuestCount;
  //     const resultRate = Rate.map(
  //       (value, index) => value * packageGuestCount[index]
  //     );
  //     const Price = item?.ItemDetails?.Price;
  //     const resultPrice = Price.map(
  //       (value, index) => value * packageGuestCount[index]
  //     );

  //     const taxDiffSum = item?.ItemDetails?.TaxDiff.reduce(
  //       (acc, value) => acc + value,
  //       0
  //     );
  //     console.log("taxDiffSum", taxDiffSum);

  //     const itemTaxName = item?.ItemDetails?.ItemTaxName;
  //     const adjustedTaxDiffSum =
  //       itemTaxName[0] === "GST" ? taxDiffSum / 2 : taxDiffSum;

  //     console.log("adjusted Tax Diff Sum----->", adjustedTaxDiffSum);

  //     const cgstProperty = `CGST ${item?.ItemDetails?.ItemTax / 2} %`;
  //     const sgstProperty = `SGST ${item?.ItemDetails?.ItemTax / 2} %`;
  //     const vatProperty = `VAT ${item?.ItemDetails?.ItemTax} %`;

  //     return {
  //       ItemTax: item?.ItemDetails?.ItemTax,
  //       ItemId: [item?.ItemDetails?.ItemId],
  //       ItemName: [item?.ItemDetails?.ItemName],
  //       Price: [resultPrice],
  //       Rate: [resultRate],
  //       ItemTaxName: [item?.ItemDetails?.ItemTaxName[0]],
  //       TaxDiff: [item?.ItemDetails?.TaxDiff],
  //       IsDeductable: [item?.ItemDetails?.IsDeductable],
  //       PackageId: [item?.PackageId],
  //       packageGuestCount: [packageGuestCount],
  //       [cgstProperty]: adjustedTaxDiffSum / 2,
  //       [sgstProperty]: adjustedTaxDiffSum / 2,
  //       [vatProperty]:adjustedTaxDiffSum

  //     };
  //   }),
  // };

  // const updatededBillDetails = {
  //   updatedItemDetails: BookingDetails.map((item) => {
  //     const Rate = item?.ItemDetails?.Rate;
  //     const packageGuestCount = item?.ItemDetails?.packageGuestCount;
  //     const resultRate = Rate.map(
  //       (value, index) => value * packageGuestCount[index]
  //     );

  //     const Price = item?.ItemDetails?.Price;
  //     const resultPrice = Price.map(
  //       (value, index) => value * packageGuestCount[index]
  //     );

  //     const taxDiffSum = item?.ItemDetails?.TaxDiff.reduce(
  //       (acc, value) => acc + value,
  //       0
  //     );
  //     console.log("taxDiffSum", taxDiffSum);

  //     const itemTaxName = item?.ItemDetails?.ItemTaxName;
  //     const adjustedTaxDiffSum =
  //       itemTaxName[0] === "GST" ? taxDiffSum / 2 : taxDiffSum;

  //     console.log("adjusted Tax Diff Sum----->", adjustedTaxDiffSum);
  //     const itemTeensTaxName = item?.TeensTaxName;
  //     console.log("Teens Tax name", itemTeensTaxName);

  //     const KidsItemName = "Kids";

  //     const KidsCount = item?.NumOfTeens;
  //     console.log("Kids count==>", KidsCount);
  //     const KidsRate = item?.TeensRate * item?.NumOfTeens;
  //     console.log("Kids rate", KidsRate);

  //     const KidsPrice = item?.TeensPrice * item?.NumOfTeens;
  //     console.log("Kids Price", KidsPrice);

  //     const KidsCgstProperty = `CGST ${item?.TeensTax / 2} %`;
  //     console.log("Kids cgst", KidsCgstProperty);

  //     const KidsSgstProperty = `CGST ${item?.TeensTax / 2} %`;
  //     console.log("Kids sgst", KidsSgstProperty);

  //     const KidsTax = item?.TeensTaxBifurcation;

  //     // Define dynamic property names
  //     const cgstProperty = `CGST ${item?.ItemDetails?.ItemTax / 2} %`;
  //     const sgstProperty = `SGST ${item?.ItemDetails?.ItemTax / 2} %`;
  //     const vatProperty = `VAT ${item?.ItemDetails?.ItemTax} %`;

  //     // Create an object to store the properties
  //     const properties = {
  //       ItemTax: item?.ItemDetails?.ItemTax,
  //       ItemId: item?.ItemDetails?.ItemId,
  //       ItemName: item?.ItemDetails?.ItemName,
  //       Price: resultPrice,
  //       Rate: resultRate,
  //       ItemTaxName: itemTaxName[0],
  //       TaxDiff: item?.ItemDetails?.TaxDiff,
  //       IsDeductable: item?.ItemDetails?.IsDeductable,
  //       PackageId: item?.PackageId,
  //       packageGuestCount: packageGuestCount,
  //     };

  //     if (itemTaxName[0] === "GST") {
  //       if (KidsCount > 0) {
  //         properties["KidsItemName"] = KidsItemName;
  //         properties["KidsCount"] = KidsCount;
  //         properties["KidsRate"] = KidsRate;
  //         properties["KidsPrice"] = KidsPrice;
  //         properties[KidsCgstProperty] = KidsTax;
  //         properties[KidsSgstProperty] = KidsTax;
  //         properties[cgstProperty] = adjustedTaxDiffSum / 2;
  //         properties[sgstProperty] = adjustedTaxDiffSum / 2;
  //       } else {
  //         properties[cgstProperty] = adjustedTaxDiffSum / 2;
  //         properties[sgstProperty] = adjustedTaxDiffSum / 2;
  //       }
  //     } else if (itemTaxName[0] === "VAT") {
  //       properties[vatProperty] = adjustedTaxDiffSum;
  //     }

  //     return properties;
  //   }),
  // };

  console.log("BookingDetails------------>", BookingDetails[0]);

  const KidsCgstProperty = `Kids CGST ${BookingDetails[0]?.TeensTax / 2} %`;

  const KidsSgstProperty = `Kids SGST ${BookingDetails[0]?.TeensTax / 2} %`;
  const KidsItemName = "Entry,Food";

  const updatededBillDetails = {
    ItemTax: BookingDetails[0]?.TeensTax,
    KidsItemName: KidsItemName,
    KidsPrice: BookingDetails[0]?.TeensPrice,
    // KidsRate: BookingDetails[0]?.TeensRate * BookingDetails[0]?.NumOfTeens,
    KidsRate: BookingDetails[0]?.TeensRate,
    ItemTaxName: BookingDetails[0]?.TeensTaxName,
    KidsTax: BookingDetails[0]?.TeensTax,
    PackageId: BookingDetails[0]?.PackageId,
    packageGuestCount: BookingDetails[0]?.NumOfTeens,
    [KidsCgstProperty]: BookingDetails[0]?.TeensTaxBifurcation / 2,
    [KidsSgstProperty]: BookingDetails[0]?.TeensTaxBifurcation / 2,
    TotalBillAmount:
      BookingDetails[0]?.TeensPrice -
      (BookingDetails[0]?.ActualAmount -
        BookingDetails[0]?.AmountAfterDiscount),
    //adding cash, card, UPI details
    cashAmount:
      BookingDetails[0]?.SettledByCompany == 0 &&
      ((BookingDetails[0]?.PayAtCounter == 1 &&
        BookingDetails[0]?.UserTypeId == 5) ||
        (BookingDetails[0]?.PayAtCounter != 1 &&
          BookingDetails[0]?.UserTypeId != 0 &&
          BookingDetails[0]?.UserTypeId != 5 &&
          BookingDetails[0]?.UserTypeId != 6))
        ? BookingDetails[0]?.CashAmount
        : 0,

    cardAmount:
      BookingDetails[0]?.SettledByCompany == 0 &&
      ((BookingDetails[0]?.PayAtCounter == 1 &&
        BookingDetails[0]?.UserTypeId == 5) ||
        (BookingDetails[0]?.PayAtCounter != 1 &&
          BookingDetails[0]?.UserTypeId != 0 &&
          BookingDetails[0]?.UserTypeId != 5 &&
          BookingDetails[0]?.UserTypeId != 6))
        ? BookingDetails[0]?.CardAmount
        : 0,

    upiAmount:
      BookingDetails[0]?.SettledByCompany == 0 &&
      ((BookingDetails[0]?.PayAtCounter == 1 &&
        BookingDetails[0]?.UserTypeId == 5) ||
        (BookingDetails[0]?.PayAtCounter != 1 &&
          BookingDetails[0]?.UserTypeId != 0 &&
          BookingDetails[0]?.UserTypeId != 5 &&
          BookingDetails[0]?.UserTypeId != 6))
        ? BookingDetails[0]?.UPIAmount
        : 0,

    upiId: BookingDetails[0]?.UPIId,
    cardHoldersName: BookingDetails[0]?.CardHoldersName,
    cardNumber: BookingDetails[0]?.CardNumber,
    cardType: BookingDetails[0]?.CardType,
    bookingCommission: BookingDetails[0]?.BookingCommision,
    settledByCompany:
      BookingDetails[0]?.SettledByCompany == 1
        ? BookingDetails[0]?.CashAmount +
            BookingDetails[0]?.CardAmount +
            BookingDetails[0]?.UPIAmount !=
          0
          ? BookingDetails[0]?.CashAmount +
            BookingDetails[0]?.CardAmount +
            BookingDetails[0]?.UPIAmount
          : BookingDetails[0]?.AmountAfterDiscount
        : 0,

    OnlinePayu:
      BookingDetails[0]?.PaymentMode === "OnlinePayu" ? 
        BookingDetails[0]?.AmountAfterDiscount
        : 0,
  };

  console.log("updatededBillDetails---->", updatededBillDetails);
  const BillIdDetails = {
    billId: BookingDetails.map((item) => {
      return item?.BillingId; // You can directly access and return the BillingId
    }),
  };

  const updateReportsItemDetails = () => {
    const itemDetailsData = {
      updatedItemDetails: JSON.stringify([updatededBillDetails]),
      billId: JSON.stringify(BillIdDetails?.billId),
    };

    console.log("Dummy Data-------->", itemDetailsData);
    dispatch(
      updateItemDetailsBillFn(
        loginDetails?.logindata?.Token,
        itemDetailsData,
        (callback) => {
          if (callback.status) {
            console.log("Item details updated", callback);
          } else {
            console.log("Callback--------voidt>>error", callback.error);
            toast.error(callback.error);
          }
        }
      )
    );
  };

  console.log("Updated Item Details----------------->", updatededBillDetails);

  console.log("Data to be passed as sms------------------->", BookingDetails);

  console.log("BillIdDetails--------------->", BillIdDetails?.billId);

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
                H.No. 838/1(3), 2nd floor Edificio Da Silva E Menezes Near Holy
                Family church Porvorim Goa 403521 <br></br>Tel. + 91 9158885000
              </h5>
              <h5 style={{ fontSize: "15px" }}>
                Email : info@casinoprideofficial.com
              </h5>
              <h5 style={{ fontSize: "15px" }}>
                Website : www.casinoprideofficial.com
              </h5>
              <h5 style={{ fontSize: "15px" }}>
                {" "}
                Instagram : casinoprideofficial
              </h5>
              <h5 style={{ fontSize: "12px" }}>
                CIN No: U55101GA2005PTC004274{" "}
              </h5>
              <h5 style={{ fontSize: "12px" }}>PAN No: AACCG7450R</h5>

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
                    Total Number of Kids :{" "}
                    <span className="BillPrintFont">
                      {item.TotalGuestCount}
                    </span>
                  </p>
                  <p className="BillPrintFont">
                    Payment Mode :{" "}
                    <span
                      style={{ fontWeight: "bold" }}
                      className="BillPrintFont"
                    >
                      {item.PaymentMode}
                    </span>
                  </p>
                  {item?.GSTNumber != null && (
                    <p className="BillPrintFont">
                      GST Number :{" "}
                      <span
                        style={{ fontWeight: "bold" }}
                        className="BillPrintFont"
                      >
                        {item?.GSTNumber}
                      </span>
                    </p>
                  )}
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
                      {moment(item?.ActualBillingDate).format(
                          "DD/MM/YYYY"
                        )}{" "}
                      {item?.ActualBillingTime}
                    </span>
                  </p>

                  <p
                    className="bill-number BillPrintFont"
                    style={{ marginRight: "35px" }}
                  >
                    BILL#:PSCP {item.BillNumber}
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
                        {/* <p className="BillPrintFont">Kids</p> */}
                        <p className="BillPrintFont">
                          Entry, Food (HSN-999692)
                        </p>
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
                        {(item?.TeensRate / item?.TotalGuestCount).toFixed(2)}
                      </td>

                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {(
                          (item?.TeensRate / item?.TotalGuestCount).toFixed(2) *
                          item?.TotalGuestCount
                        ).toFixed(2)}
                        {/* {item?.TeensRate.toFixed(2)} */}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="totals" style={{ textAlign: "right" }}>
                  {/* <h6>Total Amount: {item?.TeensRate.toFixed(2)}</h6> */}
                  <h6>
                    Total Amount:{" "}
                    {(
                      (item?.TeensRate / item?.TotalGuestCount).toFixed(2) *
                      item?.TotalGuestCount
                    ).toFixed(2)}
                  </h6>

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

                  {/* {item?.AmountAfterDiscount == 0 ? ( */}
                  {item?.ActualAmount - item?.AmountAfterDiscount == 0 ? (
                    <h6>Bill Amount: {item?.TeensPrice}</h6>
                  ) : (
                    <h6>
                      Bill Amount:{" "}
                      {item?.TeensPrice -
                        (item?.ActualAmount - item?.AmountAfterDiscount)}
                    </h6>
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
                    (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:30PM TO
                    1:30AM DURING THE WEEKDAYS.BUFFET IS OPEN FROM 1:30PM TO
                    4:00PM AND FROM 8:30PM TO 2:00AM DURING THE WEEKENDS.
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (2) OTP (ONE TIME PLAY COUPON) CAN BE PLAYED ONLY BY 21
                    YEARS AND ABOVE.
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (3) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR.
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                    (4) RIGHT TO ADMISSION IS RESERVED.
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
            // onClick={SendDetailsToUser}
            onClick={handlePrint}
            disabled={loader}
          >
            Print
          </button>
        </div>

        {/* <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
          <button
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
            type="submit"
            className="btn btn_colour mt-5 btn-lg"
            onClick={generateAndPrintPDF}
            disabled={loader}
          >
            Generate Pdf
          </button>
        </div> */}
      </div>

      <div style={{ marginTop: "2000px" }}>
        {!printLoader ? (
          <div className="ticket" ref={printableContentRef}>
            {BookingDetails &&
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
                          className="logo-imagePrint"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4"></div>
                  </div>
                  <p
                    style={{
                      marginBottom: "5px",
                    }}
                    className="BillPrintFontPrint"
                  >
                    A unit of Goa Coastal Resorts & Recreation Pvt.Ltd
                  </p>
                  <h5 className="BillPrintFontPrint">
                    H.No. 838/1(3), 2nd floor Edificio Da Silva E Menezes Near
                    Holy Family church Porvorim Goa 403521 <br></br>Tel. + 91
                    9158885000
                  </h5>
                  <h5 className="BillPrintFontPrint">
                    Email : info@casinoprideofficial.com
                  </h5>
                  <h5 className="BillPrintFontPrint">
                    Website : www.casinoprideofficial.com
                  </h5>
                  <h5 className="BillPrintFontPrint">
                    {" "}
                    Instagram : casinoprideofficial
                  </h5>
                  <h5 className="BillPrintFontPrint">
                    CIN No: U55101GA2005PTC004274{" "}
                  </h5>
                  <h5 className="BillPrintFontPrint">PAN No: AACCG7450R</h5>

                  <h5
                    style={{
                      marginBottom: "5px",
                      fontSize: "12px",
                      lineHeight: "10px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    TAX INVOICE
                  </h5>
                  <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-12 bill-details">
                      <p
                        className="bill-number BillPrintFontPrint"
                        style={{ marginRight: "15px" }}
                      >
                        BILL#:PSCP {item.BillNumber}
                      </p>
                      <p className="BillPrintFontPrint">
                        GUEST NAME :
                        <span className="BillPrintFontPrint">
                          {item.GuestName}
                        </span>{" "}
                      </p>
                      {item.guestGSTIN ? (
                        <p className="BillPrintFontPrint">
                          GUEST GSTIN :{" "}
                          <span className="BillPrintFontPrint">
                            {item.guestGSTIN}
                          </span>
                        </p>
                      ) : (
                        <></>
                      )}
                      <p className="BillPrintFontPrint">
                        GUEST Mobile :
                        <span className="guest-mobile BillPrintFontPrint">
                          {item.Phone}
                        </span>
                      </p>
                      {item.guestState ? (
                        <p className="BillPrintFontPrint">
                          GUEST STATE :
                          <span className="guest-state BillPrintFontPrint">
                            {item.guestState}
                          </span>
                        </p>
                      ) : (
                        <></>
                      )}

                      <p className="BillPrintFontPrint">
                        Total Number of Kids :{" "}
                        <span className="BillPrintFontPrint">
                          {item.TotalGuestCount}
                        </span>
                      </p>
                      <p className="BillPrintFontPrint">
                        Payment Mode :{" "}
                        <span
                          style={{ fontWeight: "bold" }}
                          className="BillPrintFontPrint"
                        >
                          {item.PaymentMode}
                        </span>
                      </p>
                      {item?.GSTNumber != null && (
                        <p className="BillPrintFontPrint">
                          GST Number :{" "}
                          <span
                            style={{ fontWeight: "bold" }}
                            className="BillPrintFontPrint"
                          >
                            {item?.GSTNumber}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bill-details">
                    <div className="date-time-bill-row">
                      <p
                        className="BillPrintFontPrint"
                        style={{ marginTop: "5px" }}
                      >
                        Date & Time:
                        <span className="BillPrintFontPrint">
                          {" "}
                          {moment(item?.ActualBillingDate).format(
                              "DD/MM/YYYY"
                            )}{" "}
                          {item?.ActualBillingTime}
                        </span>
                      </p>
                    </div>
                    <hr />
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th
                            style={{ textAlign: "center" }}
                            className="BillPrintFontPrint"
                          >
                            ITEM NAME
                          </th>
                          <th
                            style={{ textAlign: "center" }}
                            className="BillPrintFontPrint"
                          >
                            {" "}
                            Guest Count
                          </th>

                          <th
                            style={{ textAlign: "center" }}
                            className="BillPrintFontPrint"
                          >
                            RATE
                          </th>
                          <th
                            style={{ textAlign: "center" }}
                            className="BillPrintFontPrint"
                          >
                            VALUE
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td style={{ textAlign: "center" }}>
                            {/* <p className="BillPrintFontPrint">Kids</p> */}
                            <p className="BillPrintFontPrint">
                              Entry, Food (HSN-999692)
                            </p>
                          </td>

                          <td className="BillPrintFontPrint">
                            {item?.TotalGuestCount}
                          </td>

                          <td className="BillPrintFontPrint">
                            {(item?.TeensRate / item?.TotalGuestCount).toFixed(
                              2
                            )}
                          </td>

                          <td className="BillPrintFontPrint">
                            {/* {item?.TeensRate.toFixed(2)} */}
                            {(
                              (item?.TeensRate / item?.TotalGuestCount).toFixed(
                                2
                              ) * item?.TotalGuestCount
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="totals" style={{ textAlign: "right" }}>
                      <h6 className="BillPrintFontPrint">
                        {/* Total Amount: {item?.TeensRate.toFixed(2)} */}
                        Total Amount:{" "}
                        {(
                          (item?.TeensRate / item?.TotalGuestCount).toFixed(2) *
                          item?.TotalGuestCount
                        ).toFixed(2)}
                      </h6>

                      <h6 className="BillPrintFontPrint">
                        {" "}
                        CGST: {item?.TeensTax / 2} % :{" "}
                        {(item?.TeensTaxBifurcation / 2).toFixed(2)}
                      </h6>
                      <h6 className="BillPrintFontPrint">
                        {" "}
                        SGST: {item?.TeensTax / 2} % :{" "}
                        {(item?.TeensTaxBifurcation / 2).toFixed(2)}
                      </h6>

                      {/* {item?.AmountAfterDiscount == 0 ? ( */}
                      {item?.ActualAmount - item?.AmountAfterDiscount == 0 ? (
                        <h4 className="BillPrintFontPrint">
                          Bill Amount: {item?.TeensPrice}
                        </h4>
                      ) : (
                        <h4 className="BillPrintFontPrint">
                          Bill Amount:{" "}
                          {item?.TeensPrice -
                            (item?.ActualAmount - item?.AmountAfterDiscount)}
                        </h4>
                      )}
                    </div>

                    <div
                      className="terms"
                      style={{ marginTop: "20px", textAlign: "center" }}
                    >
                      <h6 className="BillPrintFontPrintterms">
                        TERMS AND CONDITIONS
                      </h6>
                      <p className="BillPrintFontPrintterms">
                        (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:30PM
                        TO 1:30AM DURING THE WEEKDAYS.BUFFET IS OPEN FROM 1:30PM
                        TO 4:00PM AND FROM 8:30PM TO 2:00AM DURING THE WEEKENDS.
                      </p>
                      <p className="BillPrintFontPrintterms">
                        (2) OTP (ONE TIME PLAY COUPON) CAN BE PLAYED ONLY BY 21
                        YEARS AND ABOVE.
                      </p>
                      <p className="BillPrintFontPrintterms">
                        (3) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR.
                      </p>
                      <p className="BillPrintFontPrintterms">
                        (4) RIGHT TO ADMISSION IS RESERVED.
                      </p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="d-flex justify-content-center qr-code">
                      {qrCodeImage && (
                        <div className="qr-code-image text-center">
                          <img
                            src={qrCodeImage}
                            alt="QR Code"
                            style={{ width: "120px", height: "120px" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TeensBilling;
