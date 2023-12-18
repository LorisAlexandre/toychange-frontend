import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function MyAnnouncesScreen({ navigation, route: { params } }) {
  const { authToken, _id } = useSelector((state) => state.user.value);
  const [announces, setAnnounces] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`https://toychange-backend.vercel.app/announce/announces/${_id}`)
      .then((res) => res.json())
      .then(({ result, announces }) => {
        if (result) {
          if (announces) {
            setAnnounces(announces);
            fetch(
              `https://toychange-backend.vercel.app/order/ordersBySeller/${_id}`
            )
              .then((res) => res.json())
              .then(({ result, orders }) => {
                result && setOrders(orders);
              });
          }
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Mes announces</Text>
      {announces.map((announce, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => {
            navigation.navigate("MyAnnounceScreen", {
              announce,
              order: orders.find((e) => e.announce === announce._id),
            });
          }}
        >
          <Text>{announce.title} </Text>
          {orders.some((e) => e.announce === announce._id) && (
            <Text>Acheté</Text>
          )}
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
