import React from "react";

const FinalPackage = ({ adults, teens, kids, packageName }) => {
  return (
    <div class="form-section mb-5 mt-5">
      <div class="row">
        <div class="col-lg-4">
          <img
            src="https://www.casinoprideofficial.com/assets/images/otp_regular.jpeg"
            alt="Image 2"
            className="img-fluid confirm_booking_img"
            // class="embed-responsive mb-4"
          />
        </div>
        <div class="col-lg-8 text-left">
          <div class="row mt-4">
            <div class="col-md-4 col-6">
              <h6 class="label-title text-uppercase">when</h6>
              <h6 id="confirmed_date_when">
                {/* {formatDate(selectedDate)} */}
                1234 date
              </h6>
            </div>
            <div class="col-md-4 col-6">
              <h6 class="label-title text-uppercase">with</h6>
              <h6 id="guest_count_with">
                {/* {adultsCount}  */}
                {adults} adults
                {/* {teensCount} */}
                {teens} teens and
                {/* {kidsCount} */}
                {kids} kids
              </h6>
            </div>
            <div class="col-md-4 col-6">
              <h6 class="label-title text-uppercase">package</h6>
              <h6>{packageName}</h6>
            </div>
          </div>
          <h6 class="label-title text-uppercase mt-3">inclusions</h6>
          <div className="row">
            <div className="col-md-6 col-lg-2">
              <div className="image-container d-flex flex-column align-items-center">
                <img
                  src="https://www.casinoprideofficial.com/assets/images/red-carpet.png"
                  alt="Image 1"
                  className="img-fluid package_card_image"
                />
                <p className="text-center mt-2">Events & Live Entertainment</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-2">
              <div className="image-container d-flex flex-column align-items-center">
                <img
                  src="https://www.casinoprideofficial.com/assets/images/buffet.png"
                  alt="Image 2"
                  className="img-fluid package_card_image"
                />
                <p className="text-center mt-2">Unlimited Food & Drinks</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-2">
              <div className="image-container d-flex flex-column align-items-center">
                <img
                  src="https://www.casinoprideofficial.com/assets/images/bonus.png"
                  alt="Image 3"
                  className="img-fluid package_card_image"
                />
                <p className="text-center mt-2">Gaming Offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalPackage;
