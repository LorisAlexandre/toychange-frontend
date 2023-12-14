import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PostScreen({ navigation, route: { params } }) {
  console.log(params);
  const user = { _id: "657abe9a610232ebea32150b" };
  const handleRedirectMessage = () => {
    fetch(
      `https://toychange-backend.vercel.app/pusherAPI/channel?buyer=${user._id}&annonce=${params._id}&seller=${params.donor}`
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
                buyer: user._id,
                seller: params.donnor,
                annonce: params._id,
              }),
            }
          )
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
            });
        } else {
          navigation.navigate("Messages", data.channel);
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
      {params.deliveryMethod === "inPerson" ? (
        <TouchableOpacity
          onPress={() => {
            handleRedirectMessage();
          }}
        >
          <Text>Contacter</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity
            onPress={() => {
              handleRedirectMessage();
            }}
          >
            <Text>Contacter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("CheckoutScreen", params)}
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
