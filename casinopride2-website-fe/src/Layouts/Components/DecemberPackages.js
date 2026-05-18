import React from "react";
import { Link } from "react-router-dom";

const DecemberPackages = () => {
  return (
    <div class="col-lg-3 col-md-6">
      <div class="family-box">
        <h5 className="text-center">
          <strong class="text-uppercase m-0  b ">OTP REGULAR</strong>
        </h5>
        <div class="family-box-inner">
          <div className="d-flex justify-content-center mt-2">
            <div className="text-center">
              <p className="text-uppercase mb-1 b">INR 2000/-</p>
              <h6 className="primary-color text-uppercase font-weight-bold">
                OTP REGULAR
              </h6>
              <h6 className="second-color text-uppercase">
                [DEC 26th - DEC 29th & Jan 2nd]
              </h6>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-2">
            <div className="text-center">
              <p className="text-uppercase mb-1 b">INR 2000/-</p>
              <h6 className="primary-color text-uppercase font-weight-bold">
                OTP REGULAR
              </h6>
              <h6 className="second-color text-uppercase">
                [DECC 30th - DEC 31st & Jan 2nd]
              </h6>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-2">
            <div className="text-center">
              <p className="text-uppercase mb-1 b">INR 2000/-</p>
              <h6 className="primary-color text-uppercase font-weight-bold">
                OTP REGULAR
              </h6>
              <h6 className="second-color text-uppercase">
                [DEC 26th - DEC 29th & Jan 2nd]
              </h6>
            </div>
          </div>
        </div>
      </div>

      <p class="primary-btn gradient-btn d-block mb-4">
        <Link to="/bookingpage"> Book now</Link>
      </p>
    </div>
  );
};

export default DecemberPackages;
