import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Pusher from "pusher-js/react-native";

export default function MyChannelScreen({ navigation, route: { params } }) {
  const user = { _id: "657abe9a610232ebea32150b" };
  const pusher = new Pusher("d002a5433a19822c44de", { cluster: "eu" });

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const sub = pusher.subscribe(params.channel._id);

    sub.bind("pusher:subscription_succeeded", () => {
      sub.bind("Message", handleReceiveMessage);
    });
    // fetch(
    //   `https://toychange-backend.vercel.app/pusherAPI/${params.channel._id}/messages`
    // )
    //   .then((res) => res.json())
    //   .then((data) => {});
    return () => {
      sub.unbind_all();
      pusher.unsubscribe(params.channel._id);
    };
  }, [navigation]);

  console.log("connection");

  const handleReceiveMessage = (data) => {
    setMessages((messages) => [...messages, data]);
  };

  const handleSendMessage = () => {
    if (!messageText) {
      return;
    }

    const payload = {
      text: messageText,
      sender: user._id,
    };

    fetch(
      `https://toychange-backend.vercel.app/pusherAPI/${params.channel._id}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => res.json())
      .then((data) => console.log(data.channel.messages));

    setMessageText("");
  };

  return (
    <View style={styles.container}>
      <Text>Mon channel {params.channel._id}</Text>
      <Text>Mes messages {messages.length}</Text>
      {messages.length > 0 &&
        messages.map((mess) => (
          <Text>
            {mess.sender}: {mess.text}
          </Text>
        ))}
      <TextInput
        style={{ borderWidth: 1, width: "100%" }}
        value={messageText}
        onChangeText={(value) => setMessageText(value)}
      />
      <TouchableOpacity onPress={handleSendMessage}>
        <Text>Send</Text>
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
