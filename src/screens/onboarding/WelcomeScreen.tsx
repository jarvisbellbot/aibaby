/**
 * Welcome Screen — Ember
 * First screen users see
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui';
import { ONBOARDING_COPY } from '../../constants';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔥👶</Text>
      <Text style={styles.title}>{ONBOARDING_COPY.welcome.title}</Text>
      <Text style={styles.subtitle}>{ONBOARDING_COPY.welcome.subtitle}</Text>
      <Button
        label={ONBOARDING_COPY.welcome.cta}
        onPress={() => navigation.navigate('Auth')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: colors.background },
  emoji: { fontSize: 64, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 16, lineHeight: 40 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 48 },
});
