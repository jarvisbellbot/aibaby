import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Modal } from 'react-native';
import { colors } from '../../theme/colors';

interface LoadingOverlayProps { visible: boolean; message?: string; submessage?: string; }

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message = 'Loading...', submessage }) => {
  const spin = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2000, useNativeDriver: true })).start();
      Animated.loop(Animated.sequence([
        Animated.timing(float, { toValue: -10, duration: 1000, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])).start();
    }
  }, [visible]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.Text style={[styles.emoji, { transform: [{ rotate }, { translateY: float }] }]}>✨</Animated.Text>
        <Text style={styles.message}>{message}</Text>
        {submessage && <Text style={styles.submessage}>{submessage}</Text>}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(255,245,238,0.95)', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 60, marginBottom: 24 },
  message: { fontSize: 20, fontWeight: '700', color: colors.text.primary, textAlign: 'center', marginBottom: 8 },
  submessage: { fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
});
