import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';

export default function AnimatedCard() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.94, useNativeDriver: true }).start();
  };
  
  const handlePressOut = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.03, duration: 120, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const handleLongPress = () => {
    Animated.timing(rotateAnim, { toValue: 1, duration: 500, useNativeDriver: true })
      .start(() => rotateAnim.setValue(0));
  };

  const moveY = fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: moveY }, { scale: scaleAnim }, { rotate: spin }] }}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onLongPress={handleLongPress}>
        <View style={styles.cardBox}>
          <Text style={styles.cardTitle}>Komponen Kartu (Latihan 1)</Text>
          <Text style={styles.cardDesc}>Tekan biasa untuk memantul, tahan lama untuk memutar kartu</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardBox: {
    backgroundColor: '#F1F5F9',
    padding: 20,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderLeftWidth: 6,
    borderLeftColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontWeight: '700', color: '#1E293B', fontSize: 16, marginBottom: 4 },
  cardDesc: { color: '#64748B', fontSize: 13 }
});