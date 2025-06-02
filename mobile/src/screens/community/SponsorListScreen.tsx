import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  Chip,
  Searchbar,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { colors, spacing, typography } from '../../constants/theme';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';
import { communityService, SponsorProfile } from '../../services/communityService';

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'SponsorList'>;

const SponsorListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [sponsors, setSponsors] = useState<SponsorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  const specializations = [
    'Alcohol Recovery',
    'Drug Recovery',
    'Behavioral Addiction',
    'Trauma-Informed',
    'Family Support',
    'Young Adults',
    'LGBTQ+ Friendly',
    'Faith-Based',
  ];

  useEffect(() => {
    loadSponsors();
  }, [selectedSpecialization]);

  const loadSponsors = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockSponsors: SponsorProfile[] = [
        {
          id: '1',
          profileEncrypted: 'encrypted_profile_1',
          sponsorProfile: {
            yearsOfExperience: 8,
            specializations: ['Alcohol Recovery', 'Trauma-Informed'],
            approach: 'Compassionate, evidence-based support with focus on building healthy coping mechanisms',
            availability: 'Weekdays 6-9 PM, Weekends flexible',
            credentials: ['Certified Addiction Counselor', 'Peer Recovery Specialist'],
            bio: 'I\'ve been in recovery for 10 years and sponsoring for 8. I believe in meeting people where they are and walking alongside them on their journey.',
          },
          reputationScore: 95,
          verificationStatus: 'verified',
          lastActive: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          profileEncrypted: 'encrypted_profile_2',
          sponsorProfile: {
            yearsOfExperience: 12,
            specializations: ['Drug Recovery', 'Young Adults'],
            approach: 'Structured program with regular check-ins and goal setting',
            availability: 'Daily 7-8 AM, Emergency support available',
            credentials: ['Licensed Clinical Social Worker', 'Addiction Specialist'],
            bio: 'Specializing in helping young adults navigate early recovery with practical life skills and emotional support.',
          },
          reputationScore: 98,
          verificationStatus: 'verified',
          lastActive: '2024-01-15T08:15:00Z',
        },
        {
          id: '3',
          profileEncrypted: 'encrypted_profile_3',
          sponsorProfile: {
            yearsOfExperience: 15,
            specializations: ['Behavioral Addiction', 'Family Support'],
            approach: 'Holistic approach incorporating family dynamics and behavioral change',
            availability: 'Flexible schedule, 24/7 crisis support',
            credentials: ['Licensed Marriage & Family Therapist', 'Certified Gambling Counselor'],
            bio: 'Experienced in helping individuals and families heal from various addictions with a focus on rebuilding relationships.',
          },
          reputationScore: 92,
          verificationStatus: 'verified',
          lastActive: '2024-01-14T22:45:00Z',
        },
      ];

      setSponsors(mockSponsors);
    } catch (error) {
      console.error('Failed to load sponsors:', error);
      Alert.alert('Error', 'Failed to load sponsors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSponsors();
    setRefreshing(false);
  };

  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = searchQuery === '' || 
      sponsor.sponsorProfile.specializations.some(spec => 
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      sponsor.sponsorProfile.approach.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialization = !selectedSpecialization ||
      sponsor.sponsorProfile.specializations.includes(selectedSpecialization);

    return matchesSearch && matchesSpecialization;
  });

  const renderSponsor = ({ item }: { item: SponsorProfile }) => (
    <Card style={styles.sponsorCard}>
      <Card.Content>
        <View style={styles.sponsorHeader}>
          <Avatar.Icon 
            size={60} 
            icon="account-star" 
            style={styles.sponsorAvatar}
          />
          <View style={styles.sponsorInfo}>
            <View style={styles.sponsorTitleRow}>
              <Text style={styles.sponsorName}>Verified Sponsor</Text>
              <View style={styles.reputationBadge}>
                <MaterialCommunityIcons 
                  name="star" 
                  size={16} 
                  color={colors.warning} 
                />
                <Text style={styles.reputationScore}>{item.reputationScore}</Text>
              </View>
            </View>
            <Text style={styles.experienceText}>
              {item.sponsorProfile.yearsOfExperience} years experience
            </Text>
            <Text style={styles.lastActiveText}>
              Active {new Date(item.lastActive).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.specializationsContainer}>
          {item.sponsorProfile.specializations.slice(0, 3).map((spec, index) => (
            <Chip 
              key={index} 
              style={styles.specializationChip}
              textStyle={styles.chipText}
            >
              {spec}
            </Chip>
          ))}
          {item.sponsorProfile.specializations.length > 3 && (
            <Chip style={styles.moreChip}>
              +{item.sponsorProfile.specializations.length - 3} more
            </Chip>
          )}
        </View>

        <Text style={styles.approachText} numberOfLines={2}>
          {item.sponsorProfile.approach}
        </Text>

        <View style={styles.availabilityContainer}>
          <MaterialCommunityIcons 
            name="clock-outline" 
            size={16} 
            color={colors.textSecondary} 
          />
          <Text style={styles.availabilityText}>
            {item.sponsorProfile.availability}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('SponsorProfile', { sponsorId: item.id })}
            style={styles.viewProfileButton}
          >
            View Profile
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('SponsorRequest', { sponsorId: item.id })}
            style={styles.requestButton}
          >
            Request Sponsor
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSpecializationFilter = () => (
    <View style={styles.filterContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[null, ...specializations]}
        keyExtractor={(item, index) => item || 'all'}
        renderItem={({ item }) => (
          <Chip
            selected={selectedSpecialization === item}
            onPress={() => setSelectedSpecialization(
              selectedSpecialization === item ? null : item
            )}
            style={[
              styles.filterChip,
              selectedSpecialization === item && styles.selectedFilterChip
            ]}
          >
            {item || 'All'}
          </Chip>
        )}
        contentContainerStyle={styles.filterList}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Finding verified sponsors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search specializations, approaches..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {renderSpecializationFilter()}

      <FlatList
        data={filteredSponsors}
        renderItem={renderSponsor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="account-search" 
              size={64} 
              color={colors.textSecondary} 
            />
            <Text style={styles.emptyTitle}>No sponsors found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  searchContainer: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    elevation: 2,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  filterList: {
    paddingRight: spacing.md,
  },
  filterChip: {
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  selectedFilterChip: {
    backgroundColor: colors.primary,
  },
  listContainer: {
    padding: spacing.md,
  },
  sponsorCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  sponsorHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  sponsorAvatar: {
    backgroundColor: colors.primary,
  },
  sponsorInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sponsorTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sponsorName: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  reputationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  experienceText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  lastActiveText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  specializationChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
  },
  moreChip: {
    backgroundColor: colors.surface,
  },
  approachText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  availabilityText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewProfileButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  requestButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default SponsorListScreen;
