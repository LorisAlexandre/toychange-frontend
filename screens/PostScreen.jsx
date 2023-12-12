import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PostScreen({ navigation, route: { params } }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go back</Text>
      </TouchableOpacity>
      <Text>PostScreen</Text>
      <Text>{params.title}</Text>
      <Text>{params.type}</Text>
      {params.deliveryMethod === "inPerson" ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("Messages", params)}
        >
          <Text>Contacter</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Messages", params)}
          >
            <Text>Contacter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("CheckoutScreen", params)}
          >
            <Text>Acheter</Text>
          </TouchableOpacity>
        </View>
      )}
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
