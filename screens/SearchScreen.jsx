import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";

import FontAwesome from "react-native-vector-icons/FontAwesome5";

import {
  addSearchQuery,
  addUserLocation,
  removeSearchQuery,
} from "../reducers/user";
import NearbyAnnounces from "../components/NearbyAnnounces";
import NewAnnounces from "../components/NewAnnounces";

export default function SearchScreen({ navigation, route: { params } }) {
  const dispatch = useDispatch();
  const { mySearches } = useSelector((state) => state.user.value);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync(
          { distanceInterval: 1000 },
          ({ coords: { latitude, longitude } }) => {
            dispatch(addUserLocation({ lat: latitude, long: longitude }));
          }
        );
      }
    })();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={[
          styles.title,
          styles.margin,
          { marginTop: 30, marginBottom: 10, textAlign: "center" },
        ]}
      >
        Toy Change
      </Text>
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
      {query || focus ? (
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
                      <FontAwesome name="trash" size={15} color={"#F56E00"} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
      ) : (
        <ScrollView style={{ marginHorizontal: 20 }}>
          <NewAnnounces navigation={navigation} />
          {/* <NearbyAnnounces navigation={navigation} /> */}
        </ScrollView>
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
});
