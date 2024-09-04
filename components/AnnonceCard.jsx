import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { addFav, removeFav } from "../reducers/user";

export default function AnnonceCard({ item, navigation, km }) {
  const dispatch = useDispatch();
  const { favAnnounces } = useSelector((state) => state.user.value);

  const handleFav = (obj) => {
    const { _id } = obj;
    if (!favAnnounces.find((e) => e._id === _id)) {
      dispatch(addFav(obj));
    } else {
      dispatch(removeFav(obj));
    }
  };

  return (
    <TouchableOpacity
      style={styles.announces}
      onPress={() => navigation.navigate("PostScreen", item)}
    >
      <ImageBackground
        source={{ uri: item.images[0] }}
        style={{
          width: 155,
          height: 176,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!item.images[0] && (
          <FontAwesome name="image" color={"#F56E00"} size={150} />
        )}
      </ImageBackground>
      <TouchableOpacity style={styles.heartBtn} onPress={() => handleFav(item)}>
        <FontAwesome
          name="heart"
          size={15}
          color={favAnnounces.some((e) => e._id === item._id) ? "red" : "gray"}
        />
      </TouchableOpacity>
      <View style={{ padding: 15, gap: 5 }}>
        <Text style={{ color: "#F56E00", fontWeight: 600, fontSize: 16 }}>
          {item.title.length > 11
            ? `${item.title.substring(0, 11)}...`
            : item.title}
        </Text>
        {km && <Text style={{ color: "#F56E00" }}>{km} km</Text>}
        <Text style={{ color: "#FF8B0A" }}>{item.address.postalCode}</Text>
        <Text style={styles.label}>
          {item.type === "exchange" ? "Echange" : "Don"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    gap: 20,
  },
  subTitle: {
    color: "#CC5302",
    fontWeight: "bold",
    fontSize: 19,
  },
  announces: {
    height: 294,
    width: 155,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF", // Ajoutez une couleur de fond
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  heartBtn: {
    padding: 5,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.70)",
    position: "absolute",
    right: 5,
    top: 5,
  },
  label: {
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
});
