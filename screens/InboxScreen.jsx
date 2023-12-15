import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function InboxScreen({ navigation, route: { params } }) {
  const user = useSelector((state) => state.user.value);
  const userId = "657c1a3848e419b2ec4d5f8e";

  const [channels, setChannels] = useState([]);

  useEffect(() => {
    if (!user.authToken) {
      return;
    }
    if (params) {
      navigation.navigate(params.redirect, params);
    }
    fetch(`https://toychange-backend.vercel.app/pusherAPI/channels/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setChannels(data.channels);
        }
      });
  }, [params]);

  // console.log(channels[0]);

  return (
    <View style={styles.container}>
      <Text>Inbox</Text>
      {channels.map((channel, i) => (
        <TouchableOpacity
          key={i}
          onPress={() =>
            navigation.navigate("MyChannelScreen", { channel: channel._id })
          }
        >
          <Text>{channel._id}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
});
