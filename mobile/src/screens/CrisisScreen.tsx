import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadCrisisResources } from '../store/slices/crisisSlice';
import { colors, spacing, typography, componentStyles } from '../constants/theme';

const CrisisScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { resources } = useSelector((state: RootState) => state.crisis);

  useEffect(() => {
    dispatch(loadCrisisResources({}));
  }, [dispatch]);

  const handleCall = (phoneNumber: string) => {
    Alert.alert(
      'Call Crisis Support',
      `Are you sure you want to call ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${phoneNumber}`)
        },
      ]
    );
  };

  const handleText = (number: string, message: string) => {
    Linking.openURL(`sms:${number}&body=${encodeURIComponent(message)}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="shield-check"
          size={48}
          color={colors.crisis}
        />
        <Text style={styles.title}>Crisis Support</Text>
        <Text style={styles.subtitle}>
          You're not alone. Help is available 24/7.
        </Text>
      </View>

      {/* Emergency Actions */}
      <View style={styles.emergencySection}>
        <Text style={styles.sectionTitle}>Immediate Help</Text>

        <Button
          mode="contained"
          buttonColor={colors.crisis}
          textColor={colors.textInverse}
          icon="phone"
          style={styles.emergencyButton}
          onPress={() => handleCall('988')}
        >
          Call 988 - Suicide & Crisis Lifeline
        </Button>

        <Button
          mode="contained"
          buttonColor={colors.crisis}
          textColor={colors.textInverse}
          icon="message-text"
          style={styles.emergencyButton}
          onPress={() => handleText('741741', 'HELLO')}
        >
          Text 741741 - Crisis Text Line
        </Button>

        <Button
          mode="outlined"
          buttonColor="transparent"
          textColor={colors.crisis}
          icon="phone-alert"
          style={styles.emergencyButton}
          onPress={() => handleCall('911')}
        >
          Call 911 - Emergency Services
        </Button>
      </View>

      {/* Crisis Resources */}
      <View style={styles.resourcesSection}>
        <Text style={styles.sectionTitle}>Crisis Resources</Text>

        {resources.map((resource, index) => (
          <Card key={index} style={styles.resourceCard}>
            <Card.Content>
              <View style={styles.resourceHeader}>
                <MaterialCommunityIcons
                  name={
                    resource.type === 'hotline' ? 'phone' :
                    resource.type === 'text' ? 'message' :
                    resource.type === 'chat' ? 'chat' :
                    'help-circle'
                  }
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.resourceName}>{resource.name}</Text>
              </View>

              <Text style={styles.resourceDescription}>
                {resource.description}
              </Text>

              <Text style={styles.resourceAvailability}>
                Available: {resource.availability}
              </Text>

              <Button
                mode="outlined"
                onPress={() => {
                  if (resource.type === 'hotline' || resource.type === 'emergency') {
                    handleCall(resource.contact);
                  } else if (resource.type === 'text') {
                    handleText(resource.contact, 'HELLO');
                  } else {
                    // For chat or other types, you might open a web URL
                    console.log('Contact:', resource.contact);
                  }
                }}
                style={styles.contactButton}
              >
                Contact: {resource.contact}
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Safety Reminders */}
      <Card style={styles.safetyCard}>
        <Card.Content>
          <View style={styles.safetyHeader}>
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={colors.info}
            />
            <Text style={styles.safetyTitle}>Remember</Text>
          </View>

          <Text style={styles.safetyText}>
            • You are not alone in this struggle{'\n'}
            • Crisis feelings are temporary{'\n'}
            • Help is always available{'\n'}
            • Your life has value and meaning{'\n'}
            • Recovery is possible
          </Text>
        </Card.Content>
      </Card>

      {/* Coping Strategies */}
      <Card style={styles.copingCard}>
        <Card.Content>
          <View style={styles.copingHeader}>
            <MaterialCommunityIcons
              name="heart-pulse"
              size={24}
              color={colors.secondary}
            />
            <Text style={styles.copingTitle}>Quick Coping Strategies</Text>
          </View>

          <Text style={styles.copingText}>
            • Take 5 deep breaths{'\n'}
            • Call a trusted friend or family member{'\n'}
            • Go to a safe, public place{'\n'}
            • Use grounding techniques (5-4-3-2-1){'\n'}
            • Listen to calming music{'\n'}
            • Write down your feelings
          </Text>
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
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.crisis,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  emergencySection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  emergencyButton: {
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  resourcesSection: {
    marginBottom: spacing.xl,
  },
  resourceCard: {
    marginBottom: spacing.md,
    ...componentStyles.card.default,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resourceName: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  resourceDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  resourceAvailability: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  contactButton: {
    alignSelf: 'flex-start',
  },
  safetyCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.info + '10',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  safetyTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  safetyText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: typography.lineHeight.sm,
  },
  copingCard: {
    backgroundColor: colors.secondary + '10',
  },
  copingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  copingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  copingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: typography.lineHeight.sm,
  },
});

export default CrisisScreen;
