import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import LoginComponent from '../components/login';
import InfosUserComponent from '../components/infosUser'; 

const MyAccountScreen = () => {
   const user = useSelector((state) => state.user.value);
console.log(user);
   if (!user || !user.authToken) {
   return (
    <LoginComponent />
   );
  } else {
// Si l'utilisateur est authentifié, affiche le composant d'informations utilisateur
return (
    <InfosUserComponent /> 
);
};

  }

  

export default MyAccountScreen;