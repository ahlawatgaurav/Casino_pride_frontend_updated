import api from "../../Service/api";

export const getAgentReport = (token, params, callback) => async (dispatch) => {
  api.CORE_PORT.get("/core/agentReport", {
    headers: { AuthToken: token },
    params,
  })
    .then((response) => {
      if (response.data?.Details) {
        callback({ status: true, response: response.data });
      } else {
        callback({ status: false, error: "No data returned" });
      }
    })
    .catch((err) => {
      callback({ status: false, error: err?.response?.data?.message || err.message });
    });
};

export const getAgentsForFilter = (token, params, callback) => async (dispatch) => {
  api.CORE_PORT.get("/core/agentsForFilter", {
    headers: { AuthToken: token },
    params,
  })
    .then((response) => {
      if (response.data?.Details) {
        callback({ status: true, response: response.data });
      } else {
        callback({ status: false, error: "No data returned" });
      }
    })
    .catch((err) => {
      callback({ status: false, error: err?.response?.data?.message || err.message });
    });
};
