import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

export default function MyOrderScreen({ navigation, route: { params } }) {
  console.log(params);
  const order = { title: "Batmam" };
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
      <Text>{params.parcel.tracking_number}</Text>
      <TouchableOpacity onPress={() => downloadLabel(params.parcel.label_url)}>
        <Text>Download Label</Text>
      </TouchableOpacity>
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
