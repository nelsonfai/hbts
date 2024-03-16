import React, { useContext } from "react";
import { View, Text, StyleSheet, Dimensions,TouchableOpacity } from 'react-native';
import { Stack,useRouter } from "expo-router";
import OnboardingScreen from '../components/onboarding/onboarding';
const { height } = Dimensions.get('window');
import I18nContext from "../context/i18nProvider";


const Index = () => {
const router = useRouter()
const {i18n,locale} = useContext(I18nContext)
console.log(locale)

const gotoSignup = () => {
  router.replace('(auth)/signup');
};
const gotoLogin = () => {+
  router.replace('(auth)/login');
};
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerTitle: '',
          }}
        />
        <View style={styles.carousel}>
          <OnboardingScreen  i18n ={i18n}/>
          </View>

        <View style={styles.loginButtons}>
          {/* Your Login Buttons Component */}
        <TouchableOpacity style={styles.loginButton} onPress={gotoLogin}>
            <Text style={{ color: 'white' }}>{i18n.t('auth.loginWithEmail')}</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={gotoSignup}>
            <Text style={{ color: 'white' }}>{i18n.t('auth.signUpWithEmail')}</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
        }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carousel: {
    height: height * 0.7,
  },
  loginButtons: {
    height: height * 0.3,
    padding: 20,
    backgroundColor:'#EFEFEF'
  },
  loginButton: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    color: 'white',
    borderRadius:7
  },
});

export default Index;
