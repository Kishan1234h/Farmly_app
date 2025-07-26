import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {logoutUser, getSession} from '../../utils/SecureStorage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {getOrders} from '../../data/db';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (user?.id) {
      try {
        const userOrders = await getOrders(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('order_fetch_failed'),
        });
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const sessionUser = await getSession();
        setUser(sessionUser);

        if (sessionUser?.id) {
          const userOrders = await getOrders(sessionUser.id);
          setOrders(userOrders);
        }
      };
      fetchData();
    }, []),
  );

  const handleLogout = async () => {
    await logoutUser();
    navigation.reset({
      index: 0,
      routes: [{name: 'SplashScreen'}],
    });
  };

  const renderOrderItem = ({item}) => {
    try {
      const products = JSON.parse(item.products);
      return (
        <TouchableOpacity
          style={styles.orderCard}
          onPress={() => navigation.navigate('OrderDetails', {order: item})}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Order #{item.order_id}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.orderTotal}>₹{item.total_amount}</Text>
          <Text style={styles.itemsCount}>
            {products.length} {t('items')}
          </Text>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('Error parsing order products:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={require('../../../assets/images/dummy-profile.png')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user?.username || t('guest_user')}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>{t('recent_orders')}</Text>

        {orders.length > 0 ? (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={item => item.order_id.toString()}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment" size={40} color="#709856" />
            <Text style={styles.emptyText}>{t('no_orders')}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#FFF" />
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#709856',
  },
  username: {
    fontSize: 22,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'Sansita-Bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    fontFamily: 'Sansita-Regular',
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Sansita-Regular',
    color: '#666',
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#709856',
    padding: 16,
    margin: 20,
    borderRadius: 10,
    marginBottom: 80,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Sansita-Bold',
    marginLeft: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default ProfileScreen;
