import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  IconButton,
  Portal,
  Modal
} from 'react-native-paper';
// Removed slider import - using button-based mood selector instead
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { journalService } from '../../services/journalService';
import { AppDispatch } from '../../store';
interface RouteParams {
  entryId?: string;
}
const JournalEntryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { entryId } = (route.params as RouteParams) || {};
  // Form state
  const [content, setContent] = useState('');
  const [moodRating, setMoodRating] = useState(5);
  const [triggerTags, setTriggerTags] = useState<string[]>([]);
  const [copingStrategies, setCopingStrategies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Modal states
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showCopingModal, setShowCopingModal] = useState(false);
  // Predefined options
  const commonTriggers = [
    'Stress', 'Anxiety', 'Loneliness', 'Boredom', 'Anger', 'Sadness',
    'Social Pressure', 'Work', 'Relationships', 'Financial Worry',
    'Physical Pain', 'Insomnia', 'Celebration', 'Habit'
  ];
  const commonCoping = [
    'Deep Breathing', 'Meditation', 'Exercise', 'Call Support Person',
    'Journal Writing', 'Listen to Music', 'Take a Walk', 'Read',
    'Hot Bath/Shower', 'Healthy Snack', 'Prayer', 'Gratitude Practice',
    'Creative Activity', 'Clean/Organize'
  ];
  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };
  const getMoodLabel = (mood: number) => {
    if (mood <= 2) return 'Very Low';
    if (mood <= 4) return 'Low';
    if (mood <= 6) return 'Neutral';
    if (mood <= 8) return 'Good';
    return 'Excellent';
  };
  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please write something in your journal entry.');
      return;
    }
    setIsLoading(true);
    try {
      const journalData = {
        content,
        moodRating,
        triggerTags,
        copingStrategiesUsed: copingStrategies, // Map to correct API field name
      };
      console.log('Saving journal entry:', journalData);
      if (entryId) {
        // Update existing entry
        await journalService.updateJournalEntry({
          entryId,
          ...journalData});
      } else {
        // Create new entry
        await journalService.createJournalEntry(journalData);
      }
      Alert.alert(
        'Entry Saved!',
        'Your journal entry has been saved successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const toggleTag = (tag: string, list: string[], setter: (tags: string[]) => void) => {
    if (list.includes(tag)) {
      setter(list.filter(t => t !== tag));
    } else {
      setter([...list, tag]);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {entryId ? 'Edit Entry' : 'New Journal Entry'}
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>
        {/* Main Content */}
        <Card style={styles.contentCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <TextInput
              mode="outlined"
              placeholder="Write about your thoughts, feelings, experiences..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
              style={styles.textInput}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />
          </Card.Content>
        </Card>
        {/* Mood Rating */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mood Rating</Text>
              <View style={styles.moodDisplay}>
                <Text style={styles.moodEmoji}>{getMoodEmoji(moodRating)}</Text>
                <Text style={styles.moodLabel}>{getMoodLabel(moodRating)} ({moodRating}/10)</Text>
              </View>
            </View>
            <View style={styles.moodButtonsContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                <Button
                  key={mood}
                  mode={moodRating === mood ? "contained" : "outlined"}
                  onPress={() => setMoodRating(mood)}
                  style={[
                    styles.moodButton,
                    moodRating === mood && styles.moodButtonSelected
                  ]}
                  contentStyle={styles.moodButtonContent}
                  labelStyle={[
                    styles.moodButtonLabel,
                    moodRating === mood && styles.moodButtonLabelSelected
                  ]}
                >
                  {mood}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>
        {/* Trigger Tags */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>What triggered these feelings?</Text>
              <IconButton
                icon="plus"
                size={20}
                iconColor={colors.primary}
                onPress={() => setShowTagsModal(true)}
              />
            </View>
            <View style={styles.tagsContainer}>
              {triggerTags.map((tag, index) => (
                <Chip
                  key={index}
                  style={styles.selectedChip}
                  textStyle={styles.selectedChipText}
                  onClose={() => toggleTag(tag, triggerTags, setTriggerTags)}
                  closeIcon="close"
                >
                  {tag}
                </Chip>
              ))}
              {triggerTags.length === 0 && (
                <Text style={styles.emptyText}>Tap + to add triggers</Text>
              )}
            </View>
          </Card.Content>
        </Card>
        {/* Coping Strategies */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Coping strategies used</Text>
              <IconButton
                icon="plus"
                size={20}
                iconColor={colors.primary}
                onPress={() => setShowCopingModal(true)}
              />
            </View>
            <View style={styles.tagsContainer}>
              {copingStrategies.map((strategy, index) => (
                <Chip
                  key={index}
                  style={styles.selectedChip}
                  textStyle={styles.selectedChipText}
                  onClose={() => toggleTag(strategy, copingStrategies, setCopingStrategies)}
                  closeIcon="close"
                >
                  {strategy}
                </Chip>
              ))}
              {copingStrategies.length === 0 && (
                <Text style={styles.emptyText}>Tap + to add coping strategies</Text>
              )}
            </View>
          </Card.Content>
        </Card>
        {/* Save Button */}
        <View style={styles.saveContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
          >
            {isLoading ? 'Saving...' : 'Save Entry'}
          </Button>
        </View>
      </ScrollView>
      {/* Trigger Tags Modal */}
      <Portal>
        <Modal
          visible={showTagsModal}
          onDismiss={() => setShowTagsModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Select Triggers</Text>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalTagsContainer}>
              {commonTriggers.map((trigger, index) => (
                <Chip
                  key={index}
                  style={[
                    styles.modalChip,
                    triggerTags.includes(trigger) && styles.modalChipSelected
                  ]}
                  textStyle={[
                    styles.modalChipText,
                    triggerTags.includes(trigger) && styles.modalChipTextSelected
                  ]}
                  onPress={() => toggleTag(trigger, triggerTags, setTriggerTags)}
                >
                  {trigger}
                </Chip>
              ))}
            </View>
          </ScrollView>
          <Button
            mode="contained"
            onPress={() => setShowTagsModal(false)}
            style={styles.modalButton}
          >
            Done
          </Button>
        </Modal>
      </Portal>
      {/* Coping Strategies Modal */}
      <Portal>
        <Modal
          visible={showCopingModal}
          onDismiss={() => setShowCopingModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Select Coping Strategies</Text>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalTagsContainer}>
              {commonCoping.map((strategy, index) => (
                <Chip
                  key={index}
                  style={[
                    styles.modalChip,
                    copingStrategies.includes(strategy) && styles.modalChipSelected
                  ]}
                  textStyle={[
                    styles.modalChipText,
                    copingStrategies.includes(strategy) && styles.modalChipTextSelected
                  ]}
                  onPress={() => toggleTag(strategy, copingStrategies, setCopingStrategies)}
                >
                  {strategy}
                </Chip>
              ))}
            </View>
          </ScrollView>
          <Button
            mode="contained"
            onPress={() => setShowCopingModal(false)}
            style={styles.modalButton}
          >
            Done
          </Button>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background},
  scrollView: {
    flex: 1},
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md},
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs},
  date: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary},
  contentCard: {
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
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md},
  textInput: {
    backgroundColor: colors.background,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md},
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center'},
  moodEmoji: {
    fontSize: 24,
    marginRight: spacing.sm},
  moodLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text},
  moodButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.xs},
  moodButton: {
    minWidth: 40,
    borderColor: colors.border},
  moodButtonSelected: {
    backgroundColor: colors.primary},
  moodButtonContent: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs},
  moodButtonLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text},
  moodButtonLabelSelected: {
    color: colors.textInverse,
    fontWeight: 'bold'},
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm},
  selectedChip: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
    borderWidth: 1},
  selectedChipText: {
    color: colors.primary,
    fontWeight: '500'},
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic'},
  saveContainer: {
    padding: spacing.lg,
    paddingTop: spacing.md},
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg},
  saveButtonContent: {
    paddingVertical: spacing.sm},
  modal: {
    backgroundColor: colors.background,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: '80%'},
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center'},
  modalContent: {
    maxHeight: 300},
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm},
  modalChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1},
  modalChipSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary},
  modalChipText: {
    color: colors.text},
  modalChipTextSelected: {
    color: colors.primary,
    fontWeight: '600'},
  modalButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg}});
export default JournalEntryScreen;
