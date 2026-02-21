import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import { colors } from '../../theme/colors';

interface BabyAvatarProps { imageUrl?: string; size?: number; happiness: number; name?: string; }

export const BabyAvatar: React.FC<BabyAvatarProps> = ({ imageUrl, size = 180, happiness, name }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const ringColor = happiness >= 80 ? colors.mood.happy : happiness >= 50 ? colors.mood.okay : colors.mood.crying;

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.ring, { width: size + 16, height: size + 16, borderRadius: (size + 16) / 2, borderColor: ringColor, transform: [{ scale: pulse }] }]}>
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
          {imageUrl
            ? <Image source={{ uri: imageUrl }} style={{ width: size, height: size, borderRadius: size / 2 }} />
            : <Text style={styles.placeholder}>👶</Text>
          }
        </View>
      </Animated.View>
      {name && <Text style={styles.name}>{name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  ring: { borderWidth: 3, alignItems: 'center', justifyContent: 'center', padding: 6 },
  avatar: { backgroundColor: colors.accent.peach, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  placeholder: { fontSize: 64 },
  name: { marginTop: 12, fontSize: 22, fontWeight: '800', color: colors.text.primary, letterSpacing: 0.5 },
});
