import React, { useState, useEffect ,useContext} from 'react';
import { View, StyleSheet, Alert,Text,KeyboardAvoidingView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import AsyncStorageService from '../../services/asyncStorage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS, SIZES } from '../../constants';
import { useUser } from '../../context/userContext';
import I18nContext from '../../context/i18nProvider';
import { API_BASE_URL } from '../../appConstants';


const ChangeEmailPage = () => {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState('');
  const [emailError,setEmailError] = useState('')
  const {user} = useUser()
  const {i18n} = useContext(I18nContext)


  const validateFields = () => {
    if (!newEmail.trim()) {
      setEmailError(i18n.t('changeEmail.emailRequired'));
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError(i18n.t('changeEmail.emailnotvalid'));
      return false;
    }
  
    if (newEmail === user.email) {
      // Check if the new email is the same as the current email (case-sensitive)
      setEmailError(i18n.t('changeEmail.emailDifferent'));
      return false;
    }
  
    setEmailError('');
    return true;
  };
  
const saveEmail = async () => {
    if (validateFields()) { 
      try {
        // Make API call to change email
        const token = await AsyncStorageService.getItem('token');
        const response = await fetch(`${API_BASE_URL}/change-email/`, {
          method: 'PUT',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'new_email':newEmail,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Unknown error');
        }
  
        Alert.alert(i18n.t('changeEmail.emailSuccess'));
        router.replace('/');
      } catch (error) {
        ////('Error changing email:', error.message);
        Alert.alert(i18n.t('changeEmail.errorOccured'));
      }
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
          headerTitle: i18n.t('changeEmail.button'),
          headerTintColor:'grey'
        }}
      />
      <View style={styles.container}>

        <Input
          label={i18n.t('changeEmail.label')}
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setNewEmail(text)}
          value={newEmail}
          placeholder="email@mail.com"
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
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Button
          title={i18n.t('changeEmail.button')}
          onPress={saveEmail}
          containerStyle={styles.buttonContainer}
          buttonStyle={{ backgroundColor: 'black' }}
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
    alignItems: 'center',
    padding: 20,
    gap: 30,
    backgroundColor: 'white',
  },
  inputContainer: {
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginTop:25
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop:-30
  },
});

export default ChangeEmailPage;
