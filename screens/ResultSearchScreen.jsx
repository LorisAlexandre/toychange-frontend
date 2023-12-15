import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFav, removeFav } from "../reducers/user";

export default function ResultSearchScreen({ navigation, route: { params } }) {
  const [announces, setAnnounces] = useState([]);
  const favAnnounces = useSelector((state) => state.user.value.favAnnounces);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(
      `https://toychange-backend.vercel.app/announce/search/${params.query}`
    )
      .then((res) => res.json())
      .then(({ result, announces }) => {
        if (result) {
          setAnnounces(announces);
        }
      });
  }, [params.query]);

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
      <Text>Ma recherche{params.query}</Text>
      <Text>{announces.length} announces</Text>
      <View>
        {announces.map((item, i) => (
          <View key={i}>
            <Text>{item.title}</Text>
            <TouchableOpacity onPress={() => handleFav(item)}>
              <Text
                style={
                  favAnnounces.some((e) => e._id === item._id) && {
                    backgroundColor: "red",
                  }
                }
              >
                Add to fav
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("PostScreen", item)}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
