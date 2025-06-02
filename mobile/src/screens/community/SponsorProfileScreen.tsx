import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { colors, spacing, typography } from '../../constants/theme';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'SponsorProfile'>;
type RouteProp = { params: { sponsorId: string } };

const SponsorProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { sponsorId } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.header}>
            <Avatar.Icon 
              size={80} 
              icon="account-star" 
              style={styles.avatar}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>Verified Sponsor</Text>
              <Text style={styles.experience}>8 years experience</Text>
              <View style={styles.reputationBadge}>
                <MaterialCommunityIcons name="star" size={16} color={colors.warning} />
                <Text style={styles.reputationScore}>95</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Specializations</Text>
          <View style={styles.specializationsContainer}>
            <Chip style={styles.chip}>Alcohol Recovery</Chip>
            <Chip style={styles.chip}>Trauma-Informed</Chip>
          </View>

          <Text style={styles.sectionTitle}>Approach</Text>
          <Text style={styles.description}>
            Compassionate, evidence-based support with focus on building healthy coping mechanisms. 
            I believe in meeting people where they are and walking alongside them on their journey.
          </Text>

          <Text style={styles.sectionTitle}>Availability</Text>
          <Text style={styles.description}>
            Weekdays 6-9 PM, Weekends flexible
          </Text>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('SponsorRequest', { sponsorId })}
            style={styles.requestButton}
          >
            Request This Sponsor
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  profileCard: {
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  headerInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  experience: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  reputationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  reputationScore: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chip: {
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
    backgroundColor: colors.primaryLight,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  requestButton: {
    marginTop: spacing.lg,
  },
});

export default SponsorProfileScreen;
