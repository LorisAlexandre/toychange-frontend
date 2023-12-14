import { StyleSheet, Text, View } from "react-native";

export default function MyChannelScreen({ navigation, route: { params } }) {
  return (
    <View style={styles.container}>
      <Text>Mon channel {params.channel}</Text>
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
