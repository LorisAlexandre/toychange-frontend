import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    authToken: null,
    username: null,
    firstname: null,
    lastname: null,
    email: null,
  },
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      Object.assign(state.value, action.payload);
    },
    logout: (state) => {
      Object.keys(state.value).forEach((key) => {
        state.value[key] = null;
      });
    },
    updateUserInfo: (state, action) => {
      Object.assign(state.value, action.payload);
    },
  },
});

export const { login, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
