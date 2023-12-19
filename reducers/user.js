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
      Object.assign(state.value, action.payload);
    },
    logout: (state) => {
      // Réinitialiser authToken, email, username, etc. à null
      Object.keys(state.value).forEach((key) => {
        if (key !== "favAnnounces" && key !== "mySearches" && key !== "geolocation") {
          state.value[key] = null;
        }
      });
    },
    updateUserInfo: (state, action) => {
      Object.assign(state.value, action.payload);
    },
    updatePassword: (state, action) => {
      const { newPassword } = action.payload;
      state.value.password = newPassword;
      console.log("Mot de passe mis à jour avec succès");
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
  updateUserInfo,
  updatePassword,
} = userSlice.actions;

export default userSlice.reducer;
