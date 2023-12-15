import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { authToken: null, email: null, favAnnounces: [], mySearches: [] },
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
    addFav: (state, action) => {
      state.value.favAnnounces.push(action.payload);
    },
    removeFav: (state, action) => {
      state.value.favAnnounces = state.value.favAnnounces.filter(
        (e) => e._id !== action.payload._id
      );
    },
    addSearchQuery: (state, action) => {
      state.value.mySearches.push(action.payload);
    },
    removeSearchQuery: (state, action) => {
      state.value.mySearches = state.value.mySearches.filter(
        (e) => e !== action.payload
      );
    },
  },
});

export const {
  login,
  logout,
  addFav,
  removeFav,
  addSearchQuery,
  removeSearchQuery,
} = userSlice.actions;
export default userSlice.reducer;
