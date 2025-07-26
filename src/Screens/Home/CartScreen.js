import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {getSession} from '../../utils/SecureStorage';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {useTranslation} from 'react-i18next';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message';

import data from '../../data/data.json';
import {getCartItems, updateQuantity, removeFromCart} from '../../data/db';

// iocns
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CartScreen = () => {
  const {t, i18n} = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android' && changeNavigationBarColor) {
      changeNavigationBarColor('#F4F4F4', true);
    }

    fetchSession();
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

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  // Fetch stored session
  const fetchSession = async () => {
    const sessionUser = await getSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
  };

  // Load cart items from SQLite
  const loadCart = async () => {
    if (!user) return;
    const items = await getCartItems(user.id);
    const enrichedCart = items.map(item => {
      let product = null;
      data.stores.forEach(store => {
        const foundProduct = store.products.find(p => p.id === item.product_id);
        if (foundProduct) {
          product = foundProduct;
        }
      });
      return {...item, product};
    });
    setCartItems(enrichedCart);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity > 0) {
        await updateQuantity(user.id, productId, newQuantity);
      } else {
        await removeFromCart(user.id, productId);
      }
      loadCart();
    } catch (error) {
      console.error('Quantity update error:', error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('failed_update_quantity'),
      });
    }
  };

  // const calculateTotal = () => {
  //   return cartItems
  //     .reduce((total, item) => {
  //       const price = parseFloat(item.product.price.replace(/[^0-9.]/g, ''));
  //       return total + price * item.quantity;
  //     }, 0)
  //     .toFixed(2);
  // };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        // Remove all non-digit characters except periods
        const cleanedPrice = item.product.price.replace(/[^0-9.]/g, '');

        // Handle cases with multiple decimal points
        const decimalParts = cleanedPrice.split('.');
        let priceValue;

        if (decimalParts.length > 1) {
          // Take only the first decimal part
          priceValue = parseFloat(`${decimalParts[0]}.${decimalParts[1]}`);
        } else {
          priceValue = parseFloat(cleanedPrice);
        }

        return total + (priceValue || 0) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadCart();
      }
    }, [user]),
  );

  return (
    <>
      <StatusBar backgroundColor="#F4F4F4" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.headText}>{t('Cart')}</Text>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => navigation.navigate('settings')}>
            <MaterialIcons name="settings" size={22} color="#212121" />
          </TouchableOpacity>
        </View>

        <View>
          <FlatList
            contentContainerStyle={styles.scrollContainer}
            data={cartItems}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) =>
              item.product ? (
                <View style={styles.cartItem}>
                  <Image
                    source={{uri: item.product.image}}
                    style={styles.image}
                  />
                  <View style={styles.details}>
                    <Text style={styles.name}>{t(item.product.name)}</Text>
                    <Text style={styles.price}>{item.product.price}</Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          handleQuantityChange(
                            item.product_id,
                            item.quantity - 1,
                          )
                        }
                        style={styles.quantityButton}>
                        <MaterialIcons
                          name="remove"
                          size={20}
                          color="#212121"
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleQuantityChange(
                            item.product_id,
                            item.quantity + 1,
                          )
                        }
                        style={styles.quantityButton}>
                        <MaterialIcons name="add" size={20} color="#212121" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : null
            }
            ListFooterComponent={
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                  {t('total')}: ₹{calculateTotal()}
                </Text>
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={() =>
                    navigation.navigate('buystack', {
                      cartItems: cartItems.filter(
                        item => item.product !== null,
                      ),
                    })
                  }>
                  <Text style={styles.checkoutText}>{t('checkout')}</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>
    </>
  );
};

export default CartScreen;

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
  icon: {
    position: 'absolute',
    right: 20,
    color: '#212121',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    color: '#709856',
    fontFamily: 'Sansita-Bold',
  },
  price: {
    fontSize: 16,
    color: '#212121',
    fontFamily: 'Sansita-Regular',
  },
  quantity: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Sansita-Regular',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 5,
    marginHorizontal: 5,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
    fontFamily: 'Sansita-Bold',
    color: '#333',
  },
  totalContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  totalText: {
    fontSize: 20,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    textAlign: 'center',
    marginBottom: 15,
  },
  checkoutButton: {
    backgroundColor: '#709856',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontFamily: 'Sansita-Bold',
    fontSize: 16,
  },
});
