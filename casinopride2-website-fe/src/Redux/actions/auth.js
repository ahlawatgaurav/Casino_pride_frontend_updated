import api from "../../Service/api";
import { saveLoginData } from "../reducers/auth";
import { saveValidateData } from "../reducers/auth";
import { saveOutletDetails } from "../reducers/auth";
import moment from "moment";

console.log("Log from apin ", api);

const today = moment().format("YYYY-MM-DD");

export const Login = (data, callback) => async (dispatch) => {
  api.AUTH_PORT.post("/auth/validateuser", data)
    .then((response) => {
      console.log("Validate user data ->", response.data);

      if (response.data?.Details) {
        dispatch(saveValidateData(response.data));
        api.AUTH_PORT.post("/auth/login", {
          UserId: response.data?.Details?.Id,
          UserType: response.data?.Details?.UserType,
        })
          .then((response) => {
            console.log("Login data -->", response.data);
            dispatch(saveLoginData(response.data));
            callback({
              status: true,
              response: response?.data,
            });
            if (response?.data) {
              console.log("Reached Hereeeee");

              api.CORE_PORT.get(
                `/core/checkCurrentOutlet?outletDate=${today}`,
                {
                  headers: {
                    AuthToken: response?.data?.Details?.logindata?.Token, // Replace with your actual token
                  },
                }
              ).then((response) => {
                console.log(
                  "checkCurrentOutlet-------------------------------------------------->>>>>> -->",
                  response.data
                );
                dispatch(saveOutletDetails(response.data));
              });
            }
          })
          .catch((err) => {
            {
              console.log("error", err);
            }
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

export const Logout = (data, token, callback) => async (dispatch) => {
  console.log("inside Logout", data);
  console.log("inside token", token);
  api.AUTH_PORT.post("/auth/logout", data, {
    headers: {
      AuthToken: token,
    },
  })
    .then((response) => {
      console.log("LOGOUT RESPONSE :: ==>", response.data);
      if (response.data?.Details) {
        console.log("LOGOUT :: ==>", response.data?.Details);

        callback({ status: true, res: response.data?.Details });
      } else if (response.data?.Error?.ErrorMessage) {
        callback({ status: false, res: response.data?.Error?.ErrorMessage });
      }
    })
    .catch((err) => {
      callback({ status: true, res: err });
    });
};
