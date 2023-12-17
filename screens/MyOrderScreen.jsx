import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { useEffect } from "react";

export default function MyOrderScreen({ navigation, route: { params } }) {
  return (
    <View style={styles.container}>
      <Text>{params.announce.title}</Text>
      <Text>{params.parcel.tracking_number}</Text>
      {params.type === "exchange" ? <Text>Echange</Text> : <Text>Don</Text>}
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
