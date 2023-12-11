import { StyleSheet, Text, View } from "react-native";

export default function AddPostScreen() {
  return (
    <View style={styles.container}>
      <Text>AddPost</Text>
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
