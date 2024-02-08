import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { icons, images } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';

const EmptyNotesPage = ({ title, image ,subtext}) => {
  let SvgComponent;
  if (image === 'list') {
    SvgComponent = images.list; // Use images.list from your constants
  } else if (image == null) {
    SvgComponent = null;
  } else {
    SvgComponent = images.habit; // Use images.diary from your constants
  }
 
  return (
    <View style={styles.container}>
      
      {SvgComponent ?
      <View style={styles.image}>
       <SvgComponent /> 
       </View>
       : null}
      
      <Text style={styles.message}>{title}</Text>
      <Text style={styles.subMessage}>{subtext}</Text>
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
    width: 80, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    marginBottom: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subMessage: {
    fontSize: 16,
    color: "#777",
    textAlign:'center'
  },
});

export default EmptyNotesPage;
