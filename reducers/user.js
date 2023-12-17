import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    authToken: null,
    email: null,
    username: null,
    lastname: null,
    firstname: null,
    _id: null,
    favAnnounces: [],
    mySearches: [],
    geolocation: {
      lat: null,
      long: null,
    },
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.authToken = action.payload.authToken;
      state.value.email = action.payload.email;
      state.value.username = action.payload.username;
      state.value.lastname = action.payload.lastname;
      state.value.firstname = action.payload.firstname;
      state.value._id = action.payload._id;
    },
    logout: (state) => {
      state.value.authToken = null;
      state.value.email = null;
      state.value.username = null;
      state.value.lastname = null;
      state.value.firstname = null;
      state.value._id = null;
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
    addUserLocation: (state, action) => {
      state.value.geolocation.lat = action.payload.lat;
      state.value.geolocation.long = action.payload.long;
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
  addUserLocation,
} = userSlice.actions;
export default userSlice.reducer;
