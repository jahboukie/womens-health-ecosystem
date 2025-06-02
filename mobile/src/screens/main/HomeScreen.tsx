import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { loadProgressDashboard } from '../../store/slices/progressSlice';
import { colors, spacing, typography, componentStyles } from '../../constants/theme';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { metrics } = useSelector((state: RootState) => state.progress);

  useEffect(() => {
    // Load dashboard data when screen mounts
    dispatch(loadProgressDashboard());
  }, [dispatch]);

  // Navigation handlers
  const handleChatWithAI = () => {
    (navigation as any).navigate('Chat');
  };

  const handleJournalEntry = () => {
    (navigation as any).navigate('Journal', { screen: 'JournalEntry' });
  };

  const handleMoodCheck = () => {
    (navigation as any).navigate('Journal', { screen: 'JournalAnalysis' });
  };

  const handleCrisisSupport = () => {
    Alert.alert(
      'Crisis Support',
      'Choose how you would like to get help:',
      [
        {
          text: 'Call Crisis Hotline',
          onPress: () => Linking.openURL('tel:988'),
        },
        {
          text: 'Text Crisis Line',
          onPress: () => Linking.openURL('sms:741741'),
        },
        {
          text: 'Emergency Services',
          onPress: () => Linking.openURL('tel:911'),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getDaysSober = () => {
    if (!user?.recoveryStartDate) return 0;
    const startDate = new Date(user.recoveryStartDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}!</Text>
        <Text style={styles.userName}>
          {user?.email?.split('@')[0] || 'Friend'}
        </Text>
      </View>

      {/* Progress Summary Card */}
      <Card style={styles.progressCard}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <MaterialCommunityIcons
              name="trophy"
              size={32}
              color={colors.accent}
            />
            <Text style={styles.progressTitle}>Your Progress</Text>
          </View>

          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{getDaysSober()}</Text>
              <Text style={styles.statLabel}>Days Sober</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{metrics?.totalDaysTracked || 0}</Text>
              <Text style={styles.statLabel}>Days Tracked</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{metrics?.recentAchievements?.length || 0}</Text>
              <Text style={styles.statLabel}>Milestones</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity onPress={handleChatWithAI} style={styles.actionCardContainer}>
            <Card style={styles.actionCard}>
              <Card.Content style={styles.actionContent}>
                <MaterialCommunityIcons
                  name="chat"
                  size={32}
                  color="#4A90E2"
                />
                <Text style={styles.actionTitle}>Chat with AI</Text>
                <Text style={styles.actionSubtitle}>Get support anytime</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleJournalEntry} style={styles.actionCardContainer}>
            <Card style={styles.actionCard}>
              <Card.Content style={styles.actionContent}>
                <MaterialCommunityIcons
                  name="book-open"
                  size={32}
                  color="#50C878"
                />
                <Text style={styles.actionTitle}>Journal Entry</Text>
                <Text style={styles.actionSubtitle}>Record your thoughts</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleMoodCheck} style={styles.actionCardContainer}>
            <Card style={styles.actionCard}>
              <Card.Content style={styles.actionContent}>
                <MaterialCommunityIcons
                  name="heart-pulse"
                  size={32}
                  color="#F39C12"
                />
                <Text style={styles.actionTitle}>Mood Check</Text>
                <Text style={styles.actionSubtitle}>Track how you feel</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCrisisSupport} style={styles.actionCardContainer}>
            <Card style={styles.actionCard}>
              <Card.Content style={styles.actionContent}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={32}
                  color="#E74C3C"
                />
                <Text style={styles.actionTitle}>Crisis Support</Text>
                <Text style={styles.actionSubtitle}>Get immediate help</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Motivation */}
      <Card style={styles.motivationCard}>
        <Card.Content>
          <View style={styles.motivationHeader}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={24}
              color={colors.accent}
            />
            <Text style={styles.motivationTitle}>Daily Motivation</Text>
          </View>
          <Text style={styles.motivationText}>
            "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would. Every step forward is progress, no matter how small."
          </Text>
        </Card.Content>
      </Card>

      {/* Emergency Button */}
      <Button
        mode="contained"
        buttonColor={colors.crisis}
        textColor={colors.textInverse}
        icon="phone"
        style={styles.emergencyButton}
        onPress={handleCrisisSupport}
      >
        Crisis Support - Tap for Help
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textTransform: 'capitalize',
  },
  progressCard: {
    marginBottom: spacing.lg,
    ...componentStyles.card.elevated,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  quickActions: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: spacing.md,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCardContainer: {
    width: '48%',
    marginBottom: spacing.md,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: 100,
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  motivationCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  motivationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  motivationTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  motivationText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: typography.lineHeight.sm,
    fontStyle: 'italic',
  },
  emergencyButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
});

export default HomeScreen;
