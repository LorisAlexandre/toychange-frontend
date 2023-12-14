import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

const UserInfoComponent = ({ navigation }) => {
  const user = useSelector((state) => state.user.value);
  return (
    <View style={styles.container}>
      {/* <Text>Nom: {user.firstname}</Text> */}
      {/* <Text>Prénom: {user.lastname}</Text> */}
      {/* <Text>Username: {user.username}</Text> */}
      {/* <Text>Email: {user.email}</Text> */}
      <Text>Token: {user.authToken}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("MyOrdersScreen")}>
        <Text>My orders go to </Text>
      </TouchableOpacity>
      {/* Ajoute d'autres informations selon les besoins */}
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
