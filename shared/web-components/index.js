/**
 * 🌐 SHARED WEB COMPONENTS
 * 
 * Centralized web components with integrated security
 * for the Women's Health Ecosystem
 */

// Security Components
export { default as SecurityProvider, useSecurity } from './SecurityProvider.jsx';
export { default as MFASetup } from './MFASetup.jsx';
export { default as BiometricAuth } from './BiometricAuth.jsx';
export { default as SecureForm } from './SecureForm.jsx';

// Layout Components
export { default as AppLayout } from './layouts/AppLayout.jsx';
export { default as AuthLayout } from './layouts/AuthLayout.jsx';
export { default as DashboardLayout } from './layouts/DashboardLayout.jsx';

// UI Components
export { default as Button } from './ui/Button.jsx';
export { default as Card } from './ui/Card.jsx';
export { default as Modal } from './ui/Modal.jsx';
export { default as LoadingSpinner } from './ui/LoadingSpinner.jsx';
export { default as ErrorBoundary } from './ui/ErrorBoundary.jsx';

// Form Components
export { default as Input } from './forms/Input.jsx';
export { default as Select } from './forms/Select.jsx';
export { default as Checkbox } from './forms/Checkbox.jsx';
export { default as DatePicker } from './forms/DatePicker.jsx';

// Chart Components
export { default as LineChart } from './charts/LineChart.jsx';
export { default as BarChart } from './charts/BarChart.jsx';
export { default as PieChart } from './charts/PieChart.jsx';
export { default as HealthMetricsChart } from './charts/HealthMetricsChart.jsx';

// Health-Specific Components
export { default as SymptomTracker } from './health/SymptomTracker.jsx';
export { default as MoodTracker } from './health/MoodTracker.jsx';
export { default as HealthDashboard } from './health/HealthDashboard.jsx';
export { default as AIChat } from './health/AIChat.jsx';

// Utility Components
export { default as Avatar } from './utils/Avatar.jsx';
export { default as Badge } from './utils/Badge.jsx';
export { default as Tooltip } from './utils/Tooltip.jsx';
export { default as Notification } from './utils/Notification.jsx';

// Hooks
export { default as useSecureStorage } from './hooks/useSecureStorage.js';
export { default as useEncryption } from './hooks/useEncryption.js';
export { default as useAuditLog } from './hooks/useAuditLog.js';
export { default as useHealthData } from './hooks/useHealthData.js';

// Constants and Types
export * from './constants/themes.js';
export * from './constants/colors.js';
export * from './types/index.js';
