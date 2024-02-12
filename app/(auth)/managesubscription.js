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

const ManageSubscription =  () => {
  const { user} = useUser();
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
    const currentLanguage = async () => {
      const lang = await AsyncStorageService.getItem('lang');
      const langOption = languageOptions.find(option => option.code === lang);
      const language = langOption ? langOption.label : 'Unknown';
      setSelectedLanguageLabel(language)
    };
    currentLanguage();
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
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: true,
          headerTitle: 'Manage Subscription',
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

          <TouchableOpacity onPress={handleLogout}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1, padding: 15, borderBottomWidth: 1, borderColor: '#f2f2f2' }}>
              <Icon name="sign-out" size={20} color="black" />
              <Text style={styles.linkText}>{i18n.t('settings.logout')}</Text>
            </View>
          </TouchableOpacity>
        </View>
 
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
     borderBottomWidth:4,
    borderColor:'red'
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

export default ManageSubscription;