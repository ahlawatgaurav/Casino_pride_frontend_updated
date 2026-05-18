import api from "../../Service/api";
import { saveBookingDetails } from "../reducers/booking";

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
        {
          console.log("error", err);
        }
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

export const fetchUserbookings =
  (token, futuredate, callback) => async (dispatch) => {
    console.log(token);
    console.log("type of date--->", futuredate);

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

export const fetchBookingDetailsById =
  (token, bookingId, callback) => async (dispatch) => {
    console.log(token);

    api.BOOKING_PORT.get(`/booking/getBookingDetails?bookingId=${bookingId}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get user bookings based on id ->", response.data);
        if (response.data?.Details) {
          dispatch(saveBookingDetails(response.data));
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

export const updateBookingForPayAtCounterFn =
  (token, data, callback) => async (dispatch) => {
    api.BOOKING_PORT.put("/booking/updateBookingForPayAtCounter", data, {
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
export const updateShiftForBooking =
  (token, data, callback) => async (dispatch) => {
    api.BOOKING_PORT.put("/booking/updateShiftForBooking", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("updateShiftForBooking>>>>>", response.data);
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
