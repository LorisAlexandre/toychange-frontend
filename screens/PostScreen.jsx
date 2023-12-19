import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { addFav, removeFav } from "../reducers/user";

export default function PostScreen({ navigation, route: { params } }) {
  const { authToken, _id, favAnnounces } = useSelector(
    (state) => state.user.value
  );
  const dispatch = useDispatch();

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
                navigation.navigate("MyChannelScreen", {
                  channel: data.channelName,
                });
              }
            });
        } else {
          navigation.navigate("MyChannelScreen", {
            channel: data.channel._id,
          });
        }
      });
  };

  const handleFav = (obj) => {
    const { _id } = obj;
    if (!favAnnounces.find((e) => e._id === _id)) {
      dispatch(addFav(obj));
    } else {
      dispatch(removeFav(obj));
    }
  };

  let condition;

  if (params.condition === "new") {
    condition = "Neuf";
  } else if (params.condition === "likeNew") {
    condition = "Comme neuf";
  } else if (params.condition === "good") {
    condition = "Bon état";
  }

  let deliveryMethod;

  if (params.deliveryMethod === "inPerson") {
    deliveryMethod = "En personne";
  } else if (params.deliveryMethod === "postalDelivery") {
    deliveryMethod = "Livraison";
  } else if (params.deliveryMethod === "both") {
    deliveryMethod = "Au choix";
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          {
            marginTop: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "absolute",
            width: "90%",
            zIndex: 100,
          },
          styles.margin,
        ]}
      >
        <TouchableOpacity
          style={styles.backgroundBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-left" color={"#F56E00"} size={28} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* <TouchableOpacity style={styles.backgroundBtn} onPress={() => ""}>
            <FontAwesome name="share-alt" color={"#F56E00"} size={20} />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.backgroundBtn}
            onPress={() => handleFav(params)}
          >
            <FontAwesome
              name="heart"
              color={
                favAnnounces.some((e) => e._id === params._id) ? "red" : "gray"
              }
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <ImageBackground
          source={{ uri: params.images[0] }}
          style={[
            styles.herobanner,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          {!params.images[0] && (
            <FontAwesome name="image" size={100} color={"#F56E00"} />
          )}
        </ImageBackground>

        <Text style={[styles.margin, styles.title, { marginBottom: 10 }]}>
          {params.title}
        </Text>
        <View style={[styles.margin, { gap: 10, marginBottom: 20 }]}>
          <Text style={styles.label}>
            {params.type === "exchange" ? "Echange" : "Don"}
          </Text>
          <Text style={styles.label}>{condition}</Text>
          <Text style={styles.label}>{deliveryMethod}</Text>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 19, color: "#CC5302", marginBottom: 10 }}>
            Description
          </Text>
          <Text style={{ fontWeight: 300, color: "#F56E00" }}>
            {params.description}
          </Text>
        </View>
      </ScrollView>
      {params.deliveryMethod === "inPerson" || params.type === "exchange" ? (
        <TouchableOpacity
          style={[styles.button, styles.margin]}
          onPress={() => {
            if (!authToken) {
              navigation.navigate("Mon Compte");
              return;
            }
            handleRedirectMessage();
          }}
        >
          <Text style={styles.buttonText}>Contacter</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.margin, { gap: 10 }]}>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }]}
            onPress={() => {
              if (!authToken) {
                navigation.navigate("Mon Compte");
                return;
              }
              handleRedirectMessage();
            }}
          >
            <Text style={styles.buttonText}>Contacter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }]}
            onPress={() => {
              if (!authToken) {
                navigation.navigate("Mon Compte");
                return;
              }
              navigation.navigate("CheckoutScreen", { announce: params });
            }}
          >
            <Text style={styles.buttonText}>Acheter</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    gap: 20,
  },
  title: {
    fontSize: 31,
    fontWeight: "bold",
    color: "#461904",
  },
  margin: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  backgroundBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.70)",
    padding: 5,
    borderRadius: 30,
  },
  herobanner: {
    height: 300,
    resizeMode: "cover",
    marginBottom: 10,
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
  button: {
    backgroundColor: "#F56E00",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
  },
});
