import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import LoginComponent from '../components/login';
import jwt_decode from 'jwt-decode';

export default function MyAccountScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);

  // Fonction pour vérifier si le token est valide
  const isAuthTokenValid = () => {
    if (user && user.authToken) {
      const authToken = user.authToken;
      try {
        const decoded = jwt_decode(authToken);
        const currentTimestamp = Date.now() / 1000;
        return decoded.exp > currentTimestamp;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  // État pour déterminer si le token est valide
  const [tokenIsValid, setTokenIsValid] = useState(isAuthTokenValid());

  useEffect(() => {
    // Met à jour l'état lorsque l'utilisateur change ou lorsque le composant est monté
    setTokenIsValid(isAuthTokenValid());
  }, [user]);

  if (!user || !tokenIsValid) {
    return (
      <View style={styles.container}>
        <LoginComponent />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Nom: {user.firstname}</Text>
      <Text>Prénom: {user.lastname}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
  },
});