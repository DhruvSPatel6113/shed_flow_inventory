import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DashboardScreen from './src/screens/DashboardScreen';
import InventoryListScreen from './src/screens/InventoryListScreen';
import TransferScreen from './src/screens/TransferScreen';
import DispatchScreen from './src/screens/DispatchScreen';
import AIOptimizerScreen from './src/screens/AIOptimizerScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0f172a',
              elevation: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#1e293b',
            },
            headerTintColor: '#38bdf8',
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            tabBarStyle: {
              backgroundColor: '#0f172a',
              borderTopColor: '#1e293b',
              height: 60,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: '#38bdf8',
            tabBarInactiveTintColor: '#64748b',
          }}
        >
          <Tab.Screen name="Overview" component={DashboardScreen} options={{ tabBarLabel: 'Shed Matrix' }} />
          <Tab.Screen name="Optimizer" component={AIOptimizerScreen} options={{ tabBarLabel: 'AI Optimizer' }} />
          <Tab.Screen name="Products" component={InventoryListScreen} options={{ tabBarLabel: 'Inventory' }} />
          <Tab.Screen name="Transfer" component={TransferScreen} options={{ tabBarLabel: 'Transfer' }} />
          <Tab.Screen name="Dispatches" component={DispatchScreen} options={{ tabBarLabel: 'Dispatch' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
