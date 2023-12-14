import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

export default function CheckoutScreen({ navigation, route: { params } }) {
  const user = {
    name: "Loris",
    address: "avenue du Canigou",
    house_number: "36",
    city: "Canet-en-Roussillon",
    postal_code: "66140",
    telephone: "+33769395249",
    email: "loris.alexandre@gmail.com",
  };

  const item = params;

  const [to_postal_code, setTo_postal_code] = useState("");
  const [shippingFees, setShippingFees] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      "https://toychange-backend.vercel.app/stripeAPI/payment-sheet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shippingFees }),
      }
    );
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Toy Change",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        name: "User name",
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      navigation.goBack();
    } else {
      createParcel();
      Alert.alert("Success", "Your order is confirmed!");
      // navigation.navigate("", "");
    }
  };

  const fetchShippingPrice = async (to_postal_code, from_postal_code) => {
    const res = await fetch(
      "https://toychange-backend.vercel.app/sendcloudAPI/shippingPrice",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to_postal_code,
          from_postal_code,
          weight: item.weight,
        }),
      }
    );
    const data = await res.json();
    if (data.result) {
      setShippingFees(data.data[1].countries[0].price);
    }
  };

  const createParcel = () => {
    fetch("https://toychange-backend.vercel.app/sendcloudAPI/createParcel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name,
        address: user.address,
        house_number: user.house_number,
        city: user.city,
        postal_code: user.postal_code,
        telephone: user.telephone,
        email: user.email,
        weight: item.weight,
        total_order_value: shippingFees,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          // navigation.navigate("Mon Compte", {
          //   parcel: data.data.parcel,
          //   redirect: "MyAnnouncesScreen",
          // });
          const parcel = data.data.parcel;
          fetch(
            `https://toychange-backend.vercel.app/sendcloudAPI/downloadLabel/${parcel.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
            });
        }
      });
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [shippingFees]);

  return (
    <View style={styles.container}>
      <Text>Your Cart</Text>
      <Text>{item.title}</Text>
      <Text>{item.type}</Text>
      <TextInput
        style={{ borderWidth: 1, width: "100%" }}
        keyboardType="number-pad"
        maxLength={5}
        autoFocus
        clearTextOnFocus
        returnKeyType="done"
        onSubmitEditing={() =>
          fetchShippingPrice(to_postal_code, user.postal_code)
        }
        value={to_postal_code}
        onChangeText={(value) => setTo_postal_code(value)}
      />

      <TouchableOpacity
        disabled={!loading || !shippingFees}
        onPress={openPaymentSheet}
      >
        <Text>Checkout €{shippingFees}</Text>
      </TouchableOpacity>
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
