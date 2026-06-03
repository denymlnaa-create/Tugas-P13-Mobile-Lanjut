import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AnimatedCard from './src/components/AnimatedCard';
import SwipeableListItem from './src/components/SwipeableListItem';
import { startBackgroundSync } from './src/tasks/syncManager';

export default function App() {
  const [currentQuote, setCurrentQuote] = useState('Sedang menyinkronkan data...');
  const [isListVisible, setIsListVisible] = useState(true);

  useEffect(() => {
    startBackgroundSync();
    loadSavedQuote();
    fetchDirectQuote();
  }, []);

  const fetchDirectQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      if (data.content) {
        await AsyncStorage.setItem('@info_kutipan', data.content);
        setCurrentQuote(data.content);
      }
    } catch (err) {
      loadSavedQuote(); 
    }
  };

  const loadSavedQuote = async () => {
    const savedData = await AsyncStorage.getItem('@info_kutipan');
    if (savedData) setCurrentQuote(savedData);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.appWrapper}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Tugas Mandiri P13</Text>
              <Text style={styles.headerSub}>Implementasi Fitur Lanjut</Text>
            </View>
            
            <View style={styles.contentBody}>
              {/* Lat 1 */}
              <AnimatedCard />
              
              {/* Lat 2 */}
              {isListVisible ? (
                <SwipeableListItem onItemDeleted={() => setIsListVisible(false)} />
              ) : (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>Item list berhasil dihapus.</Text>
                </View>
              )}

              {/* Lat 3 */}
              <View style={styles.quoteCard}>
                <Text style={styles.quoteLabel}>Kutipan Terbaru (Latihan 3)</Text>
                <Text style={styles.quoteText}>"{currentQuote}"</Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appWrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  contentBody: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  quoteCard: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  quoteText: { fontSize: 15, color: '#334155', lineHeight: 22, fontStyle: 'italic' },
  emptyBox: { height: 75, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyText: { color: '#94A3B8', fontStyle: 'italic', fontSize: 14 }
});