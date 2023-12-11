import { StyleSheet, Text, View } from "react-native";

export default function MyAccountScreen() {
  return (
    <View style={styles.container}>
      <Text>MyAccount</Text>
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
