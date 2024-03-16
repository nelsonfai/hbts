import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';
import { I18n } from 'i18n-js';
import AsyncStorageService from './asyncStorage';
import en from '../locales/en.json';
import de from '../locales/de.json';

const translations = {
  en: en,
  de: de,
};

const i18n = new I18n(translations);
const defaultLocale = 'en';

// Function to set the language dynamically
export const setLocale = async (locale) => {
  if (translations[locale]) {
    i18n.locale = locale;
    console.log('Selected locale:', locale);
    await AsyncStorageService.setItem('lang', locale); // Save selected language in AsyncStorage 
  } else {
    console.log('Default locale:', defaultLocale);
    i18n.locale = defaultLocale;
  }
};

// Function to initialize language
export const initializeLanguage = async () => {
  const savedLanguage = await AsyncStorageService.getItem('lang');
  const systemLanguage = Localization.locale.split('-')[0]; // Get the system language
  const languageToUse = savedLanguage || systemLanguage || defaultLocale; // Use saved language, system language, or default

  i18n.locale = languageToUse;
  i18n.enableFallback = true;

  I18nManager.forceRTL(false);
};

initializeLanguage();
const t = (key, options) => i18n.t(key, options);

export default i18n;
