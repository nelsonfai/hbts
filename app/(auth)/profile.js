import React, { useState, useEffect,useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert,KeyboardAvoidingView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorageService from '../../services/asyncStorage';
import { useUser } from "../../context/userContext";
import { useRouter } from 'expo-router';
import ProfileImage from '../../components/common/Image';
import { SafeAreaView } from 'react-native';
import {Stack }from 'expo-router';
import { COLORS, icons, images, SIZES ,FONT} from "../../constants";
import I18nContext from '../../context/i18nProvider';
import { API_BASE_URL } from '../../appConstants';
import { useLocalSearchParams } from 'expo-router';

const ProfileEditPage = () => {
  const {i18n} = useContext(I18nContext)
  const router = useRouter();
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const {user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [error,setError] = useState('')
  const params = useLocalSearchParams();
  const create = params.create || false

  console.log('Create Vlaue',create)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setName(user.name);
        setProfilePic(user.imageurl);
      } catch (error) {
        ////('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, [user]);

  const updateTeamInfo = (newName, newPic) => {
    setUser((prevUser) => ({
      ...prevUser,
      name: newName,
      imageurl: newPic,
    }));
  };
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (result.canceled === false) {
        setProfilePic(result.assets[0].uri); // Use assets array
      }
    } catch (error) {
      //('Error picking image:', error.message);
    }
  };
  
  
  
  const saveProfile = async () => {
    setLoading(true)
    try {
      const formData = new FormData();
      if(!name.trim()){
        setError(i18n.t('editProfile.fieldRequired'))
        setLoading(false)
        return
      }
      formData.append('name', name);
  
      if (profilePic) {
        const uriParts = profilePic.split('.');
        const fileType = uriParts[uriParts.length - 1];
  
        formData.append('profile_pic', {
          uri: profilePic,
          name: `profile_pic.${fileType}`,
          type: `image/${fileType}`,
        });
      }
  
      // Make API call to create or update profile
      const token = await AsyncStorageService.getItem('token');
      const response = await fetch(`${API_BASE_URL}/update-profile/`, {
        method: 'PATCH', // Use PATCH for updates
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Unknown error');
      }
      const data = await response.json()
      updateTeamInfo(newName=data.name,newPic=data.imageurl)
      console.log('profile data',data)
      setLoading(false)
      setProfileSaved(true)
      {create? router.replace('/') : router.replace('/settings')}

    } catch (error) {
      //('Error saving profile:', error.message);
      Alert.alert(i18n.t('editProfile.errorOccured'));
      setLoading(false)    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite  }}>
            <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
    <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTintColor:'grey',
          headerTitle: i18n.t('editProfile.title') 
        }}/>
      <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <ProfileImage  name={'+'} handlePress = {pickImage} fontSize={30} width={150} height={150} />

        )}
      </TouchableOpacity>

      <Input
        label={i18n.t('editProfile.label')}
        value={name}
        onChangeText={(text) => setName(text)}
        inputContainerStyle={{
          borderBottomWidth: 0,
          backgroundColor: '#f6f6f5',
          paddingVertical: 5,
          paddingHorizontal: 12,
          marginTop: 8,
          borderRadius: 10,

        }}
      />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
      title={!profileSaved ? i18n.t('editProfile.saveProfileButton') : i18n.t('editProfile.updatedProfileButton')}
      disabled={loading} onPress={saveProfile} containerStyle={styles.buttonContainer} buttonStyle={{backgroundColor:'black',padding:10,borderRadius:10}}/>
    </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    padding: 20,
    gap:30,
    backgroundColor:'white'
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  addPhotoText: {
    fontSize: 16,
    color: 'blue', 
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
    
  },
  buttonContainer: {
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop:-40,
    paddingHorizontal:20
  },
});

export default ProfileEditPage;



