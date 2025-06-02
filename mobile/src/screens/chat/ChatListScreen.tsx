import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '../../store';
import { loadConversations } from '../../store/slices/conversationsSlice';
import { colors, spacing, typography } from '../../constants/theme';

const ChatListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { conversations, isLoading } = useSelector((state: RootState) => state.conversations);

  useEffect(() => {
    dispatch(loadConversations({}));
  }, [dispatch]);

  const handleStartNewChat = () => {
    (navigation as any).navigate('ChatConversation', { conversationId: undefined });
  };

  const handleConversationPress = (conversationId: string) => {
    (navigation as any).navigate('ChatConversation', { conversationId });
  };

  const renderConversation = ({ item }: { item: any }) => (
    <Card
      style={styles.conversationCard}
      onPress={() => handleConversationPress(item.id)}
    >
      <Card.Content>
        <View style={styles.conversationHeader}>
          <MaterialCommunityIcons
            name={
              item.conversationType === 'crisis' ? 'alert-circle' :
              item.conversationType === 'journal' ? 'book' :
              item.conversationType === 'checkin' ? 'heart-pulse' :
              'chat'
            }
            size={24}
            color={
              item.conversationType === 'crisis' ? colors.crisis :
              item.conversationType === 'journal' ? colors.secondary :
              item.conversationType === 'checkin' ? colors.accent :
              colors.primary
            }
          />
          <Text style={styles.conversationType}>
            {item.conversationType.charAt(0).toUpperCase() + item.conversationType.slice(1)}
          </Text>
          <Text style={styles.conversationDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {item.crisisDetected && (
          <Chip
            icon="alert"
            style={styles.crisisChip}
            textStyle={styles.crisisChipText}
          >
            Crisis Support Provided
          </Chip>
        )}

        <Text style={styles.messageCount}>
          {item.messageCount} messages
        </Text>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="chat-plus"
        size={64}
        color={colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>Start Your First Conversation</Text>
      <Text style={styles.emptySubtitle}>
        Chat with our AI companion for support, guidance, and encouragement on your recovery journey.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshing={isLoading}
        onRefresh={() => dispatch(loadConversations({}))}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleStartNewChat}
        label="New Chat"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  conversationCard: {
    marginBottom: spacing.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  conversationType: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  conversationDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  crisisChip: {
    backgroundColor: colors.crisisLight,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  crisisChipText: {
    color: colors.crisis,
    fontSize: typography.fontSize.xs,
  },
  messageCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default ChatListScreen;
