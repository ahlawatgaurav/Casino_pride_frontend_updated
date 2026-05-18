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

export const AddupdateAgentSettlement =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/addUpdateAgentSettlement", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("add Update Agent Settlement details ->", response.data);
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
    billDate,
    futureDate,
    userId,
    shiftId,
    billId,
    searchBillId,
    fromDate,
    toDate,
    online,
    callback
  ) =>
  async (dispatch) => {
    console.log(
      "futureDate-----------------from redux***********************************************************>",
      futureDate
    );
      console.log('okkkk',online);
    console.log("searchBillId--->", parseInt(searchBillId));
      console.log('billDate>>',billDate);
    api.BILLING_PORT.get(
      // `/billing/getBillingDetails?billId=${parseInt(
      //   searchBillId ? searchBillId : 0
      `/billing/getBillingDetails?billId=${
        searchBillId ? parseInt(searchBillId) : 0
      }&userId=${
        userId ? parseInt(userId) : 0
      }&billingDate=${toDate || fromDate?"":billDate}&shiftId=${
        shiftId ? parseInt(shiftId) : 0
      }&isBookingWebsite=${online}&futureDate=${futureDate}&fromDate=${fromDate}&toDate=${toDate}`,
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

export const sendEmail = (data, callback) => async (dispatch) => {
  console.log(
    "Data for Email----+++++++++++++++++++++++++++++++++++++=------>",
    data
  );
  api.BILLING_PORT.post("/billing/sendBillMail", data)
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

export const updateBillingDetails =
  (token, data, callback) => async (dispatch) => {
    api.BILLING_PORT.put("/billing/updateBillingDetails", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log(" update billing Details ---------->", response.data);
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
export const cashierReport = (token, date, callback) => async (dispatch) => {
  api.BILLING_PORT.get(`/billing/cashierReport?date=${date}&reportTypeId=6`, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("generate cashierReport");
      console.log("generate cashierReport>>>>", response.data);
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

export const cashierReportShiftWise =
  (token, date, shiftId, callback) => async (dispatch) => {
    api.BILLING_PORT.get(
      `/billing/cashierReportShiftWise?date=${date}&shiftId=${shiftId}&reportTypeId=7`,
      {
        headers: { AuthToken: token },
      }
    )
      .then((response) => {
        console.log("generate report shift wise", response.data);
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

export const updateItemDetailsBillFn =
  (token, data, callback) => async (dispatch) => {
    console.log("Item details updated------>", data);
    api.BILLING_PORT.put("/billing/updateItemDetailsBill", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Item details updated------>", response.data);
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
