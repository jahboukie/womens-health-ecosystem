import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Checkbox } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../store';
import { registerUser } from '../../store/slices/authSlice';
import { colors, spacing, typography, componentStyles } from '../../constants/theme';
const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToCrisis, setAgreedToCrisis] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    consent?: string;
  }>({});
  const validateForm = () => {
    const errors: typeof validationErrors = {};
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/;
    if (!password) {
      errors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    // Consent validation
    if (!agreedToTerms || !agreedToPrivacy || !agreedToCrisis) {
      errors.consent = 'Please agree to all required terms and privacy policies';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await dispatch(registerUser({
        email: email.toLowerCase().trim(),
        password,
        privacyConsent: {
          dataProcessing: agreedToPrivacy,
          aiAnalysis: agreedToPrivacy,
          crisisIntervention: agreedToCrisis},
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone})).unwrap();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Sober Pal and start your recovery journey</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            error={!!validationErrors.email}
          />
          {validationErrors.email && (
            <Text style={styles.fieldError}>{validationErrors.email}</Text>
          )}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoComplete="password-new"
            style={styles.input}
            error={!!validationErrors.password}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {validationErrors.password && (
            <Text style={styles.fieldError}>{validationErrors.password}</Text>
          )}
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            autoComplete="password-new"
            style={styles.input}
            error={!!validationErrors.confirmPassword}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          {validationErrors.confirmPassword && (
            <Text style={styles.fieldError}>{validationErrors.confirmPassword}</Text>
          )}
          <View style={styles.consentSection}>
            <Text style={styles.consentTitle}>Privacy & Consent</Text>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={agreedToTerms ? 'checked' : 'unchecked'}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              />
              <Text style={styles.checkboxLabel}>
                I agree to the Terms of Service and Privacy Policy
              </Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={agreedToPrivacy ? 'checked' : 'unchecked'}
                onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
              />
              <Text style={styles.checkboxLabel}>
                I consent to AI analysis of my data for personalized support
              </Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={agreedToCrisis ? 'checked' : 'unchecked'}
                onPress={() => setAgreedToCrisis(!agreedToCrisis)}
              />
              <Text style={styles.checkboxLabel}>
                I consent to crisis intervention features and emergency contact
              </Text>
            </View>
            {validationErrors.consent && (
              <Text style={styles.fieldError}>{validationErrors.consent}</Text>
            )}
          </View>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={styles.registerButton}
          >
            Create Account
          </Button>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            mode="text"
            onPress={navigateToLogin}
            style={styles.loginButton}
          >
            Sign In
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background},
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl},
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl},
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm},
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center'},
  form: {
    marginBottom: spacing.xl},
  input: {
    marginBottom: spacing.sm},
  fieldError: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.md,
    marginLeft: spacing.sm},
  consentSection: {
    marginVertical: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8},
  consentTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md},
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md},
  checkboxLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginLeft: spacing.sm,
    lineHeight: typography.lineHeight.sm},
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center'},
  registerButton: {
    marginTop: spacing.md,
    ...componentStyles.button.primary},
  footer: {
    alignItems: 'center'},
  footerText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm},
  loginButton: {
    // Custom styling if needed
  }});
export default RegisterScreen;
