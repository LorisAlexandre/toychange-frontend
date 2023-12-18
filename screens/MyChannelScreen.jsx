import { useCallback, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Pusher from "pusher-js/react-native";
import Message from "../components/Message";
import { useSelector } from "react-redux";

export default function MyChannelScreen({ navigation, route: { params } }) {
  const user = useSelector((state) => state.user.value);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [recipient, setRecipient] = useState({});
  const [announce, setAnnounce] = useState({});
  const [label, setLabel] = useState("");
  const [traded, setTraded] = useState(false);
  const [imagesToSend, setImagesToSend] = useState([]);
  const [replyToMess, setReplyToMess] = useState({});

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

  const handleReady = () => {
    // L'échangeur doit créer son "annonce" et payer ses frais de livraisons, order créer
    // Si order créer alors annonce Acheté donc vendeur va dans annonce Acheté et paye ses shippingFees
    // download des labels et les users s'envoient leur colis
    navigation.navigate("AddExchangePostScreen", {
      recipient,
      announce,
      redirectTo: "CheckoutScreen",
    });
  };

  const handleAccept = (mess) => {
    setLabel("replyTo");
    setReplyToMess(mess);
    setMessageText("I accept your deal");
    setTraded(true);
  };
  const handleDecline = (mess) => {
    setLabel("replyTo");
    setReplyToMess(mess);
    setMessageText("I decline your deal");
  };

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
        label,
        traded,
        text: messageText,
        sender: user._id,
        replyTo: label === "replyTo" && {
          label: replyToMess.label,
          sender: replyToMess.sender,
          images: [...replyToMess.images],
          text: replyToMess.text,
        },
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
        .then(
          (data) =>
            console.log(data.channel.messages[data.channel.messages.length - 1])
          // if traded true envoie notif !!
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
        `https://toychange-backend.vercel.app/pusherAPI/${params.channel}/image?sender=${user._id}&label=${label}`,
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
    setReplyToMess({});
    setLabel("");
    setTraded(false);
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
        {messages.some((e) => e.traded) && (
          <TouchableOpacity
            disabled={messages.find((e) => e.traded).sender === user._id}
            onPress={() => handleReady(user._id)}
          >
            <Text>
              Echanger pour: {messages.find((e) => e.traded).replyTo.text}
            </Text>
            <Text>
              {messages.find((e) => e.traded).sender === user._id
                ? "Me"
                : recipient.username}{" "}
              est chaud
            </Text>
          </TouchableOpacity>
        )}
        {messages.length > 0 &&
          messages.map((mess, i) => (
            <TouchableOpacity
              key={i}
              onLongPress={() => {
                setLabel("replyTo");
                setReplyToMess(mess);
              }}
            >
              <Message
                {...mess}
                messSender={
                  mess.sender === user._id ? "Me" : recipient.username
                }
                handleAccept={handleAccept}
                handleDecline={handleDecline}
              />
            </TouchableOpacity>
          ))}
      </ScrollView>

      {!!replyToMess.text && (
        <View>
          <Text>reply to : {replyToMess.text}</Text>
          <TouchableOpacity onPress={() => setReplyToMess({})}>
            <Text>x</Text>
          </TouchableOpacity>
        </View>
      )}
      {label === "proposal" && (
        <View>
          <Text>Proposal:</Text>
          <TouchableOpacity onPress={() => setLabel("")}>
            <Text>x</Text>
          </TouchableOpacity>
        </View>
      )}
      <KeyboardAvoidingView style={{ width: "100%" }}>
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
          <TouchableOpacity
            disabled={announce.donor === user._id}
            onPress={() => setLabel("proposal")}
          >
            <Text>Exchange proposal</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
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
