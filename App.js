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

const PHONE_NUMBER = '525529275019';
const INSTAGRAM_URL = 'https://instagram.com/elturcochilango';
const LOGO_IMAGE = require('./assets/app-icon.png');

// --- VERİLER ---
const TURKISH_WORDS = [
  { tr: 'Merhaba', es: 'Hola', note: 'Saludo general' },
  { tr: 'Afiyet olsun', es: 'Buen provecho', note: 'Al comer' },
  { tr: 'Lütfen', es: 'Por favor', note: 'Cortesía' },
  { tr: 'Teşekkürler', es: 'Gracias', note: 'General' },
  { tr: 'Hesap lütfen', es: 'La cuenta, por favor', note: 'Restaurante' },
  { tr: 'Nasılsın?', es: '¿Cómo estás?', note: 'Informal' },
  { tr: 'İyiyim', es: 'Estoy bien', note: 'Respuesta' },
];

const NEWS_FEED_URL = 'https://www.trtworld.com/rss/es/turkey';
const CATEGORIES = [
  { id: 'all', name: 'Todo' },
  { id: 'baklava', name: 'Baklava' },
  { id: 'lokum', name: 'Lokum' },
];

const PRODUCTS = [
  { id: 'bak-1', name: 'Baklava Pistache', description: 'Baklava de pistache turco original.', price: 700, category: 'baklava', bestSeller: true, image: require('./assets/baklava_pistache_main.webp') },
  { id: 'bak-2', name: 'Baklava Nuez', description: 'Baklava clásica de nuez turca.', price: 650, category: 'baklava', bestSeller: false, image: require('./assets/baklava_nuez_main.webp') },
  { id: 'lok-1', name: 'Lokum Rosa', description: 'Delicia turca tradicional sabor rosa.', price: 250, category: 'lokum', bestSeller: false, imageUrl: 'https://images.pexels.com/photos/1438186/pexels-photo-1438186.jpeg?auto=compress&cs=tinysrgb&w=800' },
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
      console.log("Haber yüklenemedi");
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
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={LOGO_IMAGE} style={styles.logo} />
        <View>
          <Text style={styles.brand}>El Turco Chilango</Text>
          <Text style={styles.slogan}>Sabores de Turquía en México</Text>
        </View>
      </View>

      {/* CONTENT AREA */}
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
                  <View>
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
              <Pressable style={styles.contactButton
