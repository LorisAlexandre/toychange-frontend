import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import FontAwesome from "react-native-vector-icons/FontAwesome5";
import dateFormater from "../functions/dateFormater";

export default function InboxScreen({ navigation }) {
  const { authToken, _id } = useSelector((state) => state.user.value);

  const [channels, setChannels] = useState([]);

  useEffect(() => {
    if (!authToken) {
      Alert.alert("Connectez vous !");
      navigation.navigate("Mon Compte");
    }
    fetch(`https://toychange-backend.vercel.app/pusherAPI/channels/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setChannels(data.channels);
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={[
          styles.title,
          styles.margin,
          { textAlign: "center", marginVertical: 20 },
        ]}
      >
        Mes messages
      </Text>
      <ScrollView>
        <View style={{ gap: 20 }}>
          {channels.length ? (
            channels.map((channel, i) => (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  navigation.navigate("MyChannelScreen", {
                    channel: channel._id,
                  })
                }
              >
                {channel.annonce && (
                  <View
                    style={[
                      styles.margin,
                      {
                        alignContent: "center",
                        justifyContent: "space-between",
                        backgroundColor: "red",
                      },
                    ]}
                  >
                    <ImageBackground
                      source={{ uri: channel.annonce.images[0] }}
                      style={{ width: 50, height: 50 }}
                    >
                      {!channel.annonce.images[0] && (
                        <FontAwesome name="image" size={50} color={"#F56E00"} />
                      )}
                    </ImageBackground>
                    <View>
                      <Text style={{ fontSize: 16, color: "#461904" }}>
                        {channel.annonce.title}
                      </Text>
                      <View style={[{ flexDirection: "row" }]}>
                        <Text
                          style={[
                            styles.label,
                            channel.messages.some((e) => e.traded) && {
                              backgroundColor: "#09a70b",
                            },
                          ]}
                        >
                          {channel.annonce.type === "exchange"
                            ? "Echange"
                            : "Don"}
                          {channel.messages.some((e) => e.traded) && (
                            <>
                              {" "}
                              <FontAwesome name="check" />
                            </>
                          )}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      {channel.messages.length > 0 && (
                        <>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "gray",
                              textAlign: "right",
                            }}
                          >
                            {channel.messages[channel.messages.length - 1].text}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "gray",
                              textAlign: "right",
                            }}
                          >
                            {
                              dateFormater(
                                channel.messages[channel.messages.length - 1]
                                  .createdAt
                              ).heure
                            }{" "}
                            {
                              dateFormater(
                                channel.messages[channel.messages.length - 1]
                                  .createdAt
                              ).date
                            }
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "gray",
                              textAlign: "right",
                            }}
                          >
                            {channel.messages[channel.messages.length - 1]
                              .sender === _id && "moi"}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={[
                styles.margin,
                styles.title,
                { fontSize: 19, textAlign: "center" },
              ]}
            >
              Aucun message pour le moment !
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  title: {
    fontSize: 31,
    fontWeight: "bold",
    color: "#461904",
  },
  label: {
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
});
