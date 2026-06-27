import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/theme';

const LOGO = require('@/assets/images/icon.png');

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.primary,
          headerTitleStyle: { fontWeight: '700', color: Colors.text },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => (
              <Image
                source={LOGO}
                style={{ width: 32, height: 32, resizeMode: 'contain' }}
                accessibilityLabel="Paipai"
              />
            ),
          }}
        />
        <Stack.Screen name="location/[id]" options={{ title: 'Leaderboard' }} />
        <Stack.Screen
          name="camera/[id]"
          options={{ title: 'Guided Shoot', headerShown: false, presentation: 'fullScreenModal' }}
        />
      </Stack>
    </>
  );
}