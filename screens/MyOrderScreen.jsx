import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MyOrderScreen({ navigation, route: { params } }) {
  const { _id } = useSelector((state) => state.user.value);
  const [orderSeller, setOrderSeller] = useState(null);

  useEffect(() => {
    // verif si un order a comme exchange proposal alors return
    // pareil pour annonce il faut inverser les deux
    fetch(
      `https://toychange-backend.vercel.app/order/ordersByAnnounce/${params.announce._id}`
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

  return (
    <View style={styles.container}>
      <Text>{params.announce.title}</Text>
      <Text>N° de suivi: {params.parcel.tracking_number}</Text>
      {params.announce.type === "exchange" ? (
        <Text>Echange</Text>
      ) : (
        <Text>Don</Text>
      )}
      {_id !== params.announce.donor && (
        <>
          <Text>Obj à envoyer: {params.announce.exchangeProposal.title}</Text>
          <Text>Obj à recevoir: {params.announce.title}</Text>
          {orderSeller && (
            <TouchableOpacity
              onPress={() => downloadLabel(orderSeller.parcel.label_url)}
            >
              <Text>Download Label</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {_id === params.announce.donor && (
        <>
          <Text>Obj à envoyer: {params.announce.title} cf vos annonces</Text>
          <Text>Obj à recevoir: {params.announce.exchangeProposal.title}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
