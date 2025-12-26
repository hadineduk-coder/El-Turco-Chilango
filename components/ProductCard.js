import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

const ProductCard = ({ item, onOrder }) => {
  const imageSource = item.image ? item.image : { uri: item.imageUrl };

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
      
      <View style={styles.cardBody}>
        {item.bestSeller && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ En Popüler</Text>
          </View>
        )}

        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.priceRow}>
           <Text style={styles.productPrice}>{item.price} MXN</Text>
        </View>

        <Pressable 
          style={({ pressed }) => [styles.orderButton, pressed && { opacity: 0.8 }]} 
          onPress={() => onOrder(item)}
        >
          <Text style={styles.orderButtonText}>Pedir por WhatsApp</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: { width: '100%', height: 180 },
  cardBody: { padding: 15 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D4A017',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  productName: { fontSize: 18, fontWeight: '700', color: '#2D2A24' },
  productDesc: { fontSize: 14, color: '#6B6457', marginVertical: 6, lineHeight: 20 },
  priceRow: { marginBottom: 12 },
  productPrice: { fontSize: 19, fontWeight: '800', color: '#014226' },
  orderButton: { backgroundColor: '#014226', padding: 14, borderRadius: 12, alignItems: 'center' },
  orderButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});

export default ProductCard;
