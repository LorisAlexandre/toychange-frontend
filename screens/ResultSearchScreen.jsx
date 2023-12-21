import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addFav,
  addSearchQuery,
  removeFav,
  removeSearchQuery,
} from "../reducers/user";
import AnnonceCard from "../components/AnnonceCard";

import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function ResultSearchScreen({ navigation, route: { params } }) {
  const { mySearches, favAnnounces } = useSelector((state) => state.user.value);
  const [query, setQuery] = useState(params.query);
  const [focus, setFocus] = useState(false);
  const [announces, setAnnounces] = useState([]);
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

  const handleSearch = (query, queryNeeded = true) => {
    if (queryNeeded) {
      if (!query.trim()) {
        return;
      }
    }
    if (!mySearches.some((e) => e === query)) {
      dispatch(addSearchQuery(query));
    }
    navigation.replace("ResultSearchScreen", { query });
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
      <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBack}
        >
          <FontAwesome name="angle-left" color={"#F56E00"} size={25} />
        </TouchableOpacity>
      <Text
        style={[
          styles.title,
          styles.margin,
          { marginTop: 30, marginBottom: 10, textAlign: "center" },
        ]}
      >
        Toy Change
      </Text>
      </View>
      <View style={[styles.textInputContainer]}>
        <TextInput
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={[styles.textInput, { flex: 1 }]}
          placeholderTextColor={styles.textInput.borderColor}
          placeholder="Ours en peluche 🧸"
          value={query}
          onChangeText={(val) => setQuery(val)}
        />
        <Text style={styles.placeholder}>Que recherchez vous ?</Text>
        <TouchableOpacity onPress={() => handleSearch(query)}>
          <FontAwesome name="search" color={"#F56E00"} size={20} />
        </TouchableOpacity>
      </View>
      {params.query ? (
        <View>
          {query !== params.query || focus ? (
            <View style={{ marginHorizontal: 20 }}>
              <View>
                <Text style={styles.subTitle}>Suggestions</Text>
                <TouchableOpacity
                  style={[
                    styles.searches,
                    { marginBottom: 10 },
                    { justifyContent: "center" },
                  ]}
                  onPress={() => handleSearch(query)}
                >
                  <Text style={{ color: "#F56E00" }}>{query}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.subTitle}>Mes dernières recherches </Text>
                <View style={{ gap: 10 }}>
                  {mySearches
                    .filter((e) => new RegExp(query, "i").test(e))
                    .map((e, i) => (
                      <TouchableOpacity
                        style={styles.searches}
                        key={i}
                        onPress={() => handleSearch(e, false)}
                      >
                        <FontAwesome name="clock" size={15} color={"#F56E00"} />
                        <Text style={{ color: "#F56E00" }}>{e}</Text>
                        <TouchableOpacity
                          onPress={() => dispatch(removeSearchQuery(e))}
                        >
                          <FontAwesome
                            name="trash"
                            size={15}
                            color={"#F56E00"}
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            </View>
          ) : (
            <ScrollView style={{ marginHorizontal: 20 }}>
              <Text
                style={{
                  color: "#CC5302",
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                {announces.length} announces
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20 }}>
                {announces.map((item, i) => (
                  <AnnonceCard
                    handleFav={handleFav}
                    navigation={navigation}
                    item={item}
                    key={i}
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {params.nestedArr ? (
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.margin,
                  {
                    color: "#CC5302",
                    fontWeight: "bold",
                    marginBottom: 10,
                  },
                ]}
              >
                {params.announces.length} annonces
              </Text>
              <ScrollView>
                <View style={[styles.margin, { flexWrap: "wrap", gap: 20 }]}>
                  {params.announces.map((item, i) => (
                    <AnnonceCard
                      handleFav={handleFav}
                      item={item[1]}
                      key={i}
                      km={item[0]}
                      navigation={navigation}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.margin,
                  {
                    color: "#CC5302",
                    fontWeight: "bold",
                    marginBottom: 10,
                  },
                ]}
              >
                {params.announces.length} annonces
              </Text>
              <ScrollView>
                <View style={[styles.margin, { flexWrap: "wrap", gap: 20 }]}>
                  {params.announces.map((item, i) => (
                    <AnnonceCard
                      handleFav={handleFav}
                      item={item}
                      key={i}
                      navigation={navigation}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 10,
    marginTop: 0,
  },
  margin: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#461904",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#FFA732",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    color: "#CC5302",
  },
  textInputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
  },
  placeholder: {
    color: "#FFA732",
    backgroundColor: "white",
    position: "absolute",
    top: -10,
    left: 15,
    padding: 2,
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
  goBack: {
    zIndex: 100,
    marginLeft: 10,
  },
});
