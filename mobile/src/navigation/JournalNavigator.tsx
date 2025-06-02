import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { JournalStackParamList } from '../types';
import { colors } from '../constants/theme';

// Import journal screens
import JournalListScreen from '../screens/journal/JournalListScreenNew';
import JournalEntryScreen from '../screens/journal/JournalEntryScreen';
import AnalysisScreen from '../screens/journal/AnalysisScreen';

const Stack = createStackNavigator<JournalStackParamList>();

const JournalNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="JournalList"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="JournalList"
        component={JournalListScreen}
        options={{
          title: 'My Journal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="JournalEntry"
        component={JournalEntryScreen}
        options={{
          title: 'Journal Entry',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="JournalAnalysis"
        component={AnalysisScreen}
        options={{
          title: 'AI Analysis',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default JournalNavigator;
