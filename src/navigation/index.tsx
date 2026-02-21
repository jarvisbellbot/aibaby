/**
 * Ember Navigation — Root Navigator
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import ModeSelectScreen from '../screens/onboarding/ModeSelectScreen';
import PhotoUploadScreen from '../screens/onboarding/PhotoUploadScreen';
import GeneratingScreen from '../screens/onboarding/GeneratingScreen';
import BabyRevealScreen from '../screens/onboarding/BabyRevealScreen';
import NamingScreen from '../screens/onboarding/NamingScreen';
import TutorialScreen from '../screens/onboarding/TutorialScreen';
import HomeScreen from '../screens/tabs/HomeScreen';
import LeaderboardScreen from '../screens/tabs/LeaderboardScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
        <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
        <Stack.Screen name="Generating" component={GeneratingScreen} />
        <Stack.Screen name="BabyReveal" component={BabyRevealScreen} />
        <Stack.Screen name="Naming" component={NamingScreen} />
        <Stack.Screen name="Tutorial" component={TutorialScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
