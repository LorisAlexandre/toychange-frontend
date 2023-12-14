import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const data = [
  {
    _id: "65781d32e0d7234905e2f8cc",
    title: "SpiderMan",
    type: "exchange",
    deliveryMethod: "inPerson",
    address: "4 allée Jean Sébastien Bach, 51100 Reims",
    images: ["test"],
    category: "test",
    condition: "new",
    description: "Magnifique",
    donor: "65772983d6956600debc663b",
    __v: 0,
  },
  {
    _id: "657820755a69d016b360119a",
    title: "Batman",
    type: "donnation",
    deliveryMethod: "postalDelivery",
    address: "4 allée Jean Sébastien Bach, 51100 Reims",
    images: ["test"],
    category: "test",
    condition: "new",
    description: "de toute beauté",
    weight: "2.0",
    donor: "65772983d6956600debc663b",
    __v: 0,
  },
];

export default function SearchScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Search</Text>
      <View>
        {data.map((item, i) => (
          <View key={i}>
            <Text>{item.title}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("PostScreen", item)}
            >
              <Text>Go to this post</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
});
