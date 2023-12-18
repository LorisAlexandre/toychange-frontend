import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function PostScreen({ navigation, route: { params } }) {
  const { authToken, _id } = useSelector((state) => state.user.value);

  const handleRedirectMessage = () => {
    fetch(
      `https://toychange-backend.vercel.app/pusherAPI/channel?buyer=${_id}&annonce=${params._id}&seller=${params.donor}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.result) {
          fetch(
            "https://toychange-backend.vercel.app/pusherAPI/createChannel",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                buyer: _id,
                seller: params.donor,
                annonce: params._id,
              }),
            }
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.result) {
                navigation.navigate("Messages", {
                  channel: data.channelName,
                  redirect: "MyChannelScreen",
                });
              }
            });
        } else {
          navigation.navigate("Messages", {
            channel: data.channel._id,
            redirect: "MyChannelScreen",
          });
        }
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go back</Text>
      </TouchableOpacity>
      <Text>PostScreen</Text>
      <Text>{params.title}</Text>
      <Text>{params.type}</Text>
      {params.deliveryMethod === "inPerson" || params.type === "exchange" ? (
        <TouchableOpacity
          onPress={() => {
            if (!authToken) {
              navigation.navigate("Mon Compte");
              return;
            }
            handleRedirectMessage();
          }}
        >
          <Text>Contacter</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity
            onPress={() => {
              if (!authToken) {
                navigation.navigate("Mon Compte");
                return;
              }
              handleRedirectMessage();
            }}
          >
            <Text>Contacter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (!authToken) {
                navigation.navigate("Mon Compte");
                return;
              }
              navigation.navigate("CheckoutScreen", params);
            }}
          >
            <Text>Acheter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
  },
});
