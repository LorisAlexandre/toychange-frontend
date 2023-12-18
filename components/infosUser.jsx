import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { logout, updateUserInfo } from "../reducers/user";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";


const UserInfoComponent = ({ navigation }) => {
  const user = useSelector((state) => state.user.value);
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
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const handleShowChangePassword = () => {
    navigation.navigate('PasswordScreen');  };

  const logoutUser = () => {
    dispatch(logout());
    // Redirige l'utilisateur vers l'écran de connexion 
    navigation.navigate("Mon Compte");

  };
  
  // Fonction pour enregistrer les modifications au backend
  const updateBackend = async (dataToUpdate) => {
    try {
      const response = await fetch("https://toychange-backend.vercel.app/users/update", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.authToken}`,
        },
        body: JSON.stringify(dataToUpdate),
      });

      const data = await response.json();

      if (response.ok) {
        // La mise à jour sur le backend s'est bien déroulée
        console.log('Mise à jour réussie sur le backend:', data);
      } else {
        // Gère les erreurs si la mise à jour a échoué
        console.error('Erreur lors de la mise à jour sur le backend:', data);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour sur le backend:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
   <TouchableOpacity onPress={handleGoBack} style={styles.iconBack}>
        <FontAwesome name="angle-left" size={56} color="#f56e00" />
      </TouchableOpacity>
      <View style={styles.boxTitle}>
        <Text style={styles.title}>Mes informations</Text>
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
          <TouchableOpacity onPress={isEditingFirstname ? handleSaveFirstname : handleEditFirstname} style={styles.editButton}>
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
          <TouchableOpacity onPress={isEditingLastname ? handleSaveLastname : handleEditLastname} style={styles.editButton}>
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
          <TouchableOpacity onPress={isEditingUsername ? handleSaveUsername : handleEditUsername} style={styles.editButton}>
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
          <TouchableOpacity onPress={isEditingEmail ? handleSaveEmail : handleEditEmail} style={styles.editButton}>
            {isEditingEmail ? (
              <FontAwesome name="check" size={24} color="#00f500" />
            ) : (
              <FontAwesome name="pencil" size={24} color="#f56e00" />
              )}
          </TouchableOpacity>
        </View>
        {/* Champ Password */}

        <TouchableOpacity onPress={handleShowChangePassword} style={styles.changePassword}>
        <Text>Modifier votre mot de passe</Text>
              <FontAwesome name="hand-o-left" size={24} color="#f56e00" style={styles.iconChangePassword}/>
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

        {/* Token et Bouton de déconnexion */}
        <Text style={styles.token}>Token: {user.authToken}</Text>
        <TouchableOpacity onPress={logoutUser} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems:'center',

  },
  title: {
    fontSize: 24,
    color:'#FFF2D3',
    fontWeight: "bold",
  },
  scrollView: {
    width: 440,
    paddingLeft: 80,
    marginRight: 0,
    marginHorizontal: 0,
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
    height:'75%',
    backgroundColor: "#ffffff",
    alignItems:'center',
    justifyContent: "center",
    marginTop: 20,
    paddingTop:10,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '80%',
    height: 48,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 15,
  },
  boxLastname: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '80%',
    height: 48,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 15,
  },
  boxUsername: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '80%',
    height: 48,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 15,
  },
  boxEmail: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '80%',
    height: 48,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 15,
  },
  boxPassword: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '80%',
    height: 48,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 15,
  },
  logoutButton: {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    width: '80%',
    height: 58,
    backgroundColor: "#f56e00",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
  },
  changePassword: {
    display: 'flex',
    flexDirection:'row',
    alignItems: "center",
    justifyContent: "space-between",
    width: '80%',
    height: 58,
    backgroundColor: "#FFF2D3",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 25,
    paddingRight: 35,
  },
  iconChangePassword: {
    marginLeft: 45,
  
  },
  token: {
    display: 'none',
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UserInfoComponent;
