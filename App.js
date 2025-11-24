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

const PHONE_NUMBER = '525529275019';

// Uygulama logosu:
// ŞİMDİLİK örnek bir URL kullanıyoruz.
// Kendi premium ikonunu bir yere (Cloudinary, Imgur, siten vs.) yükledikten sonra
// sadece burayı kendi URL'inle değiştirmen yeterli.
const LOGO_URL =
  'https://via.placeholder.com/160x160.png?text=El+Turco+Chilango';

// Clase Turca kelimeleri – selamlar, günlük konuşma, restoranda, caddede, süpermarkette
const TURKISH_WORDS = [
  // SELAMLAR / TEMEL İFADELER
  { tr: 'Merhaba', es: 'Hola', note: 'Saludo general' },
  { tr: 'Günaydın', es: 'Buenos días', note: 'En la mañana' },
  { tr: 'İyi akşamlar', es: 'Buenas noches', note: 'Saludo en la noche' },
  { tr: 'Hoş geldiniz', es: 'Bienvenido(a)', note: 'Al recibir a alguien o en restaurante' },
  { tr: 'Güle güle', es: 'Adiós', note: 'Cuando alguien se va' },
  { tr: 'Nasılsın?', es: '¿Cómo estás?', note: 'Entre amigos, informal' },
  { tr: 'Nasılsınız?', es: '¿Cómo está?', note: 'Formal, con respeto' },
  { tr: 'İyiyim, teşekkürler', es: 'Estoy bien, gracias', note: 'Respuesta típica' },

  // TEŞEKKÜR / RİCA
  { tr: 'Teşekkürler', es: 'Gracias', note: 'Agradecimiento general' },
  { tr: 'Çok teşekkürler', es: 'Muchas gracias', note: 'Agradecimiento fuerte' },
  { tr: 'Lütfen', es: 'Por favor', note: 'Para pedir algo con cortesía' },
  { tr: 'Rica ederim', es: 'De nada / Con gusto', note: 'Respuesta a “gracias”' },
  { tr: 'Özür dilerim', es: 'Perdón / Disculpa', note: 'Cuando cometes un error' },

  // GÜNDELİK KONUŞMA
  { tr: 'Evet', es: 'Sí', note: 'Respuesta afirmativa' },
  { tr: 'Hayır', es: 'No', note: 'Respuesta negativa' },
  { tr: 'Anlamadım', es: 'No entendí', note: 'Cuando no entiendes' },
  { tr: 'Yavaş konuşur musun?', es: '¿Puedes hablar despacio?', note: 'Turco muy rápido' },
  { tr: 'Türkçe bilmiyorum', es: 'No hablo turco', note: 'Para aclarar' },
  { tr: 'Biraz Türkçe biliyorum', es: 'Hablo un poco de turco', note: 'Nivel básico' },

  // CADDEDE / YOL SORARKEN
  { tr: 'Burası neresi?', es: '¿Dónde estoy?', note: 'Cuando estás perdido' },
  { tr: '... nerededir?', es: '¿Dónde está...?', note: 'Para preguntar por un lugar' },
  { tr: 'Otobüs durağı nerede?', es: '¿Dónde está la parada de camión?', note: 'Transporte público' },
  { tr: 'Metro durağı nerede?', es: '¿Dónde está la estación de metro?', note: 'Transporte público' },
  { tr: 'Sol', es: 'Izquierda', note: 'Dirección' },
  { tr: 'Sağ', es: 'Derecha', note: 'Dirección' },
  { tr: 'Düz', es: 'Derecho / recto', note: 'Seguir derecho' },

  // RESTORANDA
  { tr: 'Menü alabilir miyim?', es: '¿Me puede traer el menú, por favor?', note: 'En restaurante' },
  { tr: 'Bir masa istiyorum', es: 'Quiero una mesa', note: 'Al llegar al restaurante' },
  { tr: 'İki kişilik masa', es: 'Mesa para dos personas', note: 'Reservar lugar' },
  { tr: 'Ne tavsiye edersiniz?', es: '¿Qué me recomienda?', note: 'Pedir recomendación' },
  { tr: 'Hesap lütfen', es: 'La cuenta, por favor', note: 'Para pagar' },
  { tr: 'Paket yapar mısınız?', es: '¿Me lo puede poner para llevar?', note: 'Para llevar' },
  { tr: 'Acısız olsun lütfen', es: 'Sin picante, por favor', note: 'Si no quieres picante' },
  { tr: 'Bir çay lütfen', es: 'Un té turco, por favor', note: 'Pedir çay' },

  // SÜPERMARKET / ALIŞVERİŞ
  { tr: 'Bu ne kadar?', es: '¿Cuánto cuesta esto?', note: 'Precio de un producto' },
  { tr: 'İndirim var mı?', es: '¿Hay descuento?', note: 'Preguntar por promoción' },
  { tr: 'Bir kilo ... istiyorum', es: 'Quiero un kilo de...', note: 'Frutas, verduras, etc.' },
  { tr: 'Poşet alabilir miyim?', es: '¿Me puede dar una bolsa?', note: 'En caja / súper' },
  { tr: 'Kredi kartı geçiyor mu?', es: '¿Aceptan tarjeta?', note: 'Forma de pago' },

  // YOL TARİFİ / ULAŞIM
  { tr: 'Taksi çağırabilir misiniz?', es: '¿Puede llamar un taxi, por favor?', note: 'En hotel o restaurante' },
  { tr: 'Havalimanına gitmek istiyorum', es: 'Quiero ir al aeropuerto', note: 'Taxi / transporte' },
  { tr: 'Ne kadar sürer?', es: '¿Cuánto tiempo tarda?', note: 'Duración del trayecto' },

  // ACİL DURUMLAR
  { tr: 'Yardım eder misiniz?', es: '¿Me puede ayudar?', note: 'Pedir ayuda' },
  { tr: 'Doktor lazım', es: 'Necesito un doctor', note: 'Emergencia médica' },
  { tr: 'Polisi arayın lütfen', es: 'Llame a la policía, por favor', note: 'Emergencia seria' },
];

// Haberler – TRT World Español Turkey RSS
const NEWS_FEED_URL = 'https://www.trtworld.com/rss/es/turkey';

// RSS boş gelir veya hata olursa gösterilecek yedek haberler
const DEFAULT_NEWS = [
  {
    id: 'local-1',
    title: 'Turquía y México refuerzan lazos culturales',
    description:
      'Resumen en español sobre la relación creciente entre México y Türkiye, con énfasis en intercambio cultural y gastronómico.',
    link: '',
  },
  {
    id: 'local-2',
    title: 'Estambul, punto de conexión entre Europa y Asia',
    description:
      'Breve nota sobre la importancia de Estambul como centro histórico, económico y turístico de Türkiye.',
    link: '',
  },
  {
    id: 'local-3',
    title: 'Turquía como destino para amantes de la comida',
    description:
      'Panorama general de la cocina turca: baklava, lokum, kebab y desayunos tradicionales, explicado en español.',
    link: '',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'Todo' },
  { id: 'baklava', name: 'Baklava' },
  { id: 'lokum', name: 'Lokum' },
  { id: 'cajas', name: 'Cajas de regalo' },
];

// Ürünler – imageUrl alanlarını sonra kendi gerçek foto URL'lerinle değiştirebilirsin.
// Şu an hepsi çalışır ve kartlarda görsel çıkar.
const PRODUCTS = [
  {
    id: 'p1',
    name: 'Baklava Pistache 500 g',
    description: 'Baklava clásica con pistache turco, jarabe ligero y masa crujiente.',
    price: 380,
    category: 'baklava',
    imageUrl:
      'https://images.pexels.com/photos/4109990/pexels-photo-4109990.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p2',
    name: 'Baklava Nuez 1 kg',
    description: 'Charola mixta de nuez, ideal para compartir.',
    price: 700,
    category: 'baklava',
    imageUrl:
      'https://images.pexels.com/photos/6062045/pexels-photo-6062045.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p3',
    name: 'Lokum Rosa 250 g',
    description: 'Delicia turca sabor rosa, espolvoreada con azúcar glass.',
    price: 250,
    category: 'lokum',
    imageUrl:
      'https://images.pexels.com/photos/1438186/pexels-photo-1438186.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p4',
    name: 'Lokum Mixto 500 g',
    description: 'Surtido de sabores clásicos: rosa, limón y naranja.',
    price: 420,
    category: 'lokum',
    imageUrl:
      'https://images.pexels.com/photos/1438188/pexels-photo-1438188.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'p5',
    name: 'Caja regalo Baklava + Lokum',
    description: 'Caja premium con selección de baklava y lokum.',
    price: 890,
    category: 'cajas',
    imageUrl:
      'https://images.pexels.com/photos/4109993/pexels-photo-4109993.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

// RSS parser
function parseRssItems(xmlText, maxItems = 8) {
  const items = [];
  const parts = xmlText.split('<item>');
  for (let i = 1; i < parts.length && items.length < maxItems; i++) {
    const block = parts[i];

    const titleMatch = block.match(
      /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/
    );
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
  const [activeTab, setActiveTab] = useState('menu');

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const loadNews = async () => {
    try {
      setNewsLoading(true);
      setNewsError('');
      const res = await fetch(NEWS_FEED_URL);
      const text = await res.text();
      const items = parseRssItems(text);

      if (items && items.length > 0) {
        setNews(items);
      } else {
        setNews(DEFAULT_NEWS);
      }
    } catch (e) {
      setNews(DEFAULT_NEWS);
      setNewsError(
        'No se pudieron cargar las noticias en vivo. Mostrando un resumen estático.'
      );
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleOrder = (product) => {
    const message = `
Hola, quiero pedir:

Producto: ${product.name}
Precio: ${product.price} MXN

Nombre:
Dirección:
Horario para entrega:
    `.trim();

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const handleAskTurkish = () => {
    const message = `
Merhaba, quiero aprender más palabras turcas en la sección "Clase Turca" de la app.
¿Me puedes ayudar?
    `.trim();

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.cardBody}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDesc}>{item.description}</Text>
        <Text style={styles.productPrice}>{item.price} MXN</Text>

        <Pressable style={styles.orderButton} onPress={() => handleOrder(item)}>
          <Text style={styles.orderButtonText}>Pedir por WhatsApp</Text>
        </Pressable>
      </View>
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
      <View style={{ flex: 2 }}>
        <Text style={styles.wordNote}>{item.note}</Text>
      </View>
    </View>
  );

  const renderNewsItem = ({ item }) => (
    <Pressable
      style={styles.newsCard}
      onPress={() => item.link && Linking.openURL(item.link)}
    >
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDescription} numberOfLines={3}>
        {item.description.replace(/<[^>]+>/g, '')}
      </Text>
      {item.link ? <Text style={styles.newsLink}>Ver nota completa</Text> : null}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Image
            source={{ uri: LOGO_URL }}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerTextBlock}>
            <Text style={styles.brand}>El Turco Chilango</Text>
            <Text style={styles.slogan}>Sabores de Turquía en México</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabBar}>
        {[
          ['menu', 'Menú'],
          ['about', 'Nosotros'],
          ['clase', 'Clase Turca'],
          ['news', 'Noticias Turquía'],
        ].map(([key, label]) => (
          <Pressable
            key={key}
            style={[styles.tabButton, activeTab === key && styles.tabButtonActive]}
            onPress={() => setActiveTab(key)}
          >
            <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

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
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
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

      {activeTab === 'about' && (
        <ScrollView style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Quiénes somos</Text>
          <Text style={styles.aboutText}>
            El Turco Chilango nace de un puente entre Estambul y Ciudad de México.
            Preparamos baklava y lokum con receta turca, adaptados al gusto mexicano.
          </Text>
          <Text style={styles.aboutText}>
            Hacemos entregas en CDMX y área metropolitana.
          </Text>
          <Text style={styles.aboutSubtitle}>Contacto</Text>
          <Text style={styles.aboutText}>WhatsApp: {PHONE_NUMBER}</Text>
          <Text style={styles.aboutText}>Instagram: @elturcochilango</Text>
        </ScrollView>
      )}

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
          />

          <Pressable style={styles.askButton} onPress={handleAskTurkish}>
            <Text style={styles.askButtonText}>Preguntar por WhatsApp</Text>
            <Text style={styles.askButtonSub}>
              Si quieres aprender más palabras turcas, escríbenos aquí.
            </Text>
          </Pressable>
        </View>
      )}

      {activeTab === 'news' && (
        <View style={styles.newsContainer}>
          {newsLoading && (
            <View style={styles.newsLoading}>
              <ActivityIndicator size="small" color={primary} />
              <Text style={styles.newsLoadingText}>Cargando noticias...</Text>
            </View>
          )}

          {!!newsError && (
            <View style={styles.newsErrorBox}>
              <Text style={styles.newsErrorText}>{newsError}</Text>
              <Pressable style={styles.newsRetryButton} onPress={loadNews}>
                <Text style={styles.newsRetryText}>Reintentar</Text>
              </Pressable>
            </View>
          )}

          {!newsLoading && (
            <FlatList
              data={news}
              keyExtractor={(item) => item.id}
              renderItem={renderNewsItem}
            />
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Pedidos especiales para fiestas y oficinas.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const primary = '#014226';
const gold = '#D4A017';
const background = '#FFF6E9';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: background },

  header: {
    backgroundColor: primary,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: '#FFFFFF20',
  },
  headerTextBlock: {
    flexDirection: 'column',
  },
  brand: { color: 'white', fontSize: 22, fontWeight: '700' },
  slogan: { color: '#F8F3DC', fontSize: 13, marginTop: 4 },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3E6CB',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabButtonActive: { backgroundColor: 'white' },
  tabText: { color: '#6B6457', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: primary },

  container: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },

  categoryBar: { marginBottom: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: primary,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
  },
  categoryChipActive: { backgroundColor: primary },
  categoryText: { color: primary, fontSize: 13 },
  categoryTextActive: { color: 'white' },

  listContent: { paddingBottom: 16 },

  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 170,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  productName: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#2D2A24' },
  productDesc: { fontSize: 13, color: '#6B6457', marginBottom: 6 },
  productPrice: { fontSize: 15, fontWeight: '700', color: gold, marginBottom: 10 },
  orderButton: {
    backgroundColor: primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },

  aboutContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  aboutTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: primary },
  aboutText: { fontSize: 14, color: '#5A4C3B', marginBottom: 8 },
  aboutSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 12,
    color: primary,
  },

  claseContainer: { flex: 1, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 16 },
  wordHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#DDCBB0',
    marginBottom: 4,
  },
  wordHeader: { fontSize: 13, fontWeight: '700', color: primary },
  wordRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E4D4B8',
  },
  wordTr: { fontSize: 14, fontWeight: '600', color: '#2D2A24' },
  wordEs: { fontSize: 14, color: '#2D2A24' },
  wordNote: { fontSize: 12, color: '#7A6D5C' },
  askButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F3E6CB',
  },
  askButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: primary,
    marginBottom: 4,
  },
  askButtonSub: {
    fontSize: 12,
    color: '#6B6457',
  },

  newsContainer: { flex: 1, paddingHorizontal: 12, paddingTop: 10 },
  newsCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  newsTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6, color: '#2D2A24' },
  newsDescription: { fontSize: 13, color: '#5A4C3B', marginBottom: 6 },
  newsLink: { fontSize: 12, color: primary, fontWeight: '600' },

  newsLoading: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  newsLoadingText: { marginLeft: 8, fontSize: 13, color: '#5A4C3B' },

  newsErrorBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F2BBBB',
  },
  newsErrorText: { color: '#8A2E2E', marginBottom: 8, fontSize: 13 },
  newsRetryButton: {
    backgroundColor: primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newsRetryText: { color: 'white', fontSize: 12, fontWeight: '600' },

  footer: {
    padding: 10,
    borderTopWidth: 0.5,
    borderColor: '#DDCBB0',
    backgroundColor: '#F9F1DE',
  },
  footerText: { textAlign: 'center', fontSize: 12, color: '#7A6D5C' },
});
