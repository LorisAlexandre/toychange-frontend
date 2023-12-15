import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function FavoriesScreen({ navigation }) {
  const mySearches = useSelector((state) => state.user.value.mySearches);
  const favAnnounces = useSelector((state) => state.user.value.favAnnounces);
  const [showAnnounces, setShowAnnounces] = useState(true);

  return (
    <View style={styles.container}>
      <Text>Favories</Text>
      <View>
        <TouchableOpacity onPress={() => setShowAnnounces(true)}>
          <Text>Fav announces</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowAnnounces(false)}>
          <Text>Last searches</Text>
        </TouchableOpacity>
      </View>
      {showAnnounces ? (
        <View>
          {favAnnounces.map((announce) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("PostScreen", announce)}
            >
              <Text>{announce.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View>
          {mySearches.map((search) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ResultSearchScreen", { query: search })
              }
            >
              <Text>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
});
