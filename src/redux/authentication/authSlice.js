import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthorized: !!localStorage.getItem("token") || false,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuthorized: (state, action) => {
      state.isAuthorized = action.payload;
    },
  },
});

export const { setAuthorized } = authSlice.actions;
export default authSlice.reducer;
