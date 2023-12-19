import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function MyAnnounceScreen({ navigation, route: { params } }) {
  const { announce, order } = params;
  const [modification, setModification] = useState(false);
  const [images, setImages] = useState([...announce.images]);
  const [payloadInput, setPayloadInput] = useState({
    title: announce.title,
    description: announce.description,
    type: announce.type,
    condition: announce.condition,
    deliveryMethod: announce.deliveryMethod,
    weight: announce.weight,
    address: {
      houseNumber: announce.address.houseNumber,
      street: announce.address.street,
      city: announce.address.city,
      postalCode: announce.address.postalCode,
    },
  });

  const handleChange = (name, value, nestedProp) => {
    if (nestedProp) {
      setPayloadInput((payload) => ({
        ...payload,
        [name]: {
          ...payload[name],
          [nestedProp]: value,
        },
      }));
    } else {
      setPayloadInput((payload) => ({ ...payload, [name]: value }));
    }
  };

  const areAllValuesExist = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (
          !value ||
          (typeof value === "object" && !areAllValuesExist(value))
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleAnnounceModification = () => {
    console.log("announce change");
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Maxi 5 img");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
      selectionLimit: 5,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const imagesUri = result.assets.map(({ uri }) => uri);
      setImages((images) => [...images, ...imagesUri].filter((e, i) => i < 5));
    }
  };

  const downloadLabel = async (url) => {
    const filename = `${announce.title}-label.pdf`;
    FileSystem.downloadAsync(
      url,
      `${FileSystem.documentDirectory}${filename}`
    ).then((result) => {
      save(result.uri);
    });
  };

  const save = (uri) => {
    shareAsync(uri);
  };

  if (modification) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={[styles.title, styles.margin, { marginVertical: 40 }]}>
            Modifiez votre annonce, partagez l'amour. 🎁
          </Text>

          <View style={{ gap: 20 }}>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="next"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={styles.textInput.borderColor}
                placeholder="Ours en peluche 🧸"
                value={payloadInput.title}
                onChangeText={(value) => handleChange("title", value)}
              />
              <Text style={styles.placeholder}>
                Quel est le titre de votre annonce ?
              </Text>
            </View>
            <View style={[styles.margin, styles.containerBtn]}>
              <TouchableOpacity
                style={[
                  payloadInput.type === "donation"
                    ? styles.active
                    : styles.inactive,
                  styles.button,
                ]}
                onPress={() => handleChange("type", "donation")}
              >
                <Text
                  style={[
                    payloadInput.type === "donation"
                      ? styles.active
                      : styles.inactive,
                  ]}
                >
                  Donation
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  payloadInput.type === "exchange"
                    ? styles.active
                    : styles.inactive,
                  styles.button,
                ]}
                onPress={() => handleChange("type", "exchange")}
              >
                <Text
                  style={
                    payloadInput.type === "exchange"
                      ? styles.active
                      : styles.inactive
                  }
                >
                  Exchange
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="next"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={styles.textInput.borderColor}
                placeholder="Poids"
                keyboardType="numeric"
                returnKeyLabel="done"
                maxLength={3}
                value={payloadInput.weight.toString()}
                onChangeText={(value) => handleChange("weight", value)}
              />
              <Text style={styles.placeholder}>Poids en Kg</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="next"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={styles.textInput.borderColor}
                placeholder="N° de maison"
                keyboardType="numeric"
                returnKeyLabel="done"
                value={payloadInput.address.houseNumber.toString()}
                onChangeText={(value) =>
                  handleChange("address", value, "houseNumber")
                }
              />
              <Text style={styles.placeholder}>N° de maison</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="next"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={styles.textInput.borderColor}
                placeholder="avenue des mimosas"
                value={payloadInput.address.street}
                onChangeText={(value) =>
                  handleChange("address", value, "street")
                }
              />
              <Text style={styles.placeholder}>Nom de rue</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="next"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={styles.textInput.borderColor}
                placeholder="Mimizan"
                value={payloadInput.address.city}
                onChangeText={(value) => handleChange("address", value, "city")}
              />
              <Text style={styles.placeholder}>Ville</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                returnKeyType="next"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={styles.textInput.borderColor}
                placeholder="40200"
                keyboardType="numeric"
                returnKeyLabel="done"
                maxLength={5}
                value={payloadInput.address.postalCode.toString()}
                onChangeText={(value) =>
                  handleChange("address", value, "postalCode")
                }
              />
              <Text style={styles.placeholder}>Code postal</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={styles.textInput.borderColor}
                placeholder="Doudou neuf reçu en cadeau..."
                value={payloadInput.description}
                onChangeText={(value) => handleChange("description", value)}
                returnKeyType="done"
              />
              <Text style={styles.placeholder}>Description</Text>
            </View>
            <View
              style={[
                styles.margin,
                {
                  flexWrap: "wrap",
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.addImageBtn]}
                onPress={pickImage}
                disabled={images.length === 5}
              >
                <FontAwesome name="plus" color={"#F56E00"} size={12} />
                <FontAwesome name="image" color={"#F56E00"} size={28} />
              </TouchableOpacity>
              {images.map((img, i) => (
                <View key={i}>
                  <Image
                    style={{ borderRadius: 8 }}
                    source={{ uri: img }}
                    width={100}
                    height={100}
                  />
                  <TouchableOpacity
                    style={styles.trashBtn}
                    onPress={() =>
                      setImages((images) => images.filter((e) => e !== img))
                    }
                  >
                    <FontAwesome name="trash" size={10} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={[styles.margin, styles.containerBtn]}>
              <TouchableOpacity
                style={[
                  payloadInput.condition === "new"
                    ? styles.active
                    : styles.inactive,
                  styles.button,
                ]}
                onPress={() => handleChange("condition", "new")}
              >
                <Text
                  style={
                    payloadInput.condition === "new"
                      ? styles.active
                      : styles.inactive
                  }
                >
                  Neuf
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  payloadInput.condition === "likeNew"
                    ? styles.active
                    : styles.inactive,
                  styles.button,
                ]}
                onPress={() => handleChange("condition", "likeNew")}
              >
                <Text
                  style={
                    payloadInput.condition === "likeNew"
                      ? styles.active
                      : styles.inactive
                  }
                >
                  Comme neuf
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  payloadInput.condition === "good"
                    ? styles.active
                    : styles.inactive,
                  styles.button,
                ]}
                onPress={() => handleChange("condition", "good")}
              >
                <Text
                  style={
                    payloadInput.condition === "good"
                      ? styles.active
                      : styles.inactive
                  }
                >
                  Bon état
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.margin, styles.containerBtn]}>
              <TouchableOpacity
                style={[
                  payloadInput.deliveryMethod === "inPerson"
                    ? styles.active
                    : styles.inactive,
                  styles.button,
                ]}
                onPress={() => handleChange("deliveryMethod", "inPerson")}
              >
                <Text
                  style={
                    payloadInput.deliveryMethod === "inPerson"
                      ? styles.active
                      : styles.inactive
                  }
                >
                  En personne
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  payloadInput.deliveryMethod === "postalDelivery"
                    ? styles.active
                    : styles.inactive,
                  styles.button,
                ]}
                onPress={() => handleChange("deliveryMethod", "postalDelivery")}
              >
                <Text
                  style={
                    payloadInput.deliveryMethod === "postalDelivery"
                      ? styles.active
                      : styles.inactive
                  }
                >
                  Livraison
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  payloadInput.deliveryMethod === "both"
                    ? styles.active
                    : styles.inactive,
                  styles.button,
                ]}
                onPress={() => handleChange("deliveryMethod", "both")}
              >
                <Text
                  style={
                    payloadInput.deliveryMethod === "both"
                      ? styles.active
                      : styles.inactive
                  }
                >
                  Les 2
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                handleAnnounceModification();
                setModification(false);
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                Modifier l'annonce
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.replace("TabNavigator", { screen: "Mon Compte" })
        }
        style={[{ marginTop: 20 }, styles.margin]}
      >
        <FontAwesome name="angle-left" color={"#F56E00"} size={28} />
      </TouchableOpacity>

      <Text>{announce.title}</Text>
      {order && (
        <View>
          <Text>Obj à échanger: {announce.exchangeProposal.title}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CheckoutScreen", {
                announce: announce,
                exchangeProposal: announce.exchangeProposal,
              })
            }
          >
            <Text>Payer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => downloadLabel(order.parcel.label_url)}
          >
            <Text>Download Label</Text>
          </TouchableOpacity>
        </View>
      )}
      {!order && (
        <View>
          <TouchableOpacity>
            <Text>Supprimer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModification(true)}>
            <Text>Modifier</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 31,
    fontWeight: "bold",
    color: "#461904",
  },
  containerBtn: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
    backgroundColor: "#FFF2D3",
    borderRadius: 16,
  },
  active: {
    backgroundColor: "#F56E00",
    color: "white",
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inactive: {
    backgroundColor: "#FFF2D3",
    color: "#F56E00",
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
  },
  placeholder: {
    color: "#FFA732",
    backgroundColor: "white",
    position: "absolute",
    top: -10,
    left: 35,
    padding: 2,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#F56E00",
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  addImageBtn: {
    flexDirection: "row",
    gap: 5,
    borderColor: "#F56E00",
    borderWidth: 1,
    height: 100,
    width: 100,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  trashBtn: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255,0.60)",
    padding: 5,
    borderRadius: 10,
    top: 5,
    left: 5,
  },
});
