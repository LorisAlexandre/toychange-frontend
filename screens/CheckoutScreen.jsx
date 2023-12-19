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
import * as Notifications from "expo-notifications";
import { useSelector } from "react-redux";

export default function CheckoutScreen({ navigation, route: { params } }) {
  const user = useSelector((state) => state.user.value);

  const { announce, exchangeProposal } = params;

  const [to_postal_code, setTo_postal_code] = useState("");
  const [shippingFees, setShippingFees] = useState(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [userInfos, setUserInfos] = useState({
    address: "",
    house_number: "",
    city: "",
    telephone: "",
    email: "",
  });

  const handleChange = (name, value) => {
    setUserInfos((payload) => ({ ...payload, [name]: value }));
  };

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
          weight: announce.weight,
        }),
      }
    );
    const data = await res.json();
    if (data.result) {
      if (data.data) {
        setShippingFees(data.data[1].countries[0].price);
      }
    }
  };

  const sendNotificationToSeller = async (article) => {
    if (!article.donor.notifToken) {
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${article.title} a créé un sourir !`,
        body: `Merci à vous pour ce partage !`,
      },
      to: article.donor,
    });
  };

  const createParcel = () => {
    fetch("https://toychange-backend.vercel.app/sendcloudAPI/createParcel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${user.firstname} ${user.lastname}`,
        address: userInfos.address,
        house_number: userInfos.house_number,
        city: userInfos.city,
        postal_code: to_postal_code,
        telephone: userInfos.telephone,
        email: userInfos.email,
        weight: exchangeProposal ? exchangeProposal.weight : announce.weight,
        total_order_value: shippingFees,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log("parcel created");
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
              if (data.result) {
                console.log("label download");
                fetch(
                  "https://toychange-backend.vercel.app/order/createOrder",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      announce: announce._id,
                      user: user._id,
                      // seller: exchangeProposal
                      //   ? exchangeProposal.exchanger
                      //   : announce.donor,
                      seller: announce.donor,
                      parcel: {
                        tracking_number: parcel.tracking_number,
                        label_url: data.url,
                        parcel_id: parcel.id,
                      },
                    }),
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.result) {
                      sendNotificationToSeller(data.order);
                      const order = data.order;
                      Alert.alert("Success", "Your order is confirmed!");
                      navigation.replace("Mon Compte", {
                        order,
                        redirect: "MyOrdersScreen",
                      });
                    }
                  });
              }
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
      <Text>{announce.title}</Text>
      <Text>{announce.type}</Text>
      <TextInput
        placeholder="postalcode"
        style={{ borderWidth: 1, width: "100%" }}
        keyboardType="number-pad"
        maxLength={5}
        autoFocus
        clearTextOnFocus
        returnKeyType="done"
        onSubmitEditing={() =>
          fetchShippingPrice(to_postal_code, announce.address.postalCode)
        }
        value={to_postal_code}
        onChangeText={(value) => setTo_postal_code(value)}
      />
      <TextInput
        style={{ borderWidth: 1, width: "100%" }}
        placeholder="rue du pissenlit"
        value={userInfos.address}
        onChangeText={(value) => handleChange("address", value)}
      />
      <TextInput
        style={{ borderWidth: 1, width: "100%" }}
        placeholder="Mimizan"
        value={userInfos.city}
        onChangeText={(value) => handleChange("city", value)}
      />
      <TextInput
        style={{ borderWidth: 1, width: "100%" }}
        placeholder="+33 6 06 06 06 06"
        value={userInfos.telephone}
        onChangeText={(value) => handleChange("telephone", value)}
      />
      <TextInput
        style={{ borderWidth: 1, width: "100%" }}
        placeholder="johndoe@gmail.com"
        value={userInfos.email}
        onChangeText={(value) => handleChange("email", value)}
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
