import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { theme } from '@/ui';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.color.background },
        headerShadowVisible: false,
        headerTintColor: theme.color.ink,
        headerTitleStyle: {
          fontFamily: theme.fontFamily.semibold,
          fontWeight: theme.fontWeight.semibold,
        },
        tabBarActiveTintColor: theme.color.primary,
        tabBarInactiveTintColor: theme.color.muted,
        tabBarStyle: {
          backgroundColor: theme.color.background,
          borderTopColor: theme.color.border,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fontFamily.medium,
        },
        sceneStyle: { backgroundColor: theme.color.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Gastos',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nuevo"
        options={{
          title: 'Nuevo gasto',
          tabBarLabel: 'Nuevo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
