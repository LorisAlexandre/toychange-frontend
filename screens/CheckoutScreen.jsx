import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CheckoutScreen({ navigation, route: { params } }) {
  const [to_postal_code, setTo_postal_code] = useState("");
  const [shippingPrice, setShippingPrice] = useState(null);

  useEffect(() => {
    fetch("https://toychange-backend.vercel.app/sendcloudAPI/shippingPrice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to_postal_code: 66140,
        from_postal_code: 59000,
        weight: 2.0,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setShippingPrice(data.data[1].countries[0].price);
      });
  }, [to_postal_code]);

  const item = params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toy Change</Text>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Mon Compte")}>
          <Text>My account</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text>Your cart</Text>
        <Text>{item.title}</Text>
      </View>
      <View>
        <Text>confirm your address:</Text>
        <TextInput
          keyboardType="number-pad"
          value={to_postal_code}
          onChangeText={(value) => setTo_postal_code(value)}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PaymentScreen", { item, shippingPrice })
          }
        >
          <Text>Confirm checkout €{shippingPrice}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightpink",
    alignItems: "flex-start",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 50,
    textAlign: "center",
    width: "100%",
  },
});
