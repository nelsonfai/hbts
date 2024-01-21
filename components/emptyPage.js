import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { icons, images } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';

const EmptyNotesPage = ({ title, image }) => {
  let SvgComponent;
  if (image === 'list') {
    SvgComponent = images.list; // Use images.list from your constants
  } else {
    SvgComponent = images.habit; // Use images.diary from your constants
  }


  return (
    <View style={styles.container}>
      <View style={styles.image}>
        {/* Use the SvgComponent variable here */}
        {SvgComponent && <SvgComponent />}
      </View>
      <Text style={styles.message}>No {title}s found</Text>
      <Text style={styles.subMessage}>Start by adding a new {title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: '100%',
  },
  image: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subMessage: {
    fontSize: 16,
    color: "#777", // Set your desired text color
  },
});

export default EmptyNotesPage;
