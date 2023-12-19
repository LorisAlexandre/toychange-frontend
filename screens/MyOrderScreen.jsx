import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function MyOrderScreen({ navigation, route: { params } }) {
  const { _id } = useSelector((state) => state.user.value);
  const [orderSeller, setOrderSeller] = useState(null);

  const { order } = params;

  useEffect(() => {
    // verif si un order a comme exchange proposal alors return
    // pareil pour annonce il faut inverser les deux
    fetch(
      `https://toychange-backend.vercel.app/order/ordersByAnnounce/${order.announce._id}`
    )
      .then((res) => res.json())
      .then(({ result, announces }) => {
        if (result) {
          setOrderSeller(
            announces.find(
              (a) =>
                a.user === a.seller &&
                a.announce.exchangeProposal.exchanger === _id
            )
          );
        }
      });
  }, []);

  const downloadLabel = async (url) => {
    const filename = `${orderSeller.announce.exchangeProposal.title}-label.pdf`;
    FileSystem.downloadAsync(
      url,
      `${FileSystem.documentDirectory}${filename}`
    ).then((result) => {
      save(result.uri);
    });
  };

  const save = (uri) => {
    shareAsync(uri);
  };

  let condition;

  if (order.announce.condition === "new") {
    condition = "Neuf";
  } else if (order.announce.condition === "likeNew") {
    condition = "Comme neuf";
  } else if (order.announce.condition === "good") {
    condition = "Bon état";
  }

  let deliveryMethod;

  if (order.announce.deliveryMethod === "inPerson") {
    deliveryMethod = "En personne";
  } else if (order.announce.deliveryMethod === "postalDelivery") {
    deliveryMethod = "Livraison";
  } else if (order.announce.deliveryMethod === "both") {
    deliveryMethod = "Au choix";
  }

  console.log(order);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={[
            {
              marginTop: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              position: "absolute",
              width: "90%",
              zIndex: 100,
            },
            styles.margin,
          ]}
        >
          <TouchableOpacity
            style={styles.backgroundBtn}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="angle-left" color={"#F56E00"} size={28} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          ></View>
        </View>
        <ImageBackground
          source={{ uri: order.announce.images[0] }}
          style={[
            styles.herobanner,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          {!order.announce.images[0] && (
            <FontAwesome name="image" size={100} color={"#F56E00"} />
          )}
        </ImageBackground>

        <Text style={[styles.margin, styles.title, { marginBottom: 10 }]}>
          {order.announce.title}
        </Text>
        <View style={[styles.margin, { gap: 10, marginBottom: 20 }]}>
          <Text style={styles.label}>
            {order.announce.type === "exchange" ? "Echange" : "Don"}
          </Text>
          <Text style={styles.label}>{condition}</Text>
          <Text style={styles.label}>{deliveryMethod}</Text>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 19, color: "#CC5302", marginBottom: 10 }}>
            Description
          </Text>
          <Text style={{ fontWeight: 300, color: "#F56E00" }}>
            {order.announce.description}
          </Text>
        </View>
        <Text>N° de suivi: {order.parcel.tracking_number}</Text>
        {_id !== order.announce.donor && (
          <>
            <Text>Obj à envoyer: {order.announce.exchangeProposal.title}</Text>
            <Text>Obj à recevoir: {order.announce.title}</Text>
            {orderSeller && (
              <TouchableOpacity
                onPress={() => downloadLabel(orderSeller.parcel.label_url)}
              >
                <Text>Download Label</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>

    //     </>
    //   )}
    //   {_id === params.announce.donor && (
    //     <>
    //       <Text>Obj à envoyer: {params.announce.title} cf vos annonces</Text>
    //       <Text>Obj à recevoir: {params.announce.exchangeProposal.title}</Text>
    //     </>
    //   )}
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    gap: 20,
  },
  title: {
    fontSize: 31,
    fontWeight: "bold",
    color: "#461904",
  },
  margin: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  backgroundBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.70)",
    padding: 5,
    borderRadius: 30,
  },
  herobanner: {
    height: 300,
    resizeMode: "cover",
    marginBottom: 10,
  },
  label: {
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
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
