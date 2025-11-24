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

const PHONE_NUMBER = '525529275019';

// Clase Turca kelimeleri
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

// **Yeni RSS kaynağı: TRT World Español – Turkey**
const NEWS_FEED_URL = 'https://www.trtworld.com/rss/es/turkey';

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
    description: 'Caja premium con selección de baklava y lokum.',
    price: 890,
    category: 'cajas',
  },
];

// RSS parser
function parseRssItems(xmlText, maxItems = 8) {
  const items = [];
