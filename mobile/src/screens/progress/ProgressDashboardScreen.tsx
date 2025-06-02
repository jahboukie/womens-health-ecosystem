/**
 * 📊 PROGRESS DASHBOARD SCREEN
 *
 * This is the main progress tracking screen that brings together:
 * 1. Animated streak counter with fire effects
 * 2. Beautiful mood trend charts
 * 3. Achievement badge gallery
 * 4. Goal progress indicators
 * 5. Motivational insights and tips
 *
 * Think of this as the command center for recovery progress!
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, FAB, Portal, Dialog, Button } from 'react-native-paper';
import { colors, spacing, typography } from '../../constants/theme';

// Import our beautiful progress components
import StreakCounter from '../../components/progress/StreakCounter';
import MoodChart from '../../components/progress/MoodChart';
import AchievementBadges from '../../components/progress/AchievementBadges';

// Import types
import {
  ProgressMetrics,
  MoodEntry,
  Achievement,
  AchievementCategory,
  AchievementRarity,
  MoodLevel
} from '../../types/progress';

const ProgressDashboardScreen: React.FC = () => {
  // 📊 STATE
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);

  // 🔄 MOCK DATA (In real app, this would come from Redux/API)
  const [progressMetrics] = useState<ProgressMetrics>({
    userId: 'user-123',
    sobrietyStartDate: new Date('2024-01-01'),
    currentStreak: 45,
    longestStreak: 67,
    totalDaysSober: 180,
    lastUpdated: new Date(),
  });

  const [moodEntries] = useState<MoodEntry[]>([
    {
      id: '1',
      userId: 'user-123',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      mood: MoodLevel.GOOD,
      energy: 7,
      anxiety: 3,
      motivation: 8,
    },
    {
      id: '2',
      userId: 'user-123',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      mood: MoodLevel.EXCELLENT,
      energy: 8,
      anxiety: 2,
      motivation: 9,
    },
    {
      id: '3',
      userId: 'user-123',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      mood: MoodLevel.GOOD,
      energy: 6,
      anxiety: 4,
      motivation: 7,
    },
    {
      id: '4',
      userId: 'user-123',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      mood: MoodLevel.NEUTRAL,
      energy: 5,
      anxiety: 5,
      motivation: 6,
    },
    {
      id: '5',
      userId: 'user-123',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      mood: MoodLevel.GOOD,
      energy: 7,
      anxiety: 3,
      motivation: 8,
    },
    {
      id: '6',
      userId: 'user-123',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      mood: MoodLevel.EXCELLENT,
      energy: 9,
      anxiety: 2,
      motivation: 9,
    },
    {
      id: '7',
      userId: 'user-123',
      date: new Date(),
      mood: MoodLevel.EXCELLENT,
      energy: 8,
      anxiety: 1,
      motivation: 10,
    },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: 'first-day',
      title: 'First Day',
      description: 'Completed your first day of sobriety',
      icon: '🌟',
      category: AchievementCategory.SOBRIETY,
      requirement: { type: 'streak', value: 1 },
      unlockedAt: new Date('2024-01-01'),
      isUnlocked: true,
      rarity: AchievementRarity.COMMON,
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Maintained sobriety for 7 days',
      icon: '🗡️',
      category: AchievementCategory.SOBRIETY,
      requirement: { type: 'streak', value: 7 },
      unlockedAt: new Date('2024-01-07'),
      isUnlocked: true,
      rarity: AchievementRarity.COMMON,
    },
    {
      id: 'month-master',
      title: 'Month Master',
      description: 'Achieved 30 days of sobriety',
      icon: '👑',
      category: AchievementCategory.SOBRIETY,
      requirement: { type: 'streak', value: 30 },
      unlockedAt: new Date('2024-01-30'),
      isUnlocked: true,
      rarity: AchievementRarity.RARE,
    },
    {
      id: 'mood-tracker',
      title: 'Mood Tracker',
      description: 'Logged mood for 7 consecutive days',
      icon: '📊',
      category: AchievementCategory.MOOD,
      requirement: { type: 'check_ins', value: 7 },
      unlockedAt: new Date('2024-01-15'),
      isUnlocked: true,
      rarity: AchievementRarity.COMMON,
    },
    {
      id: 'chat-champion',
      title: 'Chat Champion',
      description: 'Had 10 meaningful conversations with SoberPal',
      icon: '💬',
      category: AchievementCategory.ENGAGEMENT,
      requirement: { type: 'chat_sessions', value: 10 },
      unlockedAt: new Date('2024-01-20'),
      isUnlocked: true,
      rarity: AchievementRarity.COMMON,
    },
    {
      id: 'quarter-champion',
      title: 'Quarter Champion',
      description: 'Maintained sobriety for 90 days',
      icon: '🏆',
      category: AchievementCategory.MILESTONES,
      requirement: { type: 'streak', value: 90 },
      isUnlocked: false,
      rarity: AchievementRarity.EPIC,
    },
    {
      id: 'year-legend',
      title: 'Year Legend',
      description: 'Achieved one full year of sobriety',
      icon: '🌟',
      category: AchievementCategory.MILESTONES,
      requirement: { type: 'streak', value: 365 },
      isUnlocked: false,
      rarity: AchievementRarity.LEGENDARY,
    },
  ]);

  // 🔄 REFRESH HANDLER
  const handleRefresh = async () => {
    setRefreshing(true);
    // In real app, fetch latest progress data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // 🏆 ACHIEVEMENT PRESS HANDLER
  const handleAchievementPress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowAchievementDialog(true);
  };

  // ✅ CHECK-IN HANDLER
  const handleCheckIn = () => {
    // In real app, this would update the streak and create a mood entry
    console.log('Daily check-in completed!');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 🔥 STREAK COUNTER */}
        <StreakCounter
          currentStreak={progressMetrics.currentStreak}
          longestStreak={progressMetrics.longestStreak}
          sobrietyStartDate={progressMetrics.sobrietyStartDate}
          onCheckIn={handleCheckIn}
        />

        {/* 📈 MOOD CHART */}
        <MoodChart
          moodEntries={moodEntries}
          timeframe="week"
        />

        {/* 🏆 ACHIEVEMENT BADGES */}
        <AchievementBadges
          achievements={achievements}
          onBadgePress={handleAchievementPress}
        />

        {/* 💡 MOTIVATIONAL SECTION */}
        <View style={styles.motivationSection}>
          <Text style={styles.motivationTitle}>💪 Keep Going Strong!</Text>
          <Text style={styles.motivationText}>
            You're doing amazing! Every day of sobriety is a victory worth celebrating.
            Your progress shows real dedication to your recovery journey.
          </Text>
        </View>

        {/* 📊 QUICK STATS */}
        <View style={styles.quickStats}>
          <Text style={styles.quickStatsTitle}>📊 Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{achievements.filter(a => a.isUnlocked).length}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{moodEntries.length}</Text>
              <Text style={styles.statLabel}>Mood Entries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {(moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Avg Mood</Text>
            </View>
          </View>
        </View>

        {/* Add some bottom padding for better scrolling */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 🎯 TOP RIGHT LOG MOOD BUTTON */}
      <FAB
        icon="plus"
        label="Log Mood"
        style={styles.topRightFab}
        size="medium"
        onPress={() => {
          // In real app, navigate to mood logging screen
          console.log('Navigate to mood logging');
        }}
      />

      {/* 🏆 ACHIEVEMENT DETAIL DIALOG */}
      <Portal>
        <Dialog
          visible={showAchievementDialog}
          onDismiss={() => setShowAchievementDialog(false)}
        >
          <Dialog.Title>
            {selectedAchievement?.icon} {selectedAchievement?.title}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.achievementDescription}>
              {selectedAchievement?.description}
            </Text>
            {selectedAchievement?.isUnlocked && selectedAchievement.unlockedAt && (
              <Text style={styles.achievementDate}>
                Unlocked on {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
              </Text>
            )}
            {!selectedAchievement?.isUnlocked && (
              <Text style={styles.achievementLocked}>
                🔒 Keep working towards this achievement!
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAchievementDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  motivationSection: {
    backgroundColor: colors.primaryContainer,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
  },
  motivationTitle: {
    ...typography.headline6,
    color: colors.onPrimaryContainer,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  motivationText: {
    ...typography.body1,
    color: colors.onPrimaryContainer,
    textAlign: 'center',
    lineHeight: 24,
  },
  quickStats: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 2,
  },
  quickStatsTitle: {
    ...typography.headline6,
    color: colors.onSurface,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...typography.headline4,
    color: colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.caption,
    color: colors.onSurface,
    marginTop: spacing.xs,
  },
  topRightFab: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.md,
    backgroundColor: colors.primary,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  achievementDescription: {
    ...typography.body1,
    marginBottom: spacing.md,
  },
  achievementDate: {
    ...typography.caption,
    color: colors.primary,
    fontStyle: 'italic',
  },
  achievementLocked: {
    ...typography.caption,
    color: colors.onSurface,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});

export default ProgressDashboardScreen;