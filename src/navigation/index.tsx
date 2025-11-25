import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { AddGameScreen } from '../screens/AddGameScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { GameDetailScreen } from '../screens/GameDetailScreen';
import { colors, typography } from '../styles/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Simple icon component using text
const TabIcon: React.FC<{ label: string; focused: boolean }> = ({ label, focused }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text
      style={{
        fontSize: 24,
        color: focused ? colors.primary : colors.textMuted,
      }}
    >
      {label === 'Home' ? '🏒' : label === 'History' ? '📋' : '➕'}
    </Text>
  </View>
);

// Tab Navigator for main screens
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 2,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: '600',
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="AddGame"
        component={AddGameScreen}
        options={{
          tabBarLabel: 'Add Game',
          tabBarIcon: ({ focused }) => <TabIcon label="Add" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="History" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Main Navigation
export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="GameDetail"
          component={GameDetailScreen}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
