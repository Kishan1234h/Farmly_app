import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import EncryptedStorage from 'react-native-encrypted-storage';

// Import JSON translation files
import en from './locales/en.json';
import te from './locales/te.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';

const resources = {
  en: {translation: en},
  te: {translation: te},
  hi: {translation: hi},
  ta: {translation: ta},
};

// Corrected function to get stored language
const getStoredLanguage = async () => {
  try {
    const savedLanguage = await EncryptedStorage.getItem('appLanguage');
    return savedLanguage || 'en';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
};

// Initialize i18n properly
const initializeI18n = async () => {
  try {
    const lang = await getStoredLanguage();
    
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: lang,
        fallbackLng: 'en',
        compatibilityJSON: 'v3',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false, // Disable Suspense for React Native
        }
      });
    
    console.log('i18n initialized with language:', lang);
    return true;
  } catch (error) {
    console.error('i18n initialization failed:', error);
    return false;
  }
};

// Create a promise for initialization
const i18nPromise = initializeI18n();

// Export both the instance and the promise
export {i18n, i18nPromise};