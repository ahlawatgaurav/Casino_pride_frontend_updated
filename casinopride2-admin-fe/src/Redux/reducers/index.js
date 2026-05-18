// src/reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import auth from "./auth";
import users from "./users";
import booking from "./booking";
import billing from "./billing";

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: auth,
  users: users,
  booking: booking,
  billing: billing,

  // Add more reducers here
});

export default rootReducer;
