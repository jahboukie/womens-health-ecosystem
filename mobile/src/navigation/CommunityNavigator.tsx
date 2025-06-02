import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../constants/theme';

// Import community screens
import CommunityHomeScreen from '../screens/community/CommunityHomeScreen';
import SponsorListScreen from '../screens/community/SponsorListScreen';
import SponsorProfileScreen from '../screens/community/SponsorProfileScreen';
import SponsorRequestScreen from '../screens/community/SponsorRequestScreen';
import GroupListScreen from '../screens/community/GroupListScreen';
import GroupDetailScreen from '../screens/community/GroupDetailScreen';
import MessagingScreen from '../screens/community/MessagingScreen';
import ConversationScreen from '../screens/community/ConversationScreen';

export type CommunityStackParamList = {
  CommunityHome: undefined;
  SponsorList: undefined;
  SponsorProfile: { sponsorId: string };
  SponsorRequest: { sponsorId: string };
  GroupList: { groupType?: string };
  GroupDetail: { groupId: string };
  Messaging: undefined;
  Conversation: { userId: string; userName: string };
};

const Stack = createStackNavigator<CommunityStackParamList>();

const CommunityNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CommunityHome"
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
        name="CommunityHome" 
        component={CommunityHomeScreen}
        options={{
          title: 'Community',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="SponsorList" 
        component={SponsorListScreen}
        options={{
          title: 'Find a Sponsor',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="SponsorProfile" 
        component={SponsorProfileScreen}
        options={{
          title: 'Sponsor Profile',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="SponsorRequest" 
        component={SponsorRequestScreen}
        options={{
          title: 'Request Sponsor',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="GroupList" 
        component={GroupListScreen}
        options={{
          title: 'Support Groups',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="GroupDetail" 
        component={GroupDetailScreen}
        options={{
          title: 'Group Details',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Messaging" 
        component={MessagingScreen}
        options={{
          title: 'Messages',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Conversation" 
        component={ConversationScreen}
        options={({ route }) => ({
          title: route.params.userName,
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
};

export default CommunityNavigator;
