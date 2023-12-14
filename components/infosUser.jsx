import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserInfoComponent = ({ user }) => {
  return (
    <View style={styles.container}>
      <Text>Nom: {user.firstname}</Text>
      <Text>Prénom: {user.lastname}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
      {/* Ajoute d'autres informations selon les besoins */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserInfoComponent;