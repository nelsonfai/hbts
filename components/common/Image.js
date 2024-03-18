import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const ProfileImage = ({ mainImageUri, width = 200, height = 200, handlePress, name, fontSize, color }) => {
  const defaultImageSource = require('./../../assets/images/defaultprofile.svg');
  const borderRadius = width / 2;

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  const renderDefaultImage = () => {
    const initials = getInitials(name);
    return (
      <View style={[styles.defaultImageContainer, { width, height, borderRadius, backgroundColor: color ? color : '#ccc' }]}>
        <Text style={[styles.initials, { fontSize: fontSize }]}>{initials}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {mainImageUri ? (
        <Image
          source={{ uri: mainImageUri }}
          style={{ ...styles.image, width, height, borderRadius }}
        />
      ) : (
        <Image
          source={defaultImageSource}
          onError={() => {}}
          style={{ ...styles.image, width, height, borderRadius }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  image: {
    resizeMode: 'cover',
    borderRadius: 10,
  },
  defaultImageContainer: {
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ProfileImage;
