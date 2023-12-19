import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { login } from "../reducers/user";
import { FontAwesome } from "@expo/vector-icons";

function SignIn() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {

    try {
      const response = await fetch(
        "https://toychange-backend.vercel.app/users/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      if(data.result) {
        dispatch(
          login({
            authToken: data.authToken,
            username: data.username,
            firstname: data.firstname,
            lastname: data.lastname,
            _id: data._id,
            email: data.email,
          })
        );
  
        Alert.alert("Success !", "Welcome");
      } else { Alert.alert("Wrong !", "Email ou mot de passe incorrect");}
      // Dispatch l'action login avec les informations de l'utilisateur connecté
     
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.signin}>Connectez-vous à votre compte !</Text>
      <TextInput
        placeholder="Votre Email"
        value={email}
        onChangeText={(value) => setEmail(value)}
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={(value) => setPassword(value)}
        secureTextEntry={!showPassword}
        style={styles.inputPassword}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        style={styles.eyeIcon}
      >
        <FontAwesome
          name={showPassword ? "eye" : "eye-slash"}
          size={20}
          color="#f56e00"
        />
      </TouchableOpacity>
    </View>
      <TouchableOpacity
        onPress={() => handleSignIn()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>C'est partit !</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: "90%",
    height: "20%",
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  signin: {
    marginTop: 50,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    fontSize: 18,
    color: "#FF8B0A",
    marginBottom: 20,
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
    alignItems: "center",
    justifyContent: "center",
    width: 330,
    height: 48,
    marginTop: 20,
    backgroundColor: "#f56e00",
    borderRadius: 8,
  },
  textButton: {
    color: "#ffffff",
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
    width: 330,
    height: 48,
    marginTop: 10,
    borderColor: "#FF8B0A",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    padding: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 10, 
  },
  inputPassword: {
    fontSize: 18,

  }
});

export default SignIn;
