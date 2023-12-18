import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

export default function MyAnnounceScreen({ navigation, route: { params } }) {
  const downloadLabel = async (url) => {
    const filename = `${order.title}-label.pdf`;
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
      {params.order && (
        <TouchableOpacity
          onPress={() => downloadLabel(params.order.parcel.label_url)}
        >
          <Text>Download Label</Text>
        </TouchableOpacity>
      )}
      {!params.order && (
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
