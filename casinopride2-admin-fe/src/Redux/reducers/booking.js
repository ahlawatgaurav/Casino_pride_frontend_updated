import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetailsAfterLogin: {},
  bookingDetails: {}
};

export const bookingslice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    saveLoginData: (state, action) => {
      state.userDetailsAfterLogin = action.payload;
    },
    saveBookingDetails: (state, action) => {
      state.bookingDetails = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveLoginData, saveBookingDetails } = bookingslice.actions;

export default bookingslice.reducer;
