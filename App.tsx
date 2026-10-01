import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { Card, Text, theme, useGastitoFonts } from '@/ui';

export default function App() {
  const [fontsLoaded] = useGastitoFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Card>
        <Text variant="title">Gastito</Text>
        <Text tone="muted" style={styles.body}>
          La app de gastos todavía no está. Para ver la librería de UI corré npm run
          storybook y abrí localhost:6006.
        </Text>
      </Card>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.space.xl,
  },
  body: {
    marginTop: theme.space.sm,
  },
});
