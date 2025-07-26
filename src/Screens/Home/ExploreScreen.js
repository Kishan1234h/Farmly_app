import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {getSession} from '../../utils/SecureStorage';
import {addToCart} from '../../data/db';
import data from '../../data/data.json';
import Toast from 'react-native-toast-message';

const ExploreScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  // Combine all products and stores
  useEffect(() => {
    const products = data.stores.flatMap(store =>
      store.products.map(product => ({
        ...product,
        type: 'product',
        store_id: store.id,
        farm: store.name,
      })),
    );

    const stores = data.stores.map(store => ({
      ...store,
      type: 'store',
      image: store.logo,
    }));

    setAllItems([...products, ...stores]);
    setFilteredItems([...products, ...stores]);
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionUser = await getSession();
      setUser(sessionUser);
    };
    fetchSession();
  }, []);

  const handleSearch = text => {
    setSearchQuery(text);
    const filtered = allItems.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredItems(filtered);
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
    if (item.type === 'store') {
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
            {backgroundColor: item.background_color || '#F4F4F4'},
          ]}>
          <Image source={{uri: item.image}} style={styles.productImage} />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}>
            <MaterialIcons name="add" size={20} color="#212121" />
          </TouchableOpacity>
        </View>
        <Text style={styles.productName}>{t(item.name)}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor="#F4F4F4" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('search_placeholder')}
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <MaterialIcons
            name="search"
            size={24}
            color="#666"
            style={styles.searchIcon}
          />
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('no_results')}</Text>
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
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginVertical: 16,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 45,
    fontSize: 16,
    fontFamily: 'Sansita-Regular',
    color: '#212121',
    elevation: 2,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
  },
  imageContainer: {
    borderRadius: 10,
    aspectRatio: 1,
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontFamily: 'Sansita-Bold',
    color: '#212121',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  storeCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Sansita-Regular',
  },
});

export default ExploreScreen;
