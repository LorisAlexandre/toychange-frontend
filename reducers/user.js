import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { authToken: null, email: null, password: null },
  
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.value = { ...state.value, ...action.payload }; 
    },
    login: (state, action) => {
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
    },
    logout: (state) => {
      state.value.username = null;
      state.value.firstName = null;
    },
  },
});

export const { addUser, login, logout } = userSlice.actions;
export default userSlice.reducer;
