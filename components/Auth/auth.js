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
import * as Notifications from 'expo-notifications';
import MyHabitIcon from '../Habits/habitIcon';
import { API_BASE_URL } from '../../appConstants';
import { SyncReminders } from '../../services/syncReminder';

export default function Auth({ authType, authTitle, i18n }) {
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
      setEmailError(i18n.t('auth.emailRequired'));
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError(i18n.t('auth.validEmail'));
        isValid = false;
      } else {
        setEmailError('');
      }
    }
    // Validate password
    if (!password.trim()) {
      setPasswordError(i18n.t('auth.passwordRequired'));
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
      expo_token = await AsyncStorageService.getItem('expo_token');
      const response = await fetch(logINUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          expo_token: expo_token
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Unknown error');
      } else {
        await AsyncStorageService.setItem('token', responseData.token);
        SyncReminders(responseData.token);
        router.replace({
          pathname:'/',
        });
      }
    } catch (error) {
      setAuthError(i18n.t('auth.incorrectCredentials'));
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
      expo_token = await AsyncStorageService.getItem('expo_token');
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          expo_token: expo_token
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Unknown error');
      }

      await AsyncStorageService.setItem('token', responseData.token);
      gotoProfile();
    } catch (error) {
      setAuthError(i18n.t('auth.signupError'));
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
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.replace('/onboadpage')}>
                <MyHabitIcon iconName='arrow-left' size={35}  colorValue={'grey'}/>
              </TouchableOpacity>
            ),
          }}
        />
        <Text style={{padding:10,fontSize:20,fontWeight:'bold',color:'grey',marginBottom:40}}> </Text>
        <View style={[styles.verticallySpaced]}>
          <Input
            label={i18n.t('auth.emailLabel')}
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder={i18n.t('auth.emailPlaceholder')}
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

        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label={i18n.t('auth.passwordLabel')}
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder={i18n.t('auth.passwordPlaceholder')}
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
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            buttonStyle={styles.button}
            title={authType === 'signup' ? i18n.t('auth.signup') : i18n.t('auth.signin')}
            disabled={loading}
            onPress={() => (authType === 'signup' ? signUpWithEmail() : signInWithEmail())}
          />
        </View>
        {authError ? <Text style={[styles.errorText, { marginTop: 0 }]}>{authError}</Text> : null}

        {/* Login/Sign-up links */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            {authType === 'signup' ? i18n.t('auth.haveAccount') : i18n.t('auth.noAccount')}
          </Text>
          <TouchableOpacity onPress={() => router.replace(authType === 'signup' ? '/login' : '/signup')}>
            <Text style={[styles.linkText, { color: 'black' }]}>
              {authType === 'signup' ? i18n.t('auth.signin') : i18n.t('auth.signup')}
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
    fontSize: 14,
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
