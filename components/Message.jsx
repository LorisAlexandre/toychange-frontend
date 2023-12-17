import { Image, Text, TouchableOpacity, View } from "react-native";
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
    <View style={{ marginBottom: 20 }}>
      <Text>{mess.messSender}</Text>
      {mess.replyTo.text ? (
        <Text>{mess.replyTo.text}</Text>
      ) : (
        <View>
          {mess.replyTo.images?.length > 0 && (
            <Image source={{ uri: mess.replyTo.images[0] }} />
          )}
        </View>
      )}
      <Text>{mess.text}</Text>
      {mess.images?.length > 0 &&
        mess.images.map((uri, i) => <Image source={{ uri }} key={i} />)}
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

      <Text>Fin de mess</Text>

      {/* <Text>{mess.sender}:</Text>
      {mess.text ? (
        <>
          <Text>{mess.text}</Text>
          <View>
            {mess.label === "proposal" && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    handleAccept(mess);
                  }}
                >
                  <Text>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDecline(mess)}>
                  <Text>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      ) : (
        <View>
          {mess.images.map((img, i) => (
            <Image key={i} source={{ uri: img }} width={50} height={50} />
          ))}
        </View>
      )} */}
    </View>
  );
}
