import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetailsAfterLogin: {},
  saveShiftDetails: {},
  saveOutletDate: {},
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    saveLoginData: (state, action) => {
      state.userDetailsAfterLogin = action.payload;
    },
    saveShiftDetails: (state, action) => {
      state.saveShiftDetails = action.payload;
    },
    saveOutletDate: (state, action) => {
      state.saveOutletDate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveLoginData, saveShiftDetails, saveOutletDate } =
  userSlice.actions;

export default userSlice.reducer;
