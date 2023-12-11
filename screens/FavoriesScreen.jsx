import { StyleSheet, Text, View } from "react-native";

export default function FavoriesScreen() {
  return (
    <View style={styles.container}>
      <Text>Favories</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightpink",
    alignItems: "center",
    justifyContent: "center",
  },
});
