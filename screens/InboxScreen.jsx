import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function InboxScreen({ navigation, route: { params } }) {
  const user = useSelector((state) => state.user.value);
  const userId = "657abe9a610232ebea32150b";

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

  return (
    <View style={styles.container}>
      <Text>Inbox</Text>
      {channels.map((channel) => (
        <Text>{channel._id}</Text>
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
