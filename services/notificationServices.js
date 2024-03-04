import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorageService from './asyncStorage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotificationService() {
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    let notificationListener;
    const setupNotificationService = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        await AsyncStorageService.setItem('expo_token',token);

      }
      // Add a listener to handle incoming notifications
      notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });
    };

    setupNotificationService();

    return () => {
      if (notificationListener) {
        Notifications.removeNotificationSubscription(notificationListener);
      }
    };
  }, []);

  return expoPushToken;
}

 async function registerForPushNotificationsAsync() {
  let token = "";
  const isDevice = Constants.platform.ios || Constants.platform.android;
  
  if (isDevice ) {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default', 

    });}
  

  if (isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Status:', existingStatus);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      console.log('Asking notification permission');
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('Got the notification permission');

      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: '03fd8121-c6f6-4b26-bc03-a707801104b5' })).data;
    console.log(token);
  } else {
    alert('Must use a physical device for Push Notifications');
  }

  return token;
}




<<<<<<< HEAD
export async function schedulePushNotification(habitName, habitDescription = null,time, weekdays = null, identifier,frequency,specificDaysOfMonth = null,) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
=======
export async function schedulePushNotification(habitName, habitDescription = null,time, weekdays = null, identifier) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  console.log('time gotten',time)
>>>>>>> 62cfc4de84e85c221db70cf689d48b61bee76b2c
  time = new Date(time.getTime());
  const hours = time.getHours();
  const minutes = time.getMinutes();

  const notificationContent = {
    title: habitName,
    body: habitDescription || '',
    priority: 'high',
<<<<<<< HEAD
    sound: true
=======
>>>>>>> 62cfc4de84e85c221db70cf689d48b61bee76b2c
  };

  const notifications = [];

<<<<<<< HEAD
 if (frequency === 'monthly' && specificDaysOfMonth) {
  const daysOfMonthArray = specificDaysOfMonth.split(',').map(Number); // Convert string to array of integers
  console.log('array',daysOfMonthArray)
  daysOfMonthArray.forEach(dayOfMonth => {
    const triggerOptions = {
      day: dayOfMonth,
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    const id = Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: triggerOptions,
      identifier: identifier + '_' + dayOfMonth, // Ensure unique identifier for each day of month
    });
    
    notifications.push(id);
    return
  });}

=======
>>>>>>> 62cfc4de84e85c221db70cf689d48b61bee76b2c
  if (weekdays && weekdays.length > 0) {
    weekdays.forEach(day => {
      const weekdayIndex = days.indexOf(day) + 1;

      const triggerOptions = {
        weekday: weekdayIndex,
        hour: hours,
        minute: minutes,
        repeats: true,
      };

      const id = Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: triggerOptions,
        identifier: identifier + '_' + day, // Ensure unique identifier for each day
      });

      notifications.push(id);
    });
  } else {
    // Schedule a notification without specifying the weekday
    const id = Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
      identifier: identifier,
    });

    notifications.push(id);
  }

  console.log("Notification IDs on scheduling", notifications);
  return notifications;
}

export async function cancelAllHabitNotifications(identifier) {
  try {
    const allScheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const habitNotifications = allScheduledNotifications.filter(
      notification => notification.identifier.startsWith(identifier)
    );

    console.log('All Scheduled Notifications:', allScheduledNotifications);
    console.log('Habit Notifications to Cancel:', habitNotifications);

    const cancelPromises = habitNotifications.map(notification =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier)
    );

    await Promise.all(cancelPromises);
    console.log('Habit Notifications Canceled Successfully');
  } catch (error) {
    console.error('Error canceling habit notifications:', error);
  }
}


export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications canceled successfully');
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
}

function sendExpoTokenToBackend(expoToken) {
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
