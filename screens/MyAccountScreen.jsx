import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
    return (
      <View style={styles.container}>
        <InfosUserComponent navigation={navigation} />
        <TouchableOpacity
          onPress={() => navigation.navigate("MyAnnouncesScreen")}
        >
          <Text>My Announces</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("MyOrdersScreen")}>
          <Text>My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("InboxScreen")}>
          <Text>My mails</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default MyAccountScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
