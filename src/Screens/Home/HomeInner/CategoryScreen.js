import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {getSession, logoutUser} from '../../../utils/SecureStorage';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {useTranslation} from 'react-i18next';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message';

import data from '../../../data/data.json';
import {addToCart} from '../../../data/db';

// icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CategoryScreen = () => {
  const route = useRoute();
  const {category} = route.params;
  const {t, i18n} = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await EncryptedStorage.getItem('appLanguage');
      if (lang && lang !== i18n.language) {
        i18n.changeLanguage(lang);
        setLanguage(lang);
      }
    };
    loadLanguage();
  }, [language]);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionUser = await getSession();
      if (sessionUser) {
        setUser(sessionUser);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const filteredProducts = data.stores
      .flatMap(store =>
        store.products.map(product => ({
          ...product,
          store_id: store.id,
          farm: store.name,
        })),
      )
      .filter(product => product.keyword === category.name);

    setProducts(filteredProducts);
  }, [category]);

  const handleAddToCart = async product => {
    try {
      if (!user) {
        Toast.show({
          type: 'info',
          text1: t('login_required'),
          text2: t('login_to_add_cart'),
        });
        navigation.navigate('Login');
        return;
      }

      console.log('Adding product:', {
        id: product.id,
        store_id: product.store_id,
        userId: user.id,
      });

      await addToCart(product, user.id);
      Toast.show({
        type: 'success',
        text1: t('added_to_cart'),
        text2: `${t(product.name)} ${t('added_successfully')}`,
      });
    } catch (error) {
      console.error('Add to cart failed:', error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('failed_to_add_cart'),
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchSession = async () => {
        const sessionUser = await getSession();
        if (sessionUser) setUser(sessionUser);
      };
      fetchSession();
      // StatusBar.setBackgroundColor('#709856')
    }, []),
  );

  return (
    <>
      <StatusBar backgroundColor="#709856" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.head}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <MaterialIcons
              name="arrow-back-ios-new"
              size={22}
              color="#F4F4F4"
            />
          </TouchableOpacity>
          <Text style={styles.headText}>{t(category.name)}</Text>
          <View style={{width: 22}} />
        </View>
        {/* Product List */}
        <View>
          <FlatList
            data={products}
            key={products.length > 0 ? 'grid' : 'list'}
            keyExtractor={item => item.id}
            numColumns={2} 
            columnWrapperStyle={{ paddingHorizontal: 8, justifyContent: 'space-around' }} 
            renderItem={({item}) => (
              <View style={styles.card}>
                <View
                  style={[
                    styles.imageContainer,
                    {backgroundColor: item.background_color},
                  ]}>
                  <Image source={{uri: item.image}} style={styles.image} />
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}>
                    <MaterialIcons name="add" size={20} color="#212121" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.name}>{t(item.name)}</Text>
                <Text style={styles.farm}>{t(item.farm)}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#709856',
  },
  backButton: {
    padding: 8,
    paddingHorizontal: 0
  },
  headText: {
    fontSize: 25,
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Sansita-Bold',
    color: '#F4F4F4',
  },
  card: {
    width: 130,
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: 120,
    height: 130,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 19,
    color: '#709856',
    marginTop: 5,
    fontFamily: 'Sansita-Bold',
    marginHorizontal: 5,
  },
  farm: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Sansita-Regular',
    marginHorizontal: 5,
  },
  price: {
    fontSize: 15,
    color: '#212121',
    fontFamily: 'Sansita-Bold',
    marginHorizontal: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
  },
});
