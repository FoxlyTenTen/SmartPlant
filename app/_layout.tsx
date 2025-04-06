import { Stack, Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {


  return (
    <Stack>
      <Stack.Screen name="logIn" options={{ headerShown: false }} />
      <Stack.Screen name="signUp" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="geminiBot" options={{ headerShown: true }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
