import React, { useRef, useState, useEffect } from "react";
import jsSHA from "jssha";
import { SHA512 } from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const PayuPayments = ({
  ActualAmount,
  FullName,
  Email,
  Phone,
  AmountAfterDiscount,
  BookingDetails
}) => {
  const uniqueId = uuidv4();
  const formRef = useRef(null);

  const BookingId = BookingDetails?.Id;
  const finalAmount =
    AmountAfterDiscount == 0 ? ActualAmount : AmountAfterDiscount;

  const generateHash = () => {
    const salt = `${process.env.REACT_APP_PAYU_SALT}`;
    const hashString =
      `${process.env.REACT_APP_PAYU_MERCHANT_KEY}` +
      "|" +
      uniqueId +
      "|" +
      finalAmount +
      "|" +
      BookingId +
      "|" +
      FullName +
      "|" +
      Email +
      "|" +
      "||||||||||" +
      salt;

    const sha = new jsSHA("SHA-512", "TEXT");
    sha.update(hashString);

    console.log("uniqueId---------------->", uniqueId);

    // Getting hashed value from jsSHA
    const generatedHash = sha.getHash("HEX");

    console.log("generatedHash: ", generatedHash);

    const baseUrl =
      `${process.env.REACT_APP_BILLING_URL_HTTPS}/api/billing/addPaymentsAgentPanel`;

    // const baseUrl = "http://localhost:9008/api/billing/addPaymentsAgentPanel";

    // Create an object to represent the headers
    const headers = {
      Authorization: process.env.REACT_APP_AUTHORIZATION, // Add your custom headers here
    };

    // Convert the headers object into a query string
    const headersQueryString = Object.keys(headers)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(headers[key])}`
      )
      .join("&");

    // Append the headers as query parameters to the URL
    const urlWithHeaders = `${baseUrl}?${headersQueryString}`;

    // Now, urlWithHeaders contains the URL with headers as query parameters
    console.log(urlWithHeaders);

    // Set all required parameters in the form
    formRef.current.querySelector('input[name="key"]').value = process.env.REACT_APP_PAYU_MERCHANT_KEY;
    formRef.current.querySelector('input[name="txnid"]').value = uniqueId;
    formRef.current.querySelector('input[name="productinfo"]').value = BookingId;
    formRef.current.querySelector('input[name="amount"]').value = finalAmount;
    formRef.current.querySelector('input[name="email"]').value = Email;
    formRef.current.querySelector('input[name="firstname"]').value = FullName;
    formRef.current.querySelector('input[name="phone"]').value = Phone;
    formRef.current.querySelector('input[name="surl"]').value = urlWithHeaders;

    formRef.current.querySelector('input[name="furl"]').value =
      `${process.env.REACT_APP_BILLING_URL_HTTPS}/api/billing/addPaymentsAgentPanel`;

    formRef.current.querySelector('input[name="hash"]').value = generatedHash;

    // Submit the form programmatically
    formRef.current.submit();
  };

  useEffect(() => {
    generateHash();
  }, []);

  return (
    <div>
      {" "}
      <div>
        <div>
          <form
            ref={formRef}
            action={process.env.REACT_APP_PAYU_API}
            method="post"
          >
            <input type="hidden" name="key" value={process.env.REACT_APP_PAYU_MERCHANT_KEY} />
            <input type="hidden" name="txnid" value="t6svtqtjRdl4wp" />
            <input type="hidden" name="productinfo" value="iPhone" />
            <input type="hidden" name="amount" value="10" />
            <input type="hidden" name="email" value="test@gmail.com" />
            <input type="hidden" name="firstname" value="Ashish" />
            <input type="hidden" name="phone" value="9988776655" />
            <input
              type="hidden"
              name="surl"
              // value="https://apiplayground-response.herokuapp.com/"
              value="http://localhost:3001/"
            />
            <input
              type="hidden"
              name="furl"
              value="https://apiplayground-response.herokuapp.com/"
            />
            <input type="hidden" name="hash" />
          </form>

          {/* <button onClick={generateHash}>Generate Hash and Submit</button> */}

          {/* <div className="col-lg-6 mb-2 btn-lg mx-auto d-flex justify-content-center ">
            <button
              style={{ paddingLeft: "100px", paddingRight: "100px" }}
              type="submit"
              className="btn btn-primary mt-5 btn-lg"
              onClick={generateHash}
            >
              Click to pay
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PayuPayments;
