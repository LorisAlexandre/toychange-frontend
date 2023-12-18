import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function FavoriesScreen({ navigation }) {
  const { favAnnounces, mySearches } = useSelector((state) => state.user.value);
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
          {favAnnounces.map((announce, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate("PostScreen", announce)}
            >
              <Text>{announce.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View>
          {mySearches.map((search, i) => (
            <TouchableOpacity
              key={i}
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
