// auth page.js
import React, { useContext } from 'react';
import {StyleSheet, View, } from 'react-native';
import I18nContext from "../../context/i18nProvider";
import Auth from '../../components/Auth/auth';
const Signup= () => {
  const {i18n} = useContext(I18nContext)

    return (
<View style={styles.container}>
       <Auth authType="signup"   authTitle ='Sign Up' i18n= {i18n}/>
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