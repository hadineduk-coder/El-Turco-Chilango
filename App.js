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

const PHONE_NUMBER = '525529275019';

// Logo: assets/icon.png (uygulama ikonu ile aynı görsel)
const LOGO_IMAGE = require('./assets/icon.png');

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

// ÜRÜNLER – yerel asset görselleriyle
const PRODUCTS = [
  // Baklava Pistache 1 kg – BESTSELLER
  {
    id: 'baklava-pistache-1kg',
    name: 'Baklava Pistache 1 kg',
    description: 'Baklava de pistache turco, ideal para compartir en familia o en la oficina.',
    price: 700,
    category: 'baklava',
    bestSeller: true,
    image: require('./assets/baklava_pistache_main.webp'),
    extraImages: [require('./assets/baklava_pistache_close.webp')],
  },
  // Baklava Pistache 500 g – BESTSELLER
  {
    id: 'baklava-pistache-500g',
    name: 'Baklava Pistache 500 g',
    description: 'Media charola de baklava con pistache, perfecta para regalo o antojo.',
    price: 380,
    category: 'baklava',
    bestSeller: true,
    image: require('./assets/baklava_pistache_main.webp'),
    extraImages: [require('./assets/baklava_pistache_close.webp')],
  },
  // Baklava Nuez 1 kg
  {
    id: 'baklava-nuez-1kg',
    name: 'Baklava Nuez 1 kg',
    description: 'Baklava clásica de nuez, masa crujiente y jarabe equilibrado.',
    price: 650,
    category: 'baklava',
    bestSeller: false,
    image: require('./assets/baklava_nuez_main.webp'),
    extraImages: [require('./assets/baklava_nuez_close.webp')],
  },
  // Diğer ürünler – şimdilik örnek lokum ve caja, uzaktan görsel ile
  {
    id: 'lokum-rosa-250',
    name: 'Lokum Rosa 250 g',
    description: 'Delicia turca sabor rosa, espolvoreada con azúcar glass.',
    price: 250,
    category: 'lokum',
    bestSeller: false,
    imageUrl:
      'https://images.pexels.com/photos/1438186/pexels-photo-1438186.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'lokum-mixto-500',
    name: 'Lokum Mixto 500 g',
    description: 'Surtido de sabores clásicos: rosa, limón y naranja.',
    price: 420,
    category: 'lokum',
    bestSeller: false,
    imageUrl:
      'https://images.pexels.com/photos/1438188/pexels-photo-1438188.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'caja-regalo-mix',
    name: 'Caja regalo Baklava + Lokum',
    description: 'Caja premium con selección de baklava y lokum.',
    price: 890,
    category: 'cajas',
    bestSeller: false,
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

  // Basit kullanıcı profili + sadakat durumu
  const [user, setUser] = useState({
    name: '',
    phone: '',
    points: 0,
    coupons: 0,
    hasUsedReferral: false,
  });
  const [usedRefInput, setUsedRefInput] = useState('');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Referans kodu – isim + telefon son 4 haneden deterministic oluştur
  const refCode = useMemo(() => {
    if (!user.name || !user.phone) return '';
    const cleanName = user.name
      .trim()
      .split(' ')[0]
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const phoneDigits = user.phone.replace(/\D/g, '');
    const last4 = phoneDigits.slice(-4);
    if (!cleanName || !last4) return '';
    return `TURCO-${cleanName}-${last4}`;
  }, [user.name, user.phone]);

  // Her 10 MXN = 1 puan, 100 puan = 1 kupon (%10 indirim)
  const addPoints = (amountMx, consumeCoupon = false) => {
    const earned = Math.floor(amountMx / 10);
    setUser((prev) => {
      let points = prev.points + earned;
      let coupons = prev.coupons;

      if (consumeCoupon && coupons > 0) {
        coupons -= 1; // 1 kupon kullanıldı
      }

      if (points >= 100) {
        const extraCoupons = Math.floor(points / 100);
        coupons += extraCoupons;
        points = points % 100;
      }

      return { ...prev, points, coupons };
    });
  };

  // Referans kodu bonusu – yeni kullanıcı için 50 puan (ilk ve tek sefer)
  const handleUseReferralBonus = () => {
    if (!usedRefInput || user.hasUsedReferral) {
      return;
    }
    const bonus = 50;
    setUser((prev) => {
      if (prev.hasUsedReferral) return prev;
      let points = prev.points + bonus;
      let coupons = prev.coupons;

      if (points >= 100) {
        const extraCoupons = Math.floor(points / 100);
        coupons += extraCoupons;
        points = points % 100;
      }

      return { ...prev, points, coupons, hasUsedReferral: true };
    });
  };

  const handleShareRefCode = () => {
    if (!refCode) return;
    const message = `Te invito a probar baklava y lokum de El Turco Chilango. Usa mi código ${refCode} en tu primer pedido para ganar puntos.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

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

    // Kupon kullanmadan normal sipariş – puan kazan
    addPoints(product.price, false);
  };

  const handleOrderWithCoupon = (product) => {
    if (user.coupons <= 0) {
      // Kupon yoksa normal sipariş
      return handleOrder(product);
    }

    const discountedPrice = Math.round(product.price * 0.9);

    const message = `
Hola, quiero pedir usando mi cupón de 10%:

Producto: ${product.name}
Precio original: ${product.price} MXN
Precio con cupón: ${discountedPrice} MXN

Nombre:
Dirección:
Horario para entrega:
    `.trim();

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);

    // Kupon kullanıldı + indirimli tutar üzerinden puan kazan
    addPoints(discountedPrice, true);
  };

  const handleAskTurkish = () => {
    const message = `
Merhaba, quiero aprender más palabras turcas en la sección "Clase Turca" de la app.
¿Me puedes ayudar?
    `.trim();

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const renderProduct = ({ item }) => {
    const imageSource = item.image
      ? item.image
      : item.imageUrl
      ? { uri: item.imageUrl }
      : null;

    return (
      <View style={styles.card}>
        {imageSource && (
          <Image
            source={imageSource}
            style={styles.cardImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.cardBody}>
          {item.bestSeller && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Bestseller</Text>
            </View>
          )}

          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDesc}>{item.description}</Text>
          <Text style={styles.productPrice}>{item.price} MXN</Text>

          {user.coupons > 0 && (
            <Text style={styles.couponInfoText}>
              Tienes {user.coupons} cupón(es) de 10% disponibles.
            </Text>
          )}

          <Pressable style={styles.orderButton} onPress={() => handleOrder(item)}>
            <Text style={styles.orderButtonText}>Pedir por WhatsApp</Text>
          </Pressable>

          {user.coupons > 0 && (
            <Pressable
              style={[styles.orderButton, styles.orderButtonSecondary]}
              onPress={() => handleOrderWithCoupon(item)}
            >
              <Text style={styles.orderButtonSecondaryText}>
                Usar cupón 10% en este pedido
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

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
            source={LOGO_IMAGE}
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
          ['profile', 'Perfil'],
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

      {activeTab === 'profile' && (
        <ScrollView style={styles.profileContainer}>
          <Text style={styles.profileTitle}>Tu perfil</Text>

          <Text style={styles.profileLabel}>Nombre</Text>
          <TextInput
            style={styles.profileInput}
            placeholder="Tu nombre"
            value={user.name}
            onChangeText={(text) =>
              setUser((prev) => ({ ...prev, name: text }))
            }
          />

          <Text style={styles.profileLabel}>Tu WhatsApp</Text>
          <TextInput
            style={styles.profileInput}
            placeholder="Ej. 5551234567"
            value={user.phone}
            onChangeText={(text) =>
              setUser((prev) => ({ ...prev, phone: text }))
            }
            keyboardType="phone-pad"
          />

          <View style={styles.profileBox}>
            <Text style={styles.profileBoxText}>
              Puntos actuales: {user.points}
            </Text>
            <Text style={styles.profileBoxText}>
              Cupones 10%: {user.coupons}
            </Text>
          </View>

          <Text style={styles.profileLabel}>Tu código de invitación</Text>
          <View style={styles.refCodeBox}>
            <Text style={styles.refCodeText}>
              {refCode || 'Completa tu nombre y WhatsApp para generar tu código.'}
            </Text>
          </View>

          {refCode ? (
            <Pressable style={styles.refShareButton} onPress={handleShareRefCode}>
              <Text style={styles.refShareButtonText}>
                Compartir mi código por WhatsApp
              </Text>
            </Pressable>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.profileLabel}>¿Tienes un código de invitación?</Text>
          <TextInput
            style={styles.profileInput}
            placeholder="Escribe aquí el código que usaste"
            value={usedRefInput}
            onChangeText={setUsedRefInput}
          />
          <Pressable
            style={[
              styles.refUseButton,
              user.hasUsedReferral && { opacity: 0.5 },
            ]}
            disabled={user.hasUsedReferral}
            onPress={handleUseReferralBonus}
          >
            <Text style={styles.refUseButtonText}>
              Obtener 50 puntos por código
            </Text>
          </Pressable>
          {user.hasUsedReferral && (
            <Text style={styles.refInfoText}>
              Ya registraste un código de invitación. El bono se aplicó a tus puntos.
            </Text>
          )}
        </ScrollView>
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
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    color: '#2D2A24',
    fontSize: 11,
    fontWeight: '700',
  },
  productName: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#2D2A24' },
  productDesc: { fontSize: 13, color: '#6B6457', marginBottom: 6 },
  productPrice: { fontSize: 15, fontWeight: '700', color: gold, marginBottom: 10 },

  couponInfoText: {
    fontSize: 12,
    color: '#7A6D5C',
    marginBottom: 6,
  },

  orderButton: {
    backgroundColor: primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },

  orderButtonSecondary: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: primary,
  },
  orderButtonSecondaryText: {
    color: primary,
    fontWeight: '600',
    fontSize: 13,
  },

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

  profileContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  profileTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: primary },
  profileLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A4C3B',
    marginTop: 10,
    marginBottom: 4,
  },
  profileInput: {
    borderWidth: 1,
    borderColor: '#DDCBB0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: 'white',
  },
  profileBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3E6CB',
  },
  profileBoxText: { fontSize: 13, color: '#5A4C3B', marginBottom: 4 },

  refCodeBox: {
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDCBB0',
    backgroundColor: '#FFFDF7',
  },
  refCodeText: { fontSize: 13, color: '#2D2A24' },
  refShareButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: primary,
    alignItems: 'center',
  },
  refShareButtonText: { color: 'white', fontSize: 13, fontWeight: '600' },

  divider: {
    height: 1,
    backgroundColor: '#E4D4B8',
    marginVertical: 16,
  },
  refUseButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: gold,
    alignItems: 'center',
  },
  refUseButtonText: { color: '#2D2A24', fontSize: 13, fontWeight: '600' },
  refInfoText: {
    marginTop: 6,
    fontSize: 12,
    color: '#7A6D5C',
  },

  footer: {
    padding: 10,
    borderTopWidth: 0.5,
    borderColor: '#DDCBB0',
    backgroundColor: '#F9F1DE',
  },
  footerText: { textAlign: 'center', fontSize: 12, color: '#7A6D5C' },
});
