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
import {useNavigation} from '@react-navigation/native';
import {getSession, logoutUser} from '../../utils/SecureStorage';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {useTranslation} from 'react-i18next';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message';

import data from '../../data/data.json';
import {addToCart} from '../../data/db';

// icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const getRandomProducts = count => {
  let allProducts = [];

  // Collect all products from all stores
  data.stores.forEach(store => {
    store.products.forEach(product => {
      allProducts.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        farm: store.name,
        store_id: store.id,
        background_color: product.background_color || '#F4F4F4',
      });
    });
  });

  // Shuffle and pick random items
  allProducts.sort(() => 0.5 - Math.random());
  return allProducts.slice(0, count);
};

const getRandomStores = (stores, count = 5) => {
  const shuffled = stores.sort(() => 0.5 - Math.random()); // Shuffle array
  return shuffled.slice(0, count).map(store => ({
    id: store.id, // Use name as a unique ID
    name: store.name,
    image: store.logo, // Using logo for image
  }));
};

const HomeScreen = () => {
  const {t, i18n} = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const [randomItems, setRandomItems] = useState([]);
  const [randomStores, setRandomStores] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);

  // change language
  const changeLanguage = async lang => {
    await i18n.changeLanguage(lang);
    setLanguage(lang);
    // await AsyncStorage.setItem('appLanguage', lang);
    await EncryptedStorage.setItem('appLanguage', lang);
  };

  useEffect(() => {
    if (Platform.OS === 'android' && changeNavigationBarColor) {
      changeNavigationBarColor('#F4F4F4', true);
    }

    fetchSession();
    setRandomItems(getRandomProducts(6));
    setRandomStores(getRandomStores(data?.stores));
    setBestDeals(getRandomProducts(5));
  }, []);

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

  // Fetch stored session
  const fetchSession = async () => {
    const sessionUser = await getSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logoutUser();
    navigation.reset({index: 0, routes: [{name: 'splash'}]}); // Reset to Splash
  };

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

      console.log('Adding to cart:', {
        productId: product.id,
        userId: user.id,
      });

      await addToCart(product, user.id);

      Toast.show({
        type: 'success',
        text1: t('added_to_cart'),
        text2: `${t(product.name)} ${t('added_successfully')}`,
      });
    } catch (error) {
      console.error('Add to cart error details:', {
        error: error.message,
        product: product,
        user: user,
      });
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('failed_to_add_cart'),
      });
    }
  };
  return (
    <>
      <StatusBar backgroundColor="#F4F4F4" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.headText}>{t('Farmly')}</Text>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => navigation.navigate('settings')}>
            <MaterialIcons name="settings" size={22} color="#212121" />
          </TouchableOpacity>
        </View>
        {/* <Button title="Logout" onPress={handleLogout} /> */}

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Category */}
          <View>
            <FlatList
              data={data.Categories}
              horizontal
              keyExtractor={item => item.name}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    {backgroundColor: item.background_color},
                  ]}
                  onPress={() =>
                    navigation.navigate('CategoryScreen', {category: item})
                  }>
                  <Text style={styles.icon1}>{item.icon}</Text>
                  <Text style={styles.name1}>{t(item.name)}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Recommended */}
          <View
            style={{
              marginTop: 5,
            }}>
            <View style={styles.recHead}>
              <Text style={styles.headText1}>{t('recommended')}</Text>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() =>
                  navigation.navigate('viewall', {
                    title: 'Recommended',
                    data: randomItems,
                    type: 'products',
                  })
                }>
                <Text style={styles.viewText}>{t('view_all')}</Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  style={styles.icon1}
                  color="#212121"
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={randomItems}
              horizontal
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
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
                  {/* Translated name */}
                  <Text style={styles.farm}>{t(item.farm)}</Text>
                  {/* Translated farm */}
                  <Text style={styles.price}>{item.price}</Text>
                </View>
              )}
            />
          </View>

          {/* Explore farms */}
          <View>
            <View style={styles.recHead}>
              <Text style={styles.headText1}>{t('Explore_Farms')}</Text>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() =>
                  navigation.navigate('viewall', {
                    title: 'Explore Farms',
                    data: randomStores,
                    type: 'stores',
                  })
                }>
                <Text style={styles.viewText}>{t('view_all')}</Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  style={styles.icon1}
                  color="#212121"
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={randomStores}
              horizontal
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.storeCard}
                  onPress={() =>
                    navigation.navigate('farmScreen', {storeId: item.id})
                  }>
                  <View style={styles.storeImageWrapper}>
                    <Image
                      source={{uri: item.image}}
                      style={styles.storeImage}
                    />
                  </View>
                  <Text style={styles.storeName}>{t(item.name)}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* bestDeals */}
          <View>
            <View style={styles.recHead}>
              <Text style={styles.headText1}>{t('Best_Deals')}</Text>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() =>
                  navigation.navigate('viewall', {
                    title: 'Best Deals',
                    data: bestDeals,
                    type: 'products',
                  })
                }>
                <Text style={styles.viewText}>{t('view_all')}</Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  style={styles.icon1}
                  color="#212121"
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={bestDeals}
              horizontal
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
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
                  {/* Translated name */}
                  <Text style={styles.farm}>{t(item.farm)}</Text>
                  {/* Translated farm */}
                  <Text style={styles.price}>{item.price}</Text>
                </View>
              )}
            />
          </View>

          {/* <View style={styles.languageContainer}>
            <TouchableOpacity
              style={styles.langButton}
              onPress={() => changeLanguage('en')}>
              <Text style={styles.langText}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langButton}
              onPress={() => changeLanguage('te')}>
              <Text style={styles.langText}>తెలుగు</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langButton}
              onPress={() => changeLanguage('hi')}>
              <Text style={styles.langText}>हिन्दी</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langButton}
              onPress={() => changeLanguage('ta')}>
              <Text style={styles.langText}>தமிழ்</Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#F4F4F4',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headText: {
    fontSize: 30,
    color: '#709856',
    fontFamily: 'Sansita-ExtraBold',
  },
  headText1: {
    fontSize: 25,
    color: '#709856',
    fontFamily: 'Sansita-Bold',
  },
  icon: {
    position: 'absolute',
    right: 20,
    color: '#212121',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Sansita-Regular',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },

  categoryItem: {
    width: 100,
    height: 70,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  icon1: {
    fontSize: 24,
  },
  name1: {
    marginTop: 5,
    fontSize: 14,
    color: '#212121',
    fontFamily: 'Sansita-Bold',
  },

  recHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    color: '#212121',
    fontSize: 18,
    fontFamily: 'Sansita-Regular',
  },
  card: {
    width: 130,
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
    marginHorizontal: 5,
    marginVertical: 5,
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

  storeCard: {
    width: 130,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    marginVertical: 5,
  },
  storeImageWrapper: {
    width: 130,
    height: 120,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  storeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storeName: {
    fontSize: 19,
    color: '#709856',
    marginTop: 5,
    fontFamily: 'Sansita-Bold',
  },

  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  langButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  langText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
