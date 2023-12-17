import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Pusher from "pusher-js/react-native";

export default function MyChannelScreen({ navigation, route: { params } }) {
  const user = { _id: "657c1a3848e419b2ec4d5f8e", username: "M" };

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [recipient, setRecipient] = useState({});
  const [announce, setAnnounce] = useState({});
  const [proposal, setPorposal] = useState(false);
  const [imagesToSend, setImagesToSend] = useState([]);

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
          setAnnounce({ ...channel.annonce });
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

  // messages.map((e) => {
  //   console.log(e);
  // });

  const handleReceiveOldMessage = (oldMessages) => {
    setMessages((messages) => [...messages, ...oldMessages]);
  };

  const handleReceiveMessage = (data) => {
    setMessages((messages) => [...messages, data]);
  };

  const handleSendMessage = () => {
    if (!messageText && !imagesToSend.length) {
      return;
    }

    if (messageText) {
      const payloadText = {
        label: proposal ? "proposal" : "",
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
          body: JSON.stringify(payloadText),
        }
      )
        .then((res) => res.json())
        .then((data) =>
          console.log(data.channel.messages[data.channel.messages.length - 1])
        );
    }

    if (imagesToSend.length) {
      const formData = new FormData();
      imagesToSend.map((uri) =>
        formData.append("photosFromFront", {
          uri,
          name: "image.jpg",
          type: "image/jpeg",
        })
      );
      fetch(
        `https://toychange-backend.vercel.app/pusherAPI/${params.channel}/image`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((res) => res.json())
        .then((data) =>
          console.log(data.channel.messages[data.channel.messages.length - 1])
        );
    }

    setMessageText("");
    setImagesToSend([]);
  };

  const pickImage = async () => {
    if (imagesToSend.length >= 2) {
      Alert.alert("Maxi 2 img");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
      selectionLimit: 2,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const imagesUri = result.assets.map(({ uri }) => uri);
      setImagesToSend((images) => [...images, ...imagesUri]);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Mon channel {params.channel}</Text>
      <Text>Mes messages {messages.length}</Text>
      <ScrollView>
        {messages.length > 0 &&
          messages.map((mess, i) => (
            <View key={i}>
              <Text>{mess.sender}:</Text>
              {mess.text ? (
                <Text>{mess.text}</Text>
              ) : (
                <View>
                  {mess.images.map((img, i) => (
                    <Image
                      key={i}
                      source={{ uri: img }}
                      width={50}
                      height={50}
                    />
                  ))}
                </View>
              )}
            </View>
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
      <TouchableOpacity onPress={pickImage}>
        <Text>Images</Text>
      </TouchableOpacity>
      {imagesToSend.map((img) => (
        <Image source={{ uri: img }} width={50} height={50} />
      ))}
      {announce.type === "exchange" && (
        <TouchableOpacity onPress={() => setPorposal(true)}>
          <Text>Exchange proposal</Text>
        </TouchableOpacity>
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
