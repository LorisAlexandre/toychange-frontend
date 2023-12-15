import { StyleSheet, Text, View } from "react-native";

export default function NewAnnounces() {
  return (
    <View style={styles.container}>
      <Text>Nouvelles annonces</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
