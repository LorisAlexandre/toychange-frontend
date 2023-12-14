import { StyleSheet, Text, View } from "react-native";

export default function MyAnnouncesScreen({ navigation, route: { params } }) {
  console.log(params);
  return (
    <View style={styles.container}>
      <Text>Mes announces</Text>
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
