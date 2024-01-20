import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions,TouchableOpacity } from 'react-native';
import { Redirect,Stack,useRouter } from "expo-router";
import { ScreenHeaderBtn } from "../components";
import OnboardingScreen from '../components/onboarding/onboarding';
const { height } = Dimensions.get('window');
import { useUser, setUser } from '../context/userContext';


const Index = () => {
const router = useRouter()

const gotoSignup = () => {
  router.push('(auth)/signup');
};
const gotoLogin = () => {
  router.push('(auth)/login');
};

    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerRight:() =>{ 
              ''
            },
            headerShadowVisible: false,
            headerTitle: '',
          }}
        />
        <View style={styles.carousel}>

          <OnboardingScreen />
          </View>

        <View style={styles.loginButtons}>
          {/* Your Login Buttons Component */}
        <TouchableOpacity style={styles.loginButton} onPress={gotoLogin}>
            <Text style={{ color: 'white' }}>Login with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={gotoSignup}>
            <Text style={{ color: 'white' }}>Sign up with Email</Text>
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
    padding: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    color: 'white',
    borderRadius:10
  },
});

export default Index;
