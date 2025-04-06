import { Tabs } from 'expo-router';
import { Stack, Redirect, router } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="chatBot" options={{ title: 'ChatBot', headerShown: false  }} />
      <Tabs.Screen name="weather" options={{ title: 'Weather', headerShown: false  }} />
    </Tabs>
  );
}