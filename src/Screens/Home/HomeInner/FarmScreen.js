// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   StatusBar,
// } from 'react-native';
// import React, {useState, useEffect, useCallback} from 'react';
// import {useRoute, useNavigation, useFocusEffect} from '@react-navigation/native';
// import data from '../../../data/data.json';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {useTranslation} from 'react-i18next';
// import {getSession} from '../../../utils/SecureStorage';
// import {addToCart} from '../../../data/db';
// import Toast from 'react-native-toast-message';

// const FarmScreen = () => {
//   const {t} = useTranslation();
//   const route = useRoute();
//   const navigation = useNavigation();
//   const {storeId} = route.params;
//   const [user, setUser] = useState(null);

//   // Find the store in data
//   const store = data.stores.find(s => s.id === storeId);

//   useFocusEffect(
//     useCallback(() => {
//       const loadData = async () => {
//         // Find the store
//         const foundStore = data.stores.find(s => s.id === storeId);
//         setStore(foundStore);

//         // Load user session
//         const sessionUser = await getSession();
//         setUser(sessionUser);
//       };

//       loadData();
//     }, [storeId]),
//   );

//   const handleAddToCart = async product => {
//     try {
//       if (!user) {
//         Toast.show({
//           type: 'info',
//           text1: t('login_required'),
//           text2: t('login_to_add_cart'),
//         });
//         navigation.navigate('Login');
//         return;
//       }

//       await addToCart(product, user.id);
//       Toast.show({
//         type: 'success',
//         text1: t('added_to_cart'),
//         text2: `${t(product.name)} ${t('added_successfully')}`,
//       });
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       Toast.show({
//         type: 'error',
//         text1: t('error'),
//         text2: t('failed_to_add_cart'),
//       });
//     }
//   };

//   if (!store) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{t('store_not_found')}</Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       <StatusBar backgroundColor="#F4F4F4" barStyle="dark-content" />
//       <FlatList
//         contentContainerStyle={styles.container}
//         ListHeaderComponent={
//           <>
//             {/* Banner Image */}
//             <View style={styles.bannerContainer}>
//               <Image source={{uri: store.banner}} style={styles.banner} />
//               <Image source={{uri: store.logo}} style={styles.logo} />
//             </View>

//             {/* Store Info */}
//             <View style={styles.infoContainer}>
//               <Text style={styles.storeName}>{t(store.name)}</Text>
//               <Text style={styles.description}>{t(store.description)}</Text>
//             </View>

//             {/* Categories */}
//             {store.categories && store.categories.length > 0 && (
//               <View style={styles.sectionContainer}>
//                 <Text style={styles.sectionTitle}>{t('categories')}</Text>
//                 <FlatList
//                   horizontal
//                   data={store.categories}
//                   keyExtractor={item => item}
//                   renderItem={({item}) => (
//                     <View style={styles.categoryPill}>
//                       <Text style={styles.categoryText}>{t(item)}</Text>
//                     </View>
//                   )}
//                   contentContainerStyle={styles.categoriesList}
//                 />
//               </View>
//             )}
//           </>
//         }
//         data={store.products}
//         numColumns={2}
//         keyExtractor={item => item.id.toString()}
//         columnWrapperStyle={styles.productsRow}
//         renderItem={({item}) => (
//           <TouchableOpacity
//             style={styles.productCard}
//             onPress={() => handleAddToCart(item)}>
//             <View
//               style={[
//                 styles.imageContainer,
//                 {backgroundColor: item.background_color},
//               ]}>
//               <Image source={{uri: item.image}} style={styles.productImage} />
//             </View>
//             <Text style={styles.productName}>{t(item.name)}</Text>
//             <Text style={styles.productPrice}>{item.price}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </>
//   );
// };

import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useRoute, useNavigation, useFocusEffect} from '@react-navigation/native';
import data from '../../../data/data.json';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {getSession} from '../../../utils/SecureStorage';
import {addToCart} from '../../../data/db';
import Toast from 'react-native-toast-message';

const FarmScreen = () => {
  const {t} = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const {storeId} = route.params;
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const foundStore = data.stores.find(s => s.id === storeId);
        setStore(foundStore);
        
        const sessionUser = await getSession();
        setUser(sessionUser);
      };
      
      loadData();
    }, [storeId])
  );

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

      if (!product?.id) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('invalid_product'),
        });
        return;
      }

      const fullProduct = {
        ...product,
        store_id: storeId,
        farm: store?.name || 'Unknown Farm',
      };

      await addToCart(fullProduct, user.id);
      Toast.show({
        type: 'success',
        text1: t('added_to_cart'),
        text2: `${t(product.name)} ${t('added_successfully')}`,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('failed_to_add_cart'),
      });
    }
  };

  if (!store) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('store_not_found')}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#F4F4F4" barStyle="dark-content" />
      <FlatList
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            <View style={styles.bannerContainer}>
              <Image source={{uri: store.banner}} style={styles.banner} />
              <Image source={{uri: store.logo}} style={styles.logo} />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.storeName}>{t(store.name)}</Text>
              <Text style={styles.description}>{t(store.description)}</Text>
            </View>

            {store.categories?.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{t('categories')}</Text>
                <FlatList
                  horizontal
                  data={store.categories}
                  keyExtractor={item => item}
                  renderItem={({item}) => (
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryText}>{t(item)}</Text>
                    </View>
                  )}
                  contentContainerStyle={styles.categoriesList}
                />
              </View>
            )}
          </>
        }
        data={store.products}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        columnWrapperStyle={styles.productsRow}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleAddToCart(item)}
            disabled={!item?.id}>
            <View style={[
              styles.imageContainer,
              {backgroundColor: item.background_color}
            ]}>
              <Image source={{uri: item.image}} style={styles.productImage} />
            </View>
            <Text style={styles.productName}>{t(item.name)}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

// Keep your existing styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoContainer: {
    marginTop: 60,
    padding: 20,
    alignItems: 'center',
  },
  storeName: {
    fontSize: 28,
    fontFamily: 'Sansita-ExtraBold',
    color: '#709856',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Sansita-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 5,
  },
  categoryPill: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  categoryText: {
    fontFamily: 'Sansita-Regular',
    color: '#212121',
  },
  productsRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  imageContainer: {
    borderRadius: 10,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: 'Sansita-Bold',
    color: '#212121',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#FF0000',
  },
});

export default FarmScreen;
