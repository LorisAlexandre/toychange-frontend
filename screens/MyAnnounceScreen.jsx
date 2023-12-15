import { StyleSheet, Text, View } from "react-native";

export default function MyAnnounceScreen({ navigation, route: { params } }) {
  return (
    <View style={styles.container}>
      <Text>{params.announce.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
