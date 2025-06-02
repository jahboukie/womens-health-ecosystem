import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';
interface SupportScreenProps {
  navigation: any;
}
const SupportScreen: React.FC<SupportScreenProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.heroCard}>
        <Card.Content style={styles.heroContent}>
          <MaterialCommunityIcons
            name="account-heart"
            size={64}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.title}>Community Support</Text>
          <Text style={styles.subtitle}>
            Connect with verified sponsors, join support groups, and build meaningful relationships in recovery
          </Text>
        </Card.Content>
      </Card>
      <Card style={styles.featureCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>🤝 Sponsor Connections</Text>
          <List.Item
            title="Find Verified Sponsors"
            description="Connect with experienced sponsors who match your recovery needs"
            left={(props) => <List.Icon {...props} icon="account-star" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Community')}
          />
          <List.Item
            title="Support Groups"
            description="Join topic-based groups and connect with peers"
            left={(props) => <List.Icon {...props} icon="account-group" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Community')}
          />
          <List.Item
            title="Secure Messaging"
            description="Chat safely with sponsors and peer support network"
            left={(props) => <List.Icon {...props} icon="message-text" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Community')}
          />
        </Card.Content>
      </Card>
      <Card style={styles.featureCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>🇨🇦 Privacy & PIPEDA</Text>
          <List.Item
            title="Privacy Officer Contact"
            description="Connect with our Chief Privacy Officer for any privacy concerns"
            left={(props) => <List.Icon {...props} icon="account-tie" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('PrivacySettings')}
          />
          <List.Item
            title="Data Export & Rights"
            description="Export your data or submit privacy requests under PIPEDA"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('PrivacySettings')}
          />
          <List.Item
            title="Canadian Compliance"
            description="Your data is protected under Canadian privacy laws"
            left={(props) => <List.Icon {...props} icon="flag" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('PrivacySettings')}
          />
        </Card.Content>
      </Card>
      <Card style={styles.communityCard}>
        <Card.Content style={styles.communityContent}>
          <Text style={styles.communityTitle}>🌟 Community Hub</Text>
          <Text style={styles.communityText}>
            Connect with verified sponsors, join support groups, and build meaningful relationships in your recovery journey.
          </Text>
          <Button
            mode="contained"
            style={styles.communityButton}
            icon="account-group"
            onPress={() => navigation.navigate('Community')}
          >
            Enter Community
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background},
  content: {
    padding: spacing.md},
  heroCard: {
    marginBottom: spacing.lg,
    elevation: 2},
  heroContent: {
    alignItems: 'center',
    padding: spacing.xl},
  icon: {
    marginBottom: spacing.lg},
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center'},
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22},
  featureCard: {
    marginBottom: spacing.lg,
    elevation: 2},
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md},
  communityCard: {
    marginBottom: spacing.lg,
    elevation: 2,
    backgroundColor: colors.primaryLight},
  communityContent: {
    alignItems: 'center',
    padding: spacing.xl},
  communityTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center'},
  communityText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl},
  communityButton: {
    paddingHorizontal: spacing.lg}});
export default SupportScreen;
