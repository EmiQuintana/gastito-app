import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, fonts, sizes } from '@/ui';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: Platform.OS === 'ios' ? 88 : sizes.tabBar,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bold,
          fontSize: 12,
          ...(Platform.OS === 'web' ? { fontWeight: '700' } : null),
        },
        sceneStyle: { backgroundColor: colors.paper },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ focused }) => <TabIcon name="stats-chart" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  name,
  focused,
}: {
  name: 'home' | 'stats-chart' | 'settings';
  focused: boolean;
}) {
  const icon = focused ? name : (`${name}-outline` as const);
  return (
    <View style={[styles.pill, focused && styles.pillOn]}>
      <Ionicons name={icon} size={20} color={focused ? colors.ink : colors.grey} />
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: sizes.tabPill.width,
    height: sizes.tabPill.height,
    borderRadius: sizes.tabPill.height / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillOn: {
    backgroundColor: colors.mint,
  },
});
