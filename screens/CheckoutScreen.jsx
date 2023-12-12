import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CheckoutScreen({ navigation, route: { params } }) {
  return (
    <View style={styles.container}>
      <Text>CheckoutScreen</Text>
      <Text>{params.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
});
