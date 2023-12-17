import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFav, removeFav } from "../reducers/user";

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
          setAnnounces(announcesSorted);
        }
      });
  }, [geolocation.lat, geolocation.long]);

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
      <Text>Annonces proches</Text>
      <View>
        {announces.map((item, i) => (
          <View key={i}>
            <Text>{item[1].title}</Text>
            <Text>{item[0]}</Text>
            <TouchableOpacity onPress={() => handleFav(item[1])}>
              <Text
                style={
                  favAnnounces.some((e) => e._id === item[1]._id) && {
                    backgroundColor: "red",
                  }
                }
              >
                Add to fav
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("PostScreen", item[1])}
            >
              <Text>Go to this post</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
