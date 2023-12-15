import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Pusher from "pusher-js/react-native";

export default function MyChannelScreen({ navigation, route: { params } }) {
  const user = { _id: "657c1a3848e419b2ec4d5f8e", username: "M" };

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [recipient, setRecipient] = useState({});

  useEffect(() => {
    const pusher = new Pusher("d002a5433a19822c44de", { cluster: "eu" });

    const sub = pusher.subscribe(params.channel);

    sub.bind("pusher:subscription_succeeded", () => {
      sub.bind("Message", handleReceiveMessage);
    });
    fetch(
      `https://toychange-backend.vercel.app/pusherAPI/${params.channel}/messages`
    )
      .then((res) => res.json())
      .then(({ result, channel }) => {
        if (result) {
          switch (user._id) {
            case channel.buyer._id:
              setRecipient(channel.seller);
              break;
            case channel.seller._id:
              setRecipient(channel.buyer);
              break;
          }
          if (channel.messages.length) {
            handleReceiveOldMessage(channel.messages);
          }
        }
      });
    return () => {
      sub.unbind_all();
      pusher.unsubscribe(params.channel);
    };
  }, []);

  const handleReceiveOldMessage = (oldMessages) => {
    setMessages((messages) => [...messages, ...oldMessages]);
  };

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
      `https://toychange-backend.vercel.app/pusherAPI/${params.channel}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => res.json())
      .then((data) =>
        console.log(data.channel.messages[data.channel.messages.length - 1])
      );

    setMessageText("");
  };

  return (
    <View style={styles.container}>
      <Text>Mon channel {params.channel}</Text>
      <Text>Mes messages {messages.length}</Text>
      <ScrollView>
        {messages.length > 0 &&
          messages.map((mess, i) => (
            <Text key={i}>
              {mess.sender === user._id ? user.username : recipient.username}:{" "}
              {mess.text}
            </Text>
          ))}
      </ScrollView>

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
