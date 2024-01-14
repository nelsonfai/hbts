import React, { useEffect, useState } from "react";
import { View, Image, ActivityIndicator, StyleSheet,SafeAreaView } from 'react-native';
import { useUser } from "../context/userContext";
import { useRefresh } from "../context/refreshContext";
import AsyncStorageService from "../services/asyncStorage";
import { router,Stack } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { useNotificationService } from "../services/notificationServices";
import { API_BASE_URL } from "../appConstants";

const SplashScreen = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor:'white' }}>
  <Stack.Screen
    options={{
      headerStyle: { 
      },
      headerShadowVisible: false,
      headerTitle: '',

    }}/> 
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color="grey" />
  </View>
  </SafeAreaView>  
);

const IndexPage = () => {
  const { setUser } = useUser();
  const { setRefresh } = useRefresh();
  const [loading, setLoading] = useState(true);
  const expo_token = useNotificationService();


  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          // await AsyncStorageService.removeItem('token')
          const token = await AsyncStorageService.getItem('token');
          const refreshHabits = false;
          const refreshList = false;
          const refreshSummary = false
          const refreshNotes = false

          if (token) {
            const response = await fetch(`${API_BASE_URL}/profile-info/`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
              },
            });

            if (!response.ok) {
              router.replace("/onboadpage");

              throw new Error('Failed to fetch user profile');
            }

            const data = await response.json();
            const { id, email, name, profile_pic, team_invite_code, hasTeam, team_id,lang,premium} = data;
            
            setUser({ id, email, name, profile_pic, team_invite_code, hasTeam, team_id,lang,premium,notify:expo_token});
            setRefresh({ refreshHabits, refreshList,refreshSummary,refreshNotes });

            router.replace("/home");
          } else {
            router.replace("/onboadpage");
          }

          setLoading(false);
        } catch (error) {
          console.error('Error fetching user profile:', error.message);
          setLoading(false);
        }
      };

      fetchData();
    }, [setUser])
  );

  return loading ? <SplashScreen /> : null;
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150, // Adjust the width of your logo
    height: 150, // Adjust the height of your logo
    marginBottom: 20,
  },
});

export default IndexPage;
 