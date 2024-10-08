import { FontAwesome } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../reducers/user";

export default function SignIn() {
  const user = useSelector((state) => state.user.value);

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

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
      console.log("DATA SIGNIN", data);
      if (data.result) {
        // Dispatch l'action login avec les informations de l'utilisateur connecté
        dispatch(
          login({
            authToken: data.authToken,
            username: data.username,
            firstname: data.firstname,
            lastname: data.lastname,
            _id: data._id,
            email: data.email,
            registrationDate: data.registrationDate,
          })
        );
        Alert.alert("Success !", "Welcome");
      } else {
        Alert.alert("Wrong !", "Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <View style={styles.inner}>
      <Text style={styles.title}>Connectez-vous à votre compte !</Text>
      <View style={{ width: "100%", gap: 20, marginTop: 50 }}>
        <View style={styles.inputContainer}>
          <TextInput
            onSubmitEditing={() => passwordInput.current.focus()}
            ref={emailInput}
            returnKeyLabel="next"
            placeholder="Votre Email"
            value={email}
            onChangeText={(value) => setEmail(value)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            ref={passwordInput}
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
    marginTop: 50,
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
