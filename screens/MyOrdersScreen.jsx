import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

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

  const Order = (order) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("MyOrderScreen", order)}
      >
        <View>
          {order.seller === order.user._id ? (
            <Text>{order.announce.exchangeProposal.title}</Text>
          ) : (
            <Text>{order.announce.title}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const orders = userOrders.map((order, i) => <Order {...order} />);

  return (
    <View style={styles.container}>
      <Text>My orders</Text>
      <View>
        {orders.length ? <View>{orders}</View> : <Text>No orders</Text>}
      </View>
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
