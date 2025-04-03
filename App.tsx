import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import WorkersScreen from './src/screens/WorkersScreen';
import ShiftsScreen from './src/screens/ShiftsScreen';
import FacebookScreen from './src/screens/FacebookScreen';
import ShiftListScreen from './src/screens/ShiftListScreen';
import ShiftWorkersScreen from './src/screens/ShiftWorkersScreen';
import ShiftCalendarScreen from './src/screens/ShiftCalendarScreen';

export type RootStackParamList = {
  Home: undefined;
  Workers: undefined;
  Shifts: undefined;
  Facebook: undefined; // add this
  ShiftListScreen: undefined; // add this
  ShiftWorkersScreen: {
    shiftId: number;
    shiftName: string;
  }; 
  ShiftCalendar: undefined; // 👈 Add this// add this
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Workers" component={WorkersScreen} />
        <Stack.Screen name="Shifts" component={ShiftsScreen} />
        <Stack.Screen name="Facebook" component={FacebookScreen} />
        <Stack.Screen name="ShiftListScreen" component={ShiftListScreen} options={{ title: 'Shifts' }}/>
        <Stack.Screen name="ShiftWorkersScreen" component={ShiftWorkersScreen} options={{ title: 'Assigned Workers' }}/>
        <Stack.Screen name="ShiftCalendar" component={ShiftCalendarScreen} options={{ title: 'Shift Calendar' }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
