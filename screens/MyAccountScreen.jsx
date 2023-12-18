import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LoginComponent from "../components/Login";
import InfosUserComponent from "../components/InfosUser";
import { logout } from "../reducers/user";

const MyAccountScreen = ({ navigation, route: { params } }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    user.authToken && params && navigation.navigate(params.redirect, params);
  }, [params]);

  if (!user.authToken) {
    return <LoginComponent />;
  } else {
    // Si l'utilisateur est authentifié, affiche le composant d'informations utilisateur
    return <InfosUserComponent navigation={navigation} />;
  }
};

export default MyAccountScreen;
