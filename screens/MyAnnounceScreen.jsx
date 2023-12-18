import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

export default function MyAnnounceScreen({ navigation, route: { params } }) {
  const { announce, order } = params;

  console.log(order);

  const downloadLabel = async (url) => {
    const filename = `${announce.title}-label.pdf`;
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
      <Text>{announce.title}</Text>
      {order && (
        <View>
          <Text>Obj à échanger: {announce.exchangeProposal.title}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CheckoutScreen", {
                announce: announce,
                exchangeProposal: announce.exchangeProposal,
              })
            }
          >
            <Text>Payer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => downloadLabel(order.parcel.label_url)}
          >
            <Text>Download Label</Text>
          </TouchableOpacity>
        </View>
      )}
      {!order && (
        <View>
          <TouchableOpacity>
            <Text>Supprimer</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Modifier</Text>
          </TouchableOpacity>
        </View>
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
