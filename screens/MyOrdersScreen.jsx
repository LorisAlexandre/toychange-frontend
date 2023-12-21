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

export default function MyOrdersScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    fetch(`https://toychange-backend.vercel.app/order/orders/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          if (!data.orders.length) {
            return;
          }
          setUserOrders(data.orders);
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.margin,
          { alignItems: "center", gap: 20, marginTop: 30 },
        ]}
      >
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
                  source={{ uri: order.announce?.images?.[0]  }}
                  style={{ width: 50, height: 50 }}
                >
                  {!order.announce?.images?.[0] && (
                    <FontAwesome name="image" size={50} color={"#F56E00"} />
                  )}
                </ImageBackground>
                <View>
                  <Text style={{ fontSize: 16, color: "#461904" }}>
                  {order.announce && order.announce.title ? order.announce.title : "Titre non disponible"}
                  </Text>
                  <Text style={[styles.label]}>
                  {order.announce && order.announce.type === "exchange" ? "Echange" : "Don"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={[
                styles.margin,
                styles.title,
                { textAlign: "center", fontSize: 19 },
              ]}
            >
              Aucune commande pour le moment !
            </Text>
          )}
        </View>
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
  label: {
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
});
