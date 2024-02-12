import React, { useEffect ,useContext} from 'react';
import { View, Text,AppState, StyleSheet, Alert, Image, TouchableOpacity ,SafeAreaView,Switch,Modal,FlatList,ScrollView,Linking, LogBox} from 'react-native';
import { useUser } from '../../context/userContext';
import AsyncStorageService from '../../services/asyncStorage';
import { useRouter, Stack} from 'expo-router';
import { COLORS } from '../../constants';
import ProfileImage from '../../components/common/Image';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import I18nContext from '../../context/i18nProvider';
import * as Notifications from 'expo-notifications';
import { API_BASE_URL } from '../../appConstants';
import {cancelAllNotifications} from "../../services/notificationServices"
const Settings =  () => {
  const { user,setUser} = useUser();
  const {i18n} = useContext(I18nContext)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.locale);
  const [selectedLanguageLabel, setSelectedLanguageLabel] = useState('');
  const { locale, changeLocale } = useContext(I18nContext);
  const router = useRouter();

  const openAppSettings = () => {
    Linking.openSettings();
  };


const checkNotificationStatus =  async () =>{
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus  == 'granted'){
    setNotificationsEnabled(true)
  }
  else{
    setNotificationsEnabled(false)
  }
}


useEffect(() => {
  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      checkNotificationStatus();
    }
  };

  const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
  return () => {
    appStateSubscription.remove();
  };
}, []);

useEffect(() => {
  checkNotificationStatus();
}, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorageService.getItem('token');
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      await AsyncStorageService.removeItem('token');
      await AsyncStorageService.removeItem('expo_token');
      setUser({
        id: null,
        email: '',
        name: '',
        profile_pic: '',
        team_invite_code: '',
        hasTeam: false,
        team_id: null,
        lang: '',
        premium: false,
        notify: '',
      });
      await cancelAllNotifications()
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };
  const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ];
 
  useEffect(() => {
    AsyncStorageService.getItem('lang').then(lang => {
      console.log('Retrieved language:', lang);
  
      const langOption = languageOptions.find(option => option.code === lang);
      const language = langOption ? langOption.label : 'Unknown';
      setSelectedLanguageLabel(language);
    }).catch(error => {
      console.error('Error retrieving language:', error);
    });
  }, [selectedLanguage]);
  

  const handleLanguageChange = async (language) => {
    await changeLocale(language);
    setSelectedLanguage(language);
    setShowLanguageModal(false);
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleLanguageChange(item.code)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#f2f2f2' }}>
        <Text>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor:COLORS.lightWhite,borderBottomWidth:0.3},
          headerShadowVisible: true,
          headerTitle: i18n.t('settings.title'),
          headerTitleStyle: {
            alignSelf: 'center', 
          },
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, backgroundColor: COLORS.lightWhite, paddingHorizontal: 5 }}>
        <View style={{ paddingVertical: 10, gap: 10, alignItems: 'center' }}>
          <ProfileImage width={100} height={100} name={user.name} mainImageUri={user.profile_pic} fontSize={25} />
          <TouchableOpacity onPress={() => router.push('profile')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1, padding: 10,gap:10 }}>
                <Text style={styles.name}>{user.name}</Text>
                <Icon name="edit" size={20} color="black" />
              </View>
          </TouchableOpacity>
        </View>
        {/* Account Section */}
        <View style={{ marginTop: 20, paddingHorizontal: 10 ,fontSize:14}}>
          <Text style={styles.sectionTitle}>{i18n.t('settings.accounts.sectionTitle')}</Text>
          <TouchableOpacity onPress={() => setShowLanguageModal(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between', marginBottom: 1, padding: 15, borderBottomWidth: 1, borderColor: '#f2f2f2' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center',}}> 
              <Icon name="language" size={20} color="black" />
              <Text style={styles.linkText}>{i18n.t('settings.accounts.language')}</Text>
              </View>
              <Text style={{color:'grey'}}> {selectedLanguageLabel}</Text>

            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('changeEmail')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1, padding: 15, borderBottomWidth: 1, borderColor: '#f2f2f2' }}>
              <Icon name="envelope" size={20} color="black" />
              <Text style={styles.linkText}>{i18n.t('settings.accounts.changeEmail')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('changepassword')}>
            <View style={styles.linkContainer}>
              <Icon name="lock" size={20} color="black" />
              <Text style={styles.linkText}>{i18n.t('settings.accounts.changePassword')}</Text>
            </View>
          </TouchableOpacity>

        </View>
    {/* Subscription Section */}
      <View style={{ marginTop: 20, paddingHorizontal: 10, fontSize: 14 ,display:'none'}}>
        <Text style={styles.sectionTitle}>{i18n.t('settings.subscription.sectionTitle')}</Text>

        {/* Display User Information */}
        <View style={{ padding: 15, borderBottomWidth: 1, borderColor: '#f2f2f2' }}>
          <Text>Email: {user.email}</Text>
          <Text>Plan: {/* Retrieve and display user's subscription plan */}</Text>
          <Text>Next Bill Amount: {/* Retrieve and display next bill amount */}</Text>
          <Text>Next Bill Date: {/* Retrieve and display next bill date */}</Text>
          <TouchableOpacity onPress={() => router.push('manageSubscription')}>
              <Text style={{marginTop:5,textDecorationLine: 'underline',}}>{i18n.t('settings.subscription.manageSubscription')}</Text>
          </TouchableOpacity>
          </View>
      </View>

        {/* Notifications Section */}
        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
          <Text style={styles.sectionTitle}>{i18n.t('settings.notifications.sectionTitle')}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={styles.linkContainer}>
            <Icon name="bell" size={20} color="black" />
            <Text style={styles.linkText}>{i18n.t('settings.notifications.enableNotifications')}</Text>
            </View>
            <Switch
                  trackColor={{ false: 'grey', true: 'black' }}
                  thumbColor={Platform.OS === 'android' ? 'white' : undefined}
                  value={notificationsEnabled}
                  onValueChange={(value) => openAppSettings()}
                />
          </View>
        </View>
        {/* Legal Section */}
        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
          <Text style={styles.sectionTitle}>{i18n.t('settings.legal.sectionTitle')}</Text>
          <TouchableOpacity onPress={() => console.log('terms clicked')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1, padding: 15, borderBottomWidth: 1, borderColor: '#f2f2f2' }}>
              <Icon name="file-text" size={20} color="black" />
              <Text style={styles.linkText}>{i18n.t('settings.legal.termsAndConditions')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('required clicked')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1, padding: 15, borderBottomWidth: 1, borderColor: '#f2f2f2' }}>
              <Icon name="exclamation-circle" size={20} color="black" />
              <Text style={styles.linkText}>{i18n.t('settings.legal.requiredLink')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Links Section */}
        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
        <Text style={styles.sectionTitle}>{i18n.t('settings.legal.sectionTitle')}</Text>

            <TouchableOpacity onPress={() => Linking.openURL('your-review-link')}>
              <View style={styles.linkContainer}>
                <Icon name="star" size={20} color="black" />
                <Text style={styles.linkText}>{i18n.t('settings.subscription.review')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('your-instagram-link')}>
              <View style={styles.linkContainer}>
                <Icon name="instagram" size={20} color="black" />
                <Text style={styles.linkText}>Instagram</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogout}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1, padding: 15, borderBottomWidth: 1, borderColor: '#f2f2f2' }}>
              <Icon name="sign-out" size={20} color="black" />
              <Text style={styles.linkText}>{i18n.t('settings.logout')}</Text>
            </View>
          </TouchableOpacity>
      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        style={{flex:1}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,backgroundColor: 'rgba(0, 0, 0, 0.5)',padding:20 }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 ,width:'100%'}}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{i18n.t('settings.selectLanguage')}</Text>
            <FlatList
              data={languageOptions}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
            /> 
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Text style={{ color: 'white', marginTop: 10 ,backgroundColor:'black',padding:15,textAlign:'center',borderRadius:10}}>{i18n.t('settings.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
    paddingHorizontal:5

  },
  section: {
    marginTop: 20,
    paddingHorizontal:10,

  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'grey',   
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    padding: 15,
borderBottomWidth:1,
    borderColor:'#f2f2f2'

  },
  link: {
    marginLeft: 10,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profilebox: {
    paddingVertical: 10,
    gap: 10,
    alignItems: 'center',

  },
  name:{
    fontSize:18,
    fontWeight:'500'
  },
  linkText:{
    fontSize:16,
    marginLeft: 10
  }
});

export default Settings;
