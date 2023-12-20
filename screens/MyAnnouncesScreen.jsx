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
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBack}
        >
          <FontAwesome name="angle-left" color={"#F56E00"} size={25} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>Mes annonces</Text>
        </View>

        <View style={styles.announceContainer}>
          {announces.length ? (
            announces.map((announce, index) => (
              <TouchableOpacity
                key={index}
                style={styles.announceItem}
                onPress={() =>
                  navigation.navigate("MyAnnounceScreen", {
                    announce,
                    order: orders.find((e) => e.announce === announce._id),
                  })
                }
              >
                <ImageBackground
                  source={{ uri: announce.images[0] }}
                  style={styles.announceImage}
                >
                  {!announce.images[0] && (
                    <FontAwesome name="image" size={50} color={"#F56E00"} />
                  )}
                </ImageBackground>
                <View style={styles.announceDetails}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.announceTitle}>{announce.title}</Text>
                    {orders.some((e) => e.announce === announce._id) && (
                      <Text
                        style={[styles.label, { backgroundColor: "#09a70b" }]}
                      >
                        Acheté
                      </Text>
                    )}
                  </View>
                  <View style={styles.announceSection}>
                    <Text style={styles.announceType}>
                      {announce.type === "exchange" ? "Échange" : "Don"}
                    </Text>
                    <Text style={styles.deliveryMethod}>
                    {(() => {
      let deliveryMethod;

      if (announce.deliveryMethod === "inPerson") {
        deliveryMethod = "En personne";
      } else if (announce.deliveryMethod === "postalDelivery") {
        deliveryMethod = "Livraison";
      } else if (announce.deliveryMethod === "both") {
        deliveryMethod = "Au choix";
      }

      return deliveryMethod;
    })()}
                    </Text>
                    
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noAnnouncesText}>
              Aucune annonce disponible.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#461904",
  },
  goBack: {
    zIndex: 100,
    top: 30,
    left: 20,
  },
  label: {
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
  },
  announceContainer: {
    gap: 15,
  },
  announceItem: {
    flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  padding: 5,
  borderRadius: 8,
  marginLeft: 2,
  marginRight: 2,
  backgroundColor: "#FFFFFF", 
  shadowColor: 'grey',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 5,
    
  },
  announceImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  announceDetails: {
    flex: 1,
    marginLeft: 15,
  },
  announceSection: {
    
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginLeft: 5,
  },
  announceTitle: {
    fontSize: 16,
    color: "#461904",
    marginLeft: 5,
  },
  announceType: {
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    width: "40%",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 5,
  },
  
  deliveryMethod: {
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    width: "45%",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 5,
  },
  noAnnouncesText: {
    fontSize: 16,
    color: "#461904",
    textAlign: "center",
    marginTop: 20,
  },
});
