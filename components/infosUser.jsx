import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/user";

const UserInfoComponent = ({ navigation }) => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text>{user.username}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("MyOrdersScreen")}>
        <Text>My orders (0) </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
        <Text>My mails</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("MyAnnouncesScreen")}
      >
        <Text>My announces (0) </Text>
      </TouchableOpacity>
      {/* Ajoute d'autres informations selon les besoins */}
      <TouchableOpacity onPress={() => dispatch(logout())}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UserInfoComponent;
