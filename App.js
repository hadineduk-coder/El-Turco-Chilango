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
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import ProductCard from './components/ProductCard';

// --- AYARLAR ---
const PHONE_NUMBER = '525529275019';
const INSTAGRAM_URL = 'https://instagram.com/elturcochilango';
const LOGO_IMAGE = require('./assets/app-icon.png');
const NEWS_FEED_URL = 'https://www.trtworld.com/rss/es/turkey';

// --- VERİLER ---
const TURKISH_WORDS = [
  { tr: 'Merhaba', es: 'Hola', note: 'Saludo general' },
  { tr: 'Nasılsın?', es: '¿Cómo estás?', note: 'Para iniciar' },
  { tr: 'İyiyim, teşekkürler', es: 'Estoy bien, gracias', note: 'Respuesta' },
  { tr: 'Lütfen', es: 'Por favor', note: 'Cortesía' },
  { tr: 'Teşekkür ederim', es: 'Gracias', note: 'Cortesía formal' },
  { tr: 'Çok lezzetli!', es: '¡Muy delicioso!', note: 'Para tus postres' },
  { tr: 'Afiyet olsun', es: 'Buen provecho', note: 'Deseo antes de comer' },
  { tr: 'Görüşürüz', es: 'Nos vemos / Adiós', note: 'Despedida' },
  { tr: 'Ne kadar?', es: '¿Cuánto cuesta?', note: 'Consultas' },
  { tr: 'Baklava istiyorum', es: 'Quiero baklava', note: 'Pedido' },
];

const CATEGORIES = [
  { id: 'all', name: 'Todo' },
  { id: 'baklava', name: 'Baklava' },
  { id: 'delicias', name: 'Delicias' },
];

const PRODUCTS = [
  { 
    id: 'bak-1', 
    name: 'Baklava Pistache', 
    description: 'Baklava de pistache turco original.', 
    price: 700, 
    category: 'baklava', 
    bestSeller: true, 
    image: require('./assets/baklava_pistache_main.webp') 
  },
  { 
    id: 'bak-2', 
    name: 'Baklava Nuez', 
    description: 'Baklava clásica de nuez turca.', 
    price: 650, 
    category: 'baklava', 
    bestSeller: false, 
    image: require('./assets/baklava_nuez_main.webp') 
  },
  { 
    id: 'lok-1', 
    name: 'Delicias Turcas', 
    description: 'Tradicional sabor rosa con pistache.', 
    price: 250, 
    category: 'delicias', 
    bestSeller: false, 
    imageUrl: 'https://images.pexels.com/photos/1438186/pexels-photo-1438186.jpeg?auto=compress&cs=tinysrgb&w=800' 
  },
];

// --- YARDIMCI FONKSİYONLAR ---
function parseRssItems(xmlText) {
  const items = [];
  const parts = xmlText.split('<item>');
  for (let i = 1; i < parts.length && items.length < 8; i++) {
    const block = parts[i];
    const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
    const descMatch = block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/);
    const linkMatch = block.match(/<link>(.*?)<\/link>/);
    items.push({ 
      id: `news-${i}`, 
      title: titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Sin título', 
      description: descMatch ? (descMatch[1] || descMatch[2]) : '', 
      link: linkMatch ? linkMatch[1] : '' 
    });
  }
  return items;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('menu');
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const loadNews = async () => {
    try {
      setNewsLoading(true);
      const res = await fetch(NEWS_FEED_URL);
      const text = await res.text();
      setNews(parseRssItems(text));
    } catch (e) {
      console.log("Error de noticias");
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => { loadNews(); }, []);

  const handleOrder = (product) => {
    const message = `Hola El Turco Chilango, me gustaría pedir: ${product.name}`.trim();
    Linking.openURL(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Image source={LOGO_IMAGE} style={styles.logo} />
        <View>
          <Text style={styles.brand}>El Turco Chilango</Text>
          <Text style={styles.slogan}>Sabores de Turquía en México</Text>
        </View>
      </View>

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
            <FlatList 
              data={filteredProducts} 
              keyExtractor={(item) => item.id} 
              renderItem={({item}) => <ProductCard item={item} onOrder={handleOrder} />} 
              contentContainerStyle={styles.listContent} 
            />
          </View>
        )}

        {activeTab === 'clase' && (
          <View style={styles.container}>
            <FlatList 
              data={TURKISH_WORDS} 
              keyExtractor={(_, idx) => `w-${idx}`} 
              renderItem={({item}) => (
                <View style={styles.wordRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.wordTr}>{item.tr}</Text>
                    <Text style={styles.wordEs}>{item.es}</Text>
                  </View>
                  <Text style={styles.wordNote}>{item.note}</Text>
                </View>
              )} 
            />
          </View>
        )}

        {activeTab === 'news' && (
          <View style={styles.container}>
            {newsLoading ? <ActivityIndicator size="large" color="#014226" style={{ marginTop: 20 }} /> : (
              <FlatList data={news} keyExtractor={(item) => item.id} renderItem={({item}) => (
                <Pressable style={styles.newsCard} onPress={() => item.link && Linking.openURL(item.link)}>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text numberOfLines={2} style={styles.newsDesc}>{item.description.replace(/<[^>]+>/g, '')}</Text>
                </Pressable>
              )} />
            )}
          </View>
        )}

        {activeTab === 'about' && (
          <ScrollView contentContainerStyle={styles.aboutPage}>
            <Image source={LOGO_IMAGE} style={styles.aboutHeroImage} resizeMode="contain" />
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Nuestra Historia 🇲🇽🇹🇷</Text>
              <Text style={styles.aboutText}>
                El Turco Chilango nace de la pasión por compartir la riqueza culinaria de Turquía en el corazón de México. 
                Nuestros postres son elaborados artesanalmente con recetas tradicionales.
              </Text>
              <Text style={styles.aboutText}>
                Hacemos envíos directos para que disfrutes de la auténtica experiencia turca en casa.
              </Text>
            </View>

            <View style={styles.contactSection}>
              <Text style={styles.contactHeader}>¡Haz tu pedido!</Text>
              <Pressable style={styles.contactButton} onPress={() => Linking.openURL(`https://wa.me/${PHONE_NUMBER}`)}>
                <MaterialCommunityIcons name="whatsapp" size={26} color="white" />
                <View style={styles.contactBtnTextContainer}>
                  <Text style={styles.contactButtonText}>WhatsApp</Text>
                  <Text style={styles.contactButtonSub}>Contáctanos aquí</Text>
                </View>
              </Pressable>

              <Pressable style={[styles.contactButton, { backgroundColor: '#E1306C' }]} onPress={() => Linking.openURL(INSTAGRAM_URL)}>
                <MaterialCommunityIcons name="instagram" size={26} color="white" />
                <View style={styles.contactBtnTextContainer}>
                  <Text style={styles.contactButtonText}>Instagram</Text>
                  <Text style={styles.contactButtonSub}>Síguenos para novedades</Text>
                </View>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </View>

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
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFDF9' },
  header: { backgroundColor: '#014226', padding: 20, flexDirection: 'row', alignItems: 'center', paddingTop: 45 },
  logo: { width: 45, height: 45, borderRadius: 22, marginRight: 12, borderWidth: 1, borderColor: '#F3E6CB' },
  brand: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  slogan: { color: '#D4CBB3', fontSize: 11 },
  content: { flex: 1 },
  container: { flex: 1, padding: 15 },
  tabBar: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#EEE' },
  tabButton: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 10, color: '#9E9481', marginTop: 4 },
  tabTextActive: { color: '#014226', fontWeight: 'bold' },
  categoryBar: { padding: 15, maxHeight: 75 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#014226' },
  categoryChipActive: { backgroundColor: '#014226' },
  categoryText: { color: '#014226', fontWeight: '600' },
  categoryTextActive: { color: 'white' },
  listContent: { padding: 15 },
  wordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, backgroundColor: 'white', marginBottom: 12, borderRadius: 15, elevation: 2 },
  wordTr: { fontSize: 18, fontWeight: 'bold', color: '#014226' },
  wordEs: { fontSize: 15, color: '#666' },
  wordNote: { fontSize: 11, color: '#999', fontStyle: 'italic' },
  newsCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
  newsTitle: { fontWeight: 'bold', fontSize: 15, color: '#333', marginBottom: 5 },
  newsDesc: { fontSize: 13, color: '#666' },
  aboutPage: { padding: 20, paddingBottom: 40 },
  aboutHeroImage: { width: '100%', height: 120, marginBottom: 20 },
  aboutCard: { backgroundColor: 'white', padding: 20, borderRadius: 20, elevation: 2, marginBottom: 25 },
  aboutTitle: { fontSize: 22, fontWeight: 'bold', color: '#014226', marginBottom: 10 },
  aboutText: { fontSize: 15, color: '#4A4A4A', lineHeight: 24, marginBottom: 10 },
  contactSection: { width: '100%' },
  contactHeader: { fontSize: 18, fontWeight: 'bold', color: '#014226', marginBottom: 15, textAlign: 'center' },
  contactButton: { flexDirection: 'row', backgroundColor: '#25D366', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 12, elevation: 3 },
  contactBtnTextContainer: { marginLeft: 15 },
  contactButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  contactButtonSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
});
