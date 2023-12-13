import React, { useState } from 'react';
import SignIn from '../components/signin';
import SignUp from '../components/signup';
import { View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const LoginComponent = ({ navigation }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container2}>
        <View>
          <Text style={styles.title}>Ensemble, créons des sourires en partageant.</Text>
        </View>
        <View style={styles.box}>
        
            
              <TouchableOpacity onPress={() => setShowSignIn(true)} style={styles.signin} activeOpacity={0.8}>
                <Text style={styles.textButton}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSignIn(false)} style={styles.signup} activeOpacity={0.8}>
                <Text style={styles.textButton}>Sign Up</Text>
              </TouchableOpacity>
              </View>
           { showSignIn ? (
            <SignIn />
          ) : (
            <SignUp />
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
    width: '90%',
    height: '15%',
    display:'flex',
    flexDirection:'row',
    alignItems: 'center',
    
    backgroundColor: '#FFF2D3',
    justifyContent:'space-around',
    borderRadius: 16,

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
   color: '#ffffff',
    fontWeight: 'bold',
    padding: 0,
  },
  signin: {
    borderRadius: 8,
    fontSize: 18,
    width: '40%',
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f56e00',
  },
  signup: {
    borderRadius: 8,
    fontSize: 18,
    width: '40%',
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f56e00',
  },

});

export default LoginComponent;