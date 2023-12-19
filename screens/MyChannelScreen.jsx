import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
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

import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function MyChannelScreen({ navigation, route: { params } }) {
  const user = useSelector((state) => state.user.value);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [recipient, setRecipient] = useState({});
  const [announce, setAnnounce] = useState(null);
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

  let condition;

  if (announce?.condition === "new") {
    condition = "Neuf";
  } else if (announce?.condition === "likeNew") {
    condition = "Comme neuf";
  } else if (announce?.condition === "good") {
    condition = "Bon état";
  }

  let deliveryMethod;

  if (announce?.deliveryMethod === "inPerson") {
    deliveryMethod = "En personne";
  } else if (announce?.deliveryMethod === "postalDelivery") {
    deliveryMethod = "Livraison";
  } else if (announce?.deliveryMethod === "both") {
    deliveryMethod = "Au choix";
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.margin,
          { justifyContent: "space-between", alignItems: "center" },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            {
              marginTop: 20,
              alignItems: "center",
              gap: 10,
              flexDirection: "row",
            },
          ]}
        >
          <FontAwesome name="angle-left" color={"#F56E00"} size={28} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("PostScreen", announce)}
        style={[
          styles.margin,
          { alignItems: "center", justifyContent: "space-between" },
        ]}
      >
        <ImageBackground
          source={{ uri: announce?.images[0] }}
          style={{ width: 75, height: 75 }}
        >
          {!announce?.images[0] && (
            <FontAwesome name="image" color={"#F56E00"} size={100} />
          )}
        </ImageBackground>
        <View style={{ gap: 5, alignItems: "flex-end" }}>
          <Text style={{ color: "#461904", fontSize: 19, fontWeight: 700 }}>
            {announce?.title}
          </Text>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={styles.label}>
              {announce?.type === "exchange" ? "Echange" : "Don"}
            </Text>
            <Text style={styles.label}>{condition}</Text>
            <Text style={styles.label}>{deliveryMethod}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {messages.some((e) => e.traded) && (
        <TouchableOpacity
          style={{
            marginHorizontal: 20,
            borderWidth: 1,
            borderColor: "#F56E00",
            paddingVertical: 5,
            alignItems: "center",
            borderRadius: 8,
          }}
          disabled={messages.find((e) => e.traded).sender === user._id}
          onPress={() => handleReady(user._id)}
        >
          <Text>
            Accepter l'échange: {messages.find((e) => e.traded).replyTo.text}
          </Text>
          <Text>
            {messages.find((e) => e.traded).sender === user._id
              ? "J'ai"
              : `${recipient?.username} a`}{" "}
            accepté l'échange
          </Text>
          <Text>Créer le produit à échanger</Text>
        </TouchableOpacity>
      )}

      <ScrollView>
        <View style={styles.messagesContainer}>
          {messages.length > 0 &&
            messages.map((mess, i) => (
              <TouchableOpacity
                style={styles.messages}
                key={i}
                onLongPress={() => {
                  setLabel("replyTo");
                  setReplyToMess(mess);
                }}
              >
                <Message
                  {...mess}
                  messSender={
                    mess.sender === user._id ? "Me" : recipient?.username
                  }
                  handleAccept={handleAccept}
                  handleDecline={handleDecline}
                />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      <View style={[{ gap: 5 }, styles.margin]}>
        {imagesToSend.map((img, i) => (
          <Image key={i} source={{ uri: img }} width={50} height={50} />
        ))}
      </View>
      <KeyboardAvoidingView style={{ width: "100%" }}>
        <View style={[{ gap: 20, marginBottom: 10 }, styles.margin]}>
          <TouchableOpacity onPress={pickImage}>
            <FontAwesome name="file-image" color={"#FFA732"} size={25} />
          </TouchableOpacity>
          {announce?.type === "exchange" && announce?.donor !== user._id && (
            <TouchableOpacity
              disabled={announce?.donor === user._id}
              onPress={() => {
                setLabel("proposal");
              }}
            >
              <FontAwesome name="exchange-alt" color={"#FFA732"} size={25} />
            </TouchableOpacity>
          )}
          {label && (
            <TouchableOpacity
              style={[
                { flexDirection: "row", alignItems: "center", gap: 5 },
                styles.label,
              ]}
              onPress={() => setLabel("")}
            >
              <Text style={{ color: "#FFF" }}>x</Text>
              <Text style={{ color: "#FFF" }}>{label}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            returnKeyType="done"
            placeholder="Votre annonce est toujours dispo ?"
            placeholderTextColor={"#FFA732"}
            style={[styles.textInput]}
            value={messageText}
            onChangeText={(value) => setMessageText(value)}
          />
          <TouchableOpacity onPress={handleSendMessage}>
            <FontAwesome name="paper-plane" color={"#FFA732"} size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    gap: 20,
  },
  margin: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#FFA732",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    color: "#CC5302",
    flex: 1,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  placeholder: {
    color: "#FFA732",
    backgroundColor: "white",
    position: "absolute",
    top: -10,
    left: 35,
    padding: 2,
  },
  label: {
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
  },
  messages: {},
  messagesContainer: {
    marginHorizontal: 20,
  },
});
