import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function MyAccountScreen({navigation, route:{params}}) {
  const user = useSelector((state) => state.user.value);

  if (!user) {
    return (
      <View style={styles.container}>
        <LoginComponent />
      </View>
    );
  }

  if (tokenIsValid) {
    return (
      <View style={styles.container}>
        <Text>Nom: {user.firstname}</Text>
        <Text>Prénom: {user.lastname}</Text>
        <Text>Username: {user.username}</Text>
        <Text>Email: {user.email}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ReconnectionComponent />
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightpink",
    alignItems: "center",
    justifyContent: "center",
  },
});
