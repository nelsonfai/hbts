import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileBadge = ({ name, color }) => {
  const initials = name ? name.charAt(0).toUpperCase() : '';

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 25,
    height: 25,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontSize: 10,
  },
});

export default ProfileBadge;
