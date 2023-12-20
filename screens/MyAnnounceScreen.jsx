import React from "react";

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
  Alert,
  ImageBackground,
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
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Modifications annulées");
              setModification(false);
            }}
            style={[{ marginTop: 20 }, styles.margin]}
          >
            <FontAwesome name="angle-left" color={"#F56E00"} size={28} />
          </TouchableOpacity>
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
                  Don
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

  let condition;

  if (announce.condition === "new") {
    condition = "Neuf";
  } else if (announce.condition === "likeNew") {
    condition = "Comme neuf";
  } else if (announce.condition === "good") {
    condition = "Bon état";
  }

  let deliveryMethod;

  if (announce.deliveryMethod === "inPerson") {
    deliveryMethod = "En personne";
  } else if (announce.deliveryMethod === "postalDelivery") {
    deliveryMethod = "Livraison";
  } else if (announce.deliveryMethod === "both") {
    deliveryMethod = "Au choix";
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          {
            marginTop: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "absolute",
            width: "90%",
            zIndex: 100,
          },
          styles.margin,
        ]}
      >
        <TouchableOpacity
          style={styles.backgroundBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-left" color={"#F56E00"} size={28} />
        </TouchableOpacity>
        {order && (
          <Text style={[styles.label, { backgroundColor: "#09a70b" }]}>
            Vendu
          </Text>
        )}
      </View>
      <ScrollView>
        <ImageBackground
          source={{ uri: announce.images[0] }}
          style={[
            styles.herobanner,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          {!announce.images[0] && (
            <FontAwesome name="image" size={100} color={"#F56E00"} />
          )}
        </ImageBackground>

        <Text style={[styles.margin, styles.title, { marginBottom: 10 }]}>
          {announce.title}
        </Text>
        <View style={[styles.margin, { gap: 10, marginBottom: 20 }]}>
          <Text style={styles.label}>
            {announce.type === "exchange" ? "Echange" : "Don"}
          </Text>
          <Text style={styles.label}>{condition}</Text>
          <Text style={styles.label}>{deliveryMethod}</Text>
        </View>
        <View style={{ marginHorizontal: 20, marginBottom: 40 }}>
          <Text style={{ fontSize: 19, color: "#CC5302", marginBottom: 10 }}>
            Description
          </Text>
          <Text style={{ fontWeight: 300, color: "#F56E00" }}>
            {announce.description}
          </Text>
        </View>
        {order && (
          <View style={[{ marginHorizontal: 20, gap: 10 }]}>
            <Text style={{ fontSize: 19 }}>
              Colis à recevoir: {announce.exchangeProposal.title}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#F56E00",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 18,
                  borderRadius: 8,
                }}
                onPress={() =>
                  navigation.navigate("CheckoutScreen", {
                    announce: announce,
                    exchangeProposal: announce.exchangeProposal,
                  })
                }
              >
                <Text style={{ color: "white" }}>Payer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#F56E00",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 18,
                  borderRadius: 8,
                }}
                onPress={() => downloadLabel(order.parcel.label_url)}
              >
                <Text style={{ color: "white" }}>Télécharger l'étiquette</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      {!order && (
        <View style={[styles.margin, { gap: 10 }]}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#F56E00",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 18,
              borderRadius: 8,
            }}
           
          >
            <Text style={{ color: "white" }}>Supprimer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#F56E00",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 18,
              borderRadius: 8,
            }}
            onPress={() => {
              setModification(true);
            }}
          >
            <Text style={{ color: "white" }}>Modifier</Text>
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
  label: {
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
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
  backgroundBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.70)",
    padding: 5,
    borderRadius: 30,
  },
  herobanner: {
    height: 300,
    resizeMode: "cover",
    marginBottom: 10,
  },
});
