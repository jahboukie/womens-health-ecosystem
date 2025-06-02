/**
 * 📊 PROGRESS DATA MODELS
 * 
 * This file defines all data structures for the progress dashboard:
 * 1. Sobriety tracking metrics
 * 2. Mood and emotional progress
 * 3. Achievement and milestone system
 * 4. Goal setting and completion
 * 5. Analytics and insights
 * 
 * Think of this as the blueprint for measuring recovery success!
 */
// 🎯 CORE PROGRESS METRICS
export interface ProgressMetrics {
  userId: string;
  sobrietyStartDate: Date;
  currentStreak: number; // Days sober
  longestStreak: number; // Personal best
  totalDaysSober: number; // Lifetime total
  lastUpdated: Date;
}
// 😊 MOOD TRACKING
export interface MoodEntry {
  id: string;
  userId: string;
  date: Date;
  mood: MoodLevel;
  energy: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  motivation: number; // 1-10 scale
  notes?: string;
  triggers?: string[];
  copingStrategies?: string[];
}
export enum MoodLevel {
  VERY_LOW = 1,
  LOW = 2,
  NEUTRAL = 3,
  GOOD = 4,
  EXCELLENT = 5}
export const MoodLabels = {
  [MoodLevel.VERY_LOW]: 'Very Low',
  [MoodLevel.LOW]: 'Low',
  [MoodLevel.NEUTRAL]: 'Neutral',
  [MoodLevel.GOOD]: 'Good',
  [MoodLevel.EXCELLENT]: 'Excellent'};
export const MoodEmojis = {
  [MoodLevel.VERY_LOW]: '😢',
  [MoodLevel.LOW]: '😔',
  [MoodLevel.NEUTRAL]: '😐',
  [MoodLevel.GOOD]: '😊',
  [MoodLevel.EXCELLENT]: '🤩'};
// 🏆 ACHIEVEMENT SYSTEM
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: AchievementRequirement;
  unlockedAt?: Date;
  isUnlocked: boolean;
  rarity: AchievementRarity;
}
export enum AchievementCategory {
  SOBRIETY = 'sobriety',
  MOOD = 'mood',
  ENGAGEMENT = 'engagement',
  MILESTONES = 'milestones',
  SPECIAL = 'special'}
export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'}
export interface AchievementRequirement {
  type: 'streak' | 'mood_average' | 'chat_sessions' | 'check_ins' | 'custom';
  value: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
}
// 🎯 GOAL SYSTEM
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string; // 'days', 'sessions', 'points', etc.
  deadline?: Date;
  createdAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
  priority: GoalPriority;
}
export enum GoalCategory {
  SOBRIETY = 'sobriety',
  WELLNESS = 'wellness',
  THERAPY = 'therapy',
  LIFESTYLE = 'lifestyle',
  PERSONAL = 'personal'}
export enum GoalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'}
// 📈 ANALYTICS AND INSIGHTS
export interface ProgressInsight {
  id: string;
  type: InsightType;
  title: string;
  message: string;
  data: any;
  importance: InsightImportance;
  actionable: boolean;
  actionText?: string;
  generatedAt: Date;
}
export enum InsightType {
  TREND_POSITIVE = 'trend_positive',
  TREND_NEGATIVE = 'trend_negative',
  MILESTONE_APPROACHING = 'milestone_approaching',
  PATTERN_DETECTED = 'pattern_detected',
  RECOMMENDATION = 'recommendation',
  CELEBRATION = 'celebration'}
export enum InsightImportance {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'}
// 📊 DASHBOARD DATA
export interface DashboardData {
  metrics: ProgressMetrics;
  recentMoods: MoodEntry[];
  achievements: Achievement[];
  activeGoals: Goal[];
  insights: ProgressInsight[];
  weeklyStats: WeeklyStats;
  monthlyStats: MonthlyStats;
}
export interface WeeklyStats {
  week: string; // ISO week string
  averageMood: number;
  checkInCount: number;
  chatSessions: number;
  goalsCompleted: number;
  streakMaintained: boolean;
}
export interface MonthlyStats {
  month: string; // YYYY-MM format
  averageMood: number;
  totalCheckIns: number;
  totalChatSessions: number;
  goalsCompleted: number;
  achievementsUnlocked: number;
  streakDays: number;
}
// 🎨 CHART DATA STRUCTURES
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}
export interface MoodChartData {
  labels: string[];
  datasets: [{
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }];
}
export interface ProgressChartData {
  labels: string[];
  data: number[];
  colors?: string[];
}
// 🎮 GAMIFICATION ELEMENTS
export interface UserLevel {
  level: number;
  title: string;
  xp: number;
  xpToNext: number;
  totalXp: number;
  benefits: string[];
}
export interface XPSource {
  action: string;
  points: number;
  description: string;
}
// 📱 UI STATE
export interface ProgressUIState {
  selectedTimeframe: 'week' | 'month' | 'quarter' | 'year';
  selectedMetric: 'mood' | 'energy' | 'anxiety' | 'motivation';
  showAchievements: boolean;
  showGoals: boolean;
  showInsights: boolean;
  isLoading: boolean;
  error?: string;
}
/**
 * 🎓 PROGRESS TRACKING PRINCIPLES:
 * 
 * 1. **Comprehensive Metrics** - Track all aspects of recovery
 * 2. **Positive Reinforcement** - Focus on achievements and progress
 * 3. **Actionable Insights** - Provide meaningful recommendations
 * 4. **Gamification** - Make progress tracking engaging and fun
 * 5. **Privacy First** - All data encrypted and user-controlled
 * 
 * 🏥 THERAPEUTIC VALUE:
 * - Visual progress builds motivation and confidence
 * - Pattern recognition helps identify triggers and coping strategies
 * - Goal setting provides structure and direction
 * - Achievement system celebrates milestones and builds self-esteem
 * - Data insights support evidence-based recovery decisions
 * 
 * 📊 DATA VISUALIZATION:
 * - Beautiful charts make data engaging and understandable
 * - Animations provide satisfying feedback for progress
 * - Color coding conveys emotional and progress states
 * - Interactive elements encourage exploration and engagement
 * - Responsive design ensures accessibility across devices
 */
