import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function InboxScreen({ navigation, route: { params } }) {
  const { authToken } = useSelector((state) => state.user.value);
  const userId = "657c1a3848e419b2ec4d5f8e";

  const [channels, setChannels] = useState([]);

  useEffect(() => {
    if (!authToken) {
      Alert.alert("Connectez vous !");
      navigation.navigate("Mon Compte");
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
      <View>
        {channels.map((channel, i) => (
          <TouchableOpacity
            key={i}
            onPress={() =>
              navigation.navigate("MyChannelScreen", { channel: channel._id })
            }
          >
            {channel.annonce && (
              <View>
                <Text>{channel.annonce.title}</Text>
                <Text>{channel.annonce.type}</Text>
                <Text>{channel.annonce.category}</Text>
              </View>
            )}
            {channel.messages.length > 0 && (
              <Text>
                {channel.messages[channel.messages.length - 1].createdAt}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
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
