/**
 * Auth Screen — Ember
 * Email/Google/Apple sign in
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ember 🔥</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button label="Continue with Email" onPress={handleEmailSignIn} loading={loading} />
      <Button label="Continue with Google" onPress={handleGoogle} style="secondary" />
      <Button label="Continue with Apple" onPress={handleApple} style="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 32, textAlign: 'center' },
});
