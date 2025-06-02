import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProgressStackParamList } from '../types';
import { colors } from '../constants/theme';

// Import progress screens
import ProgressDashboardScreen from '../screens/progress/ProgressDashboardScreen';
import MilestonesScreen from '../screens/progress/MilestonesScreen';
import CopingStrategiesScreen from '../screens/progress/CopingStrategiesScreen';
import MoodTrackerScreen from '../screens/progress/MoodTrackerScreen';

const Stack = createStackNavigator<ProgressStackParamList>();

const ProgressNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProgressDashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.accent,
        },
        headerTintColor: colors.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ProgressDashboard" 
        component={ProgressDashboardScreen}
        options={{
          title: 'My Progress',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Milestones" 
        component={MilestonesScreen}
        options={{
          title: 'Milestones',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="CopingStrategies" 
        component={CopingStrategiesScreen}
        options={{
          title: 'Coping Strategies',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="MoodTracker" 
        component={MoodTrackerScreen}
        options={{
          title: 'Mood Tracker',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProgressNavigator;
