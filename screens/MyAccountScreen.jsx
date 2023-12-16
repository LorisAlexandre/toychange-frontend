import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import LoginComponent from "../components/login";
import UserInfoComponent from "../components/infosUser";

const MyAccountScreen = ({ navigation, route: { params } }) => {
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    user.authToken && params && navigation.navigate(params.redirect, params);
  }, [params]);

  console.log(user);
  if (!user || !user.authToken) {
    return <LoginComponent />;
  } else {
    // Si l'utilisateur est authentifié, affiche le composant d'informations utilisateur
    return <UserInfoComponent />;
  }
};

export default MyAccountScreen;
