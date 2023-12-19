import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import * as Notifications from "expo-notifications";
import { useSelector } from "react-redux";

import FontAwesome from "react-native-vector-icons/FontAwesome5";

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

  const areAllValuesExist = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (
          !value ||
          (typeof value === "object" && !areAllValuesExist(value))
        ) {
          console.log(obj, key);
          return false;
        }
      }
    }
    return true;
  };

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <Text
          style={[
            styles.title,
            styles.margin,
            { marginTop: 30, marginBottom: 10, textAlign: "center" },
          ]}
        >
          Toy Change
        </Text>
        <View
          style={[
            styles.margin,
            { justifyContent: "space-between", alignItems: "center" },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              {
                marginTop: 20,
                alignItems: "center",
                gap: 10,
                flexDirection: "row",
              },
            ]}
          >
            <FontAwesome name="angle-left" color={"#F56E00"} size={28} />
            <Text style={{ fontSize: 18, color: "#F56E00" }}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigation("Mon Compte")}
            style={[{ marginTop: 20, alignItems: "center", gap: 10 }]}
          >
            <FontAwesome name="user" color={"#F56E00"} size={28} />
            <Text style={{ color: "#F56E00" }}>Mon Compte</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ marginBottom: 40 }}>
          <Text style={[styles.subTitle, styles.margin]}>Your Cart</Text>
          <View style={{ gap: 20 }}>
            <View
              style={[
                styles.margin,
                { alignItems: "center", justifyContent: "space-between" },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                {!announce.images[0] ? (
                  <FontAwesome name="image" size={50} color={"#F56E00"} />
                ) : (
                  <Image
                    source={{ uri: announce.images[0] }}
                    width={50}
                    height={50}
                  />
                )}
                <Text style={{ color: "#F56E00", fontSize: 16 }}>
                  {announce.title}
                </Text>
              </View>
              <Text style={{ color: "#F56E00" }}>Free</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="done"
                style={[styles.margin, styles.textInput]}
                placeholder="66000"
                placeholderTextColor={"#FFA732"}
                keyboardType="number-pad"
                maxLength={5}
                autoFocus
                clearTextOnFocus
                onSubmitEditing={() =>
                  fetchShippingPrice(
                    to_postal_code,
                    announce.address.postalCode
                  )
                }
                value={to_postal_code}
                onChangeText={(value) => setTo_postal_code(value)}
              />
              <Text style={styles.placeholder}>Code postal</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="done"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={"#FFA732"}
                placeholder="rue du pissenlit"
                value={userInfos.address}
                onChangeText={(value) => handleChange("address", value)}
              />
              <Text style={styles.placeholder}>Nom de rue</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="done"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={"#FFA732"}
                keyboardType="number-pad"
                placeholder="6"
                value={userInfos.house_number}
                onChangeText={(value) => handleChange("house_number", value)}
              />
              <Text style={styles.placeholder}>N° de maison</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="done"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={"#FFA732"}
                placeholder="Mimizan"
                value={userInfos.city}
                onChangeText={(value) => handleChange("city", value)}
              />
              <Text style={styles.placeholder}>Ville</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="done"
                keyboardType="number-pad"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={"#FFA732"}
                placeholder="06 06 06 06 06"
                maxLength={10}
                value={userInfos.telephone}
                onChangeText={(value) => handleChange("telephone", value)}
              />
              <Text style={styles.placeholder}>Telephone</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="done"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={"#FFA732"}
                placeholder="johndoe@gmail.com"
                value={userInfos.email}
                onChangeText={(value) => handleChange("email", value)}
              />
              <Text style={styles.placeholder}>Email</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                { marginHorizontal: 20, marginBottom: 40 },
              ]}
              disabled={!loading || !shippingFees}
              onPress={() => {
                if (!areAllValuesExist(userInfos)) {
                  Alert.alert("Champs manquants");
                  return;
                }
                openPaymentSheet();
              }}
            >
              <Text style={styles.buttonText}>Checkout €{shippingFees}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    gap: 20,
  },
  margin: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#461904",
  },
  subTitle: {
    fontSize: 31,
    fontWeight: "bold",
    color: "#F56E00",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#FFA732",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    color: "#CC5302",
  },
  textInputContainer: {
    position: "relative",
  },
  placeholder: {
    color: "#FFA732",
    backgroundColor: "white",
    position: "absolute",
    top: -10,
    left: 35,
    padding: 2,
  },
  button: {
    backgroundColor: "#F56E00",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
  },
});
