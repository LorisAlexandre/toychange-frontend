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
} from "react-native";

const LoginComponent = ({ navigation }) => {
  const [showSignIn, setShowSignIn] = useState(true);
  const [buttonStyles, setButtonStyles] = useState({
    signIn: {
      backgroundColor: '#f56e00',
      textColor: '#FFF2D3',
    },
    signUp: {
      backgroundColor: '#FFF2D3',
      textColor: '#f56e00',
    },
  });

  const handleSignInPress = () => {
    setShowSignIn(true);
    setButtonStyles((prevStyles) => ({
      ...prevStyles,
      signIn: {
        backgroundColor: '#f56e00',
        textColor: '#FFF2D3',
      },
      signUp: {
        backgroundColor: '#FFF2D3',
        textColor: '#f56e00',
      },
    }));
  };

  const handleSignUpPress = () => {
    setShowSignIn(false);
    setButtonStyles((prevStyles) => ({
      ...prevStyles,
      signIn: {
        backgroundColor: '#FFF2D3',
        textColor: '#f56e00',
      },
      signUp: {
        backgroundColor: '#f56e00',
        textColor: '#FFF2D3',
      },
    }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.container2}>
        <View>
          <Text style={styles.title}>Ensemble, créons des sourires en partageant. 🎁</Text>
        </View>
        <View style={styles.box}>
          <TouchableOpacity
            onPress={handleSignInPress}
            style={[
              styles.signin,
              { backgroundColor: buttonStyles.signIn.backgroundColor },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.textButton, { color: buttonStyles.signIn.textColor }]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignUpPress}
            style={[
              styles.signup,
              { backgroundColor: buttonStyles.signUp.backgroundColor },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.textButton, { color: buttonStyles.signUp.textColor }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        {showSignIn ? (
          <SignIn />
        ) : (
          <ScrollView>
            <SignUp />
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#ffffff",
  },
  container2: {
    width: "100%",
    height: "100%",
    paddingTop: 70,
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginBottom: 0,
  },
  box: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    
    width: '90%',
    height: '10%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 16,
    backgroundColor: "#FFF2D3",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    fontWeight: 'bold',
  },
  textButton: {
    fontSize: 12,
    color: '#f56e00',
    fontWeight: 'bold',
    padding: 0,
  },
  signin: {
    borderRadius: 8,
    fontSize: 18,
    width: '50%',
    height: '100%',
   
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2D3',
  },
  signup: {
    borderRadius: 8,
    fontSize: 18,
    width: '50%',
    height: '100%',
    alignItems: 'center',
   
    justifyContent: 'center',
    backgroundColor: '#FFF2D3',
  },
});

export default LoginComponent;