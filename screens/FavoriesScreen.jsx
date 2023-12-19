import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFav, removeFav, removeSearchQuery } from "../reducers/user";
import AnnonceCard from "../components/AnnonceCard";

import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function FavoriesScreen({ navigation }) {
  const { favAnnounces, mySearches } = useSelector((state) => state.user.value);
  const [showAnnounces, setShowAnnounces] = useState(true);
  const dispatch = useDispatch();

  const handleSearch = (query, queryNeeded = true) => {
    if (queryNeeded) {
      if (!query.trim()) {
        return;
      }
    }
    if (!mySearches.some((e) => e === query)) {
      dispatch(addSearchQuery(query));
    }
    navigation.navigate("ResultSearchScreen", { query });
  };

  const handleFav = (obj) => {
    const { _id } = obj;
    if (!favAnnounces.find((e) => e._id === _id)) {
      dispatch(addFav(obj));
    } else {
      dispatch(removeFav(obj));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, styles.margin, { marginVertical: 20 }]}>
        Retrouvez les annonces qui vous le donne sourir! 😀
      </Text>
      <View style={[styles.margin, styles.containerBtn]}>
        <TouchableOpacity
          style={[
            showAnnounces ? styles.active : styles.inactive,
            styles.button,
          ]}
          onPress={() => setShowAnnounces(true)}
        >
          <Text style={[showAnnounces ? styles.active : styles.inactive]}>
            Mes coups de coeur
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            !showAnnounces ? styles.active : styles.inactive,
            styles.button,
          ]}
          onPress={() => setShowAnnounces(false)}
        >
          <Text style={!showAnnounces ? styles.active : styles.inactive}>
            Mes recherches
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ marginHorizontal: 20 }}>
        {showAnnounces ? (
          <View style={([styles.margin], { flexWrap: "wrap", gap: 20 })}>
            {favAnnounces.map((item, i) => (
              <AnnonceCard
                handleFav={handleFav}
                item={item}
                key={i}
                navigation={navigation}
              />
            ))}
          </View>
        ) : (
          <View>
            {mySearches.map((search, i) => (
              <TouchableOpacity
                style={styles.searches}
                key={i}
                onPress={() => handleSearch(search, false)}
              >
                <FontAwesome name="clock" size={15} color={"#F56E00"} />
                <Text style={{ color: "#F56E00" }}>{search}</Text>
                <TouchableOpacity
                  onPress={() => dispatch(removeSearchQuery(search))}
                >
                  <FontAwesome name="trash" size={15} color={"#F56E00"} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  placeholder: {
    color: "#FFA732",
    backgroundColor: "white",
    position: "absolute",
    top: -10,
    left: 15,
    padding: 2,
  },
  subTitle: {
    color: "#CC5302",
    fontWeight: "bold",
    marginBottom: 10,
  },
  searches: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#FFF2D3",
    shadowOffset: 0,
    shadowRadius: 15,
    paddingVertical: 7,
    paddingHorizontal: 14,
    flexDirection: "row",
  },
  containerBtn: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#FFF2D3",
    borderRadius: 16,
  },
  active: {
    backgroundColor: "#F56E00",
    color: "white",
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inactive: {
    backgroundColor: "#FFF2D3",
    color: "#F56E00",
  },
});
