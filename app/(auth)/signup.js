// auth page.js
import React, { useState } from 'react';
import {StyleSheet, View, } from 'react-native';

import Auth from '../../components/Auth/auth';
const Signup= () => {
    return (
<View style={styles.container}>
       <Auth authType="signup"   authTitle ='Sign Up'/>
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
  
  export default Signup;