import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function Message(mess) {
  const user = useSelector((state) => state.user.value);

  const handleAccept = () => {
    mess.handleAccept(mess);
  };
  const handleDecline = () => {
    mess.handleDecline(mess);
  };

  return (
    <View
      style={[
        mess.messSender === "Me"
          ? { backgroundColor: "#FFF2D3", borderLeftColor: "#F56E00" }
          : { borderLeftColor: "#FFF2D3" },
        styles.message,
      ]}
    >
      <Text>{mess.messSender}</Text>
      {mess.replyTo.text ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {mess.label && <Text style={styles.label}>{mess.label}</Text>}
          <Text style={{ fontSize: 12 }}>{mess.replyTo.text}</Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {mess.label && <Text style={styles.label}>{mess.label}</Text>}
          {mess.replyTo.images?.length > 0 && (
            <Image
              source={{ uri: mess.replyTo.images[0] }}
              width={50}
              height={50}
            />
          )}
        </View>
      )}
      <Text>{mess.text}</Text>
      <View style={{ flexDirection: "row", gap: 5 }}>
        {mess.images?.length > 0 &&
          mess.images.map((uri, i) => (
            <Image source={{ uri }} key={i} width={100} height={100} />
          ))}
      </View>

      {mess.label === "proposal" && (
        <View style={{ display: "flex", flexDirection: "row", columnGap: 10 }}>
          <TouchableOpacity
            disabled={mess.sender === user._id}
            onPress={handleAccept}
          >
            <Text>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={mess.sender === user._id}
            onPress={handleDecline}
          >
            <Text>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    marginBottom: 10,
    borderLeftWidth: 1,
    paddingLeft: 5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  label: {
    fontSize: 12,
    backgroundColor: "#F56E00",
    color: "#FFF2D3",
    textAlign: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: "hidden",
  },
});
