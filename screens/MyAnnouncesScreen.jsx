import { useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function MyAnnouncesScreen({ navigation }) {
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
    // <View style={styles.container}>
    //   <Text>Mes announces</Text>
    //   {announces.map((announce, i) => (
    //     <TouchableOpacity
    //       key={i}
    //       onPress={() => {
    //         navigation.navigate("MyAnnounceScreen", {
    //           announce,
    //           order: orders.find((e) => e.announce === announce._id),
    //         });
    //       }}
    //     >
    //       <Text>{announce.title} </Text>
    //       {orders.some((e) => e.announce === announce._id) && (
    //         <Text>Acheté</Text>
    //       )}
    //     </TouchableOpacity>
    //   ))}
    // </View>
    <SafeAreaView style={styles.container}>
      <View style={[styles.margin, { alignItems: "center", gap: 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="angle-left" color={"#F56E00"} size={25} />
        </TouchableOpacity>
        <Text style={[styles.title, { textAlign: "center" }]}>
          Mes commandes
        </Text>
      </View>
      <ScrollView>
        <View style={{ gap: 15 }}>
          {userOrders.length ? (
            userOrders.map((order, i) => (
              <TouchableOpacity
                style={[
                  styles.margin,
                  {
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  },
                ]}
                key={i}
                onPress={() => navigation.navigate("MyOrderScreen", { order })}
              >
                <ImageBackground
                  source={{ uri: order.announce.images[0] }}
                  style={{ width: 50, height: 50 }}
                >
                  {!order.announce.images[0] && (
                    <FontAwesome name="image" size={50} color={"#F56E00"} />
                  )}
                </ImageBackground>
                <View>
                  <Text style={{ fontSize: 16, color: "#461904" }}>
                    {order.announce.title}
                  </Text>
                  <Text style={[styles.label]}>
                    {order.announce.type === "exchange" ? "Echange" : "Don"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No orders</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
