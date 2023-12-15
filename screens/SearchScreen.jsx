import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addSearchQuery } from "../reducers/user";
import NearbyAnnounces from "../components/NearbyAnnounces";
import NewAnnounces from "../components/NewAnnounces";

export default function SearchScreen({ navigation, route: { params } }) {
  const dispatch = useDispatch();
  const mySearches = useSelector((state) => state.user.value.mySearches);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);

  useEffect(() => {}, []);

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
    <View style={styles.container}>
      <TextInput
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ borderWidth: 1, width: "100%" }}
        value={query}
        onChangeText={(val) => setQuery(val)}
      />
      <TouchableOpacity onPress={() => handleSearch(query)}>
        <Text>search</Text>
      </TouchableOpacity>
      {query || focus ? (
        <View>
          <View>
            <Text>Suggestion: </Text>
            <TouchableOpacity onPress={() => handleSearch(query)}>
              <Text>{query}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>Last searches: </Text>
            {mySearches
              .filter((e) => new RegExp(query, "i").test(e))
              .map((e, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSearch(e, false)}
                >
                  <Text>{e}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      ) : (
        <View>
          <NewAnnounces />
          <NearbyAnnounces />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
  },
});
