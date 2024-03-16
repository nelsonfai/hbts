import * as SecureStore from 'expo-secure-store';

const LANGUAGE_KEY = 'selectedLanguage';

const AsyncStorageService = {
  getItem: async (key) => {
    try {
      const value = await SecureStore.getItemAsync(key);

      return value;
    } catch (error) {
      //(`Error getting item from AsyncStorage (${key}):`, error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      //(`Error setting item in AsyncStorage (${key}):`, error);
    }
  },
  removeItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      //(`Error removing item from AsyncStorage (${key}):`, error);
    }
  },
  // Method to save the selected language
  saveLanguage: async (language) => {
    await AsyncStorageService.setItem(LANGUAGE_KEY, language);
  },
  // Method to retrieve the selected language
  getSavedLanguage: async () => {
    return await AsyncStorageService.getItem(LANGUAGE_KEY);
  },
};

export default AsyncStorageService;
