import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Chip, Searchbar, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, typography } from '../../constants/theme';
import { CommunityStackParamList } from '../../navigation/CommunityNavigator';
import { communityService, CommunityGroup } from '../../services/communityService';

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'GroupList'>;

const GroupListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const groupTypes = ['support', 'topic', 'milestone', 'location'];

  useEffect(() => {
    loadGroups();
  }, [selectedType]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await communityService.getCommunityGroups(selectedType || undefined);
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
      // Show mock data for demo
      setGroups([
        {
          id: '1',
          name: 'Daily Check-ins',
          description: 'Share your daily progress and challenges with supportive peers',
          groupType: 'support',
          privacyLevel: 'public',
          guidelines: 'Be respectful, supportive, and honest',
          moderatorId: 'mod1',
          isActive: true,
          memberCount: 24,
          isUserMember: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Mindfulness & Meditation',
          description: 'Explore mindfulness practices and meditation techniques for recovery',
          groupType: 'topic',
          privacyLevel: 'public',
          guidelines: 'Focus on mindfulness and meditation topics',
          moderatorId: 'mod2',
          isActive: true,
          memberCount: 18,
          isUserMember: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: '30-Day Milestone Club',
          description: 'Celebrate and support those reaching their 30-day milestone',
          groupType: 'milestone',
          privacyLevel: 'private',
          guidelines: 'Share milestone achievements and encouragement',
          moderatorId: 'mod3',
          isActive: true,
          memberCount: 12,
          isUserMember: false,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderGroup = ({ item }: { item: CommunityGroup }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
    >
      <Card style={styles.groupCard}>
        <Card.Content>
          <View style={styles.groupHeader}>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{item.name}</Text>
              <View style={styles.groupMeta}>
                <Chip
                  mode="outlined"
                  compact
                  style={styles.typeChip}
                  textStyle={styles.chipText}
                >
                  {item.groupType}
                </Chip>
                <Chip
                  mode="outlined"
                  compact
                  style={[styles.privacyChip, { backgroundColor: item.privacyLevel === 'public' ? colors.success : colors.warning }]}
                  textStyle={[styles.chipText, { color: 'white' }]}
                >
                  {item.privacyLevel}
                </Chip>
              </View>
            </View>
            <View style={styles.memberCount}>
              <MaterialCommunityIcons name="account-group" size={16} color={colors.textSecondary} />
              <Text style={styles.memberCountText}>{item.memberCount}</Text>
            </View>
          </View>

          <Text style={styles.groupDescription}>{item.description}</Text>

          <View style={styles.groupActions}>
            {item.isUserMember ? (
              <Button mode="contained" compact style={styles.actionButton}>
                View Group
              </Button>
            ) : (
              <Button mode="outlined" compact style={styles.actionButton}>
                Join Group
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading support groups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search groups..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={groupTypes}
          renderItem={({ item }) => (
            <Chip
              mode={selectedType === item ? 'flat' : 'outlined'}
              selected={selectedType === item}
              onPress={() => setSelectedType(selectedType === item ? null : item)}
              style={styles.filterChip}
            >
              {item}
            </Chip>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={groups.filter(group =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.description.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        style={styles.groupsList}
        contentContainerStyle={styles.groupsListContent}
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
  searchBar: {
    margin: spacing.md,
    elevation: 2,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  filterList: {
    paddingHorizontal: spacing.xs,
  },
  filterChip: {
    marginRight: spacing.sm,
  },
  groupsList: {
    flex: 1,
  },
  groupsListContent: {
    padding: spacing.md,
  },
  groupCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  groupMeta: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  typeChip: {
    height: 24,
  },
  privacyChip: {
    height: 24,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  memberCountText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  groupDescription: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  groupActions: {
    alignItems: 'flex-end',
  },
  actionButton: {
    minWidth: 100,
  },
});

export default GroupListScreen;
