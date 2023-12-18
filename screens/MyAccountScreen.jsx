import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LoginComponent from "../components/Login";
import InfosUserComponent from "../components/InfosUser";
import { logout } from "../reducers/user";
import { FontAwesome } from '@expo/vector-icons';

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
    return <View style={styles.container}>
      {/* <InfosUserComponent navigation={navigation}/> */}
      
      <Text>Je suis dans MyAccountScreen</Text>
      <View style={styles.formContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('MyAnnounceScreen')}>
  <Text>Annonces (0)</Text>
</TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MyOrdersScreen')}>
  <Text>commandes (0)</Text>
</TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
  <Text>Ma messagerie</Text>
</TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('InfosUser')}>
  <Text>Mes infos</Text>
</TouchableOpacity>
</View>
    </View>
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems:'center',

  },
  formContainer: {
    width: "100%",
    height: "30%",
    fontSize: 18,
    color: "#FF8B0A",
    marginTop: 150,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  iconBack: {
    position: 'absolute',
    top: 50,
    left: 30,
    backgroundColor: 'transparent',
  },
  button: {
    color: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    width: 330,
    height: 58,
    marginTop: 20,
    backgroundColor: "#f56e00",
    borderRadius: 8,
  },
})
export default MyAccountScreen;
