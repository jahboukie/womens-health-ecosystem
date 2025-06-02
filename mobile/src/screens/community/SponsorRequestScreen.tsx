import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  TextInput, 
  RadioButton, 
  Switch,
  ActivityIndicator 
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';

import { colors, spacing, typography } from '../../constants/theme';
import { communityService } from '../../services/communityService';

type RouteProp = { params: { sponsorId: string } };

const SponsorRequestScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp>();
  const { sponsorId } = route.params;

  const [relationshipType, setRelationshipType] = useState<'primary' | 'backup' | 'peer'>('primary');
  const [message, setMessage] = useState('');
  const [shareJournalInsights, setShareJournalInsights] = useState(false);
  const [shareMilestones, setShareMilestones] = useState(true);
  const [shareProgressData, setShareProgressData] = useState(false);
  const [allowDirectMessages, setAllowDirectMessages] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await communityService.requestSponsor(sponsorId, {
        relationshipType,
        message: message.trim() || undefined,
        privacySettings: {
          shareJournalInsights,
          shareMilestones,
          shareProgressData,
          allowDirectMessages,
        },
      });

      Alert.alert(
        'Request Sent!',
        'Your sponsor request has been sent. You\'ll be notified when they respond.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Failed to send sponsor request:', error);
      Alert.alert('Error', 'Failed to send sponsor request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Request Sponsor Relationship</Text>
          
          <Text style={styles.sectionTitle}>Relationship Type</Text>
          <RadioButton.Group 
            onValueChange={value => setRelationshipType(value as any)} 
            value={relationshipType}
          >
            <View style={styles.radioItem}>
              <RadioButton value="primary" />
              <View style={styles.radioContent}>
                <Text style={styles.radioTitle}>Primary Sponsor</Text>
                <Text style={styles.radioDescription}>
                  Your main sponsor for regular check-ins and guidance
                </Text>
              </View>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="backup" />
              <View style={styles.radioContent}>
                <Text style={styles.radioTitle}>Backup Sponsor</Text>
                <Text style={styles.radioDescription}>
                  Additional support when your primary sponsor is unavailable
                </Text>
              </View>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="peer" />
              <View style={styles.radioContent}>
                <Text style={styles.radioTitle}>Peer Support</Text>
                <Text style={styles.radioDescription}>
                  Mutual support and accountability partnership
                </Text>
              </View>
            </View>
          </RadioButton.Group>

          <Text style={styles.sectionTitle}>Personal Message (Optional)</Text>
          <TextInput
            mode="outlined"
            placeholder="Tell them why you'd like them as your sponsor..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={styles.messageInput}
          />

          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.switchContent}>
              <Text style={styles.switchTitle}>Share Journal Insights</Text>
              <Text style={styles.switchDescription}>
                Allow sponsor to see AI analysis of your journal entries
              </Text>
            </View>
            <Switch
              value={shareJournalInsights}
              onValueChange={setShareJournalInsights}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchContent}>
              <Text style={styles.switchTitle}>Share Milestones</Text>
              <Text style={styles.switchDescription}>
                Automatically share recovery milestones and achievements
              </Text>
            </View>
            <Switch
              value={shareMilestones}
              onValueChange={setShareMilestones}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchContent}>
              <Text style={styles.switchTitle}>Share Progress Data</Text>
              <Text style={styles.switchDescription}>
                Share mood trends and progress statistics
              </Text>
            </View>
            <Switch
              value={shareProgressData}
              onValueChange={setShareProgressData}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchContent}>
              <Text style={styles.switchTitle}>Allow Direct Messages</Text>
              <Text style={styles.switchDescription}>
                Enable private messaging with this sponsor
              </Text>
            </View>
            <Switch
              value={allowDirectMessages}
              onValueChange={setAllowDirectMessages}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              'Send Request'
            )}
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
  card: {
    elevation: 2,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  radioContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  radioTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  radioDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  messageInput: {
    marginBottom: spacing.md,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  switchContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  switchDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
});

export default SponsorRequestScreen;
