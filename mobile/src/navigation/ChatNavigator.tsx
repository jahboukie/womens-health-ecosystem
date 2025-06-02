import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatStackParamList } from '../types';
import { colors } from '../constants/theme';

// Import chat screens
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatConversationScreen from '../screens/chat/ChatConversationScreen';
import CrisisResourcesScreen from '../screens/chat/CrisisResourcesScreen';

const Stack = createStackNavigator<ChatStackParamList>();

const ChatNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChatList"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen}
        options={{
          title: 'AI Support Chat',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="ChatConversation" 
        component={ChatConversationScreen}
        options={{
          title: 'Chat',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="CrisisResources" 
        component={CrisisResourcesScreen}
        options={{
          title: 'Crisis Resources',
          headerShown: true,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
