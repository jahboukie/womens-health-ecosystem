import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from 'react-native';
import { Text, TextInput, IconButton, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { startConversation, sendMessage } from '../../store/slices/conversationsSlice';
import { colors, spacing, typography } from '../../constants/theme';
import { formatTimestamp } from '../../utils/messageHelpers';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { AnimatedMessage } from '../../components/chat/AnimatedMessage';
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
const ChatConversationScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  // 📱 AUTO-SCROLL FUNCTIONALITY: Create ref for FlatList to control scrolling
  const flatListRef = useRef<FlatList>(null);
  // Get current conversation from Redux store
  const { currentConversation, isLoading } = useSelector((state: any) => state.conversations);
  // Use messages from Redux store or default welcome message
  const messages = currentConversation?.messages || [
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m here to support you on your recovery journey. How are you feeling today?',
      timestamp: new Date()},
  ];
  // 🎯 AUTO-SCROLL EFFECT: Automatically scroll to bottom when new messages arrive
  useEffect(() => {
    // Small delay to ensure the message is rendered before scrolling
    const scrollToBottom = () => {
      if (flatListRef.current && messages.length > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    };
    scrollToBottom();
  }, [messages.length]); // Trigger when message count changes
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const messageToSend = message.trim();
    setMessage('');
    // Dismiss keyboard on Android
    if (Platform.OS === 'android') {
      Keyboard.dismiss();
    }
    // 🎯 IMMEDIATE SCROLL: Scroll to show user's message immediately
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
    try {
      // If this is the first message or no current conversation, start a new conversation
      if (!currentConversation || messages.length <= 1) {
        const response = await dispatch(startConversation({
          conversationType: 'casual',
          initialMessage: messageToSend,
          context: {
            currentMood: 5,
            locationContext: 'mobile_app'
          }
        })).unwrap();
        // Update conversation ID for future messages
        setConversationId(response.conversationId);
      } else {
        // Send message to existing conversation
        await dispatch(sendMessage({
          conversationId: currentConversation.id,
          message: messageToSend,
          metadata: {
            urgencyLevel: 'low'
          }
        })).unwrap();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Error handling is now managed by Redux store
    }
  };
  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <AnimatedMessage
      isUser={item.role === 'user'}
      delay={index * 100} // Stagger animations for multiple messages
    >
      <View
        testID={`message-${item.id}`}
        style={[
          styles.messageContainer,
          item.role === 'user' ? styles.userMessage : styles.assistantMessage
        ]}
      >
        <Card style={[
          styles.messageCard,
          item.role === 'user' ? styles.userMessageCard : styles.assistantMessageCard
        ]}>
          <Card.Content style={styles.messageContent}>
            <Text style={[
              styles.messageText,
              item.role === 'user' ? styles.userMessageText : styles.assistantMessageText
            ]}>
              {item.content}
            </Text>
            <Text style={[
              styles.messageTime,
              item.role === 'user' ? styles.userMessageTime : styles.assistantMessageTime
            ]}>
              {formatTimestamp(item.timestamp?.toString())}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </AnimatedMessage>
  );
  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
          <TypingIndicator visible={isLoading} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            mode="outlined"
            multiline
            style={styles.textInput}
            textAlignVertical="top"
            blurOnSubmit={false}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
            enablesReturnKeyAutomatically={true}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSendMessage}
                disabled={!message.trim()}
              />
            }
          />
        </View>
      </View>
    );
  }
  // iOS version with KeyboardAvoidingView
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
        <TypingIndicator visible={isLoading} />
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            mode="outlined"
            multiline
            style={styles.textInput}
            textAlignVertical="top"
            blurOnSubmit={false}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
            enablesReturnKeyAutomatically={true}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSendMessage}
                disabled={!message.trim()}
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background},
  keyboardAvoidingView: {
    flex: 1},
  messagesContainer: {
    flex: 1},
  messagesList: {
    padding: spacing.md,
    flexGrow: 1},
  messageContainer: {
    marginBottom: spacing.md},
  userMessage: {
    alignItems: 'flex-end'},
  assistantMessage: {
    alignItems: 'flex-start'},
  messageCard: {
    maxWidth: '80%'},
  userMessageCard: {
    backgroundColor: colors.primary},
  assistantMessageCard: {
    backgroundColor: colors.surface},
  messageContent: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md},
  messageText: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md},
  userMessageText: {
    color: colors.textInverse},
  assistantMessageText: {
    color: colors.text},
  messageTime: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs},
  userMessageTime: {
    color: colors.textInverse,
    opacity: 0.7},
  assistantMessageTime: {
    color: colors.textSecondary},
  inputContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4},
  textInput: {
    maxHeight: 100,
    minHeight: 56}});
export default ChatConversationScreen;
