import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const JournalListScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleCreateEntry = () => {
    (navigation as any).navigate('JournalEntry', { entryId: undefined });
  };

  const handleViewAnalysis = () => {
    (navigation as any).navigate('JournalAnalysis');
  };

  return (
    <View style={styles.container}>
      {/* Beautiful Empty State */}
      <View style={styles.emptyState}>
        <MaterialCommunityIcons
          name="book-open-variant"
          size={80}
          color={colors.primary}
        />
        <Text style={styles.emptyTitle}>Start Your Journal Journey</Text>
        <Text style={styles.emptySubtitle}>
          Capture your thoughts, track your mood, and reflect on your recovery progress.
          Your first entry is just a tap away.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleCreateEntry}
            style={styles.emptyButton}
            contentStyle={styles.emptyButtonContent}
          >
            Write Your First Entry
          </Button>

          <Button
            mode="outlined"
            onPress={handleViewAnalysis}
            style={styles.analysisButton}
            contentStyle={styles.emptyButtonContent}
            icon="chart-line"
          >
            View AI Analysis
          </Button>
        </View>
      </View>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateEntry}
        label="New Entry"
        color={colors.textInverse}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  emptyButtonContent: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonContainer: {
    gap: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  analysisButton: {
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
});

export default JournalListScreen;
