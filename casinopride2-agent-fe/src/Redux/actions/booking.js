import api from "../../Service/api";
import { userDetailsAfterBooking } from "../reducers/booking";

export const AddUserDetails = (data, token, callback) => async (dispatch) => {
  api.BOOKING_PORT.post("/core/user", data, { headers: { AuthToken: token } })
    .then((response) => {
      console.log("Add user details ->", response.data);
      if (response.data?.Details) {
        console.log(response.data?.Details);
        callback({
          status: true,
          response: response?.data,
        });
      } else if (response.data?.Error) {
        callback({ status: false, error: response.data?.Error?.ErrorMessage });
      }
    })
    .catch((err) => {
      {
        console.log("error", err);
      }
    });
};

export const EditUserDetails = (data, token, callback) => async (dispatch) => {
  api.BOOKING_PORT.put("/core/user", data, { headers: { AuthToken: token } })
    .then((response) => {
      console.log("Edit user details ->", response.data);
      if (response.data?.Details) {
        console.log(response.data?.Details);
        callback({
          status: true,
          response: response?.data,
        });
      } else if (response.data?.Error) {
        callback({ status: false, error: response.data?.Error?.ErrorMessage });
      }
    })
    .catch((err) => {
      {
        console.log("error", err);
      }
    });
};

export const getPackagesDetails =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.BOOKING_PORT.get("/booking/displayPackages", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get Packages details ->", response.data);
        if (response.data?.Details) {
          console.log(response.data?.Details);
          callback({
            status: true,
            response: response?.data,
          });
        } else if (response.data?.Error) {
          callback({
            status: false,
            error: response.data?.Error?.ErrorMessage,
          });
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

export const AddBookingFn = (token, data, callback) => async (dispatch) => {
  api.BOOKING_PORT.post("/booking/newBooking", data, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("New booking added ->", response.data);
      if (response.data?.Details) {
        console.log(response.data?.Details);
        callback({
          status: true,
          response: response?.data,
        });
        dispatch(userDetailsAfterBooking(response.data?.Details));
      } else if (response.data?.Error) {
        callback({ status: false, error: response.data?.Error?.ErrorMessage });
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
};

export const SendPaymentLinkToCustomer = (token, data, callback) => async (dispatch) => {
  api.BOOKING_PORT.post("/booking/SendPaymentLinkToCustomer", data, {headers: { AuthToken: token },})
  .then((response) => {
    if (response.data?.Details) {
      console.log(response.data?.Details);
      callback({
        status: true,
        response: response?.data,
      });
    } 
  })
  .catch((err) => {
      console.log("error", err);
    
  });
};

export const SendBookingConfirmMail = (data) => async (dispatch) => {
  api.BOOKING_PORT.post("/booking/sendBookingInternalMail", data)
    .then((response) => {
      if (response.data?.Details) {
        console.log(response.data?.Details);
      } 
    })
    .catch((err) => {
        console.log("error", err);
      
    });
};

export const fetchUserbookings =
  (token, futuredate, callback) => async (dispatch) => {
    console.log(token);
    console.log("type of date--->", typeof futuredate);

    api.BOOKING_PORT.get(`/booking/fetchBookings?futureDate=${futuredate}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get user bookings ->", response.data);
        if (response.data?.Details) {
          console.log(response.data?.Details);
          callback({
            status: true,
            response: response?.data,
          });
        } else if (response.data?.Error) {
          callback({
            status: false,
            error: response.data?.Error?.ErrorMessage,
          });
        }
      })
      .catch((err) => {
        {
          console.log("error", err);
        }
      });
  };

export const fetchBookingByUser =
  (token, userId, bookingDate,callback) => async (dispatch) => {
    api.BOOKING_PORT.get(`/booking/getBookingsForUser?userId=${userId}&date=${bookingDate}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get user bookings ->", response.data);
        if (response.data?.Details) {
          console.log(response.data?.Details);
          callback({
            status: true,
            response: response?.data,
          });
        } else if (response.data?.Error) {
          callback({
            status: false,
            error: response.data?.Error?.ErrorMessage,
          });
        }
      })
      .catch((err) => {
        {
          console.log("error", err);
        }
      });
  };

export const updateBooking = (token, data, callback) => async (dispatch) => {
  api.BOOKING_PORT.put("/booking/updateBooking", data, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("Updated Booking ->", response.data);
      if (response.data?.Details) {
        console.log(response.data?.Details);
        callback({
          status: true,
          response: response?.data,
        });
      } else if (response.data?.Error) {
        callback({ status: false, error: response.data?.Error?.ErrorMessage });
      }
    })
    .catch((err) => {
      {
        console.log("error", err);
      }
    });
};

export const sendEmail = (data, callback) => async (dispatch) => {
  console.log(
    "Data for Email----+++++++++++++++++++++++++++++++++++++=------>",
    data
  );
  api.BOOKING_PORT.post("/booking/sendACKMail", data)
    .then((response) => {
      console.log("Send By Email---------->", response.data);
      if (response.data?.Details) {
        console.log(response.data?.Details);
        callback({
          status: true,
          response: response?.data,
        });
      } else if (response.data?.Error) {
        callback({
          status: false,
          error: response.data?.Error?.ErrorMessage,
        });
      }
    })
    .catch((err) => {
      {
        console.log("error", err);
      }
    });
};

export const getAcknowledgementLinkFn =
  (bookignId, callback) => async (dispatch) => {
    api.BOOKING_PORT.get(
      `/booking/getAcknowledgementLink?bookingId=${bookignId}`
    )
      .then((response) => {
        console.log("Get getAcknowledgement Link  ->", response.data);
        if (response.data) {
          console.log(response.data);
          callback({
            status: true,
            response: response?.data,
          });
        } else if (response.data?.Error) {
          callback({
            status: false,
            error: response.data?.Error?.ErrorMessage,
          });
        }
      })
      .catch((err) => {
        {
          console.log("error", err);
        }
      });
  };
