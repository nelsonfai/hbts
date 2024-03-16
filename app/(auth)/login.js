// auth page.js
import React, { useContext} from 'react';
import { StyleSheet, View } from 'react-native';
import Auth from '../../components/Auth/auth';
import I18nContext from "../../context/i18nProvider";

const Login= () => {
  const {i18n} = useContext(I18nContext)

    return (
    <View style={styles.container}>
          <Auth authType="signin"  authTitle ='Login' i18n= {i18n}/>
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