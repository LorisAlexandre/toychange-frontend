import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../reducers/user';  
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const ChangePasswordForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const { authToken } = useSelector((state) => state.user.value);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSavePassword = async () => {
    // Valider que les champs ne sont pas vides
    if (!oldPassword || !newPassword || !confirmPassword) {
      // Gérer l'erreur ou afficher un message à l'utilisateur
      console.error("Veuillez remplir tous les champs.");
      return;
    }

    // Valider que le nouveau mot de passe et la confirmation correspondent
    if (newPassword !== confirmPassword) {
      // Gérer l'erreur ou afficher un message à l'utilisateur
      Alert.alert("Erreur", "Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("https://toychange-backend.vercel.app/users/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.result) {
        // Dispatch de l'action pour mettre à jour le mot de passe côté front
        dispatch(updatePassword({ newPassword }));
        // Réinitialiser les champs après la mise à jour réussie
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        Alert.alert("Succès", "Mot de passe mis à jour avec succès.");
      } else {
        Alert.alert("Erreur", data.error || "Erreur lors de la mise à jour du mot de passe.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
      console.error("Erreur réseau détaillée :", error.message);
      Alert.alert("Erreur", "Une erreur inattendue s'est produite.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.iconBack}>
        <FontAwesome name="angle-left" size={56} color="#f56e00" />
      </TouchableOpacity>
      <View style={styles.formContainer}>
        <View>
          <Text style={styles.title}>Modifier votre mot de passe :</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Ancien mot de passe"
          value={oldPassword}
          onChangeText={(value) => setOldPassword(value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChangeText={(value) => setNewPassword(value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmPassword}
          onChangeText={(value) => setConfirmPassword(value)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
          <Text style={styles.buttonText}>Enregistrer le nouveau mot de passe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
  input: {
    width: 330,
    height: 52,
    marginTop: 10,
    borderColor: "#FF8B0A",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    padding: 10,
    marginBottom: 20,
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
  iconBack: {
    position: 'absolute',
    top: 50,
    left: 30,
    backgroundColor: 'transparent',
  },
  title: {
    marginBottom: 40,
    marginTop: 70,
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF2D3',
    fontWeight: "bold",
  },
});

export default ChangePasswordForm;