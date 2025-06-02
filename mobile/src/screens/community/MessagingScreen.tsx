import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, List, Searchbar, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, typography } from '../../constants/theme';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';
import { communityService, CommunityMessage } from '../../services/communityService';

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'Messaging'>;

const MessagingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [conversations, setConversations] = useState<CommunityMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await communityService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      // Show mock data for demo
      setConversations([
        {
          id: '1',
          senderId: 'sponsor1',
          recipientId: 'user1',
          messageType: 'sponsor_check_in',
          content: 'How are you feeling today? Remember, one day at a time.',
          priority: 'normal',
          isRead: false,
          createdAt: new Date().toISOString(),
          sender: {
            id: 'sponsor1',
            profileEncrypted: '',
            userType: 'sponsor'
          }
        },
        {
          id: '2',
          senderId: 'peer1',
          recipientId: 'user1',
          messageType: 'direct',
          content: 'Great job on reaching your 30-day milestone!',
          priority: 'normal',
          isRead: true,
          readAt: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          sender: {
            id: 'peer1',
            profileEncrypted: '',
            userType: 'peer'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: CommunityMessage }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Conversation', {
        userId: item.senderId,
        userName: item.sender.userType === 'sponsor' ? 'Verified Sponsor' : 'Recovery Peer'
      })}
    >
      <List.Item
        title={item.sender.userType === 'sponsor' ? 'Verified Sponsor' : 'Recovery Peer'}
        description={item.content}
        descriptionNumberOfLines={2}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon={item.sender.userType === 'sponsor' ? 'account-star' : 'account'}
            style={{ backgroundColor: item.sender.userType === 'sponsor' ? colors.primary : colors.secondary }}
          />
        )}
        right={(props) => (
          <View style={styles.messageInfo}>
            <Text style={styles.timeText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            {!item.isRead && (
              <MaterialCommunityIcons
                name="circle"
                size={12}
                color={colors.primary}
                style={styles.unreadIndicator}
              />
            )}
          </View>
        )}
        style={[styles.conversationItem, !item.isRead && styles.unreadItem]}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search conversations..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="message-text-outline"
            size={64}
            color={colors.textSecondary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptySubtitle}>
            Connect with sponsors and peers to start meaningful conversations
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations.filter(conv =>
            conv.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.sender.userType.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          style={styles.conversationsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  searchBar: {
    margin: spacing.md,
    elevation: 2,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: 8,
    elevation: 1,
  },
  unreadItem: {
    backgroundColor: colors.primaryLight,
  },
  messageInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  unreadIndicator: {
    marginTop: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default MessagingScreen;
