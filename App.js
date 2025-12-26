import React, { useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  StatusBar,
  Linking,
  ActivityIndicator,
  Image,
} from 'react-native';
// İkonlar için Expo'nun hazır kütüphanesini ekledik
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import ProductCard from './components/ProductCard';

const PHONE_NUMBER = '525529275019';
const INSTAGRAM_URL = 'https://instagram.com/elturcochilango';
const LOGO_IMAGE = require('./assets/icon.png');

// --- VERİLER ---
const TURKISH_WORDS = [
  { tr: 'Merhaba', es: 'Hola', note: 'Saludo general' },
  { tr: 'Afiyet olsun', es: 'Buen provecho', note: 'Al comer' },
  { tr: 'Lütfen', es: 'Por favor', note: 'Cortesía' },
  { tr: 'Teşekkürler', es: 'Gracias', note: 'General' },
  { tr: 'Hesap lütfen', es: 'La cuenta, por favor', note: 'Restaurante' },
];

const CATEGORIES = [
  { id: 'all', name: 'Todo' },
  { id: 'baklava', name: 'Baklava' },
  { id: 'lokum', name: 'Lokum' },
];

const PRODUCTS = [
  { id: 'bak-1', name: 'Baklava Pistache', description: 'Baklava de pistache turco original.', price: 700, category: 'baklava', bestSeller: true, image: require('./assets/baklava_pistache_main.webp') },
  { id: 'lok-1', name: 'Lokum Rosa', description: 'Delicia turca tradicional.', price: 250, category: 'lokum', bestSeller: false, imageUrl: 'https://images.pexels.com/photos/1438186/pexels-photo-1438186.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('menu');

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleOrder = (product) => {
    const message = `Hola, me gustaría pedir: ${product.name}`.trim();
    Linking.openURL(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`);
  };

  const openInstagram = () => Linking.openURL(INSTAGRAM_URL);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={LOGO_IMAGE} style={styles.logo} />
        <View>
          <Text style={styles.brand}>El Turco Chilango</Text>
          <Text style={styles.slogan}>Sabores de Turquía en México</Text>
        </View>
      </View>

      {/* ANA İÇERİK */}
      <View style={styles.content}>
        {activeTab === 'menu' && (
          <View style={{ flex: 1 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
              {CATEGORIES.map((cat) => (
                <Pressable key={cat.id} style={[styles.categoryChip, cat.id === selectedCategory && styles.categoryChipActive]} onPress={() => setSelectedCategory(cat.id)}>
                  <Text style={[styles.categoryText, cat.id === selectedCategory && styles.categoryTextActive]}>{cat.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <FlatList data={filteredProducts} keyExtractor={(item) => item.id} renderItem={({item}) => (
              <ProductCard item={item} onOrder={handleOrder} />
            )} contentContainerStyle={styles.listContent} />
          </View>
        )}

        {activeTab === 'about' && (
          <ScrollView contentContainerStyle={styles.aboutPage}>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Nuestra Historia</Text>
              <Text style={styles.aboutText}>Traemos la auténtica tradición de los dulces turcos a la Ciudad de México. Cada receta es un puente entre Estambul y el corazón chilango.</Text>
            </View>

            <View style={styles.contactSection}>
              <Text style={styles.contactTitle}>Contacto Directo</Text>
              
              <Pressable style={styles.contactButton} onPress={() => Linking.openURL(`https://wa.me/${PHONE_NUMBER}`)}>
                <MaterialCommunityIcons name="whatsapp" size={24} color="white" />
                <Text style={styles.contactButtonText}>Escríbenos por WhatsApp</Text>
              </Pressable>

              <Pressable style={[styles.contactButton, { backgroundColor: '#E1306C' }]} onPress={openInstagram}>
                <MaterialCommunityIcons name="instagram" size={24} color="white" />
                <Text style={styles.contactButtonText}>Síguenos en Instagram</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </View>

      {/* ALT TAB BAR (İkonlu Yeni Tasarım) */}
      <View style={styles.tabBar}>
        {[
          { key: 'menu', label: 'Menú', icon: 'food-croissant' },
          { key: 'clase', label: 'Clase', icon: 'translate' },
          { key: 'news', label: 'Noticias', icon: 'newspaper-variant-outline' },
          { key: 'about', label: 'Nosotros', icon: 'information-outline' },
        ].map((tab) => (
          <Pressable key={tab.key} style={styles.tabButton} onPress={() => setActiveTab(tab.key)}>
            <MaterialCommunityIcons 
              name={tab.icon} 
              size={24} 
              color={activeTab === tab.key ? '#014226' : '#9E9481'} 
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFDF9' },
  header: { backgroundColor: '#014226', padding: 20, flexDirection: 'row', alignItems: 'center', paddingTop: 40 },
  logo: { width: 45, height: 45, borderRadius: 22, marginRight: 12, borderWidth: 1, borderColor: '#F3E6CB' },
  brand: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  slogan: { color: '#D4CBB3', fontSize: 11 },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#EEE' },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 10, color: '#9E9481', marginTop: 4 },
  tabTextActive: { color: '#014226', fontWeight: 'bold' },
  categoryBar: { padding: 15, maxHeight: 70 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#014226' },
  categoryChipActive: { backgroundColor: '#014226' },
  categoryText: { color: '#014226', fontWeight: '600' },
  categoryTextActive: { color: 'white' },
  listContent: { padding: 15 },
  aboutPage: { padding: 20 },
  aboutCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 2, marginBottom: 20 },
  aboutTitle: { fontSize: 20, fontWeight: 'bold', color: '#014226', marginBottom: 10 },
  aboutText: { fontSize: 14, color: '#555', lineHeight: 22 },
  contactSection: { alignItems: 'center' },
  contactTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 15 },
  contactButton: { flexDirection: 'row', backgroundColor: '#25D366', width: '100%', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  contactButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
});
