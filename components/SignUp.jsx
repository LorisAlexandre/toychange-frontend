import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import { useNavigation } from "@react-navigation/native"; 
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function SignUp() {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Initialise useNavigation

  const [username, setUsername] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    fetch("https://toychange-backend.vercel.app/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View>
          <Text style={styles.title}>Créer votre compte ToyChange !</Text>
        </View>
        <TextInput
          type="text"
          style={styles.input}
          onChangeText={(value) => setUsername(value)}
          value={username}
          placeholder="Username"
        />
        <TextInput
          type="text"
          style={styles.input}
          onChangeText={(value) => setFirstName(value)}
          value={firstname}
          placeholder="Firstname"
        />
        <TextInput
          type="text"
          style={styles.input}
          onChangeText={(value) => setLastName(value)}
          value={lastname}
          placeholder="lastname"
        />
        <TextInput
          type="email"
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          value={email}
          placeholder="email"
        />
        <TextInput
          type="password"
          style={styles.input}
          onChangeText={(value) => setPassword(value.toString())}
          value={password}
          placeholder="Password"
        />
        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.title2}>S'enregistrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    height: "30%",
    fontSize: 18,
    color: "#FF8B0A",
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  title2: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default SignUp;
