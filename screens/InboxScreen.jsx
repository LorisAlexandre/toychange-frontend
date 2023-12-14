import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function InboxScreen({ navigation, route: { params } }) {
  console.log(params);

  useEffect(() => {
    // si chat existe charge le sinon créer le
  }, []);

  return (
    <View style={styles.container}>
      <Text>Inbox</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
});
