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
  TextInput,
} from 'react-native';

// Bileşeni içe aktarıyoruz
import ProductCard from './components/ProductCard';

const PHONE_NUMBER = '525529275019';
const LOGO_IMAGE = require('./assets/icon.png');

// --- VERİLER ---
const TURKISH_WORDS = [
  { tr: 'Merhaba', es: 'Hola', note: 'Saludo general' },
  { tr: 'Günaydın', es: 'Buenos días', note: 'En la mañana' },
  { tr: 'İyi akşamlar', es: 'Buenas noches', note: 'Saludo en la noche' },
  { tr: 'Hoş geldiniz', es: 'Bienvenido(a)', note: 'Al recibir a alguien' },
  { tr: 'Güle güle', es: 'Adiós', note: 'Al despedirse' },
  { tr: 'Nasılsın?', es: '¿Cómo estás?', note: 'Informal' },
  { tr: 'Teşekkürler', es: 'Gracias', note: 'General' },
  { tr: 'Lütfen', es: 'Por favor', note: 'Cortesía' },
  { tr: 'Afiyet olsun', es: 'Buen provecho', note: 'Al comer' },
  { tr: 'Hesap lütfen', es: 'La cuenta, por favor', note: 'Restaurante' },
];

const NEWS_FEED_URL = 'https://www.trtworld.com/rss/es/turkey';
const CATEGORIES = [
  { id: 'all', name: 'Todo' },
  { id: 'baklava', name: 'Baklava' },
  { id: 'lokum', name: 'Lokum' },
  { id: 'cajas', name: 'Cajas de regalo' },
];

const PRODUCTS = [
  { id: 'baklava-pistache-1kg', name: 'Baklava Pistache 1 kg', description: 'Baklava de pistache turco original.', price: 700, category: 'baklava', bestSeller: true, image: require('./assets/baklava_pistache_main.webp') },
  { id: 'baklava-pistache-500g', name: 'Baklava Pistache 500 g', description: 'Media charola de baklava.', price: 380, category: 'baklava', bestSeller: true, image: require('./assets/baklava_pistache_main.webp') },
  { id: 'lokum-rosa-250', name: 'Lokum Rosa 250 g', description: 'Delicia turca sabor rosa.', price: 250, category: 'lokum', bestSeller: false, imageUrl: 'https://images.pexels.com/photos/1438186/pexels-photo-1438186.jpeg?auto=compress&cs=tinysrgb&w=800' },
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
  const [user, setUser] = useState({ name: '', phone: '' });

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
    const message = `Hola El Turco Chilango, me gustaría pedir:\n\nProducto: ${product.name}\nPrecio: ${product.price} MXN`.trim();
    Linking.openURL(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Image source={LOGO_IMAGE} style={styles.logo} />
          <View>
            <Text style={styles.brand}>El Turco Chilango</Text>
            <Text style={styles.slogan}>Sabores de Turquía en México</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabBar}>
        {[['menu', 'Menú'], ['about', 'Nosotros'], ['clase', 'Clase'], ['news', 'Noticias'], ['profile', 'Perfil']].map(([key, label]) => (
          <Pressable key={key} style={[styles.tabButton, activeTab === key && styles.tabButtonActive]} onPress={() => setActiveTab(key)}>
            <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'menu' && (
        <View style={styles.container}>
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

      {activeTab === 'clase' && (
        <View style={styles.claseContainer}>
          <FlatList data={TURKISH_WORDS} keyExtractor={(_, idx) => `w-${idx}`} renderItem={({item}) => (
            <View style={styles.wordRow}>
              <Text style={styles.wordTr}>{item.tr}</Text>
              <Text style={styles.wordEs}>{item.es}</Text>
            </View>
          )} />
        </View>
      )}

      {activeTab === 'news' && (
        <View style={styles.newsContainer}>
          {newsLoading ? <ActivityIndicator color="#014226" /> : (
            <FlatList data={news} keyExtractor={(item) => item.id} renderItem={({item}) => (
              <Pressable style={styles.newsCard} onPress={() => item.link && Linking.openURL(item.link)}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text numberOfLines={2}>{item.description.replace(/<[^>]+>/g, '')}</Text>
              </Pressable>
            )} />
          )}
        </View>
      )}

      {activeTab === 'profile' && (
        <View style={styles.profileContainer}>
          <Text style={styles.profileTitle}>Tu Perfil</Text>
          <TextInput style={styles.input} placeholder="Nombre" value={user.name} onChangeText={t => setUser({...user, name: t})} />
          <TextInput style={styles.input} placeholder="WhatsApp" value={user.phone} onChangeText={t => setUser({...user, phone: t})} keyboardType="phone-pad" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF6E9' },
  header: { backgroundColor: '#014226', padding: 20 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  brand: { color:
