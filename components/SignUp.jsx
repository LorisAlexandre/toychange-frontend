import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";

export default function SignUp() {
  const user = useSelector((state) => state.user.value);

  const dispatch = useDispatch();
  const navigation = useNavigation(); // Initialise useNavigation

  const [username, setUsername] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailInput = useRef(null);
  const firstnameInput = useRef(null);
  const lastnameInput = useRef(null);
  const usernameInput = useRef(null);
  const passwordInput = useRef(null);

  const handleSubmit = () => {
    fetch("https://toychange-backend.vercel.app/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA SIGNUP", data);
        if (data.result) {
          // Dispatch l'action addUser avec les informations de l'utilisateur
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

          setUsername("");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");

          // Utilise la navigation pour rediriger vers "InfosUser"
          navigation.navigate("InfosUser");
        } else {
          console.error("Erreur lors de l'inscription :", data);
        }
      })
      .catch((error) => {
        console.error("Erreur réseau lors de l'inscription :", error);
      });
  };

  return (
    //   <Text style={styles.title}>Créer votre compte ToyChange !</Text>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer votre compte ToyChange !</Text>
      <View style={styles.inputContainer}>
        <TextInput
          returnKeyType="next"
          onSubmitEditing={() => firstnameInput.current.focus()}
          ref={usernameInput}
          type="text"
          style={styles.input}
          onChangeText={(value) => setUsername(value)}
          value={username}
          placeholder="Username"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          returnKeyType="next"
          onSubmitEditing={() => lastnameInput.current.focus()}
          ref={firstnameInput}
          type="text"
          style={styles.input}
          onChangeText={(value) => setFirstName(value)}
          value={firstname}
          placeholder="Firstname"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          returnKeyType="next"
          onSubmitEditing={() => emailInput.current.focus()}
          ref={lastnameInput}
          type="text"
          style={styles.input}
          onChangeText={(value) => setLastName(value)}
          value={lastname}
          placeholder="lastname"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          returnKeyType="next"
          onSubmitEditing={() => passwordInput.current.focus()}
          ref={emailInput}
          type="email"
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          value={email}
          placeholder="email"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          secureTextEntry={!showPassword}
          returnKeyType="next"
          ref={passwordInput}
          type="password"
          style={styles.input}
          onChangeText={(value) => setPassword(value.toString())}
          value={password}
          placeholder="Password"
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
      <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
        <Text style={styles.btnText}>Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
    gap: 20,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  title: {
    marginTop: 10,
    fontSize: 19,
    textAlign: "center",
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
    marginTop: 30,
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
