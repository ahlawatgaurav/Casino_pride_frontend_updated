import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetailsAfterLogin: {},
};

export const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    saveLoginData: (state, action) => {
      state.userDetailsAfterLogin = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveLoginData } = billingSlice.actions;

export default billingSlice.reducer;
