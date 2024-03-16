import React, { useState, useEffect,useContext } from 'react';
import { View, StyleSheet, Alert,KeyboardAvoidingView,Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import AsyncStorageService from '../../services/asyncStorage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS, SIZES } from '../../constants';
import I18nContext from '../../context/i18nProvider';
import { API_BASE_URL } from '../../appConstants';

const ChangePasswordPage = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const {i18n} = useContext(I18nContext)

  const savePassword = async () => {
    try {
      // Make API call to change password
      if(!currentPassword.trim()){
        setCurrentPasswordError(i18n.t('changePassword.fieldRequired'))
        return 
      }
      if(!newPassword.trim()){
        setNewPasswordError(i18n.t('changePassword.requiredRequired'))
        return 
      }
      const token = await AsyncStorageService.getItem('token');
      const response = await fetch(`${API_BASE_URL}/change-password/`, {
        method: 'PUT', // Use PATCH for updates
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'current_password':currentPassword,
            'new_password':newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Unknown error');
      }

      Alert.alert(i18n.t('changePassword.passwordSuccess'));
      router.replace('/');
    } catch (error) {
      //('Error changing password:', error.message);
      Alert.alert(i18n.t('changePassword.errorOccured'));

    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: i18n.t('changePassword.button'),
          headerTintColor:'grey',

        }}
      />
      <View style={styles.container}>
        <Input
          label={i18n.t('changePassword.currentLabel')}
          secureTextEntry
          placeholder='*********'

          value={currentPassword}
          onChangeText={(text) => setCurrentPassword(text)}
          inputContainerStyle={{
            borderBottomWidth: 0,
            backgroundColor: '#f6f6f5',
            paddingVertical: 5,
            paddingHorizontal: 12,
            marginTop: 8,
            borderRadius: 10,

          }}
        />
        {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}
        <Input
          label={i18n.t('changePassword.newLabel')}
          secureTextEntry
          placeholder='*********'
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
          inputContainerStyle={{
            borderBottomWidth: 0,
            backgroundColor: '#f6f6f5',
            paddingVertical: 5,
            paddingHorizontal: 12,
            marginTop: 8,
            borderRadius: 10,

          }}
        />
        {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}

        <Button
          title={i18n.t('changePassword.button')}
          onPress={savePassword}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}

        />
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 30,
    backgroundColor: 'white',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding:10
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop:-40,
    paddingHorizontal:20
  },
});

export default ChangePasswordPage;
