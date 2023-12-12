import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const data = {
  title: "annonce test",
  price: "prix de l'annonce",
};

export default function SearchScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Search</Text>
      <TouchableOpacity onPress={() => navigation.navigate("PostScreen", data)}>
        <Text>Go to this post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
});
