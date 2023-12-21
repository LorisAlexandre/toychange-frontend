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
import Carousel from "../components/Carousel";

export default function MyOrderScreen({ navigation, route: { params } }) {
  const { _id } = useSelector((state) => state.user.value);
  const [orderSeller, setOrderSeller] = useState(null);

  const { order } = params;

  useEffect(() => {
    // vérifier si order.announce existe avant d'accéder à _id
    if (order && order.announce) {
      fetch(`https://toychange-backend.vercel.app/order/ordersByAnnounce/${order.announce._id}`)
        .then((res) => res.json())
        .then(({ result, announces }) => {
          if (result) {
            setOrderSeller(
              announces.find(
                (a) =>
                  a.user === a.seller &&
                  a.announce.exchangeProposal &&
                  a.announce.exchangeProposal.exchanger === _id
              )
            );
          }
        });
    }
  }, [order, _id]);

  const downloadLabel = async (url) => {
    if (
      orderSeller &&
      orderSeller.announce &&
      orderSeller.announce.exchangeProposal
    ) {
      const title = orderSeller.announce.exchangeProposal.title;
      const filename = `${title}-label.pdf`;
      FileSystem.downloadAsync(
        url,
        `${FileSystem.documentDirectory}${filename}`
      ).then((result) => {
        save(result.uri);
      });
    }
  };

  const save = (uri) => {
    shareAsync(uri);
  };

  let condition;

  if (order.announce && order.announce.condition) {
    if (order.announce.condition === "new") {
      condition = "Neuf";
    } else if (order.announce.condition === "likeNew") {
      condition = "Comme neuf";
    } else if (order.announce.condition === "good") {
      condition = "Bon état";
    }
  } else {
    condition = "Condition non disponible";
  }

  let deliveryMethod;

if (order.announce && order.announce.deliveryMethod) {
  if (order.announce.deliveryMethod === "inPerson") {
    deliveryMethod = "En personne";
  } else if (order.announce.deliveryMethod === "postalDelivery") {
    deliveryMethod = "Livraison";
  } else if (order.announce.deliveryMethod === "both") {
    deliveryMethod = "Au choix";
  }
} else {
  deliveryMethod = "Méthode de livraison non disponible";
}

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
        <Carousel images={order.announce?.images || []} />

        <Text style={[styles.margin, styles.title, { marginBottom: 10 }]}>
          {order.announce?.title || "Titre non disponible"}
        </Text>
        <View style={[styles.margin, { gap: 10, marginBottom: 20 }]}>
          <Text style={styles.label}>
          {order.announce && order.announce.type === "exchange" ? "Echange" : "Don"}
          </Text>
          <Text style={styles.label}>{condition}</Text>
          <Text style={styles.label}>{deliveryMethod}</Text>
        </View>
        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 19, color: "#CC5302", marginBottom: 10 }}>
            Description
          </Text>
          <Text style={{ fontWeight: 300, color: "#F56E00" }}>
            {order.announce?.description}
          </Text>
        </View>
        <Text
          style={[
            styles.margin,
            styles.subtitle,
            { marginBottom: 10, textDecorationLine: "underline" },
          ]}
        >
          Informations sur le colis:
        </Text>
        <Text style={[styles.margin, { textAlign: "left", marginBottom: 10 }]}>
          N° de suivi: {order.parcel.tracking_number}
        </Text>
        {_id !== order.announce?.donor && (
          <>
            <Text
              style={[styles.margin, { textAlign: "left", marginBottom: 10 }]}
            >
              Colis à recevoir: {order.announce && order.announce.title ? order.announce.title : "Titre non disponible"}
            </Text>
            {orderSeller ? (
              <TouchableOpacity
                style={[styles.button, styles.margin]}
                onPress={() => downloadLabel(orderSeller.parcel.label_url)}
              >
                <Text style={[styles.margin, styles.buttonText]}>
                  Télécharger l'étiquette
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.margin, { textAlign: "left" }]}>
                En attente du paiement de{" "}
  {order.announce && order.announce.exchangeProposal
    ? order.announce.exchangeProposal.title
    : "titre non disponible"} pour impression de l'étiquette...
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
  subtitle: {
    fontSize: 19,
    color: "#461904",
    textAlign: "center",
  },
});
