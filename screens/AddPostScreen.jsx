import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AddPostScreen() {
  return (
    <View style={styles.container}>
      <Text>Add Post</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
});
