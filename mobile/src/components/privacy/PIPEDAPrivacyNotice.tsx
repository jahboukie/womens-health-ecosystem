import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Checkbox, 
  Divider,
  Portal,
  Modal
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';
interface PIPEDAPrivacyNoticeProps {
  visible: boolean;
  onAccept: (consents: PIPEDAConsent) => void;
  onDecline: () => void;
}
export interface PIPEDAConsent {
  dataCollection: boolean;
  dataUse: boolean;
  dataSharing: boolean;
  dataRetention: boolean;
  marketingConsent: boolean;
  crossBorderTransfer: boolean;
  consentDate: Date;
  consentVersion: string;
}
const PIPEDAPrivacyNotice: React.FC<PIPEDAPrivacyNoticeProps> = ({
  visible,
  onAccept,
  onDecline}) => {
  const [consents, setConsents] = useState<Omit<PIPEDAConsent, 'consentDate' | 'consentVersion'>>({
    dataCollection: false,
    dataUse: false,
    dataSharing: false,
    dataRetention: false,
    marketingConsent: false,
    crossBorderTransfer: false});
  const handleConsentChange = (key: keyof typeof consents, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };
  const handleAccept = () => {
    const fullConsent: PIPEDAConsent = {
      ...consents,
      consentDate: new Date(),
      consentVersion: '1.0.0'};
    onAccept(fullConsent);
  };
  const canProceed = consents.dataCollection && consents.dataUse && consents.dataRetention;
  return (
    <Portal>
      <Modal visible={visible} dismissable={false} contentContainerStyle={styles.modal}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <MaterialCommunityIcons 
              name="shield-check" 
              size={48} 
              color={colors.primary} 
            />
            <Text style={styles.title}>Privacy Notice for Canadian Users</Text>
            <Text style={styles.subtitle}>
              In compliance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA)
            </Text>
          </View>
          <Card style={styles.section}>
            <Card.Content>
              <Text style={styles.sectionTitle}>🇨🇦 Your Privacy Rights in Canada</Text>
              <Text style={styles.description}>
                As a Canadian resident, you have specific rights under PIPEDA regarding your personal information:
              </Text>
              <View style={styles.rightsList}>
                <Text style={styles.rightItem}>• Right to know what personal information we collect</Text>
                <Text style={styles.rightItem}>• Right to know how we use your information</Text>
                <Text style={styles.rightItem}>• Right to access your personal information</Text>
                <Text style={styles.rightItem}>• Right to correct inaccurate information</Text>
                <Text style={styles.rightItem}>• Right to withdraw consent at any time</Text>
                <Text style={styles.rightItem}>• Right to file complaints with the Privacy Commissioner</Text>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.section}>
            <Card.Content>
              <Text style={styles.sectionTitle}>📊 Data Collection & Use</Text>
              <View style={styles.consentItem}>
                <Checkbox
                  status={consents.dataCollection ? 'checked' : 'unchecked'}
                  onPress={() => handleConsentChange('dataCollection', !consents.dataCollection)}
                />
                <View style={styles.consentText}>
                  <Text style={styles.consentTitle}>Data Collection (Required)</Text>
                  <Text style={styles.consentDescription}>
                    I consent to SoberPal collecting my health information, journal entries, mood data, and usage analytics for recovery support purposes.
                  </Text>
                </View>
              </View>
              <View style={styles.consentItem}>
                <Checkbox
                  status={consents.dataUse ? 'checked' : 'unchecked'}
                  onPress={() => handleConsentChange('dataUse', !consents.dataUse)}
                />
                <View style={styles.consentText}>
                  <Text style={styles.consentTitle}>Data Use (Required)</Text>
                  <Text style={styles.consentDescription}>
                    I consent to using my data for AI analysis, progress tracking, personalized insights, and crisis intervention when necessary.
                  </Text>
                </View>
              </View>
              <View style={styles.consentItem}>
                <Checkbox
                  status={consents.dataRetention ? 'checked' : 'unchecked'}
                  onPress={() => handleConsentChange('dataRetention', !consents.dataRetention)}
                />
                <View style={styles.consentText}>
                  <Text style={styles.consentTitle}>Data Retention (Required)</Text>
                  <Text style={styles.consentDescription}>
                    I understand my data will be retained for 7 years after account closure for legal compliance, or until I request deletion.
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.section}>
            <Card.Content>
              <Text style={styles.sectionTitle}>🤝 Optional Consents</Text>
              <View style={styles.consentItem}>
                <Checkbox
                  status={consents.dataSharing ? 'checked' : 'unchecked'}
                  onPress={() => handleConsentChange('dataSharing', !consents.dataSharing)}
                />
                <View style={styles.consentText}>
                  <Text style={styles.consentTitle}>Community Features (Optional)</Text>
                  <Text style={styles.consentDescription}>
                    I consent to sharing anonymized progress data with sponsors and support groups when I choose to participate.
                  </Text>
                </View>
              </View>
              <View style={styles.consentItem}>
                <Checkbox
                  status={consents.marketingConsent ? 'checked' : 'unchecked'}
                  onPress={() => handleConsentChange('marketingConsent', !consents.marketingConsent)}
                />
                <View style={styles.consentText}>
                  <Text style={styles.consentTitle}>Marketing Communications (Optional)</Text>
                  <Text style={styles.consentDescription}>
                    I consent to receiving recovery tips, app updates, and wellness content via email or push notifications.
                  </Text>
                </View>
              </View>
              <View style={styles.consentItem}>
                <Checkbox
                  status={consents.crossBorderTransfer ? 'checked' : 'unchecked'}
                  onPress={() => handleConsentChange('crossBorderTransfer', !consents.crossBorderTransfer)}
                />
                <View style={styles.consentText}>
                  <Text style={styles.consentTitle}>Cross-Border Data Transfer (Optional)</Text>
                  <Text style={styles.consentDescription}>
                    I consent to my data being processed in secure US data centers for AI analysis, with the same privacy protections.
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.section}>
            <Card.Content>
              <Text style={styles.sectionTitle}>📞 Privacy Officer Contact</Text>
              <Text style={styles.description}>
                For privacy questions, complaints, or to exercise your rights:
              </Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactItem}>📧 privacy@soberpal.ca</Text>
                <Text style={styles.contactItem}>📞 1-800-SOBER-CA (1-800-762-3722)</Text>
                <Text style={styles.contactItem}>📍 Privacy Officer, SoberPal Inc.</Text>
                <Text style={styles.contactItem}>   123 Recovery Street, Toronto, ON M5V 3A8</Text>
              </View>
              <Text style={styles.description}>
                You may also file complaints with the Privacy Commissioner of Canada at priv.gc.ca
              </Text>
            </Card.Content>
          </Card>
          <Divider style={styles.divider} />
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={onDecline}
              style={styles.declineButton}
            >
              Decline
            </Button>
            <Button
              mode="contained"
              onPress={handleAccept}
              disabled={!canProceed}
              style={styles.acceptButton}
            >
              Accept & Continue
            </Button>
          </View>
          <Text style={styles.footer}>
            By accepting, you acknowledge reading and understanding this privacy notice. 
            You can withdraw consent at any time through app settings.
          </Text>
        </ScrollView>
      </Modal>
    </Portal>
  );
};
const styles = StyleSheet.create({
  modal: {
    margin: spacing.md,
    maxHeight: '90%'},
  container: {
    backgroundColor: colors.background,
    borderRadius: 12},
  content: {
    padding: spacing.lg},
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl},
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm},
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20},
  section: {
    marginBottom: spacing.lg,
    elevation: 2},
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md},
  description: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md},
  rightsList: {
    marginLeft: spacing.sm},
  rightItem: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xs},
  consentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg},
  consentText: {
    flex: 1,
    marginLeft: spacing.sm},
  consentTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs},
  consentDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18},
  contactInfo: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.md},
  contactItem: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginBottom: spacing.xs},
  divider: {
    marginVertical: spacing.lg},
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md},
  declineButton: {
    flex: 1,
    marginRight: spacing.sm},
  acceptButton: {
    flex: 1,
    marginLeft: spacing.sm},
  footer: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16}});
export default PIPEDAPrivacyNotice;
