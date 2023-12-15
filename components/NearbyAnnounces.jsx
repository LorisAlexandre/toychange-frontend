import { StyleSheet, Text, View } from "react-native";

export default function NewAnnounces() {
  return (
    <View style={styles.container}>
      <Text>Annonces proches</Text>
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
