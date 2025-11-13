import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebase';
import { colors } from '../src/styles/globalStyles';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}