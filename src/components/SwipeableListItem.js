import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

const { width: LEBAR_SCREEN 
 } = Dimensions.get('window');
const RL_LIMIT = LEBAR_SCREEN * 0.7;

export default function SwipeableListItem({ onItemDeleted }) {
  const translateX = useSharedValue(0);
  const currentHeight = useSharedValue(80); 
  const itemOpacity = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (translateX.value < -RL_LIMIT) {
        translateX.value = withTiming(-LEBAR_SCREEN, { duration: 250 });
        currentHeight.value = withTiming(0);
        itemOpacity.value = withTiming(0, {}, () => {
          if (onItemDeleted) runOnJS(onItemDeleted)();
        });
      }
      else if (translateX.value > RL_LIMIT) {
        translateX.value = withTiming(LEBAR_SCREEN, { duration: 250 });
        currentHeight.value = withTiming(0);
        itemOpacity.value = withTiming(0, {}, () => {
          if (onItemDeleted) runOnJS(onItemDeleted)();
        });
      }
      else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    height: currentHeight.value,
    opacity: itemOpacity.value,
    marginBottom: currentHeight.value > 0 ? 20 : 0, 
  }));

  return (
    <Animated.View style={[styles.rowWrapper, containerStyle]}>
      <View style={styles.backActions}>
        <View style={[styles.actionBtn, styles.leftBtn]}>
          <Text style={styles.actionText}>ARCHIVE </Text>
        </View>
        <View style={[styles.actionBtn, styles.rightBtn]}>
          <Text style={styles.actionText}>DELETE </Text>
        </View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.frontCard, animatedStyle]}>
          <Text style={styles.frontTitle}>Belajar React Native </Text>
          <Text style={styles.frontSub}>Geser Kiri (Delete) / Kanan (Archive)</Text>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rowWrapper: {
    width: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  backActions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 1, 
  },
  actionBtn: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
  },
  leftBtn: {
    backgroundColor: '#10B981',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  rightBtn: {
    backgroundColor: '#EF4444',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
  },
  actionText: {
    fontWeight: '800',
    color: '#FFF',
    fontSize: 12,
  },
  frontCard: {
    position: 'absolute', 
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF', 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 99, 
    elevation: 3,
  },
  frontTitle: {
    fontWeight: '700',
    color: '#334155',
    fontSize: 15,
  },
  frontSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});