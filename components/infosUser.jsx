import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../reducers/user";

const UserInfoComponent = () => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = () => {
    // Dispatch l'action de déconnexion
    dispatch(logout());
    // Navigue vers l'écran de connexion
    navigation.navigate('Mon Compte');
  };
  return (
    <View style={styles.container}>
      <View style={styles.boxTitle}>
      <Text style={styles.title}>Mes informations</Text> 
      </View>
      <View style={styles.box}>
        <Text>Nom :</Text>
      <View style={styles.boxFirstname}><Text style={styles.input}>{user.firstname}</Text></View> 
      <Text>Prénom :</Text>
      <View style={styles.boxLastname}><Text style={styles.input}>{user.lastname}</Text></View> 
      <Text>Username :</Text>
      <View style={styles.boxUsername}><Text style={styles.input}>{user.username}</Text></View> 
      <Text>Email :</Text>
      <View style={styles.boxEmail}><Text style={styles.input}>{user.email}</Text></View> 
      
      <Text style={styles.token}>Token: {user.authToken}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      {/* Ajoute d'autres informations selon les besoins */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF2D3",
   
    alignItems:'center',

  },
  title: {
    fontSize: 24,
    color:'#FFF2D3',
    fontWeight: "bold",
  },
  input: {
    fontSize: 18,
    color:'#f56e00',
  },
  logoutButtonText: {
    fontSize: 18,
    color:'#FFF2D3',
  },
  box: {
    display: 'flex',
    width: '90%',
    height:'65%',
    backgroundColor: "#ffffff",
    alignItems:'center',
    justifyContent: "center",
    marginTop: 70,
    // borderWidth: 1,
    borderRadius: 8,
    borderColor: "#FF8B0A",
  },
  boxTitle: {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    width: '90%',
    height: 80,
    backgroundColor: "#f56e00",
    borderRadius: 8,
    marginTop: 70,
    
  },
  boxFirstname: {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    width: '80%',
    height: 40,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 30,
  },
  boxLastname: {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    width: '80%',
    height: 40,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 30,
  },
  boxUsername: {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    width: '80%',
    height: 40,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 30,
  },
  boxEmail: {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    width: '80%',
    height: 40,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 30,
  },
  logoutButton: {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    width: '80%',
    height: 40,
    backgroundColor: "#f56e00",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 30,
  },
  token: {
    display: 'none',
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UserInfoComponent;
