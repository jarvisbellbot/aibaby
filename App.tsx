/**
 * Ember 🔥👶
 * AI Baby App — Root Component
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { BabyProvider } from './src/context/BabyContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <BabyProvider>
        <StatusBar style="auto" />
        <Navigation />
      </BabyProvider>
    </AuthProvider>
  );
}
