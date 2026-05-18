import api from "../../Service/api";
import { saveShiftDetails, saveOutletDate } from "../reducers/users";

export const AddUserDetails = (data, token, callback) => async (dispatch) => {
  api.CORE_PORT.post("/core/user", data, { headers: { AuthToken: token } })
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
  api.CORE_PORT.put("/core/user", data, { headers: { AuthToken: token } })
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

export const addQrCodeLink =
  (token, userId, UserType, callback) => async (dispatch) => {
    api.CORE_PORT.get(`/core/addQRLink?userId=${userId}&userType=${UserType}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Add QR details ->", response.data);
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

export const getUserDetails =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.CORE_PORT.get(`/core/user?userType=${usertype}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get users details ->", response.data);
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

export const deleteUser = (token, userId, callback) => async (dispatch) => {
  console.log(token);
  console.log(userId);

  api.CORE_PORT.delete(`/core/user?userId=${userId}`, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("Delete users details ->", response.data);
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

export const getPackageDetails =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.CORE_PORT.get("/core/package", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get Package details ->", response.data);
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

export const AddPackageDetails =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/package", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Add package Details ->", response.data);
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

export const deletePackage =
  (token, packageId, callback) => async (dispatch) => {
    console.log(token);
    console.log(packageId);

    api.CORE_PORT.delete(`/core/package?packageId=${packageId}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Delete Package details ->", response.data);
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

export const editPackage = (data, token, callback) => async (dispatch) => {
  api.CORE_PORT.put("/core/package", data, { headers: { AuthToken: token } })
    .then((response) => {
      console.log("Edit package details -------------->", response.data);
      if (response.data?.Details) {
        console.log(response.data);
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

export const getCouponDetails =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.CORE_PORT.get("/core/coupon", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get coupon details ->", response.data);
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

export const fetchAgentSettlement =
  (token, date,userTypeId, callback) => async (dispatch) => {
    api.CORE_PORT.get(`/core/getAgentSettlements?bookingDate=${date}&userTypeId=${userTypeId}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Agent Settlement details ->", response.data);
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

export const deleteCoupon =
  (token, packageId, callback) => async (dispatch) => {
    console.log(token);
    console.log(packageId);

    api.CORE_PORT.delete(`/core/coupon?couponId=${packageId}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Delete Coupon details ->", response.data);
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

export const AddCouponDetails = (data, token, callback) => async (dispatch) => {
  api.CORE_PORT.post("/core/coupon", data, { headers: { AuthToken: token } })
    .then((response) => {
      console.log("Add Coupon Details ->", response.data);
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

export const updateAgentSettlement =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.put("/core/agentMonthlySettlement", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Update agent settlement ->", response.data);
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

export const EditCouponDetails =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.put("/core/coupon", data, { headers: { AuthToken: token } })
      .then((response) => {
        console.log("Edit Coupon Details ->", response.data);
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

export const getWebsiteDiscounts =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.CORE_PORT.get("/core/websiteDiscount", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get website Discount details ->", response.data);
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

export const getPanleDiscounts =
  (token, usertype, callback) => async (dispatch) => {
    console.log(token);
    console.log(usertype);

    api.CORE_PORT.get("/core/panelDiscount", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get Panel Discount details ->", response.data);
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

export const AddDiscountOnWebsiteDetails =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/websiteDiscount", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Add websiteDiscount Details ->", response.data);
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

export const AddDiscountOnPanelFn =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/panelDiscount", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Add panel discount Details ->", response.data);
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

export const deleteWebsiteDiscount =
  (token, discountId, callback) => async (dispatch) => {
    console.log(token);
    console.log(discountId);

    api.CORE_PORT.delete(`/core/websiteDiscount?discountId=${discountId}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Delete Website discount details ->", response.data);
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

export const EditWebsiteDiscounts =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.put("/core/websiteDiscount", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Edit website Discount Details ->", response.data);
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

export const EditPanelDiscounts =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.put("/core/panelDiscount", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Edit Panel Discount Details ->", response.data);
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

  export const getUserByPhone =
  (token, phone, callback) => async (dispatch) => {
    console.log(token);

    api.BOOKING_PORT.get(`/booking/getUserByPhone?phone=${phone}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get users details ->", response.data);
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
export const getCouponsbyInitials =
  (token, initial, numeric, date, callback) => async (dispatch) => {
    api.CORE_PORT.get(
      `/core/couponByInitial?initial=${initial}&numeric=${numeric}&currentDate=${date}`,
      {
        headers: { AuthToken: token },
      }
    )
      .then((response) => {
        console.log("Get Couponss ->", response.data);
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

  export const getDiscountsUsingDiscountCode = 
  (token, discountCode, callback) => async (dispatch) => {
    api.CORE_PORT.get(
      `/core/agentDiscountsUsingDiscountCode?agentDiscountCode=${discountCode}`,
      {
        headers: { AuthToken: token },
      }
    )
    .then((response) => {
      console.log("Get Discount using Discount Code ->", response.data);
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
    });
  }

export const getPanelDiscounts = (token, callback) => async (dispatch) => {
  api.CORE_PORT.get("/core/panelDiscount", {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("Get panelDiscount ->", response.data);
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

export const getEnabledPanelDiscount =
  (token, callback) => async (dispatch) => {
    api.CORE_PORT.get("/core/enabledPanelDiscounts", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Get enabledPanelDiscounts ->", response.data);
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

export const EditUsedCoupon = (data, token, callback) => async (dispatch) => {
  api.CORE_PORT.patch("/core/usedCoupon", data, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("Edit used Coupon ->", response.data);
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

export const AddFutureBookingDatesFn =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/futureBookingDate", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Add future booking Details ->", response.data);
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

export const getFutureBookingDatesDetails =
  (token, callback) => async (dispatch) => {
    api.CORE_PORT.get("/core/futureBookingDate", {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log(" Get future Booking Date ->", response.data);
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

export const openOutletFunction =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/openOutlet", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Open outlet details ->", response.data);
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

export const checkCurrentOutletFn =
  (date, token, callback) => async (dispatch) => {
    api.CORE_PORT.get(`/core/checkCurrentOutlet?outletDate=${date}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log(" Get future Booking Date ->", response.data);
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

export const checkShiftForUser =
  (date, userId, userType, token, callback) => async (dispatch) => {
    console.log("outlet day", date);
    api.CORE_PORT.get(
      `/core/checkShiftForUser?outletDate=${date}&userId=${userId}&userType=${userType}`,
      {
        headers: { AuthToken: token },
      }
    )
      .then((response) => {
        console.log(" CHeck shift for user ->", response.data);
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

export const checkActiveOutlet = (token, callback) => async (dispatch) => {
  api.CORE_PORT.get(`/core/checkActiveOutlet`, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log(" Check Active user ->", response.data);
      if (response.data) {
        console.log(response.data);
        callback({
          status: true,
          response: response?.data,
        });

        dispatch(saveOutletDate(response.data));
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

export const recentShiftForOutlet =
  (date, token, callback) => async (dispatch) => {
    console.log("outlet date---->", date);
    api.CORE_PORT.get(`/core/recentShiftForOutlet?outletDate=${date}`, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Recent shift for outlet------- ->", response.data);
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

export const openShiftFn = (data, token, callback) => async (dispatch) => {
  console.log("DATA------------------------>", data);

  console.log("Called here ---->");
  api.CORE_PORT.post("/core/openShift", data, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("Open shift----------------------------->", response.data);
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

export const closeShiftFn = (data, token, callback) => async (dispatch) => {
  console.log("close shift data----------------------->", data);
  api.CORE_PORT.post("/core/closeShift", data, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("Close shift----------------------------->", response.data);
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

export const closeOutletFunction =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/closeOutlet", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Close outlet details ->", response.data);
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

export const reopenShiftFunction =
  (data, token, callback) => async (dispatch) => {
    api.CORE_PORT.post("/core/reopenShift", data, {
      headers: { AuthToken: token },
    })
      .then((response) => {
        console.log("Reopen shift details ->", response.data);
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

export const shortenUrl = (data, token, callback) => async (dispatch) => {
  console.log("DATA---------shorten url--------------->", data);

  console.log("Called here ---->");
  api.CORE_PORT.post("/core/shortenURL", data, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log(
        "shorten url post----------------------------->",
        response.data
      );
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

export const getLongUrl = (code, token, callback) => async (dispatch) => {
  api.CORE_PORT.get(`/core/getLongURL?shortCode=${code}`, {
    headers: { AuthToken: token },
  })
    .then((response) => {
      console.log("Long code ----->", response.data);
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
export const uploadQRFile = (token, data, callback) => async (dispatch) => {
  console.log("Data for uploadQRFile>>>", data);
  api.CORE_PORT.post("/core/uploadQRFile", data, {
    headers: { AuthToken: token, "Content-Type": "application/pdf" },
  })
    .then((response) => {
      console.log("Upload>>QRFile>>response.data>>>", response.data);
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

export const getUserById = (userId, callback) => async (dispatch) => {
  console.log("pappa toh band bajaye>>", userId);
  api.CORE_PORT.get(`/core/getUserById?userId=${userId}`)
    .then((response) => {
      console.log("get User By Id ----->", response.data);
      if (response.data) {
        console.log(response.data);
        callback({
          status: true,
          response: response?.data,
        });
        // dispatch(saveDriverDetails(response.data));
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

export const countDriverBookings = (data, callback) => async (dispatch) => {
  api.CORE_PORT.put("/core/countDriverBookings", data)
    .then((response) => {
      console.log("Count Driver bookings ->", response.data);
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
