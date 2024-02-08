import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const FloatingButton = () => {
  const router = useRouter();

  const onPress = () => {
    router.push('write'); // Adjust the route name as per your navigation setup
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android elevation
    shadowColor: 'grey', // iOS shadow color
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
    shadowOpacity: 0.5, // iOS shadow opacity
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
});

export default FloatingButton;
