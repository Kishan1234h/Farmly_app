import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EncryptedStorage from 'react-native-encrypted-storage';

const SettingsScreen = () => {
  const {t, i18n} = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const languages = [
    {code: 'en', name: 'English', native: 'English'},
    {code: 'hi', name: 'हिन्दी', native: 'Hindi'},
    {code: 'ta', name: 'தமிழ்', native: 'Tamil'},
    {code: 'te', name: 'తెలుగు', native: 'Telugu'},
  ];

  const changeLanguage = async lang => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    await EncryptedStorage.setItem('appLanguage', lang);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('language_settings')}</Text>
        <View style={styles.headerBorder} />
      </View>

      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.languageItem,
            language === lang.code && styles.activeItem,
          ]}
          onPress={() => changeLanguage(lang.code)}
          activeOpacity={0.8}>
          <MaterialIcons
            name="language"
            size={24}
            color={language === lang.code ? '#709856' : '#666'}
          />
          <View style={styles.languageTextContainer}>
            <Text style={styles.languageName}>{lang.name}</Text>
            <Text style={styles.languageNative}>{lang.native}</Text>
          </View>
          {language === lang.code && (
            <MaterialIcons name="check-circle" size={24} color="#709856" />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F4F4',
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    marginBottom: 10,
  },
  headerBorder: {
    height: 2,
    backgroundColor: '#E0E0E0',
    width: '30%',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  activeItem: {
    borderWidth: 1,
    borderColor: '#709856',
    backgroundColor: '#F8FFF4',
  },
  languageTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  languageName: {
    fontSize: 16,
    fontFamily: 'Sansita-Bold',
    color: '#333',
  },
  languageNative: {
    fontSize: 14,
    fontFamily: 'Sansita-Regular',
    color: '#666',
    marginTop: 4,
  },
});

export default SettingsScreen;
