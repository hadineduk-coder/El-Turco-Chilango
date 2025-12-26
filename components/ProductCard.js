import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

// Bileşenimizi oluşturuyoruz
const ProductCard = ({ item, userCoupons, onOrder, onOrderWithCoupon }) => {
  const imageSource = item.image ? item.image : { uri: item.imageUrl };

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
      
      <View style={styles.cardBody}>
        {item.bestSeller && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ Bestseller</Text>
          </View>
        )}

        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDesc}>{item.description}</Text>
        
        <View style={styles.priceRow}>
           <Text style={styles.productPrice}>{item.price} MXN</Text>
           {userCoupons > 0 && (
             <View style={styles.discountBadge}>
               <Text style={styles.discountText}>%10 Descuento</Text>
             </View>
           )}
        </View>

        <Pressable 
          style={({ pressed }) => [styles.orderButton, pressed && { opacity: 0.8 }]} 
          onPress={() => onOrder(item)}
        >
          <Text style={styles.orderButtonText}>Pedir por WhatsApp</Text>
        </Pressable>

        {userCoupons > 0 && (
          <Pressable
            style={({ pressed }) => [styles.orderButtonSecondary, pressed && { opacity: 0.8 }]}
            onPress={() => onOrderWithCoupon(item)}
          >
            <Text style={styles.orderButtonSecondaryText}>Usar cupón 10%</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

// Sadece bu bileşene özel stiller
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 3,
  },
  cardImage: { width: '100%', height: 170 },
  cardBody: { padding: 14 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D4A017',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: { color: 'white', fontSize: 11, fontWeight: '700' },
  productName: { fontSize: 16, fontWeight: '600', color: '#2D2A24' },
  productDesc: { fontSize: 13, color: '#6B6457', marginVertical: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  productPrice: { fontSize: 17, fontWeight: '700', color: '#014226' },
  discountBadge: { backgroundColor: '#E8F5E9', marginLeft: 10, padding: 4, borderRadius: 4 },
  discountText: { color: '#2E7D32', fontSize: 10, fontWeight: 'bold' },
  orderButton: { backgroundColor: '#014226', padding: 12, borderRadius: 10, alignItems: 'center' },
  orderButtonText: { color: 'white', fontWeight: 'bold' },
  orderButtonSecondary: { marginTop: 8, borderWidth: 1, borderColor: '#014226', padding: 10, borderRadius: 10, alignItems: 'center' },
  orderButtonSecondaryText: { color: '#014226', fontWeight: '600' },
});

export default ProductCard;
