/**
 * Auth Screen — Ember
 * Premium sign-in experience with gradient background
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button, Input } from '../../components/ui';
import { signInWithEmail, signInWithGoogle, signInWithApple } from '../../lib/auth';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEmailSignIn() {
    if (!email) return;
    setLoading(true);
    const result = await signInWithEmail(email);
    setLoading(false);
    if (result.success) {
      Alert.alert('Check your email!', 'We sent you a magic link 💌');
    } else {
      Alert.alert('Error', result.error);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    if (!result.success) Alert.alert('Error', result.error);
  }

  async function handleApple() {
    setLoading(true);
    const result = await signInWithApple();
    setLoading(false);
    if (!result.success) Alert.alert('Error', result.error);
  }

  return (
    <LinearGradient
      colors={['#FF6B8A', '#FF8C69', '#FFB347', '#FFCBA4']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Logo area */}
        <View style={styles.logoArea}>
          <Text style={styles.logoEmoji}>🔥</Text>
          <Text style={styles.logoText}>ember</Text>
          <Text style={styles.tagline}>Your AI baby companion</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back 🔥</Text>
          <Text style={styles.subtitle}>Sign in to meet your baby</Text>

          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.buttonGroup}>
            <Button label="Continue with Email ✉️" onPress={handleEmailSignIn} loading={loading} />
            <Button label="Continue with Google" onPress={handleGoogle} style="secondary" />
            <Button label="Continue with Apple" onPress={handleApple} style="secondary" />
          </View>

          <Text style={styles.footerText}>
            By signing in, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  logoArea: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 60,
  },
  logoEmoji: {
    fontSize: 72,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 10,
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
});
