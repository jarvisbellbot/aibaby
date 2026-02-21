/**
 * Ember Navigation — Root Navigator
 * Full navigation with all screens + tab icons
 */

import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens — Onboarding
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import ModeSelectScreen from '../screens/onboarding/ModeSelectScreen';
import PhotoUploadScreen from '../screens/onboarding/PhotoUploadScreen';
import GeneratingScreen from '../screens/onboarding/GeneratingScreen';
import BabyRevealScreen from '../screens/onboarding/BabyRevealScreen';
import NamingScreen from '../screens/onboarding/NamingScreen';
import TutorialScreen from '../screens/onboarding/TutorialScreen';
import PartnerInviteScreen from '../screens/onboarding/PartnerInviteScreen';

// Screens — Auth
import AuthScreen from '../screens/auth/AuthScreen';

// Screens — Tabs
import HomeScreen from '../screens/tabs/HomeScreen';
import LeaderboardScreen from '../screens/tabs/LeaderboardScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';

// Screens — Modal/Stack
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ShareScreen from '../screens/ShareScreen';

import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// ===== Tab Icon =====

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
    </View>
  );
}

// ===== Main Tabs =====

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 10,
          height: 80,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 0 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Baby',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👶" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: 'Rankings',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ===== Root Navigator =====

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        initialRouteName="Welcome"
      >
        {/* Onboarding */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
        <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
        <Stack.Screen name="PartnerInvite" component={PartnerInviteScreen} />
        <Stack.Screen name="Generating" component={GeneratingScreen} />
        <Stack.Screen name="BabyReveal" component={BabyRevealScreen} />
        <Stack.Screen name="Naming" component={NamingScreen} />
        <Stack.Screen name="Tutorial" component={TutorialScreen} />

        {/* Main App */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ animation: 'fade' }}
        />

        {/* Modal screens */}
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Share"
          component={ShareScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
