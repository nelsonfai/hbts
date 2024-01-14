// auth page.js
import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Auth from '../../components/Auth/auth';
const Login= () => {
    return (
<View style={styles.container}>
       <Auth authType="signin"  authTitle ='Login'/>
</View>
    );
  };
  
const styles = StyleSheet.create({
    container: {
      padding: 12,
      backgroundColor:'white',
      flex:1,

    }

  });
  
  export default Login;