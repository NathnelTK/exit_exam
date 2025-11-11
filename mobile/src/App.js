import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Dashboard from './screens/Dashboard';
import Settings from './screens/Settings';
import Uploads from './screens/Uploads';
import WeeklyPlan from './screens/WeeklyPlan';
import MockExam from './screens/MockExam';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style=\"auto\" />
      <Stack.Navigator>
        <Stack.Screen name=\"Dashboard\" component={Dashboard} />
        <Stack.Screen name=\"Settings\" component={Settings} />
        <Stack.Screen name=\"Uploads\" component={Uploads} />
        <Stack.Screen name=\"WeeklyPlan\" component={WeeklyPlan} />
        <Stack.Screen name=\"MockExam\" component={MockExam} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

