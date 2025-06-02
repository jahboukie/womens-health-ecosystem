import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { colors, spacing, typography } from '../constants/theme';
interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    // Update state with error info
    this.setState({
      error,
      errorInfo});
    // Here you would typically log the error to a crash reporting service
    // like Sentry, Crashlytics, etc.
    this.logErrorToService(error, errorInfo);
  }
  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you would send this to your error reporting service
    console.error('Error logged to service:', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString()});
  };
  handleRestart = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry, but something unexpected happened. The app has encountered an error.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details (Development Mode):</Text>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.errorText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={this.handleRestart}
                style={styles.button}
              >
                Try Again
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  // In a real app, you might want to restart the app completely
                  // or navigate to a safe screen
                  console.log('Restart app requested');
                }}
                style={styles.button}
              >
                Restart App
              </Button>
            </View>
            <Text style={styles.supportText}>
              If this problem persists, please contact our support team.
            </Text>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg},
  content: {
    maxWidth: 400,
    alignItems: 'center'},
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md},
  message: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeight.md},
  errorDetails: {
    backgroundColor: colors.surfaceDark,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    width: '100%'},
  errorTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: spacing.sm},
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs},
  actions: {
    width: '100%',
    marginBottom: spacing.lg},
  button: {
    marginBottom: spacing.sm},
  supportText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic'}});
export default ErrorBoundary;
