import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator} from 'react-native';
import { Text, Card, Button, List, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ApiClient } from '../../services/apiClient';
interface PrivacyOfficer {
  name: string;
  title: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  languages: string[];
  businessHours: string;
}
interface ConsentStatus {
  consentType: string;
  hasConsent: boolean;
}
interface PrivacySettingsScreenProps {
  navigation: any;
}
export default function PrivacySettingsScreen({ navigation }: PrivacySettingsScreenProps) {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [privacyOfficer, setPrivacyOfficer] = useState<PrivacyOfficer | null>(null);
  const [consentStatuses, setConsentStatuses] = useState<ConsentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadPrivacyData();
  }, []);
  const loadPrivacyData = async () => {
    try {
      // Load Privacy Officer Contact
      const officerResponse = await fetch(`${ApiClient.getBaseURL()}/privacy/officer/contact`);
      const officerData = await officerResponse.json();
      if (officerData.success) {
        setPrivacyOfficer(officerData.data);
      }
      // Load Consent Statuses (if authenticated)
      if (token) {
        const consentTypes = ['DATA_COLLECTION', 'ANALYTICS', 'MARKETING', 'RESEARCH'];
        const statuses = await Promise.all(
          consentTypes.map(async (type) => {
            try {
              const response = await fetch(`${ApiClient.getBaseURL()}/privacy/consent/${type}`, {
                headers: { Authorization: `Bearer ${token}` }});
              const data = await response.json();
              return data.success ? data.data : { consentType: type, hasConsent: false };
            } catch {
              return { consentType: type, hasConsent: false };
            }
          })
        );
        setConsentStatuses(statuses);
      }
    } catch (error) {
      console.error('Failed to load privacy data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleContactPrivacyOfficer = () => {
    if (!privacyOfficer) return;
    Alert.alert(
      '🇨🇦 Contact Privacy Officer',
      `${privacyOfficer.name}\n${privacyOfficer.title}\n\nHow would you like to contact them?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '📧 Email',
          onPress: () => Linking.openURL(`mailto:${privacyOfficer.email}`)
        },
        {
          text: '📞 Call',
          onPress: () => Linking.openURL(`tel:${privacyOfficer.phone}`)
        },
      ]
    );
  };
  const handleDataExport = async () => {
    if (!token) {
      Alert.alert('Authentication Required', 'Please log in to export your data.');
      return;
    }
    Alert.alert(
      '📦 Export Your Data',
      'This will create a complete export of all your SoberPal data. You will receive a secure download link.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export Data',
          onPress: async () => {
            try {
              const response = await fetch(`${ApiClient.getBaseURL()}/privacy/export`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }});
              const data = await response.json();
              if (data.success) {
                Alert.alert(
                  '✅ Export Created',
                  `Your data export is ready!\n\nExport ID: ${data.data.exportId}\nExpires: ${new Date(data.data.expiresAt).toLocaleDateString()}\n\n${data.data.instructions}`
                );
              } else {
                Alert.alert('Export Failed', 'Unable to create data export. Please try again.');
              }
            } catch (error) {
              Alert.alert('Export Failed', 'Network error. Please try again.');
            }
          }
        },
      ]
    );
  };
  const handlePrivacyRequest = () => {
    Alert.alert(
      '📋 Submit Privacy Request',
      'What type of privacy request would you like to submit?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Access My Data', onPress: () => submitPrivacyRequest('ACCESS') },
        { text: 'Correct My Data', onPress: () => submitPrivacyRequest('CORRECTION') },
        { text: 'Delete My Data', onPress: () => submitPrivacyRequest('DELETION') },
        { text: 'File Complaint', onPress: () => submitPrivacyRequest('COMPLAINT') },
      ]
    );
  };
  const submitPrivacyRequest = async (requestType: string) => {
    if (!token) return;
    Alert.prompt(
      'Privacy Request',
      'Please describe your request:',
      async (description) => {
        if (!description || description.length < 10) {
          Alert.alert('Invalid Request', 'Please provide a detailed description (at least 10 characters).');
          return;
        }
        try {
          const response = await fetch(`${API_BASE_URL}/privacy/request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`},
            body: JSON.stringify({
              requestType,
              description,
              priority: 'MEDIUM'})});
          const data = await response.json();
          if (data.success) {
            Alert.alert(
              '✅ Request Submitted',
              `Your privacy request has been submitted.\n\nRequest ID: ${data.data.requestId}\nResponse Deadline: ${new Date(data.data.responseDeadline).toLocaleDateString()}`
            );
          } else {
            Alert.alert('Request Failed', 'Unable to submit request. Please try again.');
          }
        } catch (error) {
          Alert.alert('Request Failed', 'Network error. Please try again.');
        }
      }
    );
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Privacy Settings...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Card style={styles.heroCard}>
        <Card.Content style={styles.heroContent}>
          <MaterialCommunityIcons
            name="shield-check"
            size={64}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.title}>🇨🇦 Privacy & PIPEDA</Text>
          <Text style={styles.subtitle}>
            Your privacy rights under Canadian law. We protect your personal information with enterprise-grade security.
          </Text>
        </Card.Content>
      </Card>
      {/* Privacy Officer Contact */}
      {privacyOfficer && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Privacy Officer</Text>
            <List.Item
              title={privacyOfficer.name}
              description={privacyOfficer.title}
              left={(props) => <List.Icon {...props} icon="account-circle" />}
            />
            <List.Item
              title="Contact Information"
              description={`${privacyOfficer.email} • ${privacyOfficer.phone}`}
              left={(props) => <List.Icon {...props} icon="phone" />}
            />
            <List.Item
              title="Languages"
              description={privacyOfficer.languages.join(', ')}
              left={(props) => <List.Icon {...props} icon="translate" />}
            />
            <List.Item
              title="Business Hours"
              description={privacyOfficer.businessHours}
              left={(props) => <List.Icon {...props} icon="clock" />}
            />
            <Button
              mode="contained"
              style={styles.contactButton}
              onPress={handleContactPrivacyOfficer}
              icon="email"
            >
              Contact Privacy Officer
            </Button>
          </Card.Content>
        </Card>
      )}
      {/* Privacy Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Your Privacy Rights</Text>
          <List.Item
            title="📦 Export My Data"
            description="Download all your SoberPal data"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleDataExport}
          />
          <List.Item
            title="📋 Submit Privacy Request"
            description="Access, correct, or delete your data"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handlePrivacyRequest}
          />
        </Card.Content>
      </Card>
      {/* Consent Status */}
      {consentStatuses.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Consent Status</Text>
            {consentStatuses.map((consent, index) => (
              <View key={index} style={styles.consentItem}>
                <Text style={styles.consentType}>
                  {consent.consentType.replace('_', ' ')}
                </Text>
                <Chip
                  mode="flat"
                  style={[
                    styles.consentChip,
                    { backgroundColor: consent.hasConsent ? colors.success : colors.error }
                  ]}
                  textStyle={{ color: 'white' }}
                >
                  {consent.hasConsent ? 'Granted' : 'Not Granted'}
                </Chip>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
      {/* PIPEDA Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>About PIPEDA</Text>
          <Text style={styles.infoText}>
            The Personal Information Protection and Electronic Documents Act (PIPEDA) is Canada's federal privacy law.
            It gives you rights over your personal information and requires organizations to protect your privacy.
          </Text>
          <Text style={styles.infoText}>
            🇨🇦 Your data is stored in Canada and protected under Canadian privacy laws.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background},
  content: {
    padding: spacing.md},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background},
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: '500'},
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
  card: {
    marginBottom: spacing.lg,
    elevation: 2},
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md},
  contactButton: {
    marginTop: spacing.md},
  consentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border},
  consentType: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: '500'},
  consentChip: {
    paddingHorizontal: spacing.sm},
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm}});
