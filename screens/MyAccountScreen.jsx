import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LoginComponent from "../components/Login";
import InfosUserComponent from "../components/InfosUser";
import { logout } from "../reducers/user";
import { FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

export default MyAccountScreen = ({ navigation, route: { params } }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [numAnnounces, setNumAnnounces] = useState(0);

  const logoutUser = () => {
    dispatch(logout());
    // Redirige l'utilisateur vers l'écran de connexion
    navigation.navigate("Mon Compte");
  };

  useEffect(() => {
    user.authToken &&
      (async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status) {
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);
          // fetch(
          //   `https://toychange-backend.vercel.app/users/notifToken/${user._id}`,
          //   {
          //     method: "PUT",
          //     headers: {
          //       authorization: user.authToken,
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({ token }),
          //   }
          // );
        }
      })();
  }, [user.authToken]);

  if (!user.authToken) {
    return <LoginComponent />;
  } else {
    // Si l'utilisateur est authentifié, affiche le composant d'informations utilisateur
    return (
      <View style={styles.container}>
        {/* <InfosUserComponent navigation={navigation}/> */}

        <View style={styles.formContainer}>
          <Text style={styles.title}>Mon compte</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("MyAnnouncesScreen")}
            style={styles.button}
          >
            <Text style={styles.textLink}>Annonces ({numAnnounces})</Text>
            <FontAwesome name="angle-right" size={18} color="#461904" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("MyOrdersScreen")}
            style={styles.button}
          >
            <Text style={styles.textLink}>Commandes (0)</Text>
            <FontAwesome name="angle-right" size={18} color="#461904" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Messages")}
            style={styles.button}
          >
            <Text style={styles.textLink}>Ma messagerie</Text>
            <FontAwesome name="angle-right" size={18} color="#461904" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("InfosUser")}
            style={styles.button}
          >
            <Text style={styles.textLink}>Mes informations</Text>
            <FontAwesome name="angle-right" size={18} color="#461904" />
          </TouchableOpacity>
          <TouchableOpacity onPress={logoutUser} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  title: {
    color: "#461904",
    fontSize: 31,
    fontWeight: "bold",
    marginBottom: 30,
  },
  textLink: {
    color: "#461904",
    fontSize: 16,
  },
  logoutButtonText: {
    color: "#FFF2D3",
    fontSize: 16,
  },
  formContainer: {
    width: "100%",
    height: "100%",
    fontSize: 18,
    color: "#FF8B0A",
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space between",
    paddingTop: 10,
  },
  button: {
    color: "#ffffff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 330,
    height: 68,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingLeft: 25,
    paddingRight: 40,
    fontSize: 24,
    shadowColor: "#FFF2D3",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    height: 65,
    backgroundColor: "#f56e00",
    borderRadius: 8,
    color: "FFF2D3",
    zIndex: 10000,
    position: "absolute",
    bottom: 75,
  },
});
