import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  ActivityIndicator,
  Surface,
  IconButton
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { RootState, AppDispatch } from '../../store';
import { journalService } from '../../services/journalService';
const { width } = Dimensions.get('window');
interface AnalysisData {
  // From journal stats
  totalEntries: number;
  averageMood: number;
  mostCommonTags: Array<{ tag: string; count: number }>;
  longestStreak: number;
  currentStreak: number;
  entriesThisMonth: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  // From mood insights (flattened)
  moodTrendData?: Array<{ date: Date; mood: number }>;
  triggerAnalysis?: Array<{ trigger: string; impact: number; frequency: number }>;
  copingEffectiveness?: Array<{ strategy: string; effectiveness: number; usage: number }>;
  recommendations?: string[];
}
const AnalysisScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadAnalysisData = async () => {
    try {
      setError(null);
      // Load journal statistics
      const stats = await journalService.getJournalStats();
      // Load mood insights for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const moodInsights = await journalService.getMoodInsights({
        startDate,
        endDate
      });
      setAnalysisData({
        ...stats,
        ...moodInsights  // moodInsights is already the extracted data from the service
      });
    } catch (error: any) {
      console.error('Failed to load analysis data:', error);
      setError(error.message || 'Failed to load analysis data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    loadAnalysisData();
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    loadAnalysisData();
  };
  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return 'trending-up';
      case 'declining': return 'trending-down';
      default: return 'trending-neutral';
    }
  };
  const getMoodTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return colors.success;
      case 'declining': return colors.error;
      default: return colors.warning;
    }
  };
  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Analyzing your journal data...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
        <Text style={styles.errorTitle}>Analysis Unavailable</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={loadAnalysisData} style={styles.retryButton}>
          Try Again
        </Button>
      </View>
    );
  }
  if (!analysisData) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="chart-line" size={64} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>No Data Yet</Text>
        <Text style={styles.emptyText}>
          Start journaling to see your personalized insights and patterns.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('JournalEntry' as never)}
          style={styles.startButton}
        >
          Write Your First Entry
        </Button>
      </View>
    );
  }
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Journey Insights</Text>
        <Text style={styles.subtitle}>AI-powered analysis of your recovery progress</Text>
      </View>
      {/* Overview Stats */}
      <Card style={styles.overviewCard}>
        <Card.Content>
          <View style={styles.overviewHeader}>
            <MaterialCommunityIcons name="chart-donut" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Overview</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analysisData.totalEntries}</Text>
              <Text style={styles.statLabel}>Total Entries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analysisData.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analysisData.entriesThisMonth}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      {/* Mood Analysis */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.moodEmoji}>{getMoodEmoji(analysisData.averageMood)}</Text>
              <Text style={styles.cardTitle}>Mood Analysis</Text>
            </View>
            <View style={styles.trendIndicator}>
              <MaterialCommunityIcons
                name={getMoodTrendIcon(analysisData.moodTrend)}
                size={20}
                color={getMoodTrendColor(analysisData.moodTrend)}
              />
              <Text style={[styles.trendText, { color: getMoodTrendColor(analysisData.moodTrend) }]}>
                {analysisData.moodTrend}
              </Text>
            </View>
          </View>
          <View style={styles.moodStats}>
            <Surface style={styles.moodStat}>
              <Text style={styles.moodStatNumber}>
                {analysisData.averageMood.toFixed(1)}/10
              </Text>
              <Text style={styles.moodStatLabel}>Average Mood</Text>
            </Surface>
            <Surface style={styles.moodStat}>
              <Text style={styles.moodStatNumber}>
                {analysisData.longestStreak}
              </Text>
              <Text style={styles.moodStatLabel}>Longest Streak</Text>
            </Surface>
          </View>
        </Card.Content>
      </Card>
      {/* Trigger Analysis */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialCommunityIcons name="alert-circle" size={24} color={colors.warning} />
              <Text style={styles.cardTitle}>Trigger Patterns</Text>
            </View>
          </View>
          {analysisData.mostCommonTags.length > 0 ? (
            <View style={styles.tagsContainer}>
              {analysisData.mostCommonTags.slice(0, 6).map((tag, index) => (
                <View key={index} style={styles.tagItem}>
                  <Chip
                    style={[styles.triggerChip, { opacity: 1 - (index * 0.15) }]}
                    textStyle={styles.triggerChipText}
                  >
                    {tag.tag}
                  </Chip>
                  <Text style={styles.tagCount}>{tag.count}x</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>
              No trigger patterns identified yet. Keep journaling to see insights!
            </Text>
          )}
        </Card.Content>
      </Card>
      {/* Coping Strategies Effectiveness */}
      {analysisData.copingEffectiveness && analysisData.copingEffectiveness.length > 0 && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="shield-check" size={24} color={colors.success} />
                <Text style={styles.cardTitle}>Coping Strategy Success</Text>
              </View>
            </View>
            <View style={styles.copingStrategies}>
              {analysisData.copingEffectiveness.slice(0, 5).map((strategy, index) => (
                <View key={index} style={styles.strategyItem}>
                  <View style={styles.strategyHeader}>
                    <Text style={styles.strategyName}>{strategy.strategy}</Text>
                    <Text style={styles.effectivenessScore}>
                      {(strategy.effectiveness * 100).toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${strategy.effectiveness * 100}%`,
                          backgroundColor: strategy.effectiveness > 0.7 ? colors.success :
                                         strategy.effectiveness > 0.4 ? colors.warning : colors.error
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.usageText}>Used {strategy.usage} times</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}
      {/* AI Insights & Recommendations */}
      {analysisData.recommendations && analysisData.recommendations.length > 0 && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="brain" size={24} color={colors.primary} />
                <Text style={styles.cardTitle}>AI Insights</Text>
              </View>
            </View>
            <View style={styles.recommendationsContainer}>
              {analysisData.recommendations.map((recommendation, index) => (
                <Surface key={index} style={styles.recommendationCard}>
                  <View style={styles.recommendationHeader}>
                    <MaterialCommunityIcons name="lightbulb" size={20} color={colors.accent} />
                    <Text style={styles.recommendationTitle}>Personalized Insight</Text>
                  </View>
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </Surface>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="book-plus"
          onPress={() => navigation.navigate('JournalEntry' as never)}
          style={styles.actionButton}
        >
          New Journal Entry
        </Button>
        <Button
          mode="outlined"
          icon="refresh"
          onPress={onRefresh}
          style={styles.actionButton}
        >
          Refresh Analysis
        </Button>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background},
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary},
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background},
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm},
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg},
  retryButton: {
    backgroundColor: colors.primary},
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background},
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm},
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg},
  startButton: {
    backgroundColor: colors.primary},
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md},
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs},
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary},
  overviewCard: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.md},
  sectionCard: {
    margin: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm},
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md},
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm},
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'},
  statItem: {
    alignItems: 'center'},
  statNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary},
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md},
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'},
  moodEmoji: {
    fontSize: 24,
    marginRight: spacing.sm},
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center'},
  trendText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
    textTransform: 'capitalize'},
  moodStats: {
    flexDirection: 'row',
    justifyContent: 'space-around'},
  moodStat: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    minWidth: 100},
  moodStatNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text},
  moodStatLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs},
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm},
  tagItem: {
    alignItems: 'center',
    marginBottom: spacing.sm},
  triggerChip: {
    backgroundColor: colors.warning + '20',
    borderColor: colors.warning,
    borderWidth: 1},
  triggerChipText: {
    color: colors.warning,
    fontWeight: '500'},
  tagCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '600'},
  noDataText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: spacing.lg},
  copingStrategies: {
    gap: spacing.md},
  strategyItem: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md},
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm},
  strategyName: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    flex: 1},
  effectivenessScore: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.success},
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: spacing.sm},
  progressFill: {
    height: '100%',
    borderRadius: 3},
  usageText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary},
  recommendationsContainer: {
    gap: spacing.md},
  recommendationCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary},
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm},
  recommendationTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm},
  recommendationText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: typography.lineHeight.md},
  actionButtons: {
    padding: spacing.lg,
    gap: spacing.md},
  actionButton: {
    borderRadius: borderRadius.lg}});
export default AnalysisScreen;
