/**
 * Partner Invite Screen — Ember
 * Show sync code to share with partner
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, Share, SafeAreaView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui';
import { colors } from '../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerInvite'>;

const DEMO_SYNC_CODE = 'EMBER-1234';

export default function PartnerInviteScreen({ navigation, route }: Props) {
  const [copied, setCopied] = useState(false);
  const syncCode = DEMO_SYNC_CODE;

  async function handleCopy() {
    await Clipboard.setStringAsync(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `Join me on Ember to raise our AI baby together! 👶\nUse code: ${syncCode}\nDownload: https://ember.app`,
        title: 'Join me on Ember',
      });
    } catch (e) {
      // ignore
    }
  }

  function handleContinue() {
    navigation.navigate('Generating', {
      photos: [
        'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=512&h=512&fit=crop',
      ],
      mode: 'partner',
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.emoji}>💕</Text>
        <Text style={styles.title}>Invite your{'\n'}partner</Text>
        <Text style={styles.subtitle}>
          Share this code so they can join and upload their photo too.
        </Text>

        {/* Code display */}
        <LinearGradient
          colors={['#FFB6C1', '#FFDAB9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.codeCard}
        >
          <Text style={styles.codeLabel}>Your Sync Code</Text>
          <Text style={styles.code}>{syncCode}</Text>
        </LinearGradient>

        {/* Actions */}
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.8}>
          <Text style={styles.copyBtnText}>
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </Text>
        </TouchableOpacity>

        <Button
          label="📤 Share with Partner"
          onPress={handleShare}
          variant="secondary"
          fullWidth
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue solo for now</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          label="Continue → Generate Baby"
          onPress={handleContinue}
          fullWidth
        />

        <Text style={styles.footnote}>
          Your partner can enter this code in the app to join your baby's story.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 32,
  },
  emoji: { fontSize: 56, marginBottom: 16 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    color: colors.text,
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  codeCard: {
    width: '100%',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    opacity: 0.85,
  },
  code: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
  },
  copyBtn: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  copyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
    gap: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.borderLight },
  dividerText: { fontSize: 13, color: colors.textTertiary },
  footnote: {
    marginTop: 16,
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
