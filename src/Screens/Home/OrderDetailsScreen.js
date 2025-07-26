import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const OrderDetailsScreen = ({route}) => {
  const {t} = useTranslation();
  const {order} = route.params;
  const items = JSON.parse(order.products);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="receipt" size={24} color="#709856" />
        <Text style={styles.headerText}>{t('order_details')}</Text>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('order_date')}:</Text>
          <Text style={styles.detailValue}>
            {new Date(order.created_at).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('order_total')}:</Text>
          <Text style={[styles.detailValue, styles.total]}>
            ₹{order.total_amount}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t('order_items')}</Text>

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{t(item.name)}</Text>
            <View style={styles.itemDetails}>
              <Text style={styles.itemPrice}>{item.price}</Text>
              <Text style={styles.itemQuantity}>x {item.quantity}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    marginLeft: 10,
  },
  detailCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Sansita-Regular',
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Sansita-Bold',
    color: '#333',
  },
  total: {
    color: '#709856',
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
    marginBottom: 15,
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Sansita-Regular',
    color: '#333',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Sansita-Bold',
    color: '#709856',
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'Sansita-Regular',
    color: '#666',
  },
});

export default OrderDetailsScreen;
