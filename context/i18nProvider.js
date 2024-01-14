// I18nContext.js
import React, { createContext, useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorageService from '../services/asyncStorage';
import { setLocale, initializeLanguage, t } from '../services/translation';
import i18n from '../services/translation';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocaleState] = useState();

  const changeLocale = async (newLocale) => {
    await setLocale(newLocale);
    setLocaleState(newLocale);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      await initializeLanguage();
      const savedLanguage = await AsyncStorageService.getItem('lang');
      setLocaleState(savedLanguage || Localization.locale);
    };

    loadLanguage();
  }, []);

  return (
    <I18nContext.Provider value={{ locale, changeLocale, i18n }}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nContext;
