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
    const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]>
