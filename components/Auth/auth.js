import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import AsyncStorageService from '../../services/asyncStorage';
import { useRouter, Stack } from 'expo-router';
import { COLORS } from '../../constants';
import * as Notifications from 'expo-notifications';

import { API_BASE_URL } from '../../appConstants';
export default function Auth({ authType, authTitle }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');


  const gotoProfile = () => {
    return router.replace({
      pathname: '/profile',
      params: {
        create: true
      }

    });   
  };
  const validateFields = () => {
    let isValid = true;

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required.');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address.');
        isValid = false;
      } else {
        setEmailError('');
      }
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  async function signInWithEmail() {
    if (!validateFields()) {
      return;
    }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

    setLoading(true);
    const logINUrl = `${API_BASE_URL}/login/`;
    try {
      const response = await fetch(logINUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          expo_token:existingStatus

        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Unknown error');
      }
      else{
        await AsyncStorageService.setItem('token', responseData.token);
        console.log('Token gotten',responseData.token)
        router.replace('/');
      }

    } catch (error) {
      setAuthError('Incorrect Email or Password ');
    }
    setLoading(false);
  }

async function signUpWithEmail() {
    if (!validateFields()) {
      return;
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    setLoading(true);
    const signupUrl = `${API_BASE_URL}/signup/`;

    try {
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          expo_token:existingStatus
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Unknown error');
      }

      await AsyncStorageService.setItem('token', responseData.token);
      gotoProfile();
    } catch (error) {
      setAuthError('An error occurred during signup');
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container2}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerTintColor: 'grey',
            headerTitle: '',
          }}
        />
        <Text style={{padding:10,fontSize:20,fontWeight:'bold',color:'grey',marginBottom:40}}> </Text>
        <View
          style={[
            styles.verticallySpaced,
          ]}
        >
          <Input
          label='Email'
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
            inputContainerStyle={{
              borderBottomWidth: 0,
              backgroundColor: '#f6f6f5',
              paddingVertical: 5,
              paddingHorizontal: 12,

              marginTop: 8,
              borderRadius: 10,
            }}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View
          style={[
            styles.verticallySpaced,
            styles.mt20,
          ]}
        >
          <Input
          label='Password'
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
            inputContainerStyle={{
              borderBottomWidth: 0,
              backgroundColor: '#f6f6f5',
              paddingVertical: 5,
              paddingHorizontal: 12,
              marginTop: 8,
              borderRadius: 10,

            }}
          />
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <View
          style={[
            styles.verticallySpaced,
            styles.mt20,
          ]}
        >
          <Button
            buttonStyle={styles.button}
            title={authType === 'signup' ? 'Sign up' : 'Sign in'}
            disabled={loading}
            onPress={() => (authType === 'signup' ? signUpWithEmail() : signInWithEmail())}
          />
        </View>
        {authError ? <Text style={[styles.errorText, { marginTop: 0 }]}>{authError}</Text> : null}

        {/* Login/Sign-up links */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            {authType === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <TouchableOpacity onPress={() => router.replace(authType === 'signup' ? '/login' : '/signup')}>
            <Text style={[styles.linkText, { color: 'black' }]}>
              {authType === 'signup' ? 'Login' : 'Sign up'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container2: {
    padding: 12,
    flex:1
  },
  verticallySpaced: {
    marginTop:5
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding:10
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    paddingHorizontal:10,
    marginTop:-15,
    marginBottom:20

  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    color: 'grey',
    marginTop:10
  },
});
