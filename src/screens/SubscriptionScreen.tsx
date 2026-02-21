/**
 * Subscription Screen — Ember
 * Paywall: $2.99/mo or $35.99/yr
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { Button } from '../components/ui';

const FEATURES = [
  { emoji: '🤖', text: 'AI baby generation from your photos' },
  { emoji: '📊', text: 'Real-time happiness tracking' },
  { emoji: '🏆', text: 'Weekly leaderboard with your partner' },
  { emoji: '📤', text: 'Share your baby on social media' },
  { emoji: '💕', text: 'Partner mode — raise together' },
  { emoji: '🔔', text: 'Notifications when baby needs you' },
  { emoji: '📸', text: 'Unlimited baby generations' },
];

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$2.99',
    period: '/month',
    badge: null,
    total: '$2.99/month',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$35.99',
    period: '/year',
    badge: 'BEST VALUE',
    total: 'Just $3.00/month · Save 16%',
  },
];

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  function handleTrial() {
    Alert.alert(
      '🎉 3-Day Free Trial',
      'In demo mode, subscriptions are simulated. In production, this would start your free trial via Stripe.',
      [
        { text: 'Got it!', onPress: () => navigation.goBack() },
      ]
    );
  }

  function handleRestore() {
    Alert.alert('Restore Purchases', 'No previous purchases found.');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={['#FF6B6B', '#FFA07A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroEmoji}>🔥👶</Text>
          <Text style={styles.heroTitle}>Ember Premium</Text>
          <Text style={styles.heroSub}>Raise your AI baby to its fullest</Text>
        </LinearGradient>

        {/* Features */}
        <Text style={styles.sectionTitle}>Everything included:</Text>
        <View style={styles.featureList}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <Text style={styles.sectionTitle}>Choose your plan:</Text>
        <View style={styles.plans}>
          {PLANS.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
              activeOpacity={0.85}
            >
              {plan.badge && (
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>{plan.badge}</Text>
                </View>
              )}
              <View style={styles.planLeft}>
                <View style={[
                  styles.planRadio,
                  selectedPlan === plan.id && styles.planRadioSelected,
                ]}>
                  {selectedPlan === plan.id && <View style={styles.planRadioDot} />}
                </View>
                <Text style={styles.planLabel}>{plan.label}</Text>
              </View>
              <View style={styles.planRight}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.planNote}>
          {selectedPlan === 'yearly'
            ? '💡 Just $3.00/month · Billed annually as $35.99'
            : '💡 Billed monthly. Cancel anytime.'}
        </Text>

        {/* CTA */}
        <Button
          label="🎉 Start 3-Day Free Trial"
          onPress={handleTrial}
          size="lg"
          fullWidth
        />

        <Text style={styles.trialNote}>
          No charge for 3 days · Cancel anytime before trial ends
        </Text>

        <TouchableOpacity onPress={handleRestore}>
          <Text style={styles.restore}>Restore purchases</Text>
        </TouchableOpacity>

        <Text style={styles.legal}>
          By subscribing you agree to our Terms of Service and Privacy Policy.
          Subscriptions auto-renew unless cancelled.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 48 },
  hero: {
    padding: 40,
    alignItems: 'center',
    marginBottom: 28,
  },
  heroEmoji: { fontSize: 52, marginBottom: 12 },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  featureList: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  featureEmoji: { fontSize: 20, marginRight: 12, width: 28 },
  featureText: { flex: 1, fontSize: 15, color: colors.text, fontWeight: '500' },
  checkmark: { fontSize: 16, color: colors.success, fontWeight: '800' },
  plans: { gap: 10, marginHorizontal: 24, marginBottom: 8 },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: colors.borderLight,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  planBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  planLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRadioSelected: { borderColor: colors.primary },
  planRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  planLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  planRight: { alignItems: 'flex-end' },
  planPrice: { fontSize: 20, fontWeight: '900', color: colors.text },
  planPeriod: { fontSize: 12, color: colors.textSecondary },
  planNote: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  trialNote: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 4,
    marginBottom: 16,
  },
  restore: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 20,
  },
  legal: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textTertiary,
    paddingHorizontal: 32,
    lineHeight: 16,
  },
});
