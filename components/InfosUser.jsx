import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUserInfo } from "../reducers/user";

const UserInfoComponent = ({ navigation }) => {
  const user = useSelector((state) => state.user.value);
  console.log("salut infoUser", user);
  const dispatch = useDispatch();
  const handleGoBack = () => {
    navigation.goBack();
  };

  // État et fonctions pour gérer l'édition du prénom
  const [isEditingFirstname, setIsEditingFirstname] = useState(false);
  const [editableFirstname, setEditableFirstname] = useState(user.firstname);
  const handleEditFirstname = () => setIsEditingFirstname(true);
  const handleSaveFirstname = async () => {
    dispatch(updateUserInfo({ firstname: editableFirstname }));
    await updateBackend({ firstname: editableFirstname });
    setIsEditingFirstname(false);
  };

  // État et fonctions pour gérer l'édition du nom
  const [isEditingLastname, setIsEditingLastname] = useState(false);
  const [editableLastname, setEditableLastname] = useState(user.lastname);
  const handleEditLastname = () => setIsEditingLastname(true);
  const handleSaveLastname = async () => {
    dispatch(updateUserInfo({ lastname: editableLastname }));
    await updateBackend({ lastname: editableLastname });
    setIsEditingLastname(false);
  };

  // État et fonctions pour gérer l'édition du nom d'utilisateur
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editableUsername, setEditableUsername] = useState(user.username);
  const handleEditUsername = () => setIsEditingUsername(true);
  const handleSaveUsername = async () => {
    dispatch(updateUserInfo({ username: editableUsername }));
    await updateBackend({ username: editableUsername });
    setIsEditingUsername(false);
  };

  // État et fonctions pour gérer l'édition de l'email
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editableEmail, setEditableEmail] = useState(user.email);
  const handleEditEmail = () => setIsEditingEmail(true);
  const handleSaveEmail = async () => {
    dispatch(updateUserInfo({ email: editableEmail }));
    await updateBackend({ email: editableEmail });
    setIsEditingEmail(false);
  };

  const [editableregistrationDate, setEditableregistrationDate] = useState(
    user.registrationDate
  );

  const [showChangePassword, setShowChangePassword] = useState(false);
  const handleShowChangePassword = () => {
    navigation.navigate("PasswordScreen");
  };

  const logoutUser = () => {
    dispatch(logout());
    // Redirige l'utilisateur vers l'écran de connexion
    navigation.navigate("Mon Compte");
  };

  // Fonction pour enregistrer les modifications au backend
  const updateBackend = async (dataToUpdate) => {
    try {
      const response = await fetch(
        "https://toychange-backend.vercel.app/users/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.authToken}`,
          },
          body: JSON.stringify(dataToUpdate),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // La mise à jour sur le backend s'est bien déroulée
        Alert.alert("Votre modification a bien été pris en compte");
      } else {
        // Gère les erreurs si la mise à jour a échoué
        console.error("Erreur lors de la mise à jour sur le backend:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour sur le backend:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.boxTitle}>
        <TouchableOpacity onPress={handleGoBack} style={styles.iconBack}>
          <FontAwesome name="angle-left" color={"#F56E00"} size={36} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Mes informations</Text>
          <Text style={styles.date}>
            Création du compte le :{" "}
            <Text style={styles.registrationDate}>
              {editableregistrationDate}
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.box}>
        <ScrollView style={styles.scrollView}>
          {/* Champ Prénom */}
          <Text>Prénom :</Text>
          <View style={styles.boxFirstname}>
            {isEditingFirstname ? (
              <TextInput
                style={styles.input}
                value={editableFirstname}
                onChangeText={(value) => setEditableFirstname(value)}
              />
            ) : (
              <Text style={styles.input}>{user.firstname}</Text>
            )}
            <TouchableOpacity
              onPress={
                isEditingFirstname ? handleSaveFirstname : handleEditFirstname
              }
              style={styles.editButton}
            >
              {isEditingFirstname ? (
                <FontAwesome name="check" size={24} color="#00f500" />
              ) : (
                <FontAwesome name="pencil" size={24} color="#f56e00" />
              )}
            </TouchableOpacity>
          </View>

          {/* Champ Nom */}
          <Text>Nom :</Text>
          <View style={styles.boxLastname}>
            {isEditingLastname ? (
              <TextInput
                style={styles.input}
                value={editableLastname}
                onChangeText={(value) => setEditableLastname(value)}
              />
            ) : (
              <Text style={styles.input}>{user.lastname}</Text>
            )}
            <TouchableOpacity
              onPress={
                isEditingLastname ? handleSaveLastname : handleEditLastname
              }
              style={styles.editButton}
            >
              {isEditingLastname ? (
                <FontAwesome name="check" size={24} color="#00f500" />
              ) : (
                <FontAwesome name="pencil" size={24} color="#f56e00" />
              )}
            </TouchableOpacity>
          </View>

          {/* Champ Nom d'utilisateur */}
          <Text>Username :</Text>
          <View style={styles.boxUsername}>
            {isEditingUsername ? (
              <TextInput
                style={styles.input}
                value={editableUsername}
                onChangeText={(value) => setEditableUsername(value)}
              />
            ) : (
              <Text style={styles.input}>{user.username}</Text>
            )}
            <TouchableOpacity
              onPress={
                isEditingUsername ? handleSaveUsername : handleEditUsername
              }
              style={styles.editButton}
            >
              {isEditingUsername ? (
                <FontAwesome name="check" size={24} color="#00f500" />
              ) : (
                <FontAwesome name="pencil" size={24} color="#f56e00" />
              )}
            </TouchableOpacity>
          </View>

          {/* Champ Email */}
          <Text>Email :</Text>
          <View style={styles.boxEmail}>
            {isEditingEmail ? (
              <TextInput
                style={styles.input}
                value={editableEmail}
                onChangeText={(value) => setEditableEmail(value)}
              />
            ) : (
              <Text style={styles.input}>{user.email}</Text>
            )}
            <TouchableOpacity
              onPress={isEditingEmail ? handleSaveEmail : handleEditEmail}
              style={styles.editButton}
            >
              {isEditingEmail ? (
                <FontAwesome name="check" size={24} color="#00f500" />
              ) : (
                <FontAwesome name="pencil" size={24} color="#f56e00" />
              )}
            </TouchableOpacity>
          </View>

          {/* Champ Password */}
          <TouchableOpacity
            onPress={handleShowChangePassword}
            style={styles.changePassword}
          >
            <Text>Modifier votre mot de passe</Text>
            <FontAwesome
              name="hand-o-left"
              size={24}
              color="#f56e00"
              style={styles.iconChangePassword}
            />
          </TouchableOpacity>

          {showChangePassword && <ChangePasswordForm navigation={navigation} />}
          {/* <Text>Password :</Text>
        <View style={styles.boxPassword}>
          {isEditingPassword ? (
            <TextInput
              style={styles.input}
              value={editablePassword}
              onChangeText={(value) => setEditablePassword(value)}
            />
          ) : (
            <Text style={styles.input}>{user.password}</Text>
          )}
          <TouchableOpacity onPress={isEditingPassword ? handleSavePassword : handleEditPassword} style={styles.editButton}>
            {isEditingPassword ? (
              <FontAwesome name="check" size={24} color="#00f500" />
            ) : (
              <FontAwesome name="pencil" size={24} color="#f56e00" />
            )}
          </TouchableOpacity>
        </View> */}
        </ScrollView>
        <TouchableOpacity onPress={logoutUser} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  title: {
    marginRight: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#461904",
  },
  scrollView: {
    width: 450,
    paddingVertical: 0,
    paddingLeft: 80,
    marginRight: 0,
    marginHorizontal: 0,
  },
  input: {
    fontSize: 18,
    color: "#f56e00",
  },
  logoutButtonText: {
    fontSize: 18,
    color: "#FFF2D3",
  },
  box: {
    display: "flex",
    width: "90%",
    height: "75%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingTop: 10,
    borderRadius: 8,
    borderColor: "#FF8B0A",
  },
  boxTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 70,
    backgroundColor: "#FFFFFF",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 8,
    marginTop: 40,
  },
  boxFirstname: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    height: 48,
    backgroundColor: "#FFFFFF",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
    paddingLeft: 25,
    paddingRight: 15,
  },
  boxLastname: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    height: 48,
    backgroundColor: "#FFFFFF", // Ajoutez une couleur de fond
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 15,
  },
  boxUsername: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    height: 48,
    backgroundColor: "#FFFFFF", // Ajoutez une couleur de fond
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 15,
  },
  boxEmail: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    height: 48,
    backgroundColor: "#FFFFFF", // Ajoutez une couleur de fond
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 15,
  },
  boxPassword: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    height: 48,

    backgroundColor: "#FFFFFF", // Ajoutez une couleur de fond
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 15,
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 58,
    backgroundColor: "#f56e00",
    borderRadius: 8,
    marginTop: 5,
  },
  changePassword: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    height: 58,
    backgroundColor: "#FFFFFF", // Ajoutez une couleur de fond
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 35,
  },
  iconChangePassword: {
    marginLeft: 43,
  },
  iconBack: {
    marginRight: 40,
    backgroundColor: "transparent",
  },
  token: {
    display: "none",
    alignItems: "center",
    justifyContent: "center",
  },
  registrationDate: {
    fontWeight: "bold",
    color: "green",
  },
});

export default UserInfoComponent;
