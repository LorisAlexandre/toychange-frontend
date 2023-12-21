import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function Carousel({ images }) {
  const { width: screenWidth } = Dimensions.get("window");
  return (
    <ScrollView
      contentContainerStyle={[!images.length && { flex: 1 }, styles.carousel]}
      horizontal={!!images.length}
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    >
      {images.length ? (
        images.map((uri, i) => (
          <View>
            <Image source={{ uri }} width={screenWidth} height={300} />
            <View style={styles.label}>
              <FontAwesome name="camera" size={10} color={"#FFF"} />
              <Text style={{ color: "#FFF" }}>
                {i + 1} / {images.length}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <FontAwesome name="image" size={100} color={"#F56E00"} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  carousel: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  label: {
    position: "absolute",
    backgroundColor: "#F56E00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    bottom: 10,
    right: 10,
  },
});
