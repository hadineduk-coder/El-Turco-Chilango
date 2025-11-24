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
} from 'react-native';

const PHONE_NUMBER = '525529275019'; // ← Senin WhatsApp numaran

// Clase Turca – basit kelime listesi
const TURKISH_WORDS = [
  { tr: 'Merhaba', es: 'Hola', note: 'Saludo general' },
  { tr: 'Teşekkürler', es: 'Gracias', note: 'Agradecimiento' },
  { tr: 'Afiyet olsun', es: 'Buen provecho', note: 'Antes o después de comer' },
  { tr: 'Günaydın', es: 'Buenos días', note: 'En la mañana' },
  { tr: 'İyi akşamlar', es: 'Buenas noches', note: 'Saludo en la noche' },
  { tr: 'Evet', es: 'Sí', note: 'Respuesta afirmativa' },
  { tr: 'Hayır', es: 'No', note: 'Respuesta negativa' },
  { tr: 'Baklava', es: 'Baklava', note: 'Postre típico turco' },
  { tr: 'Lokum', es: 'Delicia turca', note: 'Dulce de gelatina turco' },
];

// Türkiye haberleri – RSS adresi (örnek)
// Gerekirse URL’yi değiştirebilirsin.
const NEWS_FEED_URL = 'https://www.aa.com.tr/es/rss/default?cat=Turkiye';

const CATEGORIES = [
  { id: 'all', name: 'Todo' },
  { id: 'baklava', name: 'Baklava' },
  { id: 'lokum', name: 'Lokum' },
  { id: 'cajas', name: 'Cajas de regalo' },
];

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Baklava Pistache 500 g',
    description: 'Baklava clásica con pistache turco, jarabe ligero y masa crujiente.',
    price: 380,
    category: 'baklava',
  },
  {
    id: 'p2',
    name: 'Baklava Nuez 1 kg',
    description: 'Charola mixta de nuez, ideal para compartir.',
    price: 700,
    category: 'baklava',
  },
  {
    id: 'p3',
    name: 'Lokum Rosa 250 g',
    description: 'Delicia turca sabor rosa, espolvoreada con azúcar glass.',
    price: 250,
    category: 'lokum',
  },
  {
    id: 'p4',
    name: 'Lokum Mixto 500 g',
    description: 'Surtido de sabores clásicos: rosa, limón y naranja.',
    price: 420,
    category: 'lokum',
  },
  {
    id: 'p5',
    name: 'Caja regalo Baklava + Lokum',
    description: 'Caja premium con selección de baklava y lokum, lista para regalar.',
    price: 890,
    category: 'cajas',
  },
];

// Çok basit bir RSS parser: başlık ve açıklamayı çeker
function parseRssItems(xmlText, maxItems = 8) {
  const items = [];
  const parts = xmlText.split('<item>');
  for (let i = 1; i < parts.length && items.length < maxItems; i++) {
    const block = parts[i];
    const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
    const descMatch = block.match(
      /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/
    );
    const linkMatch = block.match(/<link>(.*?)<\/link>/);

    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Sin título';
    const description = descMatch ? (descMatch[1] || descMatch[2]) : '';
    const link = linkMatch ? linkMatch[1] : '';

    items.push({ id: `news-${i}`, title, description, link });
  }
  return items;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'about' | 'clase' | 'news'

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Haberleri yükle
  const loadNews = async () => {
    try {
      setNewsLoading(true);
      setNewsError('');
      const res = await fetch(NEWS_FEED_URL);
      const text = await res.text();
      const items = parseRssItems(text);
      setNews(items);
    } catch (e) {
      setNewsError('No se pudieron cargar las noticias. Intenta más tarde.');
    } finally {
      setNewsLoading(false);
    }
  };

  // Uygulama açılınca bir defa haber çek
  useEffect(() => {
    loadNews();
  }, []);

  const handleOrder = (product) => {
    const message = `
Hola, quiero hacer un pedido de El Turco Chilango:

Producto: ${product.name}
Precio: ${product.price} MXN

Nombre:
Dirección:
Horario de entrega:
    `.trim();

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDesc}>{item.description}</Text>
      <Text style={styles.productPrice}>{item.price} MXN</Text>

      <Pressable style={styles.orderButton} onPress={() => handleOrder(item)}>
        <Text style={styles.orderButtonText}>Pedir por WhatsApp</Text>
      </Pressable>
    </View>
  );

  const renderTurkishWord = ({ item }) => (
    <View style={styles.wordRow}>
      <View style={{ flex: 1.2 }}>
        <Text style={styles.wordTr}>{item.tr}</Text>
      </View>
      <View style={{ flex: 1.2 }}>
        <Text style={styles.wordEs}>{item.es}</Text>
      </View>
      {item.note ? (
        <View style={{ flex: 2 }}>
          <Text style={styles.wordNote}>{item.note}</Text>
        </View>
      ) : null}
    </View>
  );

  const renderNewsItem = ({ item }) => (
    <Pressable
      style={styles.newsCard}
      onPress={() => {
        if (item.link) {
          Linking.openURL(item.link);
        }
      }}
    >
      <Text style={styles.newsTitle}>{item.title}</Text>
      {item.description ? (
        <Text style={styles.newsDescription} numberOfLines={3}>
          {item.description.replace(/<[^>]+>/g, '')}
        </Text>
      ) : null}
      {item.link ? <Text style={styles.newsLink}>Ver nota completa</Text> : null}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.brand}>El Turco Chilango</Text>
        <Text style={styles.slogan}>Sabores de Turquía en México</Text>
      </View>

      {/* Sekmeler */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabButton, activeTab === 'menu' && styles.tabButtonActive]}
          onPress={() => setActiveTab('menu')}
        >
          <Text style={[styles.tabText, activeTab === 'menu' && styles.tabTextActive]}>
            Menú
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'about' && styles.tabButtonActive]}
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
            Nosotros
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'clase' && styles.tabButtonActive]}
          onPress={() => setActiveTab('clase')}
        >
          <Text style={[styles.tabText, activeTab === 'clase' && styles.tabTextActive]}>
            Clase Turca
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'news' && styles.tabButtonActive]}
          onPress={() => setActiveTab('news')}
        >
          <Text style={[styles.tabText, activeTab === 'news' && styles.tabTextActive]}>
            Noticias Turquía
          </Text>
        </Pressable>
      </View>

      {/* Menú */}
      {activeTab === 'menu' && (
        <View style={styles.container}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryBar}
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat.id === selectedCategory;
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text
                    style={[styles.categoryText, isActive && styles.categoryTextActive]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      {/* Nosotros */}
      {activeTab === 'about' && (
        <ScrollView
          style={styles.aboutContainer}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Text style={styles.aboutTitle}>Quiénes somos</Text>
          <Text style={styles.aboutText}>
            El Turco Chilango nace de un puente entre Estambul y Ciudad de México.
            Preparamos baklava y lokum con receta turca, adaptados al gusto mexicano,
            para fiestas, oficinas y momentos especiales.
          </Text>
          <Text style={styles.aboutText}>
            Hacemos entregas en CDMX y zona conurbada. También preparamos cajas de regalo
            personalizadas para cumpleaños, bodas, detalles corporativos y más.
          </Text>
          <Text style={styles.aboutSubtitle}>Contacto</Text>
          <Text style={styles.aboutText}>WhatsApp: {PHONE_NUMBER}</Text>
          <Text style={styles.aboutText}>Instagram: @elturcochilango</Text>
        </ScrollView>
      )}

      {/* Clase Turca */}
      {activeTab === 'clase' && (
        <View style={styles.claseContainer}>
          <View style={styles.wordHeaderRow}>
            <Text style={[styles.wordHeader, { flex: 1.2 }]}>Turco</Text>
            <Text style={[styles.wordHeader, { flex: 1.2 }]}>Español</Text>
            <Text style={[styles.wordHeader, { flex: 2 }]}>Uso</Text>
          </View>
          <FlatList
            data={TURKISH_WORDS}
            keyExtractor={(item, idx) => `word-${idx}`}
            renderItem={renderTurkishWord}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </View>
      )}

      {/* Noticias Turquía */}
      {activeTab === 'news' && (
        <View style={styles.newsContainer}>
          {newsLoading && (
            <View style={styles.newsLoading}>
              <ActivityIndicator size="small" color={primary} />
              <Text style={styles.newsLoadingText}>Cargando noticias...</Text>
            </View>
          )}

          {!!newsError && !newsLoading && (
            <View style={styles.newsErrorBox}>
              <Text style={styles.newsErrorText}>{newsError}</Text>
              <Pressable style={styles.newsRetryButton} onPress={loadNews}>
                <Text style={styles.newsRetryText}>Reintentar</Text>
              </Pressable>
            </View>
          )}

          {!newsLoading && !newsError && (
            <FlatList
              data={news}
              keyExtractor={(item) => item.id}
              renderItem={renderNewsItem}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Pedidos especiales para fiestas, oficinas y eventos.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const primary = '#014226';
const gold = '#D4A017';
const background = '#FFF6E9';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: background,
  },
  header: {
    backgroundColor: primary,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  brand: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  slogan: {
    color: '#F8F3DC',
    fontSize: 13,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3E6CB',
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexWrap: 'wrap',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  tabButtonActive: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 13,
    color: '#6B6457',
    fontWeight: '600',
  },
  tabTextActive: {
    color: primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  categoryBar: {
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: primary,
    marginRight: 8,
    backgroundColor: 'white',
  },
  categoryChipActive: {
    backgroundColor: primary,
  },
  categoryText: {
    fontSize: 13,
    color: primary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2D2A24',
  },
  productDesc: {
    fontSize: 13,
    color: '#6B6457',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: gold,
    marginBottom: 10,
  },
  orderButton: {
    backgroundColor: primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  aboutContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: primary,
  },
  aboutSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 4,
    color: primary,
  },
  aboutText: {
    fontSize: 14,
    color: '#5A4C3B',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#DDCBB0',
    backgroundColor: '#F9F1DE',
  },
  footerText: {
    fontSize: 12,
    color: '#7A6D5C',
    textAlign: 'center',
  },
  // Clase Turca
  claseContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  wordHeaderRow: {
    flexDirection: 'row',
    paddingVer
