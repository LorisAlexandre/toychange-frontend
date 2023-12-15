import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function MyAnnouncesScreen({ navigation, route: { params } }) {
  const { authToken } = useSelector((state) => state.user.value);
  const userId = "657b479ea04d2e5063b61220";
  const [announces, setAnnounces] = useState([]);

  useEffect(() => {
    fetch(`https://toychange-backend.vercel.app/announce/announces/${userId}`)
      .then((res) => res.json())
      .then(({ result, announces }) => {
        if (result) {
          if (announces) {
            setAnnounces(announces);
          }
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Mes announces</Text>
      {announces.map((announce) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("MyAnnounceScreen", { announce })}
        >
          <Text>{announce.title}</Text>
        </TouchableOpacity>
      ))}
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
