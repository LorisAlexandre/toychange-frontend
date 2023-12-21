import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";

export default LoginComponent = ({ navigation }) => {
  const [showSignIn, setShowSignIn] = useState(true);

  const handleSignInPress = () => {
    setShowSignIn(true);
  };
  const handleSignUpPress = () => {
    setShowSignIn(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={[!showSignIn && { flex: 0.5 }, { gap: 10 }]}>
          <Text style={styles.title}>
            Ensemble, créons des sourires en partageant. 🎁
          </Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={handleSignInPress}
              style={[
                showSignIn
                  ? { backgroundColor: "#f56e00" }
                  : { backgroundColor: "#FFF2D3" },
                styles.btn,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  showSignIn ? { color: "#FFF2D3" } : { color: "#f56e00" },
                  styles.textButton,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignUpPress}
              style={[
                showSignIn
                  ? { backgroundColor: "#FFF2D3" }
                  : { backgroundColor: "#f56e00" },
                styles.btn,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  showSignIn ? { color: "#f56e00" } : { color: "#FFF2D3" },
                  styles.textButton,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[showSignIn && { maxHeight: 250 }, styles.inner]}>
          {showSignIn ? <SignIn /> : <SignUp />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    marginHorizontal: 20,
  },
  inner: {
    flex: 1, //
    justifyContent: "space-around", //
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  btnContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 32,
    backgroundColor: "#FFF2D3",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  btn: {
    borderRadius: 32,
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: "center",
  },
});
