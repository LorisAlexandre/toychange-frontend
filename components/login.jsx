import React, { useState } from 'react';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import { View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

const LoginComponent = ({ navigation }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signInButtonStyles, setSignInButtonStyles] = useState({
    backgroundColor: '#FFF2D3',
    textColor: '#f56e00',
  });
  const [signUpButtonStyles, setSignUpButtonStyles] = useState({
    backgroundColor: '#FFF2D3',
    textColor: '#f56e00',
  });
  const handleSignInPress = () => {
    setShowSignIn(true);
    setSignInButtonStyles({
      backgroundColor: '#f56e00',
      textColor: '#FFF2D3',
    });
    setSignUpButtonStyles({
      backgroundColor: '#FFF2D3',
      textColor: '#f56e00',
    });
  };

  const handleSignUpPress = () => {
    setShowSignIn(false);
    setSignInButtonStyles({
      backgroundColor: '#FFF2D3',
      textColor: '#f56e00',
    });
    setSignUpButtonStyles({
      backgroundColor: '#f56e00',
      textColor: '#FFF2D3',
    });
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <View style={styles.container2}>
        <View>
          <Text style={styles.title}>Ensemble, créons des sourires en partageant. 🎁</Text>
        </View>
        <View style={styles.box}>
          <TouchableOpacity onPress={handleSignInPress} style={[styles.signin, { backgroundColor: signInButtonStyles.backgroundColor }]} activeOpacity={0.8}>
            <Text style={[styles.textButton, { color: signInButtonStyles.textColor }]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUpPress} style={[styles.signup, { backgroundColor: signUpButtonStyles.backgroundColor }]} activeOpacity={0.8}>
            <Text style={[styles.textButton, { color: signUpButtonStyles.textColor }]}>Sign Up</Text>
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
    display: 'flex',
    backgroundColor: '#ffffff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  container2: {
    width: '100%',
    height: '100%',
    paddingTop: 70,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 0,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  box: {
    width: 330,
    height: 58,
    display:'flex',
    flexDirection:'row',
    alignItems: 'center',
    
    // backgroundColor: '#FFF2D3',
    justifyContent:'space-around',
    borderRadius: 8,

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
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
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
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    justifyContent: 'center',
    backgroundColor: '#FFF2D3',
  },

});

export default LoginComponent;