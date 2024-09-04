import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function AddPostScreen({ navigation }) {
  const { authToken, _id } = useSelector((state) => state.user.value);
  const [payloadInput, setPayloadInput] = useState({
    title: "",
    description: "",
    type: "donation",
    condition: "likeNew",
    deliveryMethod: "both",
    weight: "",
    address: {
      postalCode: "",
    },
  });
  const [images, setImages] = useState([]);
  const titleInput = useRef(null);
  const weightInput = useRef(null);
  const postalCodeInput = useRef(null);
  const descriptionInput = useRef(null);

  useEffect(() => {
    if (!authToken) {
      Alert.alert("Connectez vous !");
      navigation.navigate("Mon Compte");
    }
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { statusCam } = await Camera.requestCameraPermissionsAsync();
    })();
  }, []);

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

  const handleCreateAnnounce = () => {
    payloadInput.weight = payloadInput.weight.toString().replace(/,/g, ".");
    if (!areAllValuesExist(payloadInput)) {
      return;
    }
    const payload = {
      ...payloadInput,
      donor: _id,
    };
    console.log("fetching ??");
    fetch("https://toychange-backend.vercel.app/announce/addAnnounce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(({ result, announce }) => {
        console.log("annonce créé");
        if (result) {
          if (images.length) {
            const formData = new FormData();
            images.map((uri) =>
              formData.append("photosFromFront", {
                uri,
                name: "photo.jpg",
                type: "image/jpeg",
              })
            );
            fetch(
              `https://toychange-backend.vercel.app/announce/uploadImages/${announce._id}`,
              {
                method: "PUT",
                body: formData,
              }
            )
              .then((res) => {
                console.log(res);
                return res.json();
              })
              .then(({ result, announce }) => {
                console.log("images created");
                if (!result) {
                  Alert.alert("Images fail to upload");
                }
                navigation.reset({
                  index: 1,
                  routes: [
                    { name: "TabNavigator", screen: "Mon Compte" },
                    { name: "MyAnnouncesScreen" },
                    { name: "MyAnnounceScreen", params: { announce } },
                  ],
                });
              });
          } else {
            navigation.reset({
              index: 1,
              routes: [
                { name: "TabNavigator", screen: "Mon Compte" },
                { name: "MyAnnouncesScreen" },
                { name: "MyAnnounceScreen", params: { announce } },
              ],
            });
          }
        }
      });
  };

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert("Maxi 4 img");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
      selectionLimit: 4,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const imagesUri = result.assets.map(({ uri }) => uri);
      setImages((images) => [...images, ...imagesUri].filter((_, i) => i < 4));
    }
  };
  const takeImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Maxi 5 img");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imagesUri = [result.assets[0].uri];
      setImages((images) => [...images, ...imagesUri].filter((_, i) => i < 4));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <Text style={[styles.title, styles.margin, { marginVertical: 30 }]}>
            Créez le rire, partagez l'amour. 🎁
          </Text>
          <View style={styles.inner}>
            <View style={styles.textInputContainer}>
              <TextInput
                ref={titleInput}
                onSubmitEditing={() => weightInput.current.focus()}
                returnKeyType="done"
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
                ref={weightInput}
                onSubmitEditing={() => postalCodeInput.current.focus()}
                returnKeyType="done"
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
                ref={postalCodeInput}
                onSubmitEditing={() => descriptionInput.current.focus()}
                returnKeyType="done"
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
                ref={descriptionInput}
                // onSubmitEditing={() => titleInput.current.focus()}
                returnKeyType="done"
                style={[styles.margin, styles.textInput]}
                placeholderTextColor={styles.textInput.borderColor}
                placeholder="Doudou neuf reçu en cadeau..."
                value={payloadInput.description}
                onChangeText={(value) => handleChange("description", value)}
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
                onPress={takeImage}
                disabled={images.length === 5}
              >
                <FontAwesome name="plus" color={"#F56E00"} size={12} />
                <FontAwesome name="camera" color={"#F56E00"} size={28} />
              </TouchableOpacity>
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
              onPress={handleCreateAnnounce}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                Créer l'annonce
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    gap: 20,
  },
  inner: {
    flex: 1, //
    justifyContent: "space-around", //
    paddingBottom: 20,
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
// #F56E00
