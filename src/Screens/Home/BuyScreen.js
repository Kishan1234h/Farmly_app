import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import {getSession} from '../../utils/SecureStorage';
import {placeOrder} from '../../data/db';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BuyScreen = () => {
  const {t} = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const sessionUser = await getSession();
      setUser(sessionUser);

      if (route.params?.cartItems) {
        setCartItems(route.params.cartItems);
        calculateTotal(route.params.cartItems);
      }
    };
    loadData();
  }, []);

  const calculateTotal = items => {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.product.price.replace(/[^0-9.]/g, ''));
      return sum + price * item.quantity;
    }, 0);
    setTotal(total.toFixed(2));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: t('login_required'),
        text2: t('login_to_continue'),
      });
      return;
    }

    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name,
    }));

    const success = await placeOrder(user.id, orderItems, total);

    if (success) {
      Toast.show({
        type: 'success',
        text1: t('order_success'),
        text2: t('order_placed'),
      });
      navigation.reset({
        index: 0,
        routes: [{name: 'homestack'}],
      });
    } else {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('order_failed'),
      });
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#F4F4F4" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#709856" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('review_order')}</Text>
          <View style={{width: 24}} />
        </View>

        <FlatList
          data={cartItems}
          contentContainerStyle={styles.listContent}
          keyExtractor={item => item.product_id.toString()}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Text style={styles.productName}>{t(item.product.name)}</Text>
              <View style={styles.row}>
                <Text style={styles.price}>
                  {item.product.price} x {item.quantity}
                </Text>
                <Text style={styles.total}>
                  ₹
                  {(
                    parseFloat(item.product.price.replace(/[^0-9.]/g, '')) *
                    item.quantity
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.totalContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t('total')}:</Text>
                <Text style={styles.totalAmount}>₹{total}</Text>
              </View>
              <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={handlePlaceOrder}>
                <Text style={styles.buttonText}>{t('place_order')}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontFamily: 'Sansita-Regular',
    color: '#666',
  },
  total: {
    fontSize: 14,
    fontFamily: 'Sansita-Bold',
    color: '#212121',
  },
  totalContainer: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: 'Sansita-Bold',
    color: '#212121',
  },
  placeOrderButton: {
    backgroundColor: '#709856',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Sansita-Bold',
  },
});

export default BuyScreen;
