import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../constants/theme';
import { SupportStackParamList } from '../types';

// Import screens
import SupportScreen from '../screens/main/SupportScreen';
import PrivacySettingsScreen from '../screens/main/PrivacySettingsScreen';
import CommunityNavigator from './CommunityNavigator';

const Stack = createStackNavigator<SupportStackParamList>();

const SupportNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="SupportMain"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="SupportMain"
        component={SupportScreen}
        options={{
          title: 'Support & Community',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettingsScreen}
        options={{
          title: 'Privacy & PIPEDA',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Community"
        component={CommunityNavigator}
        options={{
          title: 'Community',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SupportNavigator;
