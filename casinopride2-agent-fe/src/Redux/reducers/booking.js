import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetailsAfterLogin: {},
  userDetailsAfterBooking: {},
};

export const bookingslice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    saveLoginData: (state, action) => {
      state.userDetailsAfterLogin = action.payload;
    },
    userDetailsAfterBooking: (state, action) => {
      state.userDetailsAfterBooking = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveLoginData, userDetailsAfterBooking } = bookingslice.actions;

export default bookingslice.reducer;
