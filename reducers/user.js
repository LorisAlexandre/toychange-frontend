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
    updatePassword: (state, action) => {
      const { oldPassword, newPassword } = action.payload;
    
      // Vérifier si l'ancien mot de passe correspond à celui enregistré dans l'état
      if (state.value.password === oldPassword) {
        // Mise à jour réussie
        state.value.password = newPassword;
        console.log('Mot de passe mis à jour avec succès');
      } else {
        // Gérer le cas où l'ancien mot de passe ne correspond pas
        console.error('Erreur : L\'ancien mot de passe ne correspond pas.');
      }
    },
  },
});

export const { login, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
