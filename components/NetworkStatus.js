import React,{useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {icons}from '../constants';
import { images } from '../constants';
import I18nContext from '../context/i18nProvider';
const NetworkStatus = ({ onRefresh }) => {
  const {i18n} = useContext(I18nContext)

  return (
    <View style={styles.container}>
      <View style={styles.image}>
      <images.noWifi />

        </View>
      <Text style={styles.text}>{i18n.t('notes.write.networkError')}</Text>
      <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 75, // Set the width of your network image
    height: 75, // Set the height of your network image
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor:'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white', // Customize the text color of the button
    fontSize: 16,
  },
});

export default NetworkStatus;
