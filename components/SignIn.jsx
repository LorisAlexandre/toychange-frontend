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

export default function SignIn() {
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
      if (data.result) {
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
      } else {
        Alert.alert("Wrong !", "Email ou mot de passe incorrect");
      }
      // Dispatch l'action login avec les informations de l'utilisateur connecté
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <View style={styles.inner}>
      <Text style={styles.title}>Connectez-vous à votre compte !</Text>
      <View style={{ width: "100%", gap: 20 }}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Votre Email"
            value={email}
            onChangeText={(value) => setEmail(value)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.inputIcon}
          >
            <FontAwesome
              name={showPassword ? "eye" : "eye-slash"}
              size={20}
              color="#f56e00"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSignIn} style={styles.btn}>
          <Text style={styles.btnText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1, //
    justifyContent: "space-around", //
  },
  title: {
    fontSize: 19,
    textAlign: "center",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f56e00",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btn: {
    backgroundColor: "#f56e00",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#FFF",
  },
  inputIcon: {
    position: "absolute",
    right: 16,
  },
});
