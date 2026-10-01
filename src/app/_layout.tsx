import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { theme, useGastitoFonts } from '@/ui';

export default function RootLayout() {
  const [fontsLoaded] = useGastitoFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.color.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
