import { compose } from "@reduxjs/toolkit";
import api from "../../Service/api";

export const AddBillingDetails =
  (token, data, callback) => async (dispatch) => {
    console.log("Data for add billing details---------->", data);
    api.BILLING_PORT.post("/billing/addBillingDetails", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Billin Details ---------->", response.data);
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

// export const GetBillingDetails =
//   (token, futureDate, shiftId, userId, callback) => async (dispatch) => {
//     const queryParams = {
//       futureDate: futureDate,
//       userId: userId,
//       shiftId: shiftId,
//     };

//     api.BILLING_PORT.get(`/billing/getBillingDetails`, {
//       headers: { AuthToken: token },
//     })
//       .then((response) => {
//         console.log("Get Billing Details ->", response.data);
//         if (response.data?.Details) {
//           console.log(response.data?.Details);
//           callback({
//             status: true,
//             response: response?.data,
//           });
//         } else if (response.data?.Error) {
//           callback({
//             status: false,
//             error: response.data?.Error?.ErrorMessage,
//           });
//         }
//       })
//       .catch((err) => {
//         {
//           console.log("error", err);
//         }
//       });
//   };

export const GetBillingDetails =
  (
    token,
    futureDate,
    userId,
    shiftId,
    billId,
    searchBillId,
    online,
    callback
  ) =>
  async (dispatch) => {
    console.log(
      "futureDate-----------------from redux***********************************************************>",
      futureDate
    );

    console.log("searchBillId--->", parseInt(searchBillId));

    api.BILLING_PORT.get(
      `/billing/getBillingDetails?billId=${parseInt(
        searchBillId ? searchBillId : 0
      )}&userId=${
        userId ? parseInt(userId) : 0
      }&billingDate=${futureDate}&shiftId=${
        shiftId ? parseInt(shiftId) : 0
      }&isBookingWebsite=${online}`,
      {
        headers: { AuthToken: token },
      }
    )
      .then((response) => {
        console.log("Get Billing Details -> ->", response.data);
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

export const uploadBillFile = (token, data, callback) => async (dispatch) => {
  console.log("Data for add billing details---------->", data);
  api.BILLING_PORT.post("/billing/uploadBillFile", data, {
    headers: { AuthToken: token, "Content-Type": "application/pdf" },
  })
    .then((response) => {
      console.log(" PDF   Billin Details ---------->", response.data);
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

export const senSms = (token, data, callback) => async (dispatch) => {
  console.log("Data for add billing details---------->", data);
};

export const getVoidBillingList = (token, callback) => async (dispatch) => {
  api.BILLING_PORT.get("/billing/fetchVoidBill", {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("inside resp of getVoidBillingList");
      console.log("Get void biiling list -> ->", response.data);
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
        console.log("inside resp of getVoidBillingList error", err);
      }
    });
};

export const getNoShowGuestList =
  (token, eventDate, callback) => async (dispatch) => {
    if (eventDate === null) {
      api.BILLING_PORT.get(`/billing/noShowGuestList`, {
        headers: { AuthToken: token },
      })
        .then((response) => {
          console.log("Get No show guest list Details -> ->", response.data);
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
    } else {
      api.BILLING_PORT.get(`/billing/noShowGuestList?eventDate=${eventDate}`, {
        headers: { AuthToken: token },
      })
        .then((response) => {
          console.log("Get No show guest list Details -> ->", response.data);
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
    }
  };

export const voidBill = (token, data, callback) => async (dispatch) => {
  console.log("Data for void bill---------->", data);
  api.BILLING_PORT.put("/billing/voidBill", data, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("Void bill Details ---------->", response.data);
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

export const updateBillForVoid =
  (token, data, callback) => async (dispatch) => {
    console.log("update Data for void bill---------->", data);
    api.BILLING_PORT.put("/billing/updateBillIdForVoid", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log(" update Void bill Details ---------->", response.data);
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

export const generateCSVReport =
  (token, data, callback) => async (dispatch) => {
    console.log("Data to generate reports---------->", data);

    console.log("Reached here for reports------>");
    api.BILLING_PORT.post("/billing/generateCSVReport", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Data to generate reports ---------->", response.data);
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

export const generateNoShowReport =
  (token, date, callback) => async (dispatch) => {
    api.BILLING_PORT.get(
      `/billing/generateNoShowReport?eventDate=${date}&reportTypeId=5`,
      {
        headers: { AuthToken: token },
      }
    )
      .then((response) => {
        console.log("generate no show bill ");
        console.log("generate no show bill---------------->>", response.data);
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
          console.log("inside resp of getVoidBillingList error", err);
        }
      });
  };
export const updateBookingId = (data, callback) => async (dispatch) => {
  console.log("Data for add billing details---------->", data);
  api.BILLING_PORT.put("/billing/updateBookingId", data)
    .then((response) => {
      console.log(
        " Updated Booking Id from payments ---------->",
        response.data
      );
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

export const UploadAckFile = (data, callback) => async (dispatch) => {
  console.log("Data for add ack  details---------->", data);
  api.BOOKING_PORT.post("/booking/uploadACKFile", data, {
    headers: { "Content-Type": "application/pdf" },
  })
    .then((response) => {
      console.log(" Data for add ack  details--->", response.data);
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
