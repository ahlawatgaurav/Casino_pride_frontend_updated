// import React, { useEffect, useState, useRef, useCallback } from "react";
// import html2pdf from "html2pdf.js";
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
// import { toPng } from "html-to-image";
// import { uploadBillFile, sendEmail } from "../../../Redux/actions/billing";
// import { Oval } from "react-loader-spinner";
// import QRCode from "qrcode";
// import { PDFDocument, rgb } from "pdf-lib";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { shortenUrl } from "../../../Redux/actions/users";
// import "../../../assets/print.css";
// import ReactToPrint from "react-to-print";
// import { useReactToPrint } from "react-to-print";
// import { updateItemDetailsBillFn } from "../../../Redux/actions/billing";

// const BillingDetails = () => {
//   const printableContentRef = useRef();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userType } = location.state;
//   const { userData } = location.state;
//   const { BookingDetails } = location.state;
//   const [loader, setLoader] = useState(false);

//   const sourcePage = location.state?.sourcePage || "";

//   console.log("sourcePage-------------->", sourcePage);

//   const loginDetails = useSelector(
//     (state) => state.auth?.userDetailsAfterLogin.Details
//   );

//   console.log("Data to be passed as sms------------------->", BookingDetails);

//   const DiscountedAmount =
//     BookingDetails[0]?.ActualAmount - BookingDetails[0]?.AmountAfterDiscount;

//   const FinalAmount = BookingDetails[0]?.ActualAmount - DiscountedAmount;

//   console.log("DiscountedAmount---->", BookingDetails[0]?.ActualAmount);

//   const [totalDiscount, setTotalDiscount] = useState(0);

//   useEffect(() => {
//     if (BookingDetails[0]?.AmountAfterDiscount == 0) {
//       setTotalDiscount(0);
//     } else {
//       setTotalDiscount(
//         BookingDetails[0]?.ActualAmount - BookingDetails[0]?.AmountAfterDiscount
//       );
//     }
//   }, []);

//   console.log(
//     "totalDiscount-----------------||||||||||||||||||||||||||||||||||||||||||||||||||>",
//     totalDiscount
//   );

//   const dummyLink = "http://13.235.27.91:5858/p/4r4";
//   const Bookinglink = "https://bit.ly/3trchox";

//   const generatePDF = async () => {
//     const elements = document.querySelectorAll(".thermal-bill");
//     const container = document.createElement("div");

//     elements.forEach((element) => {
//       container.appendChild(element.cloneNode(true));
//     });

//     document.body.appendChild(container);

//     let pdfWindow = window.open("PDF Report", "_blank");
//     pdfWindow.document.write(elements);
//     pdfWindow.document.close();
//     pdfWindow.focus();
//     setTimeout(() => {
//       pdfWindow.print();
//     }, 20);

//     const opt = {
//       margin: [10, 0, 0, 0],
//       filename: `${BookingDetails[0]?.BillingId}bill.pdf`,
//       image: { type: "jpeg", quality: 1 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };

//     html2pdf()
//       .from(container)
//       .set(opt)
//       .outputPdf()
//       .then((res) => {
//         console.log("res ==>", res);
//       });

//     document.body.removeChild(container);
//   };

//   const generateAndPrintPDF = async () => {
//     const elements = document.querySelectorAll(".thermal-bill");
//     const container = document.createElement("div");

//     elements.forEach((element) => {
//       container.appendChild(element.cloneNode(true));
//     });

//     document.body.appendChild(container);

//     const opt = {
//       margin: [10, 0, 0, 0],
//       filename: `${BookingDetails[0]?.BillingId}bill.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };

//     const pdf = await html2pdf().from(container).set(opt).save();

//     const jsPDFInstance = new jsPDF();
//     jsPDFInstance.output("datauristring", pdf);

//     document.body.removeChild(container);
//   };

//   // const generatePDF = async () => {
//   //   const elements = document.querySelectorAll(".thermal-bill");
//   //   const container = document.createElement("div");

//   //   elements.forEach((element) => {
//   //     container.appendChild(element.cloneNode(true));
//   //   });

//   //   document.body.appendChild(container);

//   //   const opt = {
//   //     margin: [10, 0, 0, 0],
//   //     filename: `${BookingDetails[0]?.BillingId}bill.pdf`,
//   //     image: { type: "jpeg", quality: 1 },
//   //     html2canvas: { scale: 2 },
//   //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//   //   };

//   //   // Generate the PDF and save it as a data URI
//   //   const pdfBlob = await html2pdf().from(container).set(opt).outputPdf();

//   //   // Create a hidden iframe
//   //   const iframe = document.createElement("iframe");
//   //   iframe.style.display = "none";

//   //   // Set the source of the iframe to the generated PDF
//   //   iframe.src = URL.createObjectURL(
//   //     new Blob([pdfBlob], { type: "application/pdf" })
//   //   );

//   //   // Append the iframe to the document
//   //   document.body.appendChild(iframe);

//   //   // Print the PDF
//   //   iframe.contentWindow.print();

//   //   // Remove the iframe after printing
//   //   iframe.onload = () => {
//   //     document.body.removeChild(iframe);
//   //   };

//   //   document.body.removeChild(container);
//   // };

//   const [qrCodeImage, setQRCodeImage] = useState(null);

//   const elementRef = useRef(null);

//   const [updatedQrcodeImage, setUpatedQrcodeImage] = useState("");

//   console.log(
//     "updatedQrcodeImage----------------------------------------------->",
//     updatedQrcodeImage
//   );

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

//         console.log(
//           "BookingDetails[0]?.BillingId-------->",
//           BookingDetails[0]?.BookingId
//         );

//         const formData = new FormData();
//         formData.append(
//           "File",
//           imageBlob,
//           `${BookingDetails[0]?.BillingId}bill.png`
//         );
//         formData.append("bookingId", BookingDetails[0]?.BookingId);

//         dispatch(
//           uploadBillFile(
//             loginDetails?.logindata?.Token,
//             formData,
//             (callback) => {
//               if (callback.status) {
//                 console.log(
//                   "callback?.response?.Details[0]--->",
//                   callback?.response?.Details[0]?.Bill
//                 );
//                 const data = {
//                   longURL: callback?.response?.Details[0]?.Bill,
//                 };

//                 dispatch(
//                   shortenUrl(
//                     data,
//                     loginDetails?.logindata?.Token,
//                     (callback) => {
//                       if (callback.status) {
//                         console.log(
//                           "post shorten url------------->",
//                           callback?.response
//                         );
//                         setUpatedQrcodeImage(callback?.response?.shortUrl);
//                         setLoader(false);
//                       } else {
//                         toast.error(callback.error);
//                       }
//                     }
//                   )
//                 );
//               } else {
//                 toast.error(callback.error);
//               }
//             }
//           )
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [elementRef]);

//   const sendPrintFn = () => {
//     console.log("Hiiiiiiiii");
//   };

//   const SendDetailsToUser = useCallback(() => {
//     // updateReportsItemDetails();
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

//         const formData = new FormData();
//         formData.append(
//           "File",
//           imageBlob,
//           `${BookingDetails[0]?.BillingId}bill.png`
//         );
//         formData.append("bookingId", BookingDetails[0]?.BookingId);

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
//                 // setUpatedQrcodeImage(
//                 //   callback?.response?.Details[0]?.BillingFile
//                 // );

//                 const data = {
//                   longURL: callback?.response?.Details[0]?.Bill,
//                 };

//                 dispatch(
//                   shortenUrl(
//                     data,
//                     loginDetails?.logindata?.Token,
//                     (callback) => {
//                       if (callback.status) {
//                         console.log(
//                           "post shorten url------------->",
//                           callback?.response?.shortUrl
//                         );
//                         setUpatedQrcodeImage(callback?.response?.shortUrl);

//                         const data = {
//                           receiverMail: JSON.stringify(
//                             BookingDetails[0]?.Email
//                           ),
//                           amount: FinalAmount,
//                           billFile: JSON.stringify(
//                             callback?.response?.shortUrl
//                           ),
//                         };

//                         if (sourcePage == "") {
//                           dispatch(
//                             sendEmail(data, (callback) => {
//                               if (callback.status) {
//                                 toast.success("Email sent");
//                                 navigate("/NewBooking");

//                                 toast.error(callback.error);
//                               } else {
//                                 toast.error(callback.error);
//                               }
//                             })
//                           );

//                           const apiUrl = `http://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${BookingDetails[0]?.Phone}&text=Thank%20you%20for%20choosing%20Casino%20Pride.%20View%20e-bill%20of%20Rs%20${FinalAmount}%20at%20-%20${callback?.response?.shortUrl}%0ALets%20Play%20with%20Pride%20!%0AGood%20luck%20!%0ACPGOAA`;
//                           fetch(apiUrl)
//                             .then((response) => {
//                               if (!response.ok) {
//                                 throw new Error(
//                                   `HTTP error! Status: ${response.status}`
//                                 );
//                               }
//                               return response.json(); // Parse the JSON response
//                             })
//                             .then((data) => {
//                               console.log(data); // Handle the parsed JSON data here
//                               toast.success("Details sent to customer");
//                             })
//                             .catch((error) => {
//                               console.error("Fetch error:", error);
//                               toast.success("Details sent to customer");
//                             });
//                         } else {
//                           navigate("/NewBooking");
//                         }

//                         setLoader(false);
//                       } else {
//                         toast.error(callback.error);
//                       }
//                     }
//                   )
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

//         console.log(
//           "bllling file------------------------{{{{{{{{}}}}}}}}}}}}}}}}}----->",
//           updatedQrcodeImage
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
//     updateReportsItemDetails();
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

//   // useEffect(() => {
//   //   QRCode.toCanvas(
//   //     document.createElement("canvas"),
//   //     dummyLink,
//   //     (error, canvas) => {
//   //       if (error) {
//   //         console.error("QR code generation error:", error);
//   //       } else {
//   //         const qrCodeDataURL = canvas.toDataURL("image/png");
//   //         setQRCodeImage(qrCodeDataURL);
//   //       }
//   //     }
//   //   );
//   // }, [dummyLink]);

//   const [printLoader, setPrintLoader] = useState(false);

//   const handlePrint = useReactToPrint({
//     content: () => printableContentRef.current,

//     onBeforeGetContent: () => {
//       SendDetailsToUser();
//     },
//   });

//   const [finalUseState, setFinalUseState] = useState("");

//   useEffect(() => {
//     console.log("Calculations for package guest count-->", BookingDetails);
//     const finalDetails = BookingDetails.reduce((total, item) => {
//       const guestCountData = item?.ItemDetails.packageGuestCount || [];
//       const calculatedTotal = guestCountData.reduce(
//         (count, num) => count + num,
//         0
//       );
//       return calculatedTotal;
//     }, 0);

//     console.log("finalDetails--------->", finalDetails);
//     setFinalUseState(finalDetails);
//   }, []);

//   // const updatededBillDetails = {
//   //   updatedItemDetails: BookingDetails.map((item) => {
//   //     const Rate = item?.ItemDetails?.Rate;
//   //     const packageGuestCount = item?.ItemDetails?.packageGuestCount;
//   //     const resultRate = Rate.map(
//   //       (value, index) => value * packageGuestCount[index]
//   //     );
//   //     const Price = item?.ItemDetails?.Price;
//   //     const resultPrice = Price.map(
//   //       (value, index) => value * packageGuestCount[index]
//   //     );

//   //     const taxDiffSum = item?.ItemDetails?.TaxDiff.reduce(
//   //       (acc, value) => acc + value,
//   //       0
//   //     );
//   //     console.log("taxDiffSum", taxDiffSum);

//   //     const itemTaxName = item?.ItemDetails?.ItemTaxName;
//   //     const adjustedTaxDiffSum =
//   //       itemTaxName[0] === "GST" ? taxDiffSum / 2 : taxDiffSum;

//   //     console.log("adjusted Tax Diff Sum----->", adjustedTaxDiffSum);

//   //     const cgstProperty = `CGST ${item?.ItemDetails?.ItemTax / 2} %`;
//   //     const sgstProperty = `SGST ${item?.ItemDetails?.ItemTax / 2} %`;
//   //     const vatProperty = `VAT ${item?.ItemDetails?.ItemTax} %`;

//   //     return {
//   //       ItemTax: item?.ItemDetails?.ItemTax,
//   //       ItemId: [item?.ItemDetails?.ItemId],
//   //       ItemName: [item?.ItemDetails?.ItemName],
//   //       Price: [resultPrice],
//   //       Rate: [resultRate],
//   //       ItemTaxName: [item?.ItemDetails?.ItemTaxName[0]],
//   //       TaxDiff: [item?.ItemDetails?.TaxDiff],
//   //       IsDeductable: [item?.ItemDetails?.IsDeductable],
//   //       PackageId: [item?.PackageId],
//   //       packageGuestCount: [packageGuestCount],
//   //       [cgstProperty]: adjustedTaxDiffSum / 2,
//   //       [sgstProperty]: adjustedTaxDiffSum / 2,
//   //       [vatProperty]:adjustedTaxDiffSum

//   //     };
//   //   }),
//   // };

//   // const updatededBillDetails = {
//   //   updatedItemDetails: BookingDetails.map((item) => {
//   //     const Rate = item?.ItemDetails?.Rate;
//   //     const packageGuestCount = item?.ItemDetails?.packageGuestCount;
//   //     const resultRate = Rate.map(
//   //       (value, index) => value * packageGuestCount[index]
//   //     );

//   //     const Price = item?.ItemDetails?.Price;
//   //     const resultPrice = Price.map(
//   //       (value, index) => value * packageGuestCount[index]
//   //     );

//   //     const taxDiffSum = item?.ItemDetails?.TaxDiff.reduce(
//   //       (acc, value) => acc + value,
//   //       0
//   //     );
//   //     console.log("taxDiffSum", taxDiffSum);

//   //     const itemTaxName = item?.ItemDetails?.ItemTaxName;
//   //     const adjustedTaxDiffSum =
//   //       itemTaxName[0] === "GST" ? taxDiffSum / 2 : taxDiffSum;

//   //     console.log("adjusted Tax Diff Sum----->", adjustedTaxDiffSum);
//   //     const itemTeensTaxName = item?.TeensTaxName;
//   //     console.log("Teens Tax name", itemTeensTaxName);

//   //     const KidsItemName = "Kids";

//   //     const KidsCount = item?.NumOfTeens;
//   //     console.log("Kids count==>", KidsCount);
//   //     const KidsRate = item?.TeensRate * item?.NumOfTeens;
//   //     console.log("Kids rate", KidsRate);

//   //     const KidsPrice = item?.TeensPrice * item?.NumOfTeens;
//   //     console.log("Kids Price", KidsPrice);

//   //     const KidsCgstProperty = `CGST ${item?.TeensTax / 2} %`;
//   //     console.log("Kids cgst", KidsCgstProperty);

//   //     const KidsSgstProperty = `CGST ${item?.TeensTax / 2} %`;
//   //     console.log("Kids sgst", KidsSgstProperty);

//   //     const KidsTax = item?.TeensTaxBifurcation;

//   //     // Define dynamic property names
//   //     const cgstProperty = `CGST ${item?.ItemDetails?.ItemTax / 2} %`;
//   //     const sgstProperty = `SGST ${item?.ItemDetails?.ItemTax / 2} %`;
//   //     const vatProperty = `VAT ${item?.ItemDetails?.ItemTax} %`;

//   //     // Create an object to store the properties
//   //     const properties = {
//   //       ItemTax: item?.ItemDetails?.ItemTax,
//   //       ItemId: item?.ItemDetails?.ItemId,
//   //       ItemName: item?.ItemDetails?.ItemName,
//   //       Price: resultPrice,
//   //       Rate: resultRate,
//   //       ItemTaxName: itemTaxName[0],
//   //       TaxDiff: item?.ItemDetails?.TaxDiff,
//   //       IsDeductable: item?.ItemDetails?.IsDeductable,
//   //       PackageId: item?.PackageId,
//   //       packageGuestCount: packageGuestCount,
//   //     };

//   //     if (itemTaxName[0] === "GST") {
//   //       if (KidsCount > 0) {
//   //         properties["KidsItemName"] = KidsItemName;
//   //         properties["KidsCount"] = KidsCount;
//   //         properties["KidsRate"] = KidsRate;
//   //         properties["KidsPrice"] = KidsPrice;
//   //         properties[KidsCgstProperty] = KidsTax;
//   //         properties[KidsSgstProperty] = KidsTax;
//   //         properties[cgstProperty] = adjustedTaxDiffSum / 2;
//   //         properties[sgstProperty] = adjustedTaxDiffSum / 2;
//   //       } else {
//   //         properties[cgstProperty] = adjustedTaxDiffSum / 2;
//   //         properties[sgstProperty] = adjustedTaxDiffSum / 2;
//   //       }
//   //     } else if (itemTaxName[0] === "VAT") {
//   //       properties[vatProperty] = adjustedTaxDiffSum;
//   //     }

//   //     return properties;
//   //   }),
//   // };

//   const updatededBillDetails = {
//     updatedItemDetails: BookingDetails.map((item) => {
//       const Rate = item?.ItemDetails?.Rate;
//       const packageGuestCount = item?.ItemDetails?.packageGuestCount;
//       const resultRate = Rate.map(
//         (value, index) => value * packageGuestCount[index]
//       );

//       console.log("Result Rate----->", resultRate);

//       const FinalRateResult = resultRate.reduce((acc, item) => acc + item, 0);

//       console.log("Reuslted rate------->", FinalRateResult);

//       const Price = item?.ItemDetails?.Price;
//       const resultPrice = Price.map(
//         (value, index) => value * packageGuestCount[index]
//       );

//       const TotalBillAmount = resultPrice.reduce(
//         (accumulator, currentValue) => accumulator + currentValue,
//         0
//       );

//       console.log("Result price----->", resultPrice);

//       const finalResultPrice = resultPrice.reduce(
//         (accumulator, currentValue) => accumulator + currentValue,
//         0
//       );

//       const ActualAmount = item?.ActualAmount;
//       const AmountAfterDiscount = item?.AmountAfterDiscount;

//       // if (ActualAmount - AmountAfterDiscount == 0) {
//       // }

//       const Discount = ActualAmount - AmountAfterDiscount;

//       const DiscountedFigure = finalResultPrice - Discount;

//       console.log("DiscountedFigure------------->", DiscountedFigure);

//       const taxDiffSum = item?.ItemDetails?.TaxDiff.reduce(
//         (acc, value) => acc + value,
//         0
//       );
//       console.log("taxDiffSum", taxDiffSum);

//       const itemTaxName = item?.ItemDetails?.ItemTaxName;
//       const adjustedTaxDiffSum =
//         itemTaxName[0] === "GST" ? taxDiffSum / 2 : taxDiffSum;

//       console.log("adjusted Tax Diff Sum----->", adjustedTaxDiffSum);
//       const itemTeensTaxName = item?.TeensTaxName;
//       console.log("Teens Tax name", itemTeensTaxName);

//       const KidsItemName = "Kids";

//       const KidsCount = item?.NumOfTeens;
//       console.log("Kids count==>", KidsCount);
//       const KidsRate = item?.TeensRate * item?.NumOfTeens;
//       console.log("Kids rate", KidsRate);

//       const KidsPrice = item?.TeensPrice * item?.NumOfTeens;
//       console.log("Kids Price", KidsPrice);

//       const KidsCgstProperty = `CGST ${item?.TeensTax / 2} %`;
//       console.log("Kids cgst", KidsCgstProperty);

//       const KidsSgstProperty = `CGST ${item?.TeensTax / 2} %`;
//       console.log("Kids sgst", KidsSgstProperty);

//       const KidsTax = item?.TeensTaxBifurcation;

//       // Define dynamic property names
//       const cgstProperty = `CGST ${item?.ItemDetails?.ItemTax / 2} %`;
//       const sgstProperty = `SGST ${item?.ItemDetails?.ItemTax / 2} %`;
//       const vatProperty = `VAT ${item?.ItemDetails?.ItemTax} %`;

//       // Create an object to store the properties
//       const properties = {
//         ItemTax: item?.ItemDetails?.ItemTax,
//         ItemId: item?.ItemDetails?.ItemId,
//         ItemName: item?.ItemDetails?.ItemName,
//         Price: finalResultPrice,
//         Rate: FinalRateResult,
//         ItemTaxName: itemTaxName[0],
//         TaxDiff: item?.ItemDetails?.TaxDiff,
//         IsDeductable: item?.ItemDetails?.IsDeductable,
//         PackageId: item?.PackageId,
//         packageGuestCount: packageGuestCount,
//       };

//       if (itemTaxName[0] === "GST") {
//         if (KidsCount > 0) {
//           properties["KidsItemName"] = KidsItemName;
//           properties["KidsCount"] = KidsCount;
//           properties["KidsRate"] = KidsRate;
//           properties["KidsPrice"] = KidsPrice;
//           properties[KidsCgstProperty] = KidsTax;
//           properties[KidsSgstProperty] = KidsTax;
//           properties[cgstProperty] = adjustedTaxDiffSum / 2;
//           properties[sgstProperty] = adjustedTaxDiffSum / 2;
//           properties["TotalBillAmount"] = DiscountedFigure;
//         } else {
//           properties[cgstProperty] = adjustedTaxDiffSum / 2;
//           properties[sgstProperty] = adjustedTaxDiffSum / 2;
//           properties["TotalBillAmount"] = DiscountedFigure;
//         }
//       } else if (itemTaxName[0] === "VAT") {
//         properties[vatProperty] = adjustedTaxDiffSum;
//         properties["TotalBillAmount"] = TotalBillAmount;
//       }

//       return properties;
//     }),
//   };

//   const BillIdDetails = {
//     billId: BookingDetails.map((item) => {
//       return item?.BillingId; // You can directly access and return the BillingId
//     }),
//   };

//   const updateReportsItemDetails = () => {
//     const itemDetailsData = {
//       updatedItemDetails: JSON.stringify(
//         updatededBillDetails?.updatedItemDetails
//       ),
//       billId: JSON.stringify(BillIdDetails?.billId),
//     };

//     console.log("Dummy Data-------->", itemDetailsData);
//     dispatch(
//       updateItemDetailsBillFn(
//         loginDetails?.logindata?.Token,
//         itemDetailsData,
//         (callback) => {
//           if (callback.status) {
//             console.log("Item details updated", callback);
//           } else {
//             console.log("Callback--------voidt>>error", callback.error);
//             toast.error(callback.error);
//           }
//         }
//       )
//     );
//   };

//   console.log(
//     "Updated Item Details----------------->",
//     updatededBillDetails?.updatedItemDetails
//   );

//   console.log("Data to be passed as sms------------------->", BookingDetails);

//   console.log("BillIdDetails--------------->", BillIdDetails?.billId);
//   // const dummyNumber = 3343.7778;
//   // const truncatedNumber = Math.floor(dummyNumber * 100) / 100;

//   // console.log("truncated number", truncatedNumber.toFixed(2));

//   const dummyNumber = 3343.7778;

//   // Round the number to 2 digits and then multiply by 2
//   const roundedAndMultiplied = (
//     (Math.round(dummyNumber * 100) / 100) *
//     2
//   ).toFixed(2);

//   console.log("Dummy Number---->");

//   const roundToTwoDecimalPlaces = (number) => Math.round(number * 100) / 100;

//   // const packageDiscountValue = BookingDetails.map((item) => {
//   //   console.log(
//   //     "item-->",
//   //     item?.ItemDetails?.Rate.map((rate) => parseFloat(rate).toFixed(2))
//   //   );
//   // });

//   BookingDetails.map((item) => {
//     const roundedRates = item?.ItemDetails?.Rate.map((rate) =>
//       parseFloat(rate).toFixed(2)
//     );

//     const multipliedAndSummedValue = roundedRates.reduce(
//       (acc, roundedRate) => acc + parseFloat(roundedRate) * 3,
//       0
//     );

//     console.log("item-->", multipliedAndSummedValue.toFixed(2));
//   });

//   return (
//     <div>
//       <div>
//         <ToastContainer />
//         {loader ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//             }}
//           >
//             <Oval
//               height={80}
//               width={50}
//               color="#4fa94d"
//               visible={true}
//               ariaLabel="oval-loading"
//               secondaryColor="#4fa94d"
//               strokeWidth={2}
//               strokeWidthSecondary={2}
//             />
//           </div>
//         ) : (
//           <></>
//         )}

//         <div className="container-fluid" ref={elementRef}>
//           {BookingDetails &&
//             BookingDetails?.map((item) => (
//               <div
//                 className="thermal-bill"
//                 style={{
//                   height: "1120px",
//                   backgroundColor: "white",
//                   width: "100%",
//                   padding: "2%",
//                 }}
//               >
//                 <div className="row">
//                   <div className="col-lg-4"></div>
//                   <div className="col-lg-4">
//                     <div className="text-center">
//                       <img
//                         src={logo}
//                         alt="Casino Pride Logo"
//                         className="logo-image"
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-4"></div>
//                 </div>

//                 <p
//                   style={{
//                     marginBottom: "5px",
//                   }}
//                   className="BillPrintFont"
//                 >
//                   A unit of Goa Coastal Resorts & Recreation Pvt.Ltd
//                 </p>
//                 <h5 style={{ fontSize: "15px" }}>
//                   Hotel Neo Majestic, Plot No. 104/14, Porvorim, Bardez, Goa -
//                   403 521 <br></br>Tel. + 91 9158885000
//                 </h5>
//                 <h5 style={{ fontSize: "15px" }}>
//                   Email : info@casinoprideofficial.com
//                 </h5>
//                 <h5 style={{ fontSize: "15px" }}>
//                   Website : www.casinoprideofficial.com
//                 </h5>
//                 <h5 style={{ fontSize: "15px" }}>
//                   Instagram : casinoprideofficial
//                 </h5>
//                 <h5 style={{ fontSize: "12px" }}>
//                   CIN No: U55101GA2005PTC004274{" "}
//                 </h5>
//                 <h5 style={{ fontSize: "12px" }}>PAN No: AACCG7450R</h5>
//                 {item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
//                   <h5 style={{ fontSize: "12px" }}>TIN No : 30220106332</h5>
//                 ) : (
//                   <></>
//                 )}
//                 {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
//                   <h5 style={{ fontSize: "12px" }}>GSTIN : 30AACCG7450R1ZC</h5>
//                 ) : (
//                   <></>
//                 )}
//                 <h5>TAX INVOICE</h5>
//                 <div className="row">
//                   <div className="col-6 bill-details">
//                     <p className="BillPrintFont">
//                       Guest Name :<span>{item.GuestName}</span>{" "}
//                     </p>
//                     {item.guestGSTIN ? (
//                       <p className="BillPrintFont">
//                         Guest GSTIN :{" "}
//                         <span
//                           style={{ fontWeight: "bold" }}
//                           className="BillPrintFont"
//                         >
//                           {item.guestGSTIN}
//                         </span>
//                       </p>
//                     ) : (
//                       <></>
//                     )}
//                     <p className="BillPrintFont">
//                       Guest Mobile :
//                       <span
//                         className="guest-mobile"
//                         style={{ fontWeight: "bold" }}
//                       >
//                         {item.Phone}
//                       </span>
//                     </p>
//                     {item.State || item?.Address || item?.Country ? (
//                       <p className="BillPrintFont">
//                         Guest Address:
//                         <span
//                           className="guest-state BillPrintFont"
//                           style={{ fontWeight: "bold" }}
//                         >
//                           {" "}
//                           {item?.Address} {item.State} {item?.Country}
//                         </span>
//                       </p>
//                     ) : (
//                       <></>
//                     )}

//                     <p className="BillPrintFont">
//                       Number of Adults :{" "}
//                       <span
//                         style={{ fontWeight: "bold" }}
//                         className="BillPrintFont"
//                       >
//                         {item.TotalGuestCount - BookingDetails[0]?.NumOfTeens}
//                       </span>
//                     </p>

//                     {!BookingDetails[0].NumOfTeens == 0 ? (
//                       <p className="BillPrintFont">
//                         Number of Kids :{" "}
//                         <span
//                           style={{ fontWeight: "bold" }}
//                           className="BillPrintFont"
//                         >
//                           {BookingDetails[0]?.NumOfTeens}
//                         </span>
//                       </p>
//                     ) : (
//                       <></>
//                     )}

//                     <p className="BillPrintFont">
//                       Total Number of Guests :{" "}
//                       <span
//                         style={{ fontWeight: "bold" }}
//                         className="BillPrintFont"
//                       >
//                         {item?.TotalGuestCount}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="col-6">
//                     <div className="d-flex justify-content-end qr-code">
//                       {qrCodeImage && (
//                         <div className="qr-code-image">
//                           <img src={qrCodeImage} alt="QR Code" />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bill-details">
//                   <div className="date-time-bill-row">
//                     <p className="BillPrintFont">
//                       Date & Time :
//                       <span
//                         style={{ fontWeight: "bold" }}
//                         className="BillPrintFont"
//                       >
//                         {" "}
//                         {moment
//                           .utc(item?.BillDateTime)
//                           .format("DD/MM/YYYY HH:mm")}
//                       </span>
//                     </p>

//                     <p
//                       className="bill-number BillPrintFont"
//                       style={{ marginRight: "25px" }}
//                     >
//                       BILL#: {item.BillNumber}
//                     </p>
//                   </div>
//                   <hr />
//                   <table className="table" style={{ padding: "15px" }}>
//                     <thead>
//                       <tr>
//                         <th
//                           style={{ textAlign: "center" }}
//                           className="BillPrintFont"
//                         >
//                           ITEM NAME
//                         </th>
//                         <th
//                           style={{ textAlign: "center" }}
//                           className="BillPrintFont"
//                         >
//                           GUEST COUNT
//                         </th>

//                         <th
//                           style={{ textAlign: "center" }}
//                           className="BillPrintFont"
//                         >
//                           RATE
//                         </th>
//                         <th
//                           style={{ textAlign: "center" }}
//                           className="BillPrintFont"
//                         >
//                           VALUE
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td
//                           style={{ textAlign: "center" }}
//                           className="BillPrintFont"
//                         >
//                           {item?.ItemDetails &&
//                             item?.ItemDetails?.ItemName.map((item) => (
//                               <p>{item}</p>
//                             ))}
//                         </td>

//                         <td
//                           style={{ textAlign: "center" }}
//                           className="BillPrintFont"
//                         >
//                           {item?.ItemDetails &&
//                           item?.ItemDetails.packageGuestCount ? (
//                             item.ItemDetails.packageGuestCount.map(
//                               (guest, index) => <p key={index}>{guest}</p>
//                             )
//                           ) : (
//                             <p>No data</p>
//                           )}
//                         </td>

//                         <td
//                           style={{ textAlign: "right" }}
//                           className="BillPrintFont"
//                         >
//                           {item?.ItemDetails &&
//                             item?.ItemDetails?.Rate.map((item, index) => (
//                               <p key={index}>
//                                 {item && parseFloat(item).toFixed(2)}
//                               </p>
//                             ))}
//                         </td>

//                         <td
//                           style={{ textAlign: "right" }}
//                           className="BillPrintFont"
//                         >
//                           {item?.ItemDetails?.Rate.map((rate, index) => (
//                             <p key={index}>
//                               {/* {rate &&
//                               item?.ItemDetails?.packageGuestCount[index]
//                                 ? Math.floor(
//                                     parseFloat(rate) *
//                                       item?.ItemDetails?.packageGuestCount[
//                                         index
//                                       ] *
//                                       100
//                                   ) / 100
//                                 : "N/A"} */}

//                               {/* {rate &&
//   item?.ItemDetails?.packageGuestCount[index]
//     ? parseFloat(
//         Math.floor(
//           parseFloat(rate) *
//             item?.ItemDetails?.packageGuestCount[index] *
//             100
//         ) / 100
//       ).toFixed(2)
//     : "N/A"} */}

//                               {rate &&
//                               item?.ItemDetails?.packageGuestCount[index]
//                                 ? (
//                                     parseFloat(rate).toFixed(2) *
//                                     item?.ItemDetails?.packageGuestCount[index]
//                                   ).toFixed(2)
//                                 : "N/A"}

//                               {/* {rate &&
//                               item?.ItemDetails?.packageGuestCount[index]
//                                 ? parseFloat(rate) *
//                                   item?.ItemDetails?.packageGuestCount[index]
//                                 : "N/A"} */}
//                             </p>
//                           ))}
//                         </td>
//                       </tr>

//                       {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
//                         item?.TeensPrice > 0 && (
//                           <tr>
//                             <td
//                               style={{ textAlign: "center" }}
//                               className="BillPrintFont"
//                             >
//                               <p>Kids</p>
//                             </td>

//                             <td
//                               style={{ textAlign: "center" }}
//                               className="BillPrintFont"
//                             >
//                               {item?.NumOfTeens}
//                             </td>

//                             <td
//                               style={{ textAlign: "right" }}
//                               className="BillPrintFont"
//                             >
//                               {item?.TeensRate &&
//                                 item?.NumOfTeens &&
//                                 Math.floor(
//                                   (item.TeensRate / item.NumOfTeens) * 100
//                                 ) / 100}
//                             </td>

//                             <td
//                               style={{ textAlign: "right" }}
//                               className="BillPrintFont"
//                             >
//                               {item?.TeensRate &&
//                                 Math.floor(item.TeensRate * 100) / 100}
//                             </td>
//                           </tr>
//                         )}
//                     </tbody>
//                   </table>

//                   <div className="totals" style={{ textAlign: "right" }}>
//                     {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
//                       <h6 className="BillPrintFont ">
//                         Total Amount :
//                         {item?.ItemDetails?.ActualAmount -
//                           item?.ItemDetails?.AmountAfterDiscount ==
//                         0 ? (
//                           <span className="BillPrintFont">
//                             {/* {parseFloat(
//                               item?.ItemDetails?.packageGuestCount
//                                 .reduce((acc, count, index) => {
//                                   return (
//                                     acc +
//                                     count *
//                                       item?.ItemDetails?.Rate[index].toFixed(2)
//                                   );
//                                 }, 0)
//                                 .toFixed(2)
//                             )} */}
//                             {parseFloat(
//                               item?.ItemDetails?.packageGuestCount
//                                 .reduce((acc, count, index) => {
//                                   return (
//                                     acc +
//                                     parseFloat(
//                                       (
//                                         count *
//                                         parseFloat(
//                                           parseFloat(
//                                             item?.ItemDetails?.Rate[index]
//                                           ).toFixed(2)
//                                         )
//                                       ).toFixed(2)
//                                     )
//                                   );
//                                 }, 0)
//                                 .toFixed(2)
//                             )}
//                           </span>
//                         ) : (
//                           // item?.ItemDetails?.Rate.map((rate, index) => (
//                           //   <span key={index} className="BillPrintFont">
//                           //     {parseFloat(rate).toFixed(2)}
//                           //   </span>
//                           // ))
//                           <span className="BillPrintFont">
//                             {" "}
//                             {(parseFloat(
//                               item?.ItemDetails?.packageGuestCount.reduce(
//                                 (acc, count, index) =>
//                                   acc + count * item?.ItemDetails?.Rate[index],
//                                 0
//                               ) + (item?.TeensRate || 0)
//                             ).toFixed(2) *
//                               100) /
//                               100}
//                           </span>
//                         )}
//                       </h6>
//                     ) : (
//                       <h6 className="BillPrintFont">
//                         Total Amount :
//                         {item?.ItemDetails && (
//                           <span className="BillPrintFont">
//                             {(parseFloat(
//                               item?.ItemDetails?.packageGuestCount
//                                 .reduce(
//                                   (acc, count, index) =>
//                                     acc +
//                                     count * item?.ItemDetails?.Rate[index],
//                                   0
//                                 )
//                                 .toFixed(2)
//                             ) *
//                               100) /
//                               100}
//                           </span>
//                         )}
//                       </h6>
//                     )}

//                     {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
//                     item?.TeensPrice > 0 ? (
//                       <>
//                         {item?.ItemDetails?.TaxDiff ? (
//                           <>
//                             <h6 className="BillPrintFont">
//                               CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
//                               {((
//                                 (item?.ItemDetails?.packageGuestCount &&
//                                 item?.ItemDetails?.TaxDiff
//                                   ? item.ItemDetails.packageGuestCount.reduce(
//                                       (total, count, index) =>
//                                         total +
//                                         count * item.ItemDetails.TaxDiff[index],
//                                       0
//                                     )
//                                   : 0) / 2
//                               ).toFixed(2) *
//                                 100) /
//                                 100}
//                             </h6>
//                             <h6 className="BillPrintFont">
//                               SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
//                               {((
//                                 (item?.ItemDetails?.packageGuestCount &&
//                                 item?.ItemDetails?.TaxDiff
//                                   ? item.ItemDetails.packageGuestCount.reduce(
//                                       (total, count, index) =>
//                                         total +
//                                         count * item.ItemDetails.TaxDiff[index],
//                                       0
//                                     )
//                                   : 0) / 2
//                               ).toFixed(2) *
//                                 100) /
//                                 100}
//                             </h6>{" "}
//                           </>
//                         ) : (
//                           <></>
//                         )}
//                         <h6 className="BillPrintFont">
//                           CGST {item?.TeensTax / 2} %:{" "}
//                           {((item?.TeensTaxBifurcation / 2).toFixed(2) * 100) /
//                             100}
//                         </h6>
//                         <h6 className="BillPrintFont">
//                           SGST {item?.TeensTax / 2} %:
//                           {((item?.TeensTaxBifurcation / 2).toFixed(2) * 100) /
//                             100}
//                         </h6>

//                         <h6 className="BillPrintFont">
//                           Bill Amount :{" "}
//                           {item?.ItemDetails && (
//                             <span>
//                               {(parseFloat(
//                                 item?.ItemDetails?.packageGuestCount.reduce(
//                                   (acc, count, index) =>
//                                     acc +
//                                     count * item?.ItemDetails?.Price[index],
//                                   0
//                                 ) +
//                                   (item?.TeensPrice || 0) -
//                                   totalDiscount
//                               ).toFixed(2) *
//                                 100) /
//                                 100}
//                             </span>
//                           )}
//                         </h6>
//                       </>
//                     ) : (
//                       <>
//                         {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
//                           <>
//                             {!item?.ItemDetails?.TaxBifurcation ? (
//                               <>
//                                 <h6>
//                                   CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
//                                   {((
//                                     (item?.ItemDetails?.packageGuestCount &&
//                                     item?.ItemDetails?.TaxDiff
//                                       ? item.ItemDetails.packageGuestCount.reduce(
//                                           (total, count, index) =>
//                                             total +
//                                             count *
//                                               item.ItemDetails.TaxDiff[index],
//                                           0
//                                         )
//                                       : 0) / 2
//                                   ).toFixed(2) *
//                                     100) /
//                                     100}
//                                 </h6>

//                                 <h6>
//                                   SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
//                                   {((
//                                     (item?.ItemDetails?.packageGuestCount &&
//                                     item?.ItemDetails?.TaxDiff
//                                       ? item.ItemDetails.packageGuestCount.reduce(
//                                           (total, count, index) =>
//                                             total +
//                                             count *
//                                               item.ItemDetails.TaxDiff[index],
//                                           0
//                                         )
//                                       : 0) / 2
//                                   ).toFixed(2) *
//                                     100) /
//                                     100}
//                                 </h6>
//                               </>
//                             ) : (
//                               <>
//                                 <h6>
//                                   CGST {item?.ItemDetails.ItemTax / 2} %:
//                                   {item?.ItemDetails?.packageGuestCount &&
//                                   item?.ItemDetails?.TaxBifurcation
//                                     ? ((
//                                         item.ItemDetails.packageGuestCount.reduce(
//                                           (total, count, index) =>
//                                             total +
//                                             count *
//                                               item.ItemDetails.TaxBifurcation[
//                                                 index
//                                               ],
//                                           0
//                                         ) / 2
//                                       ).toFixed(2) *
//                                         100) /
//                                       100
//                                     : 0}
//                                 </h6>

//                                 <h6>
//                                   SGST {item?.ItemDetails.ItemTax / 2} %:
//                                   {item?.ItemDetails?.packageGuestCount &&
//                                   item?.ItemDetails?.TaxBifurcation
//                                     ? ((
//                                         item.ItemDetails.packageGuestCount.reduce(
//                                           (total, count, index) =>
//                                             total +
//                                             count *
//                                               item.ItemDetails.TaxBifurcation[
//                                                 index
//                                               ],
//                                           0
//                                         ) / 2
//                                       ).toFixed(2) *
//                                         100) /
//                                       100
//                                     : "0"}
//                                 </h6>
//                               </>
//                             )}
//                           </>
//                         ) : item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
//                           <h6 className="BillPrintFont">
//                             VAT {item?.ItemDetails.ItemTax}%:
//                             {item?.ItemDetails?.packageGuestCount &&
//                             item?.ItemDetails?.TaxDiff
//                               ? (item.ItemDetails.packageGuestCount
//                                   .reduce(
//                                     (total, count, index) =>
//                                       total +
//                                       count * item.ItemDetails.TaxDiff[index],
//                                     0
//                                   )
//                                   .toFixed(2) *
//                                   100) /
//                                 100
//                               : "0"}
//                           </h6>
//                         ) : (
//                           <h6 className="BillPrintFont">
//                             {/* {item?.ItemDetails?.ItemTaxName[0]}{" "}
//                               {item?.ItemDetails.ItemTax} %:{" "}
//                               {(
//                                 item?.ItemDetails?.TaxDiff[0] *
//                                 item?.ItemDetails?.packageGuestCount
//                               ).toFixed(2)} */}
//                           </h6>
//                         )}

//                         {item?.ItemDetails?.IsDeductable[0] === 1 &&
//                         BookingDetails[0]?.AmountAfterDiscount > 0 ? (
//                           <>
//                             <h6 className="BillPrintFont">
//                               Bill Amount :{" "}
//                               {item?.ItemDetails && (
//                                 <span>
//                                   {(parseFloat(
//                                     item?.ItemDetails?.packageGuestCount.reduce(
//                                       (acc, count, index) =>
//                                         acc +
//                                         count * item?.ItemDetails?.Price[index],
//                                       0
//                                     ) -
//                                       (item?.ActualAmount -
//                                         item?.AmountAfterDiscount)
//                                   ).toFixed(2) *
//                                     100) /
//                                     100}
//                                 </span>
//                               )}
//                             </h6>
//                           </>
//                         ) : totalDiscount == 0 ? (
//                           <h6 className="BillPrintFont">
//                             Bill Amount :{" "}
//                             {item?.ItemDetails && (
//                               <span>
//                                 {parseFloat(
//                                   (item?.ItemDetails?.packageGuestCount
//                                     .reduce(
//                                       (acc, count, index) =>
//                                         acc +
//                                         count * item?.ItemDetails?.Price[index],
//                                       0
//                                     )
//                                     .toFixed(2) *
//                                     100) /
//                                     100
//                                 )}
//                               </span>
//                             )}
//                           </h6>
//                         ) : (
//                           <h6 className="BillPrintFont">
//                             Bill Amount :{" "}
//                             {item?.ItemDetails && (
//                               <span>
//                                 {parseFloat(
//                                   (item?.ItemDetails?.packageGuestCount
//                                     .reduce(
//                                       (acc, count, index) =>
//                                         acc +
//                                         count * item?.ItemDetails?.Price[index],
//                                       0
//                                     )
//                                     .toFixed(2) *
//                                     100) /
//                                     100
//                                 )}
//                               </span>
//                             )}
//                           </h6>
//                         )}
//                       </>
//                     )}
//                   </div>
//                   <div
//                     className="terms"
//                     style={{ marginTop: "10px", textAlign: "center" }}
//                   >
//                     <h6
//                       style={{
//                         textAlign: "center",
//                         fontSize: "12px",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       TERMS AND CONDITIONS
//                     </h6>
//                     <p style={{ fontSize: "10px", fontWeight: "bold" }}>
//                       (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM 8:00PM
//                       TO 1:30AM DURING WEEKDAYS.
//                     </p>
//                     <p style={{ fontSize: "10px", fontWeight: "bold" }}>
//                       (2) BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:00PM
//                       TO 2:00AM DURING WEEKEND.
//                     </p>
//                     <p style={{ fontSize: "10px", fontWeight: "bold" }}>
//                       (3) ANY PERSON ABOVE 21 YEARS OLD INTEND TO PLAY MAY ENTER
//                       GAMING AREA & PURCHASE CHIPS SEPARATELY.
//                     </p>
//                     <p style={{ fontSize: "10px", fontWeight: "bold" }}>
//                       (4) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR, GAMING CHIPS
//                       OR ANY OTHER SERVICES. HOWEVER, LIMITED COUPONS APPLIED ON
//                       SELECTIVE LIQUOR PACKAGES.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>

//         <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
//           <button
//             style={{ paddingLeft: "100px", paddingRight: "100px" }}
//             type="submit"
//             className="btn btn_colour mt-5 btn-lg"
//             onClick={handlePrint}
//           >
//             Print
//           </button>
//         </div>
//       </div>
//       <div>
//         <ToastContainer />
//         {loader ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//             }}
//           >
//             <Oval
//               height={80}
//               width={50}
//               color="#4fa94d"
//               visible={true}
//               ariaLabel="oval-loading"
//               secondaryColor="#4fa94d"
//               strokeWidth={2}
//               strokeWidthSecondary={2}
//             />
//           </div>
//         ) : (
//           <></>
//         )}

//         <div style={{ marginTop: "2000px" }}>
//           {!printLoader ? (
//             <div className="ticket" ref={printableContentRef}>
//               {BookingDetails &&
//                 BookingDetails?.map((item) => (
//                   <div
//                     className="thermal-bill"
//                     style={{
//                       backgroundColor: "white",
//                       width: "100%",
//                       padding: "2%",
//                     }}
//                   >
//                     <div className="row">
//                       <div className="col-lg-4"></div>
//                       <div className="col-lg-4">
//                         <div className="text-center">
//                           <img
//                             src={logo}
//                             alt="Casino Pride Logo"
//                             className="logo-imagePrint"
//                           />
//                         </div>
//                       </div>
//                       <div className="col-lg-4"></div>
//                     </div>

//                     <p
//                       className="BillPrintFontPrint"
//                       style={{
//                         marginBottom: "5px",
//                       }}
//                     >
//                       A unit of Goa Coastal Resorts & Recreation Pvt.Ltd
//                     </p>
//                     <h5
//                       className="BillPrintFontPrint"
//                       style={{
//                         marginBottom: "5px",
//                       }}
//                     >
//                       Hotel Neo Majestic, Plot No. 104/14, Porvorim, Bardez, Goa
//                       - 403 521 <br></br>Tel. + 91 9158885000
//                     </h5>
//                     <h5
//                       className="BillPrintFontPrint"
//                       style={{
//                         marginBottom: "5px",
//                       }}
//                     >
//                       Email : info@casinoprideofficial.com
//                     </h5>
//                     <h5
//                       className="BillPrintFontPrint"
//                       style={{
//                         marginBottom: "5px",
//                       }}
//                     >
//                       Website : www.casinoprideofficial.com
//                     </h5>
//                     <h5
//                       className="BillPrintFontPrint"
//                       style={{
//                         marginBottom: "5px",
//                       }}
//                     >
//                       Instagram :casinoprideofficial
//                     </h5>
//                     <h5
//                       className="BillPrintFontPrint"
//                       style={{
//                         marginBottom: "5px",
//                       }}
//                     >
//                       CIN No: U55101GA2005PTC004274{" "}
//                     </h5>
//                     <h5
//                       className="BillPrintFontPrint"
//                       style={{
//                         marginBottom: "5px",
//                       }}
//                     >
//                       PAN No: AACCG7450R
//                     </h5>
//                     {item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
//                       <h5
//                         className="BillPrintFontPrint"
//                         style={{
//                           marginBottom: "5px",
//                           marginTop: "5px",
//                         }}
//                       >
//                         TIN No : 30220106332
//                       </h5>
//                     ) : (
//                       <></>
//                     )}
//                     {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
//                       <h5
//                         className="BillPrintFontPrint"
//                         style={{
//                           marginBottom: "5px",
//                         }}
//                       >
//                         GSTIN : 30AACCG7450R1ZC
//                       </h5>
//                     ) : (
//                       <></>
//                     )}
//                     <h5
//                       // style={{
//                       //   marginTop: "10px",
//                       //   marginBottom: "5px",
//                       //   fontSize: "14px",
//                       //   lineHeight: "14px",
//                       //   fontWeight: "bold",
//                       // }}
//                       className="taxinvoicename"
//                     >
//                       TAX INVOICE
//                     </h5>
//                     <div className="row">
//                       <div className="col-10  bill-details">
//                         <p
//                           className="BillPrintFontPrint"
//                           style={{ marginRight: "5px" }}
//                         >
//                           BILL#: {item.BillNumber}
//                         </p>
//                         <p className="BillPrintFontPrint">
//                           Guest Name :
//                           <span className="BillPrintFontPrint ">
//                             {item.GuestName}
//                           </span>{" "}
//                         </p>
//                         {item.guestGSTIN ? (
//                           <p className="BillPrintFontPrint">
//                             Guest GSTIN :{" "}
//                             <span className="BillPrintFontPrint">
//                               {item.guestGSTIN}
//                             </span>
//                           </p>
//                         ) : (
//                           <></>
//                         )}
//                         <p className="BillPrintFontPrint">
//                           Guest Mobile :
//                           <span className="BillPrintFontPrint">
//                             {item.Phone}
//                           </span>
//                         </p>
//                         {item.State || item?.Address || item?.Country ? (
//                           <p className="BillPrintFontPrint">
//                             Guest Address:
//                             <span className="BillPrintFontPrint">
//                               {" "}
//                               {item?.Address} {item.State} {item?.Country}
//                             </span>
//                           </p>
//                         ) : (
//                           <></>
//                         )}

//                         <p className="BillPrintFontPrint">
//                           Number of Adults :{" "}
//                           <span className="BillPrintFontPrint">
//                             {item.TotalGuestCount -
//                               BookingDetails[0].NumOfTeens}
//                           </span>
//                         </p>

//                         {!BookingDetails[0].NumOfTeens == 0 ? (
//                           <p className="BillPrintFontPrint">
//                             Number of Kids :{" "}
//                             <span className="BillPrintFontPrint">
//                               {BookingDetails[0]?.NumOfTeens}
//                             </span>
//                           </p>
//                         ) : (
//                           <></>
//                         )}

//                         <p className="BillPrintFontPrint">
//                           Total Number of Guests :{" "}
//                           <span className="BillPrintFontPrint">
//                             {item?.TotalGuestCount}
//                           </span>
//                         </p>
//                       </div>
//                       {/* <div className="col-6">
//                         <div className="d-flex justify-content-end qr-code">
//                           {qrCodeImage && (
//                             <div className="qr-code-image">
//                               <img
//                                 src={qrCodeImage}
//                                 alt="QR Code"
//                                 style={{ width: "80px", height: "80px" }}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </div> */}
//                     </div>
//                     <div className="bill-details" style={{ marginTop: "10px" }}>
//                       <div className="date-time-bill-row">
//                         <p className="BillPrintFontPrint">
//                           Date & Time:
//                           <span className="BillPrintFontPrint">
//                             {" "}
//                             {moment
//                               .utc(item?.BillDateTime)
//                               .format("DD/MM/YYYY HH:mm")}
//                           </span>
//                         </p>
//                       </div>
//                       <hr />
//                       <table className="ticket_table ">
//                         <thead>
//                           <tr>
//                             <th style={{ textAlign: "center" }}>
//                               <p className="BillPrintFontPrintterms">
//                                 ITEM NAME
//                               </p>
//                             </th>
//                             <th style={{ textAlign: "center" }}>
//                               <p className="BillPrintFontPrintterms">
//                                 GUEST COUNT
//                               </p>
//                             </th>

//                             <th
//                               style={{
//                                 textAlign: "center",
//                               }}
//                             >
//                               <p
//                                 className="BillPrintFontPrintterms"
//                                 style={{ marginRight: "10px" }}
//                               >
//                                 {" "}
//                                 RATE
//                               </p>
//                             </th>
//                             <th style={{ textAlign: "center" }}>
//                               <p className="BillPrintFontPrintterms"> VALUE</p>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           <tr>
//                             <td style={{ textAlign: "center" }}>
//                               {item?.ItemDetails &&
//                                 item?.ItemDetails?.ItemName.map((item) => (
//                                   <p className="BillPrintFontPrint">{item}</p>
//                                 ))}
//                             </td>

//                             <td style={{ textAlign: "center" }}>
//                               {item?.ItemDetails &&
//                               item?.ItemDetails.packageGuestCount ? (
//                                 item.ItemDetails.packageGuestCount.map(
//                                   (guest, index) => (
//                                     <p
//                                       key={index}
//                                       className="BillPrintFontPrint"
//                                     >
//                                       {guest}
//                                     </p>
//                                   )
//                                 )
//                               ) : (
//                                 <p>No data</p>
//                               )}
//                             </td>

//                             <td
//                               style={{
//                                 textAlign: "right",
//                               }}
//                             >
//                               {item?.ItemDetails &&
//                                 item?.ItemDetails?.Rate.map((item) => (
//                                   <p
//                                     className="BillPrintFontPrint"
//                                     style={{ marginRight: "10px" }}
//                                   >
//                                     {item && parseFloat(item).toFixed(2)}
//                                   </p>
//                                 ))}
//                             </td>

//                             <td style={{ textAlign: "right" }}>
//                               {item?.ItemDetails?.Rate.map((rate, index) => (
//                                 <p key={index} className="BillPrintFontPrint">
//                                   {rate &&
//                                   item?.ItemDetails?.packageGuestCount[index]
//                                     ? (
//                                         parseFloat(rate).toFixed(2) *
//                                         item?.ItemDetails?.packageGuestCount[
//                                           index
//                                         ]
//                                       ).toFixed(2)
//                                     : "N/A"}
//                                 </p>
//                               ))}
//                             </td>
//                           </tr>

//                           {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
//                             item?.TeensPrice > 0 && (
//                               <tr>
//                                 <td style={{ textAlign: "center" }}>
//                                   <p className="BillPrintFontPrint">Kids</p>
//                                 </td>

//                                 <td
//                                   style={{ textAlign: "center" }}
//                                   className="BillPrintFontPrint"
//                                 >
//                                   <p className="BillPrintFontPrint">
//                                     {item?.NumOfTeens}
//                                   </p>
//                                 </td>

//                                 <td style={{ textAlign: "right" }}>
//                                   <p className="BillPrintFontPrint">
//                                     {item?.TeensRate &&
//                                       item?.NumOfTeens &&
//                                       Math.floor(
//                                         (item.TeensRate / item.NumOfTeens) * 100
//                                       ) / 100}
//                                   </p>
//                                 </td>

//                                 <td style={{ textAlign: "right" }}>
//                                   <p className="BillPrintFontPrint">
//                                     {" "}
//                                     {item?.TeensRate &&
//                                       Math.floor(item.TeensRate * 100) / 100}
//                                   </p>
//                                 </td>
//                               </tr>
//                             )}
//                         </tbody>
//                       </table>

//                       <div className="totals" style={{ textAlign: "right" }}>
//                         {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
//                           <h6 className="BillPrintFontPrint ">
//                             Total Amount :
//                             {item?.ItemDetails?.ActualAmount -
//                               item?.ItemDetails?.AmountAfterDiscount ==
//                             0 ? (
//                               <span className="BillPrintFontPrint">
//                                 {parseFloat(
//                                   item?.ItemDetails?.packageGuestCount
//                                     .reduce((acc, count, index) => {
//                                       return (
//                                         acc +
//                                         parseFloat(
//                                           (
//                                             count *
//                                             parseFloat(
//                                               parseFloat(
//                                                 item?.ItemDetails?.Rate[index]
//                                               ).toFixed(2)
//                                             )
//                                           ).toFixed(2)
//                                         )
//                                       );
//                                     }, 0)
//                                     .toFixed(2)
//                                 )}
//                               </span>
//                             ) : (
//                               <span className="BillPrintFontPrint">
//                                 {(parseFloat(
//                                   item?.ItemDetails?.packageGuestCount.reduce(
//                                     (acc, count, index) =>
//                                       acc +
//                                       count * item?.ItemDetails?.Rate[index],
//                                     0
//                                   ) + (item?.TeensRate || 0)
//                                 ).toFixed(2) *
//                                   100) /
//                                   100}
//                               </span>
//                             )}
//                           </h6>
//                         ) : (
//                           <h6 className="BillPrintFontPrint">
//                             Total Amount :
//                             {item?.ItemDetails && (
//                               <span className="BillPrintFontPrint">
//                                 {(parseFloat(
//                                   item?.ItemDetails?.packageGuestCount
//                                     .reduce(
//                                       (acc, count, index) =>
//                                         acc +
//                                         count * item?.ItemDetails?.Rate[index],
//                                       0
//                                     )
//                                     .toFixed(2)
//                                 ) *
//                                   100) /
//                                   100}
//                               </span>
//                             )}
//                           </h6>
//                         )}

//                         {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
//                         item?.TeensPrice > 0 ? (
//                           <>
//                             {item?.ItemDetails?.TaxDiff ? (
//                               <>
//                                 <h6 className="BillPrintFontPrint">
//                                   CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
//                                   {((
//                                     (item?.ItemDetails?.packageGuestCount &&
//                                     item?.ItemDetails?.TaxDiff
//                                       ? item.ItemDetails.packageGuestCount.reduce(
//                                           (total, count, index) =>
//                                             total +
//                                             count *
//                                               item.ItemDetails.TaxDiff[index],
//                                           0
//                                         )
//                                       : 0) / 2
//                                   ).toFixed(2) *
//                                     100) /
//                                     100}
//                                 </h6>
//                                 <h6 className="BillPrintFontPrint">
//                                   SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
//                                   {((
//                                     (item?.ItemDetails?.packageGuestCount &&
//                                     item?.ItemDetails?.TaxDiff
//                                       ? item.ItemDetails.packageGuestCount.reduce(
//                                           (total, count, index) =>
//                                             total +
//                                             count *
//                                               item.ItemDetails.TaxDiff[index],
//                                           0
//                                         )
//                                       : 0) / 2
//                                   ).toFixed(2) *
//                                     100) /
//                                     100}
//                                 </h6>{" "}
//                               </>
//                             ) : (
//                               <></>
//                             )}
//                             <h6 className="BillPrintFontPrint">
//                               CGST {item?.TeensTax / 2} %:{" "}
//                               {((item?.TeensTaxBifurcation / 2).toFixed(2) *
//                                 100) /
//                                 100}
//                             </h6>
//                             <h6 className="BillPrintFontPrint">
//                               SGST {item?.TeensTax / 2} %:
//                               {((item?.TeensTaxBifurcation / 2).toFixed(2) *
//                                 100) /
//                                 100}
//                             </h6>

//                             <h6 className="BillPrintFontPrint">
//                               Bill Amount :{" "}
//                               {item?.ItemDetails && (
//                                 <span>
//                                   {(parseFloat(
//                                     item?.ItemDetails?.packageGuestCount.reduce(
//                                       (acc, count, index) =>
//                                         acc +
//                                         count * item?.ItemDetails?.Price[index],
//                                       0
//                                     ) +
//                                       (item?.TeensPrice || 0) -
//                                       totalDiscount
//                                   ).toFixed(2) *
//                                     100) /
//                                     100}
//                                 </span>
//                               )}
//                             </h6>
//                           </>
//                         ) : (
//                           <>
//                             {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
//                               <>
//                                 {!item?.ItemDetails?.TaxBifurcation ? (
//                                   <>
//                                     <h6 className="BillPrintFontPrint">
//                                       CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
//                                       {((
//                                         (item?.ItemDetails?.packageGuestCount &&
//                                         item?.ItemDetails?.TaxDiff
//                                           ? item.ItemDetails.packageGuestCount.reduce(
//                                               (total, count, index) =>
//                                                 total +
//                                                 count *
//                                                   item.ItemDetails.TaxDiff[
//                                                     index
//                                                   ],
//                                               0
//                                             )
//                                           : 0) / 2
//                                       ).toFixed(2) *
//                                         100) /
//                                         100}
//                                     </h6>

//                                     <h6 className="BillPrintFontPrint">
//                                       SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
//                                       {((
//                                         (item?.ItemDetails?.packageGuestCount &&
//                                         item?.ItemDetails?.TaxDiff
//                                           ? item.ItemDetails.packageGuestCount.reduce(
//                                               (total, count, index) =>
//                                                 total +
//                                                 count *
//                                                   item.ItemDetails.TaxDiff[
//                                                     index
//                                                   ],
//                                               0
//                                             )
//                                           : 0) / 2
//                                       ).toFixed(2) *
//                                         100) /
//                                         100}
//                                     </h6>
//                                   </>
//                                 ) : (
//                                   <>
//                                     <h6 className="BillPrintFontPrint">
//                                       CGST {item?.ItemDetails.ItemTax / 2} %:
//                                       {item?.ItemDetails?.packageGuestCount &&
//                                       item?.ItemDetails?.TaxBifurcation
//                                         ? ((
//                                             item.ItemDetails.packageGuestCount.reduce(
//                                               (total, count, index) =>
//                                                 total +
//                                                 count *
//                                                   item.ItemDetails
//                                                     .TaxBifurcation[index],
//                                               0
//                                             ) / 2
//                                           ).toFixed(2) *
//                                             100) /
//                                           100
//                                         : 0}
//                                     </h6>

//                                     <h6 className="BillPrintFontPrint">
//                                       SGST {item?.ItemDetails.ItemTax / 2} %:
//                                       {item?.ItemDetails?.packageGuestCount &&
//                                       item?.ItemDetails?.TaxBifurcation
//                                         ? ((
//                                             item.ItemDetails.packageGuestCount.reduce(
//                                               (total, count, index) =>
//                                                 total +
//                                                 count *
//                                                   item.ItemDetails
//                                                     .TaxBifurcation[index],
//                                               0
//                                             ) / 2
//                                           ).toFixed(2) *
//                                             100) /
//                                           100
//                                         : "0"}
//                                     </h6>
//                                   </>
//                                 )}
//                               </>
//                             ) : item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
//                               <h6 className="BillPrintFontPrint">
//                                 VAT {item?.ItemDetails.ItemTax}%:
//                                 {item?.ItemDetails?.packageGuestCount &&
//                                 item?.ItemDetails?.TaxDiff
//                                   ? (item.ItemDetails.packageGuestCount
//                                       .reduce(
//                                         (total, count, index) =>
//                                           total +
//                                           count *
//                                             item.ItemDetails.TaxDiff[index],
//                                         0
//                                       )
//                                       .toFixed(2) *
//                                       100) /
//                                     100
//                                   : "0"}
//                               </h6>
//                             ) : (
//                               <h6 className="BillPrintFontPrint"></h6>
//                             )}

//                             {item?.ItemDetails?.IsDeductable[0] === 1 &&
//                             BookingDetails[0]?.AmountAfterDiscount > 0 ? (
//                               <>
//                                 <h6 className="BillPrintFontPrint">
//                                   Bill Amount :{" "}
//                                   {item?.ItemDetails && (
//                                     <span>
//                                       {(parseFloat(
//                                         item?.ItemDetails?.packageGuestCount.reduce(
//                                           (acc, count, index) =>
//                                             acc +
//                                             count *
//                                               item?.ItemDetails?.Price[index],
//                                           0
//                                         ) -
//                                           (item?.ActualAmount -
//                                             item?.AmountAfterDiscount)
//                                       ).toFixed(2) *
//                                         100) /
//                                         100}
//                                     </span>
//                                   )}
//                                 </h6>
//                               </>
//                             ) : totalDiscount == 0 ? (
//                               <h6 className="BillPrintFontPrint">
//                                 Bill Amount :{" "}
//                                 {parseFloat(
//                                   (item?.ItemDetails?.packageGuestCount
//                                     .reduce(
//                                       (acc, count, index) =>
//                                         acc +
//                                         count * item?.ItemDetails?.Price[index],
//                                       0
//                                     )
//                                     .toFixed(2) *
//                                     100) /
//                                     100
//                                 )}
//                               </h6>
//                             ) : (
//                               <h6 className="BillPrintFontPrint">
//                                 Bill Amount :{" "}
//                                 {item?.ItemDetails && (
//                                   <span>
//                                     {parseFloat(
//                                       (item?.ItemDetails?.packageGuestCount
//                                         .reduce(
//                                           (acc, count, index) =>
//                                             acc +
//                                             count *
//                                               item?.ItemDetails?.Price[index],
//                                           0
//                                         )
//                                         .toFixed(2) *
//                                         100) /
//                                         100
//                                     )}
//                                   </span>
//                                 )}
//                               </h6>
//                             )}
//                           </>
//                         )}
//                       </div>
//                       <div
//                         className="terms"
//                         style={{ marginTop: "10px", textAlign: "center" }}
//                       >
//                         <h6 className="BillPrintFontPrintterms">
//                           TERMS AND CONDITIONS
//                         </h6>
//                         <p className="BillPrintFontPrintterms">
//                           (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM
//                           8:00PM TO 1:30AM DURING WEEKDAYS.
//                         </p>
//                         <p className="BillPrintFontPrintterms">
//                           (2) BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM
//                           8:00PM TO 2:00AM DURING WEEKEND.
//                         </p>
//                         <p className="BillPrintFontPrintterms">
//                           (3) ANY PERSON ABOVE 21 YEARS OLD INTEND TO PLAY MAY
//                           ENTER GAMING AREA & PURCHASE CHIPS SEPARATELY.
//                         </p>
//                         <p className="BillPrintFontPrintterms">
//                           (4) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR, GAMING
//                           CHIPS OR ANY OTHER SERVICES. HOWEVER, LIMITED COUPONS
//                           APPLIED ON SELECTIVE LIQUOR PACKAGES.
//                         </p>
//                       </div>

//                       <div className="col-12">
//                         <div className="d-flex justify-content-center qr-code">
//                           {qrCodeImage && (
//                             <div className="qr-code-image text-center">
//                               <img
//                                 src={qrCodeImage}
//                                 alt="QR Code"
//                                 style={{ width: "100px", height: "100px" }}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           ) : (
//             <></>
//           )}
//         </div>

//         {/* <ReactToPrint
//           trigger={() => <button onClick={sendPrintFn}>Print</button>}
//           content={() => printableContentRef.current}
//         /> */}

//         {/* <div>
//           <button onClick={handlePrint}>Print this out!</button>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default BillingDetails;

//not to fixed
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

const BillingDetails = () => {
  const printableContentRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType } = location.state;
  const { userData } = location.state;
  const { BookingDetails } = location.state;
  const [loader, setLoader] = useState(false);

  const sourcePage = location.state?.sourcePage || "";

  console.log("sourcePage-------------->", sourcePage);

  const loginDetails = useSelector(
    (state) => state.auth?.userDetailsAfterLogin.Details
  );

  console.log("Data to be passed as sms------------------->", BookingDetails);

  const DiscountedAmount =
    BookingDetails[0]?.ActualAmount - BookingDetails[0]?.AmountAfterDiscount;

  const FinalAmount = BookingDetails[0]?.ActualAmount - DiscountedAmount;

  console.log("DiscountedAmount---->", BookingDetails[0]?.ActualAmount);

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
                console.log(
                  "callback?.response?.Details[0]--->",
                  callback?.response?.Details[0]?.Bill
                );
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

                        let shortUrl = callback?.response?.shortUrl;
                      

                        const apiUrl = `https://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${BookingDetails[0]?.Phone}&text=Thank%20you%20for%20choosing%20Casino%20Pride.%20View%20e-bill%20of%20Rs%20${FinalAmount}%20at%20-%20${shortUrl}%0ALets%20Play%20with%20Pride%20!%0AGood%20luck%20!%0ACPGOAA`;

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

  const updatededBillDetails = {
    updatedItemDetails: BookingDetails.map((item) => {
      console.log("okiiiii>>>", item);
      const Rate = item?.ItemDetails?.Rate;
      const packageGuestCount = item?.ItemDetails?.packageGuestCount;
      //adding cash, card, UPI details
      const CashAmount =
        item?.SettledByCompany == 0 &&
        ((item?.PayAtCounter == 1 && item?.UserTypeId == 5) ||
          (item?.PayAtCounter != 1 &&
            (item?.UserTypeId != 0 ||
              item?.UserTypeId != 5 ||
              item?.UserTypeId != 6)))
          ? item?.CashAmount
          : 0;

      const CardAmount =
        item?.SettledByCompany == 0 &&
        ((item?.PayAtCounter == 1 && item?.UserTypeId == 5) ||
          (item?.PayAtCounter != 1 &&
            (item?.UserTypeId != 0 ||
            item?.UserTypeId != 5 ||
            item?.UserTypeId != 6)))
          ? item?.CardAmount
          : 0;

      const UPIAmount =
        item?.SettledByCompany == 0 &&
        ((item?.PayAtCounter == 1 && item?.UserTypeId == 5) ||
          (item?.PayAtCounter != 1 &&
            (item?.UserTypeId != 0 ||
            item?.UserTypeId != 5 ||
            item?.UserTypeId != 6)))
          ? item?.UPIAmount
          : 0;

      const UPIId = item?.UPIId;
      const CardHoldersName = item?.CardHoldersName;
      const CardNumber = item?.CardNumber;
      const CardType = item?.CardType;
      const BookingCommision = item?.BookingCommision;
      const SettledByCompany =
        item?.SettledByCompany == 1
          ? item?.CashAmount + item?.CardAmount + item?.UPIAmount != 0
            ? item?.CashAmount + item?.CardAmount + item?.UPIAmount
            : item?.AmountAfterDiscount
          : 0;

      const OnlinePayu =
        item?.PaymentMode === "OnlinePayu"
          ? item?.AmountAfterDiscount
          : 0;
      const resultRate = Rate.map(
        (value, index) => value * packageGuestCount[index]
      );

      console.log("Result Rate----->", resultRate);

      const FinalRateResult = resultRate.reduce((acc, item) => acc + item, 0);

      console.log("Reuslted rate------->", FinalRateResult);

      console.log("tax biff ---->", item?.ItemDetails?.TaxDiff);

      const taxDiffArray = item?.ItemDetails?.TaxDiff;
      const packageGuestCountArray = item?.ItemDetails?.packageGuestCount;

      const total = taxDiffArray
        .map((taxDiff, index) => {
          const packageGuestCount = packageGuestCountArray[index];
          return taxDiff * packageGuestCount;
        })
        .reduce((acc, value) => acc + value, 0);

      console.log("totalllll--->", total);

      const Price = item?.ItemDetails?.Price;
      const resultPrice = Price.map(
        (value, index) => value * packageGuestCount[index]
      );

      const TotalBillAmount = resultPrice.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      console.log("Result price----->", resultPrice);

      const multipliedArray = resultPrice.map(
        (price, index) => price * packageGuestCount[index]
      );

      const finalResultPrice = multipliedArray.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      // const finalResultPrice = resultPrice.reduce(
      //   (accumulator, currentValue) => accumulator + currentValue,
      //   0
      // );

      console.log("finalResultPrice--->", finalResultPrice);
      const ActualAmount = item?.ActualAmount;
      const AmountAfterDiscount = item?.AmountAfterDiscount;

      const Discount = ActualAmount - AmountAfterDiscount;

      const DiscountedFigure = finalResultPrice - Discount;

      console.log("DiscountedFigure------------->", DiscountedFigure);

      const taxDiffSum = item?.ItemDetails?.TaxDiff.reduce(
        (acc, value) => acc + value,
        0
      );

      const multipliedTaxDiff = item?.ItemDetails?.TaxDiff.map(
        (tax, index) => tax * packageGuestCountArray[index]
      );

      const finalTaxDiffSum = multipliedTaxDiff.reduce(
        (acc, value) => acc + value,
        0
      );

      console.log("taxDiffSum", finalTaxDiffSum);

      const itemTaxName = item?.ItemDetails?.ItemTaxName;
      const adjustedTaxDiffSum =
        itemTaxName[0] === "GST" ? taxDiffSum / 2 : taxDiffSum;

      console.log("adjusted Tax Diff Sum----->", adjustedTaxDiffSum);
      const itemTeensTaxName = item?.TeensTaxName;
      console.log("Teens Tax name", itemTeensTaxName);

      // const KidsItemName = "Kids";
      const KidsItemName = "Entry,Food";

      const KidsCount = item?.NumOfTeens;
      console.log("Kids count==>", KidsCount);
      const KidsRate = item?.TeensRate;
      console.log("Kids rate", KidsRate);

      const KidsPrice = item?.TeensPrice;

      const KidsCgstProperty = `Kids CGST ${item?.TeensTax / 2} %`;
      console.log("Kids cgst", KidsCgstProperty);

      const KidsSgstProperty = `Kids SGST ${item?.TeensTax / 2} %`;
      console.log("Kids sgst", KidsSgstProperty);

      const KidsTaxPercentage = item?.TeensTax;
      const KidsTax = item?.TeensTaxBifurcation / KidsCount;

      const TotalKidsplusAdults = TotalBillAmount + KidsPrice;

      console.log("Kids Price>>>>>>---->>>>", KidsPrice);
      console.log("TotalBillAmount========>>>", TotalBillAmount);
      console.log("TotalKidsplusAdult-------->", TotalKidsplusAdults);
      console.log("Discount<<<<<<<-------->>>>>", Discount);

      // Define dynamic property names
      const cgstProperty = `CGST ${item?.ItemDetails?.ItemTax / 2} %`;
      const sgstProperty = `SGST ${item?.ItemDetails?.ItemTax / 2} %`;
      const vatProperty = `VAT ${item?.ItemDetails?.ItemTax} %`;

      // Using a for loop to add the values
      // const taxBifurcation = item?.ItemDetails?.TaxBifurcation
      let sumWhenDiscount = 0;
      for (let i = 0; i < item?.ItemDetails?.TaxBifurcation?.length; i++) {
        console.log(
          "item?.ItemDetails?.packageGuestCount?.length>>",
          item?.ItemDetails?.packageGuestCount?.length
        );
        if (
          item?.ItemDetails?.packageGuestCount?.length > 1 &&
          item?.NumOfTeens == 0
        ) {
          console.log("ooo");
          sumWhenDiscount +=
            item?.ItemDetails?.TaxBifurcation[i] *
            item?.ItemDetails?.packageGuestCount[i];
        } else if (
          item?.ItemDetails?.packageGuestCount?.length == 1 &&
          item?.ItemDetails?.packageGuestCount[i] == 1 &&
          item?.NumOfTeens == 0
        ) {
          console.log("bbb");
          sumWhenDiscount += item?.ItemDetails?.TaxBifurcation[i] / 2;
        } else if (
          item?.ItemDetails?.packageGuestCount?.length == 1 &&
          item?.ItemDetails?.packageGuestCount[i] > 1 &&
          item?.NumOfTeens == 0
        ) {
          console.log("sss");
          // sumWhenDiscount += item?.ItemDetails?.TaxBifurcation[i];
          sumWhenDiscount +=
            (item?.ItemDetails?.packageGuestCount[i] *
              item?.ItemDetails?.TaxBifurcation[i]) /
            2;
        } else if (
          item?.ItemDetails?.packageGuestCount?.length == 1 &&
          item?.ItemDetails?.packageGuestCount[i] > 1 &&
          item?.NumOfTeens == 0
        ) {
          console.log("vvv");
          sumWhenDiscount += item?.ItemDetails?.TaxBifurcation[i];
        } else if (
          item?.ItemDetails?.packageGuestCount?.length == 1 &&
          item?.ItemDetails?.packageGuestCount[i] > 1 &&
          item?.NumOfTeens > 0
        ) {
          console.log("mmm");
          sumWhenDiscount +=
            (item?.ItemDetails?.TaxBifurcation[i] *
              item?.ItemDetails?.packageGuestCount[i]) /
            2;
        } else if (
          item?.ItemDetails?.packageGuestCount?.length == 1 &&
          item?.ItemDetails?.packageGuestCount[i] == 1 &&
          item?.NumOfTeens > 0
        ) {
          console.log("ppp");
          sumWhenDiscount += item?.ItemDetails?.TaxBifurcation[i] / 2;
        }
        if (
          item?.ItemDetails?.packageGuestCount?.length > 1 &&
          item?.NumOfTeens > 0
        ) {
          console.log("qqq");
          sumWhenDiscount +=
            item?.ItemDetails?.TaxBifurcation[i] *
            item?.ItemDetails?.packageGuestCount[i];
        }
        // else{
        //   console.log('nnn');
        // sumWhenDiscount += item?.ItemDetails?.TaxBifurcation[i] / 2;
        // }
      }

      // Create an object to store the properties
      const properties = {
        ItemTax: item?.ItemDetails?.ItemTax,
        ItemId: item?.ItemDetails?.ItemId,
        ItemName: item?.ItemDetails?.ItemName,
        Price: finalResultPrice,
        KidsTax: KidsTax,
        // Rate: FinalRateResult,
        ItemTaxName: itemTaxName[0],
        TaxDiff: finalTaxDiffSum,
        IsDeductable: item?.ItemDetails?.IsDeductable,
        PackageId: item?.PackageId,
        packageGuestCount: packageGuestCount,
      };
      if (itemTaxName[0] === "GST") {
        if (KidsCount > 0) {
          if (
            KidsCount == 1 &&
            item?.ActualAmount - item?.AmountAfterDiscount > 0 &&
            JSON.parse(item?.PackageGuestCount).length == 1
          ) {
            console.log("okok");
            properties["KidsItemName"] = KidsItemName;
            properties["KidsCount"] = KidsCount;
            properties["KidsRate"] = KidsRate;
            properties["KidsPrice"] = KidsPrice;
            properties["KidsTax"] = KidsTaxPercentage;
            properties[KidsCgstProperty] = KidsTax / 2;
            properties[KidsSgstProperty] = KidsTax / 2;
            // properties[cgstProperty] = adjustedTaxDiffSum / 2;
            properties[cgstProperty] = sumWhenDiscount;
            // properties[sgstProperty] = adjustedTaxDiffSum / 2;
            properties[sgstProperty] = sumWhenDiscount;
            properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
            properties["Rate"] = FinalRateResult;
            properties["cashAmount"] = CashAmount;
            properties["cardAmount"] = CardAmount;
            properties["upiAmount"] = UPIAmount;
            properties["upiId"] = UPIId;
            properties["cardHoldersName"] = CardHoldersName;
            properties["cardNumber"] = CardNumber;
            properties["cardType"] = CardType;
            properties["bookingCommission"] = BookingCommision;
            properties["settledByCompany"] = SettledByCompany;
            properties["onlinePayu"] = OnlinePayu;
          } else if (
            KidsCount > 1 &&
            item?.ActualAmount - item?.AmountAfterDiscount > 0 &&
            JSON.parse(item?.PackageGuestCount).length == 1
          ) {
            console.log("pkpk");
            properties["KidsItemName"] = KidsItemName;
            properties["KidsCount"] = KidsCount;
            properties["KidsRate"] = KidsRate;
            properties["KidsPrice"] = KidsPrice;
            properties[KidsCgstProperty] = item?.TeensTaxBifurcation / 2;
            properties[KidsSgstProperty] = item?.TeensTaxBifurcation / 2;
            properties["KidsTax"] = KidsTaxPercentage;
            // properties[cgstProperty] = adjustedTaxDiffSum / 2;
            properties[cgstProperty] = sumWhenDiscount;
            // properties[sgstProperty] = adjustedTaxDiffSum / 2;
            properties[sgstProperty] = sumWhenDiscount;
            properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
            properties["Rate"] = FinalRateResult;
            properties["cashAmount"] = CashAmount;
            properties["cardAmount"] = CardAmount;
            properties["upiAmount"] = UPIAmount;
            properties["upiId"] = UPIId;
            properties["cardHoldersName"] = CardHoldersName;
            properties["cardNumber"] = CardNumber;
            properties["cardType"] = CardType;
            properties["bookingCommission"] = BookingCommision;
            properties["settledByCompany"] = SettledByCompany;
            properties["onlinePayu"] = OnlinePayu;
          } else if (
            KidsCount > 1 &&
            item?.ActualAmount - item?.AmountAfterDiscount > 0 &&
            JSON.parse(item?.PackageGuestCount).length > 1
          ) {
            console.log("nknk");
            properties["KidsItemName"] = KidsItemName;
            properties["KidsCount"] = KidsCount;
            properties["KidsRate"] = KidsRate;
            properties["KidsPrice"] = KidsPrice;
            properties[KidsCgstProperty] = item?.TeensTaxBifurcation / 2;
            properties["KidsTax"] = KidsTaxPercentage;
            properties[KidsSgstProperty] = item?.TeensTaxBifurcation / 2;
            // properties[cgstProperty] = adjustedTaxDiffSum / 2;
            properties[cgstProperty] = sumWhenDiscount / 2;
            // properties[sgstProperty] = adjustedTaxDiffSum / 2;
            properties[sgstProperty] = sumWhenDiscount / 2;
            properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
            properties["Rate"] = FinalRateResult;
            properties["cashAmount"] = CashAmount;
            properties["cardAmount"] = CardAmount;
            properties["upiAmount"] = UPIAmount;
            properties["upiId"] = UPIId;
            properties["cardHoldersName"] = CardHoldersName;
            properties["cardNumber"] = CardNumber;
            properties["cardType"] = CardType;
            properties["bookingCommission"] = BookingCommision;
            properties["settledByCompany"] = SettledByCompany;
            properties["onlinePayu"] = OnlinePayu;
          } else if (
            KidsCount == 1 &&
            item?.ActualAmount - item?.AmountAfterDiscount > 0 &&
            JSON.parse(item?.PackageGuestCount).length > 1
          ) {
            console.log("fkfk");
            properties["KidsItemName"] = KidsItemName;
            properties["KidsCount"] = KidsCount;
            properties["KidsRate"] = KidsRate;
            properties["KidsPrice"] = KidsPrice;
            properties[KidsCgstProperty] = item?.TeensTaxBifurcation / 2;
            properties[KidsSgstProperty] = item?.TeensTaxBifurcation / 2;
            properties["KidsTax"] = KidsTaxPercentage;
            // properties[cgstProperty] = adjustedTaxDiffSum / 2;
            properties[cgstProperty] = sumWhenDiscount / 2;
            // properties[sgstProperty] = adjustedTaxDiffSum / 2;
            properties[sgstProperty] = sumWhenDiscount / 2;
            properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
            properties["Rate"] = FinalRateResult;
            properties["cashAmount"] = CashAmount;
            properties["cardAmount"] = CardAmount;
            properties["upiAmount"] = UPIAmount;
            properties["upiId"] = UPIId;
            properties["cardHoldersName"] = CardHoldersName;
            properties["cardNumber"] = CardNumber;
            properties["cardType"] = CardType;
            properties["bookingCommission"] = BookingCommision;
            properties["settledByCompany"] = SettledByCompany;
            properties["onlinePayu"] = OnlinePayu;
          } else if (
            KidsCount == 1 &&
            item?.ActualAmount - item?.AmountAfterDiscount == 0 &&
            JSON.parse(item?.PackageGuestCount).length == 1
          ) {
            console.log("gkgk");
            properties["KidsItemName"] = KidsItemName;
            properties["KidsCount"] = KidsCount;
            properties["KidsRate"] = KidsRate;
            properties["KidsPrice"] = KidsPrice;
            properties[KidsCgstProperty] = item?.TeensTaxBifurcation / 2;
            properties[KidsSgstProperty] = item?.TeensTaxBifurcation / 2;
            properties["KidsTax"] = KidsTaxPercentage;
            // properties[cgstProperty] = adjustedTaxDiffSum / 2;
            properties[cgstProperty] = total / 2;
            // properties[sgstProperty] = adjustedTaxDiffSum / 2;
            properties[sgstProperty] = total / 2;
            properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
            properties["Rate"] = FinalRateResult;
            properties["cashAmount"] = CashAmount;
            properties["cardAmount"] = CardAmount;
            properties["upiAmount"] = UPIAmount;
            properties["upiId"] = UPIId;
            properties["cardHoldersName"] = CardHoldersName;
            properties["cardNumber"] = CardNumber;
            properties["cardType"] = CardType;
            properties["bookingCommission"] = BookingCommision;
            properties["settledByCompany"] = SettledByCompany;
            properties["onlinePayu"] = OnlinePayu;
          } else if (
            KidsCount == 1 &&
            item?.ActualAmount - item?.AmountAfterDiscount == 0 &&
            JSON.parse(item?.PackageGuestCount).length > 1
          ) {
            console.log("zkzk");
            properties["KidsItemName"] = KidsItemName;
            properties["KidsCount"] = KidsCount;
            properties["KidsRate"] = KidsRate;
            properties["KidsPrice"] = KidsPrice;
            properties[KidsCgstProperty] = item?.TeensTaxBifurcation / 2;
            properties[KidsSgstProperty] = item?.TeensTaxBifurcation / 2;
            properties["KidsTax"] = KidsTaxPercentage;
            // properties[cgstProperty] = adjustedTaxDiffSum / 2;
            properties[cgstProperty] = total / 2;
            // properties[sgstProperty] = adjustedTaxDiffSum / 2;
            properties[sgstProperty] = total / 2;
            properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
            properties["Rate"] = FinalRateResult;
            properties["cashAmount"] = CashAmount;
            properties["cardAmount"] = CardAmount;
            properties["upiAmount"] = UPIAmount;
            properties["upiId"] = UPIId;
            properties["cardHoldersName"] = CardHoldersName;
            properties["cardNumber"] = CardNumber;
            properties["cardType"] = CardType;
            properties["bookingCommission"] = BookingCommision;
            properties["settledByCompany"] = SettledByCompany;
            properties["onlinePayu"] = OnlinePayu;
          } else if (
            KidsCount > 1 &&
            item?.ActualAmount - item?.AmountAfterDiscount == 0 &&
            JSON.parse(item?.PackageGuestCount).length == 1
          ) {
            console.log("gkgk");
            properties["KidsItemName"] = KidsItemName;
            properties["KidsCount"] = KidsCount;
            properties["KidsRate"] = KidsRate;
            properties["KidsPrice"] = KidsPrice;
            properties[KidsCgstProperty] = item?.TeensTaxBifurcation / 2;
            properties[KidsSgstProperty] = item?.TeensTaxBifurcation / 2;
            properties["KidsTax"] = KidsTaxPercentage;
            // properties[cgstProperty] = adjustedTaxDiffSum / 2;
            properties[cgstProperty] = total / 2;
            // properties[sgstProperty] = adjustedTaxDiffSum / 2;
            properties[sgstProperty] = total / 2;
            properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
            properties["Rate"] = FinalRateResult;
            properties["cashAmount"] = CashAmount;
            properties["cardAmount"] = CardAmount;
            properties["upiAmount"] = UPIAmount;
            properties["upiId"] = UPIId;
            properties["cardHoldersName"] = CardHoldersName;
            properties["cardNumber"] = CardNumber;
            properties["cardType"] = CardType;
            properties["bookingCommission"] = BookingCommision;
            properties["settledByCompany"] = SettledByCompany;
            properties["onlinePayu"] = OnlinePayu;
          } else if (
            KidsCount > 1 &&
            item?.ActualAmount - item?.AmountAfterDiscount == 0 &&
            JSON.parse(item?.PackageGuestCount).length > 1
          ) {
            console.log("gkgk");
            properties["KidsItemName"] = KidsItemName;
            properties["KidsCount"] = KidsCount;
            properties["KidsRate"] = KidsRate;
            properties["KidsPrice"] = KidsPrice;
            properties[KidsCgstProperty] = item?.TeensTaxBifurcation / 2;
            properties[KidsSgstProperty] = item?.TeensTaxBifurcation / 2;
            properties["KidsTax"] = KidsTaxPercentage;
            // properties[cgstProperty] = adjustedTaxDiffSum / 2;
            properties[cgstProperty] = total / 2;
            // properties[sgstProperty] = adjustedTaxDiffSum / 2;
            properties[sgstProperty] = total / 2;
            properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
            properties["Rate"] = FinalRateResult;
            properties["cashAmount"] = CashAmount;
            properties["cardAmount"] = CardAmount;
            properties["upiAmount"] = UPIAmount;
            properties["upiId"] = UPIId;
            properties["cardHoldersName"] = CardHoldersName;
            properties["cardNumber"] = CardNumber;
            properties["cardType"] = CardType;
            properties["bookingCommission"] = BookingCommision;
            properties["settledByCompany"] = SettledByCompany;
            properties["onlinePayu"] = OnlinePayu;
          } else {
            console.log("sksk");
            properties["KidsItemName"] = KidsItemName;
            properties["KidsCount"] = KidsCount;
            properties["KidsRate"] = KidsRate;
            properties["KidsPrice"] = KidsPrice;
            properties[KidsCgstProperty] = KidsTax;
            properties[KidsSgstProperty] = KidsTax;
            properties["KidsTax"] = KidsTaxPercentage;
            // properties[cgstProperty] = adjustedTaxDiffSum / 2;
            properties[cgstProperty] = total / 2;
            // properties[sgstProperty] = adjustedTaxDiffSum / 2;
            properties[sgstProperty] = total / 2;
            properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
            properties["Rate"] = FinalRateResult;
            properties["cashAmount"] = CashAmount;
            properties["cardAmount"] = CardAmount;
            properties["upiAmount"] = UPIAmount;
            properties["upiId"] = UPIId;
            properties["cardHoldersName"] = CardHoldersName;
            properties["cardNumber"] = CardNumber;
            properties["cardType"] = CardType;
            properties["bookingCommission"] = BookingCommision;
            properties["settledByCompany"] = SettledByCompany;
            properties["onlinePayu"] = OnlinePayu;
          }
        } else if (
          item?.ActualAmount - item?.AmountAfterDiscount > 0 &&
          JSON.parse(item?.PackageGuestCount).length == 1
        ) {
          console.log(
            "<<packageguestcount>>",
            JSON.parse(item?.PackageGuestCount).length
          );
          properties["KidsItemName"] = KidsItemName;
          properties["KidsCount"] = KidsCount;
          properties["KidsRate"] = KidsRate;
          properties["KidsPrice"] = KidsPrice;
          properties[KidsCgstProperty] = KidsTax;
          properties[KidsSgstProperty] = KidsTax;
          properties["KidsTax"] = KidsTaxPercentage;
          // properties[cgstProperty] = adjustedTaxDiffSum / 2;
          properties[cgstProperty] = sumWhenDiscount;
          // properties[sgstProperty] = adjustedTaxDiffSum / 2;
          properties[sgstProperty] = sumWhenDiscount;
          properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
          properties["Rate"] = FinalRateResult;
          properties["cashAmount"] = CashAmount;
          properties["cardAmount"] = CardAmount;
          properties["upiAmount"] = UPIAmount;
          properties["upiId"] = UPIId;
          properties["cardHoldersName"] = CardHoldersName;
          properties["cardNumber"] = CardNumber;
          properties["cardType"] = CardType;
          properties["bookingCommission"] = BookingCommision;
          properties["settledByCompany"] = SettledByCompany;
          properties["onlinePayu"] = OnlinePayu;
        } else if (
          item?.ActualAmount - item?.AmountAfterDiscount > 0 &&
          JSON.parse(item?.PackageGuestCount).length > 1
        ) {
          console.log(
            "item?.packageGuestCount>>",
            JSON.parse(item?.PackageGuestCount).length
          );

          properties["KidsItemName"] = KidsItemName;
          properties["KidsCount"] = KidsCount;
          properties["KidsRate"] = KidsRate;
          properties["KidsPrice"] = KidsPrice;
          properties[KidsCgstProperty] = KidsTax;
          properties[KidsSgstProperty] = KidsTax;
          properties["KidsTax"] = KidsTaxPercentage;
          // properties[cgstProperty] = adjustedTaxDiffSum / 2;
          properties[cgstProperty] = sumWhenDiscount / 2;
          // properties[sgstProperty] = adjustedTaxDiffSum / 2;
          properties[sgstProperty] = sumWhenDiscount / 2;
          properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
          properties["Rate"] = FinalRateResult;
          properties["cashAmount"] = CashAmount;
          properties["cardAmount"] = CardAmount;
          properties["upiAmount"] = UPIAmount;
          properties["upiId"] = UPIId;
          properties["cardHoldersName"] = CardHoldersName;
          properties["cardNumber"] = CardNumber;
          properties["cardType"] = CardType;
          properties["bookingCommission"] = BookingCommision;
          properties["settledByCompany"] = SettledByCompany;
          properties["onlinePayu"] = OnlinePayu;
        }
        // else if (item?.ActualAmount - item?.AmountAfterDiscount > 0 && JSON.parse(item?.PackageGuestCount).length == 1) {
        //   console.log('<<packageguestcount>>',JSON.parse(item?.PackageGuestCount).length);
        //   properties["KidsItemName"] = KidsItemName;
        //   properties["KidsCount"] = KidsCount;
        //   properties["KidsRate"] = KidsRate;
        //   properties["KidsPrice"] = KidsPrice;
        //   properties[KidsCgstProperty] = KidsTax;
        //   properties[KidsSgstProperty] = KidsTax;
        //   // properties[cgstProperty] = adjustedTaxDiffSum / 2;
        //   properties[cgstProperty] = sumWhenDiscount;
        //   // properties[sgstProperty] = adjustedTaxDiffSum / 2;
        //   properties[sgstProperty] = sumWhenDiscount;
        //   properties["TotalBillAmount"] = TotalKidsplusAdults - Discount;
        //   properties["Rate"] = FinalRateResult;
        //   properties["cashAmount"] = CashAmount;
        //   properties["cardAmount"] = CardAmount;
        //   properties["upiAmount"] = UPIAmount;
        //   properties["upiId"] = UPIId;
        //   properties["cardHoldersName"] = CardHoldersName;
        //   properties["cardNumber"] = CardNumber;
        //   properties["cardType"] = CardType;
        //          properties["bookingCommission"] = BookingCommision;
        // }
        else {
          console.log("no discountt");
          // properties[cgstProperty] = adjustedTaxDiffSum / 2;
          properties[cgstProperty] = total / 2;
          // properties[sgstProperty] = adjustedTaxDiffSum / 2;
          properties[sgstProperty] = total / 2;
          properties["TotalBillAmount"] = TotalBillAmount - Discount;
          properties["Rate"] = FinalRateResult;
          properties["cashAmount"] = CashAmount;
          properties["cardAmount"] = CardAmount;
          properties["KidsTax"] = KidsTaxPercentage;
          properties["upiAmount"] = UPIAmount;
          properties["upiId"] = UPIId;
          properties["cardHoldersName"] = CardHoldersName;
          properties["cardNumber"] = CardNumber;
          properties["cardType"] = CardType;
          properties["bookingCommission"] = BookingCommision;
          properties["settledByCompany"] = SettledByCompany;
          properties["onlinePayu"] = OnlinePayu;
        }
      } else if (itemTaxName[0] === "VAT") {
        properties[vatProperty] = finalTaxDiffSum;
        properties["TotalBillAmount"] = TotalBillAmount;
        properties["Rate"] = FinalRateResult;
      }

      return properties;
    }),
  };

  const BillIdDetails = {
    billId: BookingDetails.map((item) => {
      return item?.BillingId; // You can directly access and return the BillingId
    }),
  };

  console.log("updatededBillDetails----->", updatededBillDetails);

  const updateReportsItemDetails = () => {
    const itemDetailsData = {
      updatedItemDetails: JSON.stringify(
        updatededBillDetails?.updatedItemDetails
      ),
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

  console.log(
    "Updated Item Details----------------->",
    updatededBillDetails?.updatedItemDetails
  );

  console.log("Data to be passed as sms------------------->", BookingDetails);

  console.log("BillIdDetails--------------->", BillIdDetails?.billId);
  const dummyNumber = 3343.7778;
  const truncatedNumber = Math.floor(dummyNumber * 100) / 100;

  console.log("truncated number", truncatedNumber.toFixed(2));

  console.log("New -->", Math.round(81.96721649169922 * 100) / 100);

  return (
    <div>
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
            BookingDetails?.map(
              (item) => (
                console.log("ITEMMMM-->>>", item),
                (
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
                      H.No. 838/1(3), 2nd floor Edificio Da Silva E Menezes Near
                      Holy Family church Porvorim Goa 403521<br></br>Tel. + 91
                      9158885000
                    </h5>
                    <h5 style={{ fontSize: "15px" }}>
                      Email : info@casinoprideofficial.com
                    </h5>
                    <h5 style={{ fontSize: "15px" }}>
                      Website : www.casinoprideofficial.com
                    </h5>
                    <h5 style={{ fontSize: "15px" }}>
                      Instagram : casinoprideofficial
                    </h5>
                    <h5 style={{ fontSize: "12px" }}>
                      CIN No: U55101GA2005PTC004274{" "}
                    </h5>
                    <h5 style={{ fontSize: "12px" }}>PAN No: AACCG7450R</h5>
                    {item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
                      <h5 style={{ fontSize: "12px" }}>TIN No : 30220106332</h5>
                    ) : (
                      <></>
                    )}
                    {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
                      <h5 style={{ fontSize: "12px" }}>
                        GSTIN : 30AACCG7450R1ZC
                      </h5>
                    ) : (
                      <></>
                    )}
                    <h5>TAX INVOICE</h5>
                    <div className="row">
                      <div className="col-6 bill-details">
                        <p className="BillPrintFont">
                          Guest Name :<span>{item.GuestName}</span>{" "}
                        </p>
                        {item.guestGSTIN ? (
                          <p className="BillPrintFont">
                            Guest GSTIN :{" "}
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
                          Guest Mobile :
                          <span
                            className="guest-mobile"
                            style={{ fontWeight: "bold" }}
                          >
                            {item.Phone}
                          </span>
                        </p>
                        {item.State || item?.Address || item?.Country ? (
                          <p className="BillPrintFont">
                            Guest Address:
                            <span
                              className="guest-state BillPrintFont"
                              style={{ fontWeight: "bold" }}
                            >
                              {" "}
                              {item?.Address} {item.State} {item?.Country}
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
                            {item.TotalGuestCount -
                              BookingDetails[0].NumOfTeens}
                          </span>
                        </p>

                        {!BookingDetails[0].NumOfTeens == 0 ? (
                          <p className="BillPrintFont">
                            Number of Kids :{" "}
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
                          Date & Time :
                          <span
                            style={{ fontWeight: "bold" }}
                            className="BillPrintFont"
                          >
                            {" "}
                            {/* {moment
                          .utc(item?.BillDateTime)
                          .format("DD/MM/YYYY HH:mm")} */}
                            {/* {moment(item?.BillingDate.slice(0, 10))
                          .format("DD/MM/YYYY")}{" "} */}
                            {/* {moment(item?.ActualBillingDate.slice(0, 10))
                          .format("DD/MM/YYYY")}{" "} */}
                            {moment(item?.ActualBillingDate).format(
                              "DD/MM/YYYY"
                            )}{" "}
                            {item?.ActualBillingTime}
                          </span>
                        </p>

                        <p
                          className="bill-number BillPrintFont"
                          style={{ marginRight: "25px" }}
                        >
                          BILL#: PSCP {item.BillNumber}
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
                              {item?.ItemDetails &&
                              item?.ItemDetails.packageGuestCount ? (
                                item.ItemDetails.packageGuestCount.map(
                                  (guest, index) => <p key={index}>{guest}</p>
                                )
                              ) : (
                                <p>No data</p>
                              )}
                              {/* {finalUseState} */}
                            </td>

                            {/* <td
                            style={{ textAlign: "right" }}
                            className="BillPrintFont"
                          >
                            {item?.ItemDetails?.Rate.map((rate, index) => (
                              <p key={index}>
                                {rate && item?.ItemDetails?.packageGuestCount[index]
                                  ? (
                                      parseFloat(rate) /
                                      item?.ItemDetails?.packageGuestCount[index]
                                    ).toFixed(2)
                                  : "N/A"}
                              </p>
                            ))}
                          </td> */}

                            <td
                              style={{ textAlign: "right", marginRight: "5px" }}
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

                            {/* <td
                          style={{ textAlign: "right" }}
                          className="BillPrintFont"
                        >
                         

                          {item?.ItemDetails?.Rate.map((rate, index) => (
                            <p key={index}>
                              {rate &&
                              item?.ItemDetails?.packageGuestCount[index]
                                ? (
                                    parseFloat(rate) *
                                    item?.ItemDetails?.packageGuestCount[index]
                                  ).toFixed(2)
                                : "N/A"}
                            </p>
                          ))}
                        </td> */}

                            <td
                              style={{ textAlign: "right" }}
                              className="BillPrintFont"
                            >
                              {item?.ItemDetails?.Rate.map((rate, index) => (
                                <p key={index}>
                                  {rate &&
                                  item?.ItemDetails?.packageGuestCount[index]
                                    ? (
                                        parseFloat(rate).toFixed(2) *
                                        item?.ItemDetails?.packageGuestCount[
                                          index
                                        ]
                                      ).toFixed(2)
                                    : "N/A"}
                                </p>
                              ))}
                            </td>
                          </tr>

                          {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                            item?.TeensPrice > 0 && (
                              <tr>
                                <td
                                  style={{ textAlign: "center" }}
                                  className="BillPrintFont"
                                >
                                  {/* <p>Kids</p> */}
                                  <p>Entry, Food (HSN-999692)</p>
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
                                  {/* {item?.TeensRate.toFixed(2)} */}
                                  {item?.TeensRate &&
                                    item?.NumOfTeens &&
                                    (item.TeensRate / item.NumOfTeens).toFixed(
                                      2
                                    )}
                                </td>

                                <td
                                  style={{ textAlign: "right" }}
                                  className="BillPrintFont"
                                >
                                  {/* {item?.TeensRate.toFixed(2)} */}
                                  {/* {item?.TeensRate &&
                                item?.NumOfTeens &&
                                Math.floor(item.TeensRate * 100) / 100} */}
                                  {/* {item?.TeensRate &&
                                item?.NumOfTeens &&
                                (item.TeensRate / item.NumOfTeens).toFixed(2) *
                                  item.NumOfTeens} */}
                                  {item?.TeensRate &&
                                    item?.NumOfTeens &&
                                    (
                                      (
                                        item.TeensRate / item.NumOfTeens
                                      ).toFixed(2) * item.NumOfTeens
                                    ).toFixed(2)}
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>

                      <div className="totals" style={{ textAlign: "right" }}>
                        {/* GST WITH TEENS OLD CODE */}
                        {/* {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                      item?.TeensPrice > 0 ? (
                        <h6 className="BillPrintFont ">
                          Total Amount 1:{" "}
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
                          Total Amount 2:
                          {item?.ItemDetails &&
                            item?.ItemDetails?.Rate.map((item) => (
                              <span className="BillPrintFont">
                                {parseFloat(item).toFixed(2)}
                              </span>
                            ))}
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
                      )} */}

                        {/*Displaying Bill Amount */}
                        {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
                          <h6 className="BillPrintFont ">
                            Total Amount :
                            {item?.ItemDetails?.ActualAmount -
                              item?.ItemDetails?.AmountAfterDiscount ==
                            0 ? (
                              <span className="BillPrintFont">
                                {parseFloat(
                                  item?.ItemDetails?.packageGuestCount
                                    .reduce((acc, count, index) => {
                                      return (
                                        acc +
                                        count *
                                          item?.ItemDetails?.Rate[
                                            index
                                          ].toFixed(2)
                                      );
                                    }, 0)
                                    .toFixed(2)
                                )}
                              </span>
                            ) : (
                              <span className="BillPrintFont">
                                {parseFloat(
                                  item?.ItemDetails?.packageGuestCount.reduce(
                                    (acc, count, index) => {
                                      return (
                                        acc +
                                        count *
                                          item?.ItemDetails?.Rate[
                                            index
                                          ].toFixed(2)
                                      );
                                    },
                                    0
                                  ) + (item?.TeensRate || 0)
                                ).toFixed(2)}
                              </span>
                            )}
                          </h6>
                        ) : (
                          <h6 className="BillPrintFont">
                            Total Amount :
                            {item?.ItemDetails && (
                              <span className="BillPrintFont">
                                {parseFloat(
                                  item?.ItemDetails?.packageGuestCount
                                    .reduce((acc, count, index) => {
                                      const rate =
                                        item?.ItemDetails?.Rate[index].toFixed(
                                          2
                                        );

                                      if (rate !== undefined) {
                                        return (
                                          acc +
                                          parseFloat((count * rate).toFixed(2))
                                        );
                                      }

                                      return acc;
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
                        {/*Displaying CGST SGST and VAT on conditions */}
                        {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                        item?.TeensPrice > 0 ? (
                          <>
                            {item?.ItemDetails?.TaxBifurcation ? (
                              <>
                                <h6 className="BillPrintFont">
                                  CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                  {/* {(
                                item?.ItemDetails?.TaxDiff.reduce(
                                  (acc, value) => acc + value,
                                  0
                                ) / 2
                              ).toFixed(2)} */}
                                  {(
                                    (item?.ItemDetails?.packageGuestCount &&
                                    item?.ItemDetails?.TaxBifurcation
                                      ? item.ItemDetails.packageGuestCount.reduce(
                                          (total, count, index) =>
                                            total +
                                            // count * item.ItemDetails.TaxDiff[index],
                                            count *
                                              item.ItemDetails.TaxBifurcation[
                                                index
                                              ],
                                          0
                                        )
                                      : 0) / 2
                                  ).toFixed(2)}
                                </h6>
                                <h6 className="BillPrintFont">
                                  SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                  {(
                                    (item?.ItemDetails?.packageGuestCount &&
                                    item?.ItemDetails?.TaxBifurcation
                                      ? item.ItemDetails.packageGuestCount.reduce(
                                          (total, count, index) =>
                                            total +
                                            // count * item.ItemDetails.TaxDiff[index],
                                            count *
                                              item.ItemDetails.TaxBifurcation[
                                                index
                                              ],
                                          0
                                        )
                                      : 0) / 2
                                  ).toFixed(2)}
                                </h6>{" "}
                              </>
                            ) : (
                              <>
                                <h6 className="BillPrintFont">
                                  CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                  {/* {(
                              item?.ItemDetails?.TaxDiff.reduce(
                                (acc, value) => acc + value,
                                0
                              ) / 2
                            ).toFixed(2)} */}
                                  {(
                                    (item?.ItemDetails?.packageGuestCount &&
                                    item?.ItemDetails?.TaxDiff
                                      ? item.ItemDetails.packageGuestCount.reduce(
                                          (total, count, index) =>
                                            total +
                                            count *
                                              item.ItemDetails.TaxDiff[index],
                                          // count * item.ItemDetails.TaxBifurcation[index],
                                          0
                                        )
                                      : 0) / 2
                                  ).toFixed(2)}
                                </h6>
                                <h6 className="BillPrintFont">
                                  SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                  {(
                                    (item?.ItemDetails?.packageGuestCount &&
                                    item?.ItemDetails?.TaxDiff
                                      ? item.ItemDetails.packageGuestCount.reduce(
                                          (total, count, index) =>
                                            total +
                                            count *
                                              item.ItemDetails.TaxDiff[index],
                                          // count * item.ItemDetails.TaxBifurcation[index],
                                          0
                                        )
                                      : 0) / 2
                                  ).toFixed(2)}
                                </h6>{" "}
                              </>
                            )}
                            <h6 className="BillPrintFont">
                              CGST {item?.TeensTax / 2} %:{" "}
                              {(item?.TeensTaxBifurcation / 2).toFixed(2)}
                            </h6>
                            <h6 className="BillPrintFont">
                              SGST {item?.TeensTax / 2} %:
                              {(item?.TeensTaxBifurcation / 2).toFixed(2)}
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
                                          count *
                                            item?.ItemDetails?.Price[index]
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
                                {/* <h6 className="BillPrintFont">
                                CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                {(item?.ItemDetails?.TaxDiff[0] *
                                  item?.ItemDetails?.packageGuestCount) /
                                  2}
                              </h6>
                              <h6 className="BillPrintFont">
                                SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                {(item?.ItemDetails?.TaxDiff[0] *
                                  item?.ItemDetails?.packageGuestCount) /
                                  2}
                              </h6> */}
                                {!item?.ItemDetails?.TaxBifurcation ? (
                                  <>
                                    {/* <h6>
                                    CGST :
                                    {(
                                      item?.ItemDetails?.TaxDiffWeekday?.reduce(
                                        (acc, value) => acc + value,
                                        0
                                      ) / 2
                                    ).toFixed(2)}
                                  </h6> */}
                                    {/* <h6>
                                    SGST :
                                    {(
                                      item?.ItemDetails?.TaxDiffWeekday?.reduce(
                                        (acc, value) => acc + value,
                                        0
                                      ) / 2
                                    ).toFixed(2)}
                                  </h6> */}
                                    <h6>
                                      CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                      {(
                                        (item?.ItemDetails?.packageGuestCount &&
                                        item?.ItemDetails?.TaxDiff
                                          ? item.ItemDetails.packageGuestCount.reduce(
                                              (total, count, index) =>
                                                total +
                                                count *
                                                  item.ItemDetails.TaxDiff[
                                                    index
                                                  ],
                                              0
                                            )
                                          : 0) / 2
                                      ).toFixed(2)}
                                    </h6>

                                    <h6>
                                      SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                      {(
                                        (item?.ItemDetails?.packageGuestCount &&
                                        item?.ItemDetails?.TaxDiff
                                          ? item.ItemDetails.packageGuestCount.reduce(
                                              (total, count, index) =>
                                                total +
                                                count *
                                                  item.ItemDetails.TaxDiff[
                                                    index
                                                  ],
                                              0
                                            )
                                          : 0) / 2
                                      ).toFixed(2)}
                                    </h6>
                                  </>
                                ) : (
                                  <>
                                    <h6>
                                      CGST {item?.ItemDetails.ItemTax / 2} %:
                                      {item?.ItemDetails?.packageGuestCount &&
                                      item?.ItemDetails?.TaxBifurcation
                                        ? (
                                            item.ItemDetails.packageGuestCount.reduce(
                                              (total, count, index) =>
                                                total +
                                                count *
                                                  item.ItemDetails
                                                    .TaxBifurcation[index],
                                              0
                                            ) / 2
                                          ).toFixed(2)
                                        : 0}
                                    </h6>
                                    {/* <h6>
                                    SGST 1:
                                    {item?.ItemDetails?.ActualAmount -
                                      item?.ItemDetails?.AmountAfterDiscount !==
                                    0
                                      ? item?.ItemDetails?.TaxBifurcation
                                        ? (
                                            item.ItemDetails.TaxBifurcation.reduce(
                                              (total, tax) => total + tax,
                                              0
                                            ) / 2
                                          ).toFixed(2)
                                        : 0
                                      : (
                                          (item?.ItemDetails?.packageGuestCount &&
                                          item?.ItemDetails?.TaxBifurcation
                                            ? item.ItemDetails.packageGuestCount.reduce(
                                                (total, count, index) =>
                                                  total +
                                                  count *
                                                    item.ItemDetails.TaxBifurcation[
                                                      index
                                                    ],
                                                0
                                              )
                                            : 0) / 2
                                        ).toFixed(2)}
                                  </h6> */}

                                    {/* <h6>
                                    CGST 1:
                                    {
                                    item?.ItemDetails?.ActualAmount -
                                      item?.ItemDetails?.AmountAfterDiscount !==
                                    0
                                      ?
                                      item?.ItemDetails?.TaxBifurcation
                                        ? (
                                            item.ItemDetails.TaxBifurcation.reduce(
                                              (total, tax) => total + tax,
                                              0
                                            ) / 2
                                          ).toFixed(2)
                                        : 0
                                      : (
                                          (item?.ItemDetails?.packageGuestCount &&
                                          item?.ItemDetails?.TaxBifurcation
                                            ? item.ItemDetails.packageGuestCount.reduce(
                                                (total, count, index) =>
                                                  total +
                                                  count *
                                                    item.ItemDetails.TaxBifurcation[
                                                      index
                                                    ],
                                                0
                                              )
                                            : 0) / 2
                                        ).toFixed(2)}
                                  </h6> */}

                                    <h6>
                                      SGST {item?.ItemDetails.ItemTax / 2} %:
                                      {item?.ItemDetails?.packageGuestCount &&
                                      item?.ItemDetails?.TaxBifurcation
                                        ? (
                                            item.ItemDetails.packageGuestCount.reduce(
                                              (total, count, index) =>
                                                total +
                                                count *
                                                  item.ItemDetails
                                                    .TaxBifurcation[index],
                                              0
                                            ) / 2
                                          ).toFixed(2)
                                        : 0}
                                    </h6>
                                  </>
                                )}
                              </>
                            ) : item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
                              <h6 className="BillPrintFont">
                                VAT {item?.ItemDetails.ItemTax}%:
                                {/* {(
                                item?.ItemDetails?.TaxDiffWeekday *
                                item?.ItemDetails?.packageGuestCount
                              ).toFixed(2)} */}
                                {/*commented by manasi */}
                                {/* {(item?.ItemDetails?.packageGuestCount &&
                            item?.ItemDetails?.TaxDiff
                              ? item.ItemDetails.packageGuestCount.reduce(
                                  (total, count, index) =>
                                    total +
                                    count * item.ItemDetails.TaxDiff[index],
                                  0
                                )
                              : 0
                            ).toFixed(2)} */}
                                {/*addition by manasi */}
                                {(
                                  (parseFloat(
                                    item?.ItemDetails?.packageGuestCount
                                      .reduce((acc, count, index) => {
                                        const rate =
                                          item?.ItemDetails?.Rate[
                                            index
                                          ].toFixed(2);

                                        if (rate !== undefined) {
                                          return (
                                            acc +
                                            parseFloat(
                                              (count * rate).toFixed(2)
                                            )
                                          );
                                        }

                                        return acc;
                                      }, 0)
                                      .toFixed(2) *
                                      (item?.ItemDetails?.ItemTax / 100)
                                  ) *
                                    100) /
                                  100
                                ).toFixed(2)}
                                {/* {item?.ItemDetails?.TaxDiffWeekday?.reduce(
                                (acc, value) => acc + value,
                                0
                              ).toFixed(2)} */}
                              </h6>
                            ) : (
                              <h6 className="BillPrintFont">
                                {/* {item?.ItemDetails?.ItemTaxName[0]}{" "}
                              {item?.ItemDetails.ItemTax} %:{" "}
                              {(
                                item?.ItemDetails?.TaxDiff[0] *
                                item?.ItemDetails?.packageGuestCount
                              ).toFixed(2)} */}
                              </h6>
                            )}

                            {/*Displaying Bill amount */}
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
                                              count *
                                                item?.ItemDetails?.Price[index]
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
                                            count *
                                              item?.ItemDetails?.Price[index]
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
                                            count *
                                              item?.ItemDetails?.Price[index]
                                          );
                                        },
                                        0
                                      )
                                      // + (item?.TeensPrice || 0)
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

                      {/*tERMS AND conditions */}
                      {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
                        <div
                          className="terms"
                          style={{ marginTop: "10px", textAlign: "center" }}
                        >
                          <h6
                            style={{
                              textAlign: "center",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            TERMS AND CONDITIONS
                          </h6>
                          <p style={{ fontSize: "10px", fontWeight: "bold" }}>
                            (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM
                            8:30PM TO 1:30AM DURING THE WEEKDAYS.BUFFET IS OPEN
                            FROM 1:30PM TO 4:00PM AND FROM 8:30PM TO 2:00AM
                            DURING THE WEEKENDS.
                          </p>
                          {/* <p style={{ fontSize: "10px", fontWeight: "bold" }}>
                        BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:30PM
                        TO 2:00AM DURING THE WEEKENDS.
                      </p> */}
                          <p style={{ fontSize: "10px", fontWeight: "bold" }}>
                            (2) OTP (ONE TIME PLAY COUPON) CAN BE PLAYED ONLY BY
                            21 YEARS AND ABOVE.
                          </p>
                          <p style={{ fontSize: "10px", fontWeight: "bold" }}>
                            (3) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR.
                          </p>
                          <p style={{ fontSize: "10px", fontWeight: "bold" }}>
                            (4) RIGHT TO ADMISSION IS RESERVED.
                          </p>
                        </div>
                      ) : (
                        <div
                          className="terms"
                          style={{ marginTop: "10px", textAlign: "center" }}
                        >
                          <h6
                            style={{
                              textAlign: "center",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            TERMS AND CONDITIONS
                          </h6>
                          <p style={{ fontSize: "10px", fontWeight: "bold" }}>
                            (1) LIST OF LIQUOR BRANDS AVAILABLE ON BROCHURE /
                            WEBSITE.
                          </p>
                          <p style={{ fontSize: "10px", fontWeight: "bold" }}>
                            (2) LIQUOR COUPONS ARE STRICTLY NON TRANSFERABLE.
                          </p>
                          <p style={{ fontSize: "10px", fontWeight: "bold" }}>
                            (3) RIGHT TO ADMISSION IS RESERVED.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )
            )}
        </div>

        <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
          <button
            style={{ paddingLeft: "100px", paddingRight: "100px" }}
            type="submit"
            className="btn btn_colour mt-5 btn-lg"
            // onClick={SendDetailsToUser}
            onClick={handlePrint}
            // disabled={loader}
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
                      className="BillPrintFontPrint"
                      style={{
                        marginBottom: "5px",
                      }}
                    >
                      A unit of Goa Coastal Resorts & Recreation Pvt.Ltd
                    </p>
                    <h5
                      className="BillPrintFontPrint"
                      style={{
                        marginBottom: "5px",
                      }}
                    >
                      H.No. 838/1(3), 2nd floor Edificio Da Silva E Menezes Near
                      Holy Family church Porvorim Goa 403521 <br></br>Tel. + 91
                      9158885000
                    </h5>
                    <h5
                      className="BillPrintFontPrint"
                      style={{
                        marginBottom: "5px",
                      }}
                    >
                      Email : info@casinoprideofficial.com
                    </h5>
                    <h5
                      className="BillPrintFontPrint"
                      style={{
                        marginBottom: "5px",
                      }}
                    >
                      Website : www.casinoprideofficial.com
                    </h5>
                    <h5
                      className="BillPrintFontPrint"
                      style={{
                        marginBottom: "5px",
                      }}
                    >
                      Instagram :casinoprideofficial
                    </h5>
                    <h5
                      className="BillPrintFontPrint"
                      style={{
                        marginBottom: "5px",
                      }}
                    >
                      CIN No: U55101GA2005PTC004274{" "}
                    </h5>
                    <h5
                      className="BillPrintFontPrint"
                      style={{
                        marginBottom: "5px",
                      }}
                    >
                      PAN No: AACCG7450R
                    </h5>
                    {item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
                      <h5
                        className="BillPrintFontPrint"
                        style={{
                          marginBottom: "5px",
                          marginTop: "5px",
                        }}
                      >
                        TIN No : 30220106332
                      </h5>
                    ) : (
                      <></>
                    )}
                    {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
                      <h5
                        className="BillPrintFontPrint"
                        style={{
                          marginBottom: "5px",
                        }}
                      >
                        GSTIN : 30AACCG7450R1ZC
                      </h5>
                    ) : (
                      <></>
                    )}
                    <h5
                      // style={{
                      //   marginTop: "10px",
                      //   marginBottom: "5px",
                      //   fontSize: "14px",
                      //   lineHeight: "14px",
                      //   fontWeight: "bold",
                      // }}
                      className="taxinvoicename"
                    >
                      TAX INVOICE
                    </h5>
                    <div className="row">
                      <div className="col-10  bill-details">
                        <p
                          className="BillPrintFontPrint"
                          style={{ marginRight: "5px" }}
                        >
                          BILL#: PSCP {item.BillNumber}
                        </p>
                        <p className="BillPrintFontPrint">
                          Guest Name :
                          <span className="BillPrintFontPrint ">
                            {item.GuestName}
                          </span>{" "}
                        </p>
                        {item.guestGSTIN ? (
                          <p className="BillPrintFontPrint">
                            Guest GSTIN :{" "}
                            <span className="BillPrintFontPrint">
                              {item.guestGSTIN}
                            </span>
                          </p>
                        ) : (
                          <></>
                        )}
                        <p className="BillPrintFontPrint">
                          Guest Mobile :
                          <span className="BillPrintFontPrint">
                            {item.Phone}
                          </span>
                        </p>
                        {item.State || item?.Address || item?.Country ? (
                          <p className="BillPrintFontPrint">
                            Guest Address:
                            <span className="BillPrintFontPrint">
                              {" "}
                              {item?.Address} {item.State}- {item?.Country}
                            </span>
                          </p>
                        ) : (
                          <></>
                        )}

                        <p className="BillPrintFontPrint">
                          Number of Adults :{" "}
                          <span className="BillPrintFontPrint">
                            {item.TotalGuestCount -
                              BookingDetails[0].NumOfTeens}
                          </span>
                        </p>

                        {!BookingDetails[0].NumOfTeens == 0 ? (
                          <p className="BillPrintFontPrint">
                            Number of Kids :{" "}
                            <span className="BillPrintFontPrint">
                              {BookingDetails[0].NumOfTeens}
                            </span>
                          </p>
                        ) : (
                          <></>
                        )}

                        <p className="BillPrintFontPrint">
                          Total Number of Guests :{" "}
                          <span className="BillPrintFontPrint">
                            {item.TotalGuestCount}
                          </span>
                        </p>
                        <p className="BillPrintFontPrint">
                          Payment Mode :{" "}
                          <span className="BillPrintFontPrint">
                            {item.PaymentMode}
                          </span>
                        </p>
                        {item?.GSTNumber != null && (
                          <p className="BillPrintFontPrint">
                            GST Number :{" "}
                            <span className="BillPrintFontPrint">
                              {item?.GSTNumber}
                            </span>
                          </p>
                        )}
                      </div>
                      {/* <div className="col-6">
                        <div className="d-flex justify-content-end qr-code">
                          {qrCodeImage && (
                            <div className="qr-code-image">
                              <img
                                src={qrCodeImage}
                                alt="QR Code"
                                style={{ width: "80px", height: "80px" }}
                              />
                            </div>
                          )}
                        </div>
                      </div> */}
                    </div>
                    <div className="bill-details" style={{ marginTop: "10px" }}>
                      <div className="date-time-bill-row">
                        <p className="BillPrintFontPrint">
                          Date & Time:
                          <span className="BillPrintFontPrint">
                            {" "}
                            {/* {moment
                              .utc(item?.BillDateTime)
                              .format("DD/MM/YYYY HH:mm")} */}
                            {/* {moment(item?.BillingDate.slice(0, 10))
                          .format("DD/MM/YYYY")}{" "} */}
                            {/* {moment(item?.ActualBillingDate.slice(0, 10))
                          .format("DD/MM/YYYY")}{" "} */}
                            {moment(item?.ActualBillingDate).format(
                              "DD/MM/YYYY"
                            )}{" "}
                            {item?.ActualBillingTime}
                          </span>
                        </p>

                        {/* <p
                          className="BillPrintFontPrint"
                          style={{ marginRight: "5px" }}
                        >
                          BILL#: {item.BillNumber}
                        </p> */}
                      </div>
                      <hr />
                      <table
                        className="ticket_table"
                        // className="table table-bordered"
                      >
                        <thead>
                          <tr>
                            <th style={{ textAlign: "center" }}>
                              <p className="BillPrintFontPrintterms">
                                ITEM NAME
                              </p>
                            </th>
                            <th style={{ textAlign: "center" }}>
                              <p className="BillPrintFontPrintterms">
                                GUEST COUNT
                              </p>
                            </th>

                            <th style={{ textAlign: "center" }}>
                              <p className="BillPrintFontPrintterms"> RATE</p>
                            </th>
                            <th style={{ textAlign: "center" }}>
                              <p className="BillPrintFontPrintterms"> VALUE</p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* <tr>
                            <td style={{ textAlign: "center",}}>
                              {item?.ItemDetails &&
                                item?.ItemDetails?.ItemName.map((item) => (
                                  <p className="BillPrintFontPrint" >{item}</p>
                                ))}
                            </td>

                            <td style={{ textAlign: "center" }}
                                      // style={{borderBottom: "1px solid black"}}
                            
                            >
                              {item?.ItemDetails &&
                              item?.ItemDetails.packageGuestCount ? (
                                item.ItemDetails.packageGuestCount.map(
                                  (guest, index) => (
                                    <p
                                      key={index}
                                      className="BillPrintFontPrint"
                                      // style={{borderBottom: "1px solid black"}}
                                    >
                                      {guest}
                                    </p>
                                  )
                                )
                              ) : (
                                <p>No data</p>
                              )}
                            </td>

                            <td
                              style={{
                                textAlign: "right",
                                paddingRight: "5px",
                              }}
                            >
                              {item?.ItemDetails &&
                                item?.ItemDetails?.Rate.map((item) => (
                                  <p className="BillPrintFontPrint">
                                    {parseFloat(item).toFixed(2)}
                                  </p>
                                ))}
                            </td>

                            <td style={{ textAlign: "right" }}>
                              {item?.ItemDetails?.Rate.map((rate, index) => (
                                <p key={index} className="BillPrintFontPrint">
                                  {rate &&
                                  item?.ItemDetails?.packageGuestCount[index]
                                    ? (
                                        parseFloat(rate).toFixed(2) *
                                        item?.ItemDetails?.packageGuestCount[
                                          index
                                        ]
                                      ).toFixed(2)
                                    : "N/A"}
                                </p>
                              ))}
                            </td>
                          </tr> */}

                          {item?.ItemDetails &&
                            item?.ItemDetails?.ItemName.map((name, index) => (
                              <tr>
                                <td style={{ textAlign: "center" }}>
                                  <p className="BillPrintFontPrint">
                                    {item?.ItemDetails?.ItemName[index]}
                                  </p>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <p className="BillPrintFontPrint">
                                    {
                                      item?.ItemDetails?.packageGuestCount[
                                        index
                                      ]
                                    }
                                  </p>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <p className="BillPrintFontPrint">
                                    {parseFloat(
                                      item?.ItemDetails?.Rate[index]
                                    ).toFixed(2)}
                                  </p>
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  <p key={index} className="BillPrintFontPrint">
                                    {item?.ItemDetails?.Rate[index]
                                      ? (
                                          parseFloat(
                                            item?.ItemDetails?.Rate[index]
                                          ).toFixed(2) *
                                          item?.ItemDetails?.packageGuestCount[
                                            index
                                          ]
                                        ).toFixed(2)
                                      : "N/A"}
                                  </p>
                                </td>
                              </tr>
                            ))}

                          {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                            item?.TeensPrice > 0 && (
                              <tr>
                                <td style={{ textAlign: "center" }}>
                                  {/* <p className="BillPrintFontPrint">Kids</p> */}
                                  <p className="BillPrintFontPrint">
                                    Entry, Food (HSN-999692)
                                  </p>
                                </td>

                                <td
                                  style={{ textAlign: "center" }}
                                  className="BillPrintFontPrint"
                                >
                                  <p className="BillPrintFontPrint">
                                    {item?.NumOfTeens}
                                  </p>
                                </td>

                                <td
                                  style={{
                                    // textAlign: "right",
                                    textAlign: "center",
                                    paddingRight: "5px",
                                  }}
                                >
                                  <p className="BillPrintFontPrint">
                                    {/* {item?.TeensRate.toFixed(2)} */}
                                    {item?.TeensRate &&
                                      item?.NumOfTeens &&
                                      (
                                        item.TeensRate / item.NumOfTeens
                                      ).toFixed(2)}
                                  </p>
                                </td>

                                <td
                                  // style={{ textAlign: "right" }}
                                  style={{ textAlign: "center" }}
                                >
                                  <p className="BillPrintFontPrint">
                                    {" "}
                                    {/* {item?.TeensRate.toFixed(2)} */}
                                    {/* {item?.TeensRate &&
                                      item?.NumOfTeens &&
                                      (
                                        item.TeensRate / item.NumOfTeens
                                      ).toFixed(2) * item.NumOfTeens} */}
                                    {item?.TeensRate &&
                                      item?.NumOfTeens &&
                                      (
                                        (
                                          item.TeensRate / item.NumOfTeens
                                        ).toFixed(2) * item.NumOfTeens
                                      ).toFixed(2)}
                                  </p>
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>

                      <div className="totals" style={{ textAlign: "right" }}>
                        {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
                          <h6 className="BillPrintFontPrint ">
                            Total Amount :
                            {item?.ItemDetails?.ActualAmount -
                              item?.ItemDetails?.AmountAfterDiscount ==
                            0 ? (
                              <span className="BillPrintFont">
                                {parseFloat(
                                  item?.ItemDetails?.packageGuestCount
                                    .reduce((acc, count, index) => {
                                      return (
                                        acc +
                                        count *
                                          item?.ItemDetails?.Rate[
                                            index
                                          ].toFixed(2)
                                      );
                                    }, 0)
                                    .toFixed(2)
                                )}
                              </span>
                            ) : (
                              <span className="BillPrintFontPrint">
                                {parseFloat(
                                  item?.ItemDetails?.packageGuestCount.reduce(
                                    (acc, count, index) => {
                                      return (
                                        acc +
                                        count *
                                          item?.ItemDetails?.Rate[
                                            index
                                          ].toFixed(2)
                                      );
                                    },
                                    0
                                  ) + (item?.TeensRate || 0)
                                ).toFixed(2)}
                              </span>
                            )}
                          </h6>
                        ) : (
                          <h6 className="BillPrintFontPrint">
                            Total Amount :
                            {parseFloat(
                              item?.ItemDetails?.packageGuestCount
                                .reduce((acc, count, index) => {
                                  const rate =
                                    item?.ItemDetails?.Rate[index].toFixed(2);

                                  if (rate !== undefined) {
                                    return (
                                      acc +
                                      parseFloat((count * rate).toFixed(2))
                                    );
                                  }

                                  return acc;
                                }, 0)
                                .toFixed(2)
                            )}
                          </h6>
                        )}

                        {item?.ItemDetails?.ItemTaxName[0] === "GST" &&
                        item?.TeensPrice > 0 ? (
                          <>
                            {item?.ItemDetails?.TaxBifurcation ? (
                              <>
                                <h6 className="BillPrintFontPrint">
                                  CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                  {(
                                    (item?.ItemDetails?.packageGuestCount &&
                                    item?.ItemDetails?.TaxBifurcation
                                      ? item.ItemDetails.packageGuestCount.reduce(
                                          (total, count, index) =>
                                            total +
                                            count *
                                              item.ItemDetails.TaxBifurcation[
                                                index
                                              ],
                                          0
                                        )
                                      : 0) / 2
                                  ).toFixed(2)}
                                </h6>
                                <h6 className="BillPrintFontPrint">
                                  SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                  {(
                                    (item?.ItemDetails?.packageGuestCount &&
                                    item?.ItemDetails?.TaxBifurcation
                                      ? item.ItemDetails.packageGuestCount.reduce(
                                          (total, count, index) =>
                                            total +
                                            count *
                                              item.ItemDetails.TaxBifurcation[
                                                index
                                              ],
                                          0
                                        )
                                      : 0) / 2
                                  ).toFixed(2)}
                                </h6>{" "}
                              </>
                            ) : (
                              <>
                                <h6 className="BillPrintFontPrint">
                                  CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                  {(
                                    (item?.ItemDetails?.packageGuestCount &&
                                    item?.ItemDetails?.TaxDiff
                                      ? item.ItemDetails.packageGuestCount.reduce(
                                          (total, count, index) =>
                                            total +
                                            count *
                                              item.ItemDetails.TaxDiff[index],
                                          0
                                        )
                                      : 0) / 2
                                  ).toFixed(2)}
                                </h6>
                                <h6 className="BillPrintFontPrint">
                                  SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                  {(
                                    (item?.ItemDetails?.packageGuestCount &&
                                    item?.ItemDetails?.TaxDiff
                                      ? item.ItemDetails.packageGuestCount.reduce(
                                          (total, count, index) =>
                                            total +
                                            count *
                                              item.ItemDetails.TaxDiff[index],
                                          0
                                        )
                                      : 0) / 2
                                  ).toFixed(2)}
                                </h6>{" "}
                              </>
                            )}
                            <h6 className="BillPrintFontPrint">
                              CGST {item?.TeensTax / 2} %:{" "}
                              {(item?.TeensTaxBifurcation / 2).toFixed(2)}
                            </h6>
                            <h6 className="BillPrintFontPrint">
                              SGST {item?.TeensTax / 2} %:
                              {(item?.TeensTaxBifurcation / 2).toFixed(2)}
                            </h6>

                            <h6 className="BillPrintFontPrint">
                              Bill Amount :{" "}
                              {item?.ItemDetails && (
                                <span>
                                  {parseFloat(
                                    item?.ItemDetails?.packageGuestCount.reduce(
                                      (acc, count, index) => {
                                        return (
                                          acc +
                                          count *
                                            item?.ItemDetails?.Price[index]
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
                                {!item?.ItemDetails?.TaxBifurcation ? (
                                  <>
                                    <h6 className="BillPrintFontPrint">
                                      CGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                      {(
                                        (item?.ItemDetails?.packageGuestCount &&
                                        item?.ItemDetails?.TaxDiff
                                          ? item.ItemDetails.packageGuestCount.reduce(
                                              (total, count, index) =>
                                                total +
                                                count *
                                                  item.ItemDetails.TaxDiff[
                                                    index
                                                  ],
                                              0
                                            )
                                          : 0) / 2
                                      ).toFixed(2)}
                                    </h6>

                                    <h6 className="BillPrintFontPrint">
                                      SGST {item?.ItemDetails.ItemTax / 2} %:{" "}
                                      {(
                                        (item?.ItemDetails?.packageGuestCount &&
                                        item?.ItemDetails?.TaxDiff
                                          ? item.ItemDetails.packageGuestCount.reduce(
                                              (total, count, index) =>
                                                total +
                                                count *
                                                  item.ItemDetails.TaxDiff[
                                                    index
                                                  ],
                                              0
                                            )
                                          : 0) / 2
                                      ).toFixed(2)}
                                    </h6>
                                  </>
                                ) : (
                                  <>
                                    <h6 className="BillPrintFontPrint">
                                      CGST {item?.ItemDetails.ItemTax / 2} %:
                                      {item?.ItemDetails?.packageGuestCount &&
                                      item?.ItemDetails?.TaxBifurcation
                                        ? (
                                            item.ItemDetails.packageGuestCount.reduce(
                                              (total, count, index) =>
                                                total +
                                                count *
                                                  item.ItemDetails
                                                    .TaxBifurcation[index],
                                              0
                                            ) / 2
                                          ).toFixed(2)
                                        : 0}
                                    </h6>

                                    <h6 className="BillPrintFontPrint">
                                      SGST {item?.ItemDetails.ItemTax / 2} %:
                                      {item?.ItemDetails?.packageGuestCount &&
                                      item?.ItemDetails?.TaxBifurcation
                                        ? (
                                            item.ItemDetails.packageGuestCount.reduce(
                                              (total, count, index) =>
                                                total +
                                                count *
                                                  item.ItemDetails
                                                    .TaxBifurcation[index],
                                              0
                                            ) / 2
                                          ).toFixed(2)
                                        : 0}
                                    </h6>
                                  </>
                                )}
                              </>
                            ) : item?.ItemDetails?.ItemTaxName[0] === "VAT" ? (
                              <h6 className="BillPrintFontPrint">
                                VAT {item?.ItemDetails.ItemTax}%:
                                {/*Commented by manasi */}
                                {/* {(item?.ItemDetails?.packageGuestCount &&
                                item?.ItemDetails?.TaxDiff
                                  ? item.ItemDetails.packageGuestCount.reduce(
                                      (total, count, index) =>
                                        total +
                                        count * item.ItemDetails.TaxDiff[index],
                                      0
                                    )
                                  : 0
                                ).toFixed(2)} */}
                                {/*addition by manasi */}
                                {(
                                  (parseFloat(
                                    item?.ItemDetails?.packageGuestCount
                                      .reduce((acc, count, index) => {
                                        const rate =
                                          item?.ItemDetails?.Rate[
                                            index
                                          ].toFixed(2);

                                        if (rate !== undefined) {
                                          return (
                                            acc +
                                            parseFloat(
                                              (count * rate).toFixed(2)
                                            )
                                          );
                                        }

                                        return acc;
                                      }, 0)
                                      .toFixed(2) *
                                      (item?.ItemDetails?.ItemTax / 100)
                                  ) *
                                    100) /
                                  100
                                ).toFixed(2)}
                              </h6>
                            ) : (
                              <h6 className="BillPrintFontPrint"></h6>
                            )}

                            {item?.ItemDetails?.IsDeductable[0] === 1 &&
                            BookingDetails[0]?.AmountAfterDiscount > 0 ? (
                              <>
                                <h6 className="BillPrintFontPrint">
                                  Bill Amount :{" "}
                                  {item?.ItemDetails && (
                                    <span>
                                      {parseFloat(
                                        item?.ItemDetails?.packageGuestCount.reduce(
                                          (acc, count, index) => {
                                            return (
                                              acc +
                                              count *
                                                item?.ItemDetails?.Price[index]
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
                              <h6 className="BillPrintFontPrint">
                                Bill Amount :{" "}
                                {item?.ItemDetails && (
                                  <span>
                                    {parseFloat(
                                      item?.ItemDetails?.packageGuestCount.reduce(
                                        (acc, count, index) => {
                                          return (
                                            acc +
                                            count *
                                              item?.ItemDetails?.Price[index]
                                          );
                                        },
                                        0
                                      )
                                    ).toFixed(2)}
                                  </span>
                                )}
                              </h6>
                            ) : (
                              <h6 className="BillPrintFontPrint">
                                Bill Amount :{" "}
                                {item?.ItemDetails && (
                                  <span>
                                    {parseFloat(
                                      item?.ItemDetails?.packageGuestCount.reduce(
                                        (acc, count, index) => {
                                          return (
                                            acc +
                                            count *
                                              item?.ItemDetails?.Price[index]
                                          );
                                        },
                                        0
                                      )
                                      // + (item?.TeensPrice || 0)
                                    ).toFixed(2)}
                                  </span>
                                )}
                              </h6>
                            )}
                          </>
                        )}
                      </div>

                      {/*TERMS AND CONDITIONS*/}
                      {item?.ItemDetails?.ItemTaxName[0] === "GST" ? (
                        <div
                          className="terms"
                          style={{ marginTop: "10px", textAlign: "center" }}
                        >
                          <h6 className="BillPrintFontPrintterms">
                            TERMS AND CONDITIONS
                          </h6>
                          <p className="BillPrintFontPrintterms">
                            (1) BUFFET IS OPEN FROM 1:30PM TO 3:30PM AND FROM
                            8:30PM TO 1:30AM DURING THE WEEKDAYS.BUFFET IS OPEN
                            FROM 1:30PM TO 4:00PM AND FROM 8:30PM TO 2:00AM
                            DURING THE WEEKENDS.
                          </p>
                          {/* <p className="BillPrintFontPrintterms">
                          BUFFET IS OPEN FROM 1:30PM TO 4:00PM AND FROM 8:30PM
                        TO 2:00AM DURING THE WEEKENDS.
                          </p> */}
                          <p className="BillPrintFontPrintterms">
                            (2) OTP (ONE TIME PLAY COUPON) CAN BE PLAYED ONLY BY
                            21 YEARS AND ABOVE.
                          </p>
                          <p className="BillPrintFontPrintterms">
                            (3) THIS INVOICE DOES NOT ENTITLE ANY LIQUOR.
                          </p>
                          <p className="BillPrintFontPrintterms">
                            (4) RIGHT TO ADMISSION IS RESERVED.
                          </p>
                        </div>
                      ) : (
                        <div
                          className="terms"
                          style={{ marginTop: "10px", textAlign: "center" }}
                        >
                          <h6 className="BillPrintFontPrintterms">
                            TERMS AND CONDITIONS
                          </h6>
                          <p className="BillPrintFontPrintterms">
                            (1) LIST OF LIQUOR BRANDS AVAILABLE ON BROCHURE /
                            WEBSITE.
                          </p>
                          <p className="BillPrintFontPrintterms">
                            (2) LIQUOR COUPONS ARE STRICTLY NON TRANSFERABLE.
                          </p>
                          <p className="BillPrintFontPrintterms">
                            (3) RIGHT TO ADMISSION IS RESERVED.
                          </p>
                        </div>
                      )}

                      <div className="col-12">
                        <div className="d-flex justify-content-center qr-code">
                          {qrCodeImage && (
                            <div className="qr-code-image text-center">
                              <img
                                src={qrCodeImage}
                                alt="QR Code"
                                style={{ width: "100px", height: "100px" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* <ReactToPrint
          trigger={() => <button onClick={sendPrintFn}>Print</button>}
          content={() => printableContentRef.current}
        /> */}

        {/* <div>
          <button onClick={handlePrint}>Print this out!</button>
        </div> */}
      </div>
    </div>
  );
};

export default BillingDetails;
