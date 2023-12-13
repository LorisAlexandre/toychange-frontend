import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { authToken: null, email: null, password: null },
  
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.authToken = action.payload.authToken;
    },
    logout: (state) => {
      return { authToken: null, email: null, password: null };
    },
  },
});

export const { addUser, login, logout } = userSlice.actions;
export default userSlice.reducer;
