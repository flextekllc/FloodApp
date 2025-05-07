import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import WorkersScreen from './src/screens/WorkersScreen';
import ShiftsScreen from './src/screens/ShiftsScreen';
import ShiftListScreen from './src/screens/ShiftListScreen';
import ShiftWorkersScreen from './src/screens/ShiftWorkersScreen';
import ShiftCalendarScreen from './src/screens/ShiftCalendarScreen';
import WebViewTabsScreen from './src/screens/WebViewTabsScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Workers: undefined;
  Shifts: undefined;
  ShiftListScreen: undefined;
  ShiftWorkersScreen: {
    shiftId: number;
    shiftName: string;
  };
  ShiftCalendar: undefined;
  SocialWebView: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Workers" component={WorkersScreen} />
        <Stack.Screen name="Shifts" component={ShiftsScreen} />
        <Stack.Screen name="ShiftListScreen" component={ShiftListScreen} options={{ title: 'Shifts' }} />
        <Stack.Screen name="ShiftWorkersScreen" component={ShiftWorkersScreen} options={{ title: 'Assigned Workers' }} />
        <Stack.Screen name="ShiftCalendar" component={ShiftCalendarScreen} options={{ title: 'Shift Calendar' }} />
        <Stack.Screen name="SocialWebView" component={WebViewTabsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
