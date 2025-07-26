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
import {getSession} from '../../../utils/SecureStorage';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {addToCart} from '../../../data/db';

const ViewAllScreen = () => {
  const route = useRoute();
  const {title, data, type} = route.params;
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionUser = await getSession();
      if (sessionUser) setUser(sessionUser);
    };
    fetchSession();
  }, []);

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

      await addToCart(product, user.id);
      Toast.show({
        type: 'success',
        text1: t('added_to_cart'),
        text2: `${t(product.name)} ${t('added_successfully')}`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('failed_to_add_cart'),
      });
    }
  };

  const renderItem = ({item}) => {
    if (type === 'stores') {
      return (
        <TouchableOpacity
          style={styles.storeCard}
          onPress={() => navigation.navigate('farmScreen', {storeId: item.id})}>
          <Image source={{uri: item.image}} style={styles.storeImage} />
          <Text style={styles.storeName}>{t(item.name)}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.productCard}>
        <View
          style={[
            styles.imageContainer,
            {backgroundColor: item.background_color},
          ]}>
          <Image source={{uri: item.image}} style={styles.productImage} />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}>
            <MaterialIcons name="add" size={20} color="#212121" />
          </TouchableOpacity>
        </View>
        <Text style={styles.productName}>{t(item.name)}</Text>
        {item.farm && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('farmScreen', {storeId: item.id})
            }>
            <Text style={styles.farm}>{t(item.farm)}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.price}>{item.price}</Text>
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor="#709856" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios-new" size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t(title)}</Text>
          <View style={{width: 22}} />
        </View>

        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          numColumns={type === 'stores' ? 1 : 2}
          columnWrapperStyle={type !== 'stores' && styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
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
    backgroundColor: '#709856',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: 'Sansita-Bold',
    flex: 1,
    textAlign: 'center',
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFF',
    padding: 8,
  },
  imageContainer: {
    borderRadius: 10,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 16,
    color: '#709856',
    fontFamily: 'Sansita-Bold',
    marginBottom: 4,
  },
  farm: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Sansita-Regular',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#212121',
    fontFamily: 'Sansita-Bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  storeCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  storeName: {
    fontSize: 16,
    color: '#709856',
    fontFamily: 'Sansita-Bold',
    flex: 1,
  },
});

export default ViewAllScreen;
