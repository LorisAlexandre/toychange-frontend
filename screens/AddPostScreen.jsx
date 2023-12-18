import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

export default function AddPostScreen({ navigation }) {
  const { authToken, _id } = useSelector((state) => state.user.value);
  const [payloadInput, setPayloadInput] = useState({
    title: "",
    description: "",
    type: "donation",
    condition: "likeNew",
    deliveryMethod: "both",
    weight: "1",
    address: {
      houseNumber: "",
      street: "",
      city: "",
      postalCode: "",
    },
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!authToken) {
      Alert.alert("Connectez vous !");
      navigation.navigate("Mon Compte");
    }
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    if (!areAllValuesExist(payloadInput)) {
      return;
    }
    const payload = {
      ...payloadInput,
      donor: _id,
    };
    console.log("all values good");
    fetch("https://toychange-backend.vercel.app/announce/addAnnounce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(({ result, announce }) => {
        console.log(result);
        if (result) {
          if (images.length) {
            console.log("fetch images");
            const formData = new FormData();
            images.map((uri) =>
              formData.append("photosFromFront", {
                uri,
                name: "image.jpg",
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
              .then((res) => res.json())
              .then(({ result, announce }) => {
                if (!result) {
                  Alert.alert("Images fail to upload");
                }
                navigation.navigate("Mon Compte", {
                  redirect: "MyAnnounceScreen",
                  announce,
                });
              });
          } else {
            console.log("redirect");
            navigation.navigate("Mon Compte", {
              redirect: "MyAnnounceScreen",
              announce,
            });
          }
        }
      });
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

  return (
    <View style={styles.container}>
      <Text>Add Post</Text>
      <Text>category "test"</Text>

      <View style={{ width: "100%" }}>
        <TextInput
          style={{ borderWidth: 1, width: "100%" }}
          placeholder="title"
          value={payloadInput.title}
          onChangeText={(value) => handleChange("title", value)}
        />
        <TextInput
          style={{ borderWidth: 1, width: "100%" }}
          placeholder="weight"
          keyboardType="numeric"
          maxLength={3}
          value={payloadInput.weight.toString()}
          onChangeText={(value) => handleChange("weight", value)}
        />
        <TextInput
          style={{ borderWidth: 1, width: "100%" }}
          placeholder="address houseNumber"
          keyboardType="numeric"
          value={payloadInput.address.houseNumber.toString()}
          onChangeText={(value) =>
            handleChange("address", value, "houseNumber")
          }
        />
        <TextInput
          style={{ borderWidth: 1, width: "100%" }}
          placeholder="address street"
          value={payloadInput.address.street}
          onChangeText={(value) => handleChange("address", value, "street")}
        />
        <TextInput
          style={{ borderWidth: 1, width: "100%" }}
          placeholder="address city"
          value={payloadInput.address.city}
          onChangeText={(value) => handleChange("address", value, "city")}
        />
        <TextInput
          style={{ borderWidth: 1, width: "100%" }}
          placeholder="address postalCode"
          keyboardType="numeric"
          maxLength={5}
          value={payloadInput.address.postalCode.toString()}
          onChangeText={(value) => handleChange("address", value, "postalCode")}
        />
        <TextInput
          style={{ borderWidth: 1, width: "100%" }}
          placeholder="description"
          value={payloadInput.description}
          onChangeText={(value) => handleChange("description", value)}
        />
        <TouchableOpacity onPress={pickImage} disabled={images.length === 5}>
          <Text>Add images</Text>
        </TouchableOpacity>
        {images.map((img) => (
          <Image source={{ uri: img }} width={50} height={50} />
        ))}
        <View>
          <TouchableOpacity onPress={() => handleChange("condition", "new")}>
            <Text>New</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChange("condition", "likeNew")}
          >
            <Text>Like new</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleChange("condition", "good")}>
            <Text>Good</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => handleChange("deliveryMethod", "inPerson")}
          >
            <Text>In person</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChange("deliveryMethod", "postalDelivery")}
          >
            <Text>Postal delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChange("deliveryMethod", "both")}
          >
            <Text>Both</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => handleChange("type", "donation")}>
            <Text>Donation</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleChange("type", "exchange")}>
            <Text>Exchange</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleCreateAnnounce}>
          <Text>Créer annonce</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightpink",
    alignItems: "center",
    justifyContent: "center",
  },
});
