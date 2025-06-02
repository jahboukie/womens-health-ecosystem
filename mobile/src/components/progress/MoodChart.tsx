/**
 * 📈 BEAUTIFUL MOOD CHART
 * 
 * This component creates stunning mood trend visualizations:
 * 1. Smooth line charts with gradients
 * 2. Interactive data points
 * 3. Mood emoji indicators
 * 4. Time period selection
 * 5. Trend analysis and insights
 * 
 * Think of this as the emotional journey visualizer!
 */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, Card, SegmentedButtons } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { colors, spacing, typography } from '../../constants/theme';
import { MoodEntry, MoodLevel, MoodEmojis, MoodLabels } from '../../types/progress';
interface MoodChartProps {
  moodEntries: MoodEntry[];
  timeframe?: 'week' | 'month' | 'quarter';
  onTimeframeChange?: (timeframe: 'week' | 'month' | 'quarter') => void;
}
export const MoodChart: React.FC<MoodChartProps> = ({
  moodEntries,
  timeframe = 'week',
  onTimeframeChange}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [chartData, setChartData] = useState<any>(null);
  const [insights, setInsights] = useState<string>('');
  // 📊 PROCESS MOOD DATA
  useEffect(() => {
    const processedData = processMoodData(moodEntries, selectedTimeframe);
    setChartData(processedData);
    setInsights(generateInsights(moodEntries, selectedTimeframe));
  }, [moodEntries, selectedTimeframe]);
  // 🔄 HANDLE TIMEFRAME CHANGE
  const handleTimeframeChange = (value: string) => {
    const newTimeframe = value as 'week' | 'month' | 'quarter';
    setSelectedTimeframe(newTimeframe);
    onTimeframeChange?.(newTimeframe);
  };
  // 📈 PROCESS MOOD DATA FOR CHART
  const processMoodData = (entries: MoodEntry[], period: string) => {
    if (!entries.length) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [3],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 3}]};
    }
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    // Filter by timeframe
    const now = new Date();
    const cutoffDate = new Date();
    switch (period) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
    }
    const filteredEntries = sortedEntries.filter(entry => 
      new Date(entry.date) >= cutoffDate
    );
    if (!filteredEntries.length) {
      return {
        labels: ['No Recent Data'],
        datasets: [{
          data: [3],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 3}]};
    }
    // Create labels and data points
    const labels: string[] = [];
    const moodData: number[] = [];
    const energyData: number[] = [];
    const anxietyData: number[] = [];
    filteredEntries.forEach(entry => {
      const date = new Date(entry.date);
      const label = period === 'week' 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push(label);
      moodData.push(entry.mood);
      energyData.push(entry.energy);
      anxietyData.push(10 - entry.anxiety); // Invert anxiety so higher is better
    });
    return {
      labels,
      datasets: [
        {
          data: moodData,
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Green for mood
          strokeWidth: 3},
        {
          data: energyData,
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Blue for energy
          strokeWidth: 2},
        {
          data: anxietyData,
          color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`, // Purple for calm (inverted anxiety)
          strokeWidth: 2},
      ]};
  };
  // 🧠 GENERATE INSIGHTS
  const generateInsights = (entries: MoodEntry[], period: string): string => {
    if (!entries.length) return "Start tracking your mood to see insights here! 📊";
    const recentEntries = entries.slice(-7); // Last 7 entries
    const avgMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    const avgEnergy = recentEntries.reduce((sum, entry) => sum + entry.energy, 0) / recentEntries.length;
    const avgAnxiety = recentEntries.reduce((sum, entry) => sum + entry.anxiety, 0) / recentEntries.length;
    // Trend analysis
    const firstHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
    const secondHalf = recentEntries.slice(Math.floor(recentEntries.length / 2));
    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
    const trend = secondHalfAvg > firstHalfAvg ? 'improving' : 
                  secondHalfAvg < firstHalfAvg ? 'declining' : 'stable';
    // Generate insight message
    if (avgMood >= 4) {
      return `🌟 Your mood is ${trend} and looking great! Average mood: ${avgMood.toFixed(1)}/5`;
    } else if (avgMood >= 3) {
      return `📈 Your mood is ${trend}. Keep focusing on what makes you feel good! Average: ${avgMood.toFixed(1)}/5`;
    } else {
      return `💙 Your mood is ${trend}. Remember, every day is a new opportunity. Average: ${avgMood.toFixed(1)}/5`;
    }
  };
  // 🎨 CHART CONFIGURATION
  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16},
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.primary},
    propsForBackgroundLines: {
      strokeDasharray: "5,5",
      stroke: colors.onSurface,
      strokeOpacity: 0.1}};
  const screenWidth = Dimensions.get('window').width;
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mood Trends 📈</Text>
        {/* 📅 TIMEFRAME SELECTOR */}
        <SegmentedButtons
          value={selectedTimeframe}
          onValueChange={handleTimeframeChange}
          buttons={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'quarter', label: '3 Months' },
          ]}
          style={styles.timeframeSelector}
        />
      </View>
      {/* 📊 CHART */}
      {chartData && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={chartData}
            width={Math.max(screenWidth - 40, chartData.labels.length * 60)}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={true}
            withHorizontalLines={true}
            fromZero={false}
            yAxisInterval={1}
            segments={4}
          />
        </ScrollView>
      )}
      {/* 📈 LEGEND */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(46, 204, 113, 1)' }]} />
          <Text style={styles.legendText}>Mood</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(52, 152, 219, 1)' }]} />
          <Text style={styles.legendText}>Energy</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(155, 89, 182, 1)' }]} />
          <Text style={styles.legendText}>Calm</Text>
        </View>
      </View>
      {/* 🧠 INSIGHTS */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>💡 Insights</Text>
        <Text style={styles.insightsText}>{insights}</Text>
      </View>
      {/* 😊 MOOD SCALE REFERENCE */}
      <View style={styles.moodScale}>
        <Text style={styles.moodScaleTitle}>Mood Scale:</Text>
        <View style={styles.moodScaleItems}>
          {Object.entries(MoodEmojis).map(([level, emoji]) => (
            <View key={level} style={styles.moodScaleItem}>
              <Text style={styles.moodEmoji}>{emoji}</Text>
              <Text style={styles.moodScaleText}>{level}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};
// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
    elevation: 4,
    borderRadius: 16},
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md},
  title: {
    ...typography.headline6,
    color: colors.onSurface,
    marginBottom: spacing.md,
    textAlign: 'center'},
  timeframeSelector: {
    marginBottom: spacing.sm},
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16},
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md},
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md},
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs},
  legendText: {
    ...typography.caption,
    color: colors.onSurface},
  insightsContainer: {
    backgroundColor: colors.primaryContainer,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: 12},
  insightsTitle: {
    ...typography.subtitle2,
    color: colors.onPrimaryContainer,
    marginBottom: spacing.xs},
  insightsText: {
    ...typography.body2,
    color: colors.onPrimaryContainer,
    lineHeight: 20},
  moodScale: {
    padding: spacing.lg,
    paddingTop: 0},
  moodScaleTitle: {
    ...typography.subtitle2,
    color: colors.onSurface,
    marginBottom: spacing.sm},
  moodScaleItems: {
    flexDirection: 'row',
    justifyContent: 'space-between'},
  moodScaleItem: {
    alignItems: 'center'},
  moodEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs},
  moodScaleText: {
    ...typography.caption,
    color: colors.onSurface,
    fontSize: 10}});
export default MoodChart;
/**
 * 🎓 MOOD CHART FEATURES:
 * 
 * 1. **Multi-Metric Tracking** - Mood, energy, and anxiety (as calm)
 * 2. **Interactive Timeframes** - Week, month, and quarter views
 * 3. **Trend Analysis** - Automatic insights about mood patterns
 * 4. **Beautiful Visualizations** - Smooth lines with gradients
 * 5. **Educational Elements** - Mood scale reference for context
 * 
 * 📊 DATA VISUALIZATION PRINCIPLES:
 * - Multiple metrics provide comprehensive emotional picture
 * - Color coding makes different metrics easy to distinguish
 * - Smooth curves show trends rather than just data points
 * - Interactive elements encourage exploration
 * - Insights help users understand their patterns
 * 
 * 🏥 THERAPEUTIC VALUE:
 * - Visual trends help identify patterns and triggers
 * - Progress tracking builds awareness and motivation
 * - Insights provide actionable feedback
 * - Historical data supports therapy discussions
 * - Positive trends reinforce recovery progress
 */
