import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFav, removeFav } from "../reducers/user";

import FontAwesome from "react-native-vector-icons/FontAwesome5";
import AnnonceCard from "./AnnonceCard";

export default function NearbyAnnounces({ navigation }) {
  const dispatch = useDispatch();
  const { geolocation, favAnnounces } = useSelector(
    (state) => state.user.value
  );
  const [announces, setAnnounces] = useState([]);

  useEffect(() => {
    fetch(
      `https://toychange-backend.vercel.app/announce/nearby?lat=${geolocation.lat}&long=${geolocation.long}`
    )
      .then((res) => res.json())
      .then(({ result, announcesSorted }) => {
        if (result) {
          fetch("https://toychange-backend.vercel.app/order/allOrders")
            .then((res) => res.json())
            .then(({ result, orders }) => {
              if (result) {
                const announcesFiltre = announcesSorted.filter(
                  (annonce) =>
                    !orders.some(
                      (order) => order.reference === annonce[1]._id
                    ) && !annonce[1].hasOwnProperty("exchangeProposal")
                );
                setAnnounces(announcesFiltre);
              }
            });
        }
      });
  }, []);

  const handleFav = (obj) => {
    const { _id } = obj;
    if (!favAnnounces.find((e) => e._id === _id)) {
      dispatch(addFav(obj));
    } else {
      dispatch(removeFav(obj));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ResultSearchScreen", {
            announces,
            nestedArr: true,
          })
        }
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 10,
        }}
      >
        <Text style={styles.subTitle}>Les annonces proches</Text>
        <FontAwesome
          name="angle-right"
          size={19}
          color={styles.subTitle.color}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20 }}>
        {announces
          .filter((e, i) => i < 2)
          .map((item, i) => (
            <AnnonceCard
              handleFav={handleFav}
              navigation={navigation}
              item={item[1]}
              km={item[0]}
              key={i}
            />
          ))}
      </View>
    </View>
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
