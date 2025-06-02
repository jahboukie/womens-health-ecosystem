/**
 * 🏆 ACHIEVEMENT BADGE SYSTEM
 *
 * This component creates a beautiful achievement gallery:
 * 1. Animated badge unlocking
 * 2. Rarity-based styling
 * 3. Progress indicators for locked badges
 * 4. Celebration animations
 * 5. Achievement details and descriptions
 *
 * Think of this as the trophy case for recovery milestones!
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors, spacing, typography } from '../../constants/theme';
import { Achievement, AchievementRarity, AchievementCategory } from '../../types/progress';
interface AchievementBadgesProps {
  achievements: Achievement[];
  onBadgePress?: (achievement: Achievement) => void;
  showProgress?: boolean;
}
interface BadgeItemProps {
  achievement: Achievement;
  onPress?: (achievement: Achievement) => void;
  showProgress?: boolean;
}
// 🎨 RARITY COLORS
const rarityColors = {
  [AchievementRarity.COMMON]: '#95A5A6',     // Gray
  [AchievementRarity.RARE]: '#3498DB',       // Blue
  [AchievementRarity.EPIC]: '#9B59B6',       // Purple
  [AchievementRarity.LEGENDARY]: '#F1C40F',  // Gold
};
const rarityGradients = {
  [AchievementRarity.COMMON]: ['#BDC3C7', '#95A5A6'],
  [AchievementRarity.RARE]: ['#5DADE2', '#3498DB'],
  [AchievementRarity.EPIC]: ['#BB8FCE', '#9B59B6'],
  [AchievementRarity.LEGENDARY]: ['#F7DC6F', '#F1C40F']};
// 🏆 INDIVIDUAL BADGE COMPONENT
const BadgeItem: React.FC<BadgeItemProps> = ({ achievement, onPress, showProgress = true }) => {
  const scaleAnimation = useRef(new Animated.Value(achievement.isUnlocked ? 1 : 0.8)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  // 🎬 UNLOCK ANIMATION
  useEffect(() => {
    if (achievement.isUnlocked) {
      // Scale up animation
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true}).start();
      // Glow effect for unlocked badges
      const glowSequence = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true}),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true}),
        ])
      );
      glowSequence.start();
    }
  }, [achievement.isUnlocked]);
  // 🎯 PRESS ANIMATION
  const handlePress = () => {
    // Shake animation for locked badges
    if (!achievement.isUnlocked) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true}),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true}),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true}),
      ]).start();
    }
    onPress?.(achievement);
  };
  // 🎨 DYNAMIC STYLES
  const badgeColor = rarityColors[achievement.rarity];
  const isLocked = !achievement.isUnlocked;
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.badgeContainer,
          {
            transform: [
              { scale: scaleAnimation },
              { translateX: shakeAnimation },
            ],
            opacity: isLocked ? 0.4 : 1},
        ]}
      >
        {/* 🌟 GLOW EFFECT */}
        {achievement.isUnlocked && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnimation,
                backgroundColor: badgeColor},
            ]}
          />
        )}
        {/* 🏆 BADGE CONTENT */}
        <View style={[styles.badge, { borderColor: badgeColor }]}>
          <Text style={styles.badgeIcon}>{achievement.icon}</Text>
          {/* 🔒 LOCK OVERLAY */}
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </View>
        {/* 📝 BADGE INFO */}
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeTitle} numberOfLines={2}>
            {achievement.title}
          </Text>
          <Text style={styles.badgeRarity}>
            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
          </Text>
          {/* 📅 UNLOCK DATE */}
          {achievement.isUnlocked && achievement.unlockedAt && (
            <Text style={styles.unlockDate}>
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
// 🏆 MAIN ACHIEVEMENT BADGES COMPONENT
export const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  achievements,
  onBadgePress,
  showProgress = true}) => {
  // 📊 ACHIEVEMENT STATS
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
  // 🏆 GROUP BY CATEGORY
  const groupedAchievements = achievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {} as Record<AchievementCategory, Achievement[]>);
  // 🎨 CATEGORY ICONS
  const categoryIcons = {
    [AchievementCategory.SOBRIETY]: '🎯',
    [AchievementCategory.MOOD]: '😊',
    [AchievementCategory.ENGAGEMENT]: '💬',
    [AchievementCategory.MILESTONES]: '🏁',
    [AchievementCategory.SPECIAL]: '⭐'};
  const categoryNames = {
    [AchievementCategory.SOBRIETY]: 'Sobriety',
    [AchievementCategory.MOOD]: 'Wellness',
    [AchievementCategory.ENGAGEMENT]: 'Engagement',
    [AchievementCategory.MILESTONES]: 'Milestones',
    [AchievementCategory.SPECIAL]: 'Special'};
  return (
    <Card style={styles.container}>
      {/* 📊 HEADER WITH PROGRESS */}
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Achievements</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {unlockedCount} of {totalCount} unlocked ({Math.round(progressPercentage)}%)
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` }
              ]}
            />
          </View>
        </View>
      </View>
      {/* 🏆 ACHIEVEMENT CATEGORIES */}
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
        <View key={category} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryIcon}>
              {categoryIcons[category as AchievementCategory]}
            </Text>
            <Text style={styles.categoryTitle}>
              {categoryNames[category as AchievementCategory]}
            </Text>
            <Text style={styles.categoryCount}>
              {categoryAchievements.filter(a => a.isUnlocked).length}/{categoryAchievements.length}
            </Text>
          </View>
          <FlatList
            data={categoryAchievements}
            style={styles.grid}
            numColumns={4}
            renderItem={({ item }) => (
              <View style={styles.gridItem}>
                <BadgeItem
                  achievement={item}
                  onPress={onBadgePress}
                  showProgress={showProgress}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      ))}
      {/* 🎯 NEXT ACHIEVEMENT HINT */}
      {achievements.length > 0 && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintTitle}>💡 Next Achievement</Text>
          <Text style={styles.hintText}>
            Keep up your daily check-ins to unlock more badges!
          </Text>
        </View>
      )}
    </Card>
  );
};
// 🎨 STYLES
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
    elevation: 4,
    borderRadius: 16},
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
    borderBottomOpacity: 0.1},
  title: {
    ...typography.headline6,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.md},
  progressContainer: {
    alignItems: 'center'},
  progressText: {
    ...typography.body2,
    color: colors.onSurface,
    marginBottom: spacing.xs},
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden'},
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4},
  categorySection: {
    padding: spacing.lg,
    paddingTop: spacing.md},
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md},
  categoryIcon: {
    fontSize: 20,
    marginRight: spacing.sm},
  categoryTitle: {
    ...typography.subtitle1,
    color: colors.onSurface,
    flex: 1},
  categoryCount: {
    ...typography.caption,
    color: colors.onSurface,
    opacity: 0.7},
  grid: {
    flex: 1},
  gridItem: {
    flex: 1,
    alignItems: 'center',
    margin: spacing.xs},
  badgeContainer: {
    alignItems: 'center',
    padding: spacing.xs},
  glowEffect: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 50,
    opacity: 0.3},
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    elevation: 2},
  badgeIcon: {
    fontSize: 24},
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'},
  lockIcon: {
    fontSize: 20},
  badgeInfo: {
    alignItems: 'center',
    width: 80},
  badgeTitle: {
    ...typography.caption,
    color: colors.onSurface,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 12},
  badgeRarity: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 8,
    marginTop: 2},
  unlockDate: {
    ...typography.caption,
    color: colors.onSurface,
    opacity: 0.5,
    fontSize: 8,
    marginTop: 2},
  hintContainer: {
    backgroundColor: colors.primaryContainer,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: 12},
  hintTitle: {
    ...typography.subtitle2,
    color: colors.onPrimaryContainer,
    marginBottom: spacing.xs},
  hintText: {
    ...typography.body2,
    color: colors.onPrimaryContainer,
    lineHeight: 20}});
export default AchievementBadges;
/**
 * 🎓 ACHIEVEMENT BADGE FEATURES:
 *
 * 1. **Rarity System** - Common, Rare, Epic, Legendary with unique styling
 * 2. **Unlock Animations** - Satisfying scale and glow effects
 * 3. **Category Organization** - Grouped by achievement type
 * 4. **Progress Tracking** - Visual progress bars and counters
 * 5. **Interactive Elements** - Tap for details, shake for locked badges
 *
 * 🎮 GAMIFICATION PSYCHOLOGY:
 * - Visual progress creates sense of accomplishment
 * - Rarity system adds excitement and value
 * - Locked badges create anticipation and goals
 * - Categories provide clear achievement paths
 * - Animations make unlocking feel rewarding
 *
 * 🏥 THERAPEUTIC VALUE:
 * - Achievement recognition builds self-esteem
 * - Progress visualization motivates continued effort
 * - Milestone celebration reinforces positive behaviors
 * - Goal-oriented structure supports recovery planning
 * - Social sharing potential builds community support
 */
