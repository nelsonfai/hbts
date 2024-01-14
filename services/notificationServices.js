// notificationServices.js

import { useEffect,useState } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants'; // Import Constants for platform checking
import { Platform } from 'react-native';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

export function useNotificationService() {
    const [expoPushToken, setExpoPushToken] = useState(null);
     useEffect(() => {
      const setupNotificationService = async () => {
        const token = await registerForPushNotificationsAsync();  
        console.log('My token',token)
        if (token){
          setExpoPushToken(token)
        }
        // Add a listener to handle incoming notifications
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
          console.log('Notification received:', notification);
        });

        // Clean up the listener when the component unmounts
        return () => {
          Notifications.removeNotificationSubscription(notificationListener);
        };
      };
  
      setupNotificationService();
    }, []);
  
    return expoPushToken;
  }

async function registerForPushNotificationsAsync() {
    let token = "";
    const isDevice = Constants.platform.ios || Constants.platform.android;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    if (isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('Status:',existingStatus)
      let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        console.log('Asking notification permison')
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('Got the notification permison')

        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        //alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      
      token = (await Notifications.getExpoPushTokenAsync({ projectId: '03fd8121-c6f6-4b26-bc03-a707801104b5' })).data;
      //token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token)
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }












function sendExpoTokenToBackend(expoToken) {
  // Send the expoToken to your backend API
  // (Replace this with your actual backend endpoint)
  fetch('https://your-backend-api.com/register-expo-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      expoToken: expoToken,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Expo token registered successfully:', data);
    })
    .catch(error => {
      console.error('Error registering expo token:', error);
    });
}