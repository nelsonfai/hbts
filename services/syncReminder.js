 import {cancelAllNotifications,schedulePushNotification} from "./notificationServices"
 import { API_BASE_URL } from "../appConstants";
 
 export const SyncReminders = async (authToken) => {
    try {  
      const response = await fetch(`${API_BASE_URL}/sync_reminders/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`, 
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      await cancelAllNotifications()

      for (const habit of data) {
        const daysString = habit.specific_days_of_week;
        const reminderTime = new Date(`${habit.reminder_time}`);

        if (habit.reminder_time) {
          await schedulePushNotification(
            habitName=habit.name,
            habitDescription=habit.description,
            time =reminderTime,
            weekdays = daysString ? daysString.split(',') : [],
            identifier =habit.name
          );
        }
      }
      return data;
    } catch (error) {
      //('Error fetching user habits:', error.message);
    }
  };
