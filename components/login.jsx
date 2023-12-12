import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import SignUp from './SignUp.jsx';
import SignIn from './SignIn.jsx';

function LoginComponent({ navigation }) {
  const user = useSelector((state) => state.user.value);

  const [isSignUp, setIsSignUp] = useState(false);

  if (isSignUp) {
    return <SignUp />
  } else {
    return <SignIn />
  }

  

  return (
    <View>
      <View>
        <Text>Login page</Text>
        <View> 
          <TouchableOpacity onPress={()=>setIsSignUp(true)}><Text>Sign Up</Text></TouchableOpacity> 
          <TouchableOpacity onPress={()=>setIsSignUp(false)}><Text>Sign In</Text></TouchableOpacity> 
          </View>
          
      </View>
    </View>
  );
}

export default LoginComponent;