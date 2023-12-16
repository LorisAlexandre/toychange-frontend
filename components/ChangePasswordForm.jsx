import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../reducers/user';  
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';



const ChangePasswordForm = () => {
    const navigation = useNavigation();
    
    const handleGoBack = () => {
        navigation.navigate("InfosUser");
      };

  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSavePassword = () => {

    // Valider que les champs ne sont pas vides
    if (!oldPassword || !newPassword || !confirmPassword) {
      // Gérer l'erreur ou afficher un message à l'utilisateur
      console.error("Veuillez remplir tous les champs.");
      return;
    }

    // Valider que le nouveau mot de passe et la confirmation correspondent
    if (newPassword !== confirmPassword) {
      // Gérer l'erreur ou afficher un message à l'utilisateur
      console.error("Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }

    // Dispatch de l'action pour mettre à jour le mot de passe
    dispatch(updatePassword({ oldPassword, newPassword }));

    // Réinitialiser les champs après la mise à jour réussie
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
        <View style={styles.formContainer}>
        <TouchableOpacity onPress={handleGoBack}>
        <FontAwesome name="angle-left" size={24} color="#f56e00" />
      </TouchableOpacity>
            <View>
                <Text style={styles.title}>Modifier votre mot de passe :</Text>
            </View>
      <TextInput
        style={styles.input}
        placeholder="Ancien mot de passe"
        value={oldPassword}
        onChangeText={(text) => setOldPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer le nouveau mot de passe"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
        <Text>Enregistrer le nouveau mot de passe</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
        width: 330,
        height: 48,
        marginTop: 10,
        borderColor: "#FF8B0A",
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 18,
        padding: 10,
      },
      button: {
        color: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        width: 330,
        height: 48,
        marginTop: 20,
        backgroundColor: "#f56e00",
        borderRadius: 8,
      },
})
export default ChangePasswordForm;