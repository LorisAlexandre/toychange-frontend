import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const data = [
  {
    _id: {
      $oid: "65781d32e0d7234905e2f8cc",
    },
    title: "SpiderMan",
    type: "exchange",
    deliveryMethod: "inPerson",
    address: "4 allée Jean Sébastien Bach, 51100 Reims",
    images: ["test"],
    category: "test",
    condition: "new",
    description: "Magnifique",
    donor: {
      $oid: "65772983d6956600debc663b",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "657820755a69d016b360119a",
    },
    title: "Batman",
    type: "donnation",
    deliveryMethod: "postalDelivery",
    address: "4 allée Jean Sébastien Bach, 51100 Reims",
    images: ["test"],
    category: "test",
    condition: "new",
    description: "de toute beauté",
    weight: "2.0",
    donor: {
      $oid: "65772983d6956600debc663b",
    },
    __v: 0,
  },
];

export default function SearchScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.title}></View>
      <Text style={styles.titleText}>ToyChange</Text>
      <TextInput style={styles.inputSearch} placeholder="Search"/>
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
    display: 'flex',
    width: 390,
    height: 844,
    paddinTop: 30,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    display: 'flex',
    width: 319,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  titleText: {
    display: 'flex',
    textAlign: 'center',
    fontSize: 50,
    fontStyle: 'normal',
    fontWeight: 700,
 

  },
  inputSearch: {
    display: 'flex',
    width: 292,
    height:48,
    textAlign: 'center',
    borderColor: "#FFA732",
    borderWidth: 1,
    borderRadius: 8,


  },
});
