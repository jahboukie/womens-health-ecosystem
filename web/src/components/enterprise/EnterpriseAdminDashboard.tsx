import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Security,
  Analytics,
  AttachMoney,
  Warning,
  CheckCircle,
  Timeline,
  Business,
  Download,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface EnterpriseMetrics {
  userEngagement: {
    totalActiveUsers: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    retentionRates: {
      day7: number;
      day30: number;
      day90: number;
    };
  };
  recoveryTrends: {
    averageRecoveryDays: number;
    milestoneCompletionRates: Record<string, number>;
    progressTrends: {
      improving: number;
      stable: number;
      declining: number;
    };
    aiInteractionEffectiveness: number;
  };
  crisisIntervention: {
    totalCrisisEvents: number;
    averageResponseTime: number;
    resolutionRate: number;
    preventionSuccessRate: number;
  };
  costBenefit: {
    estimatedHealthcareSavings: number;
    absenteeismReduction: number;
    productivityImprovement: number;
    roiCalculation: {
      totalInvestment: number;
      totalBenefits: number;
      roi: number;
      paybackPeriod: number;
    };
  };
  wellnessScores: {
    averageWellnessScore: number;
    wellnessTrend: number;
    improvementRate: number;
  };
}

interface DashboardFilters {
  startDate: Date;
  endDate: Date;
  departments: string[];
  locations: string[];
}

const EnterpriseAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<EnterpriseMetrics | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<DashboardFilters>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    departments: [],
    locations: [],
  });

  useEffect(() => {
    loadEnterpriseMetrics();
  }, [filters]);

  const loadEnterpriseMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/enterprise/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to load enterprise metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: 'pdf' | 'excel') => {
    try {
      const response = await fetch(`/api/enterprise/reports/export?format=${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, metrics }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enterprise-report-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Enterprise Analytics...
        </Typography>
      </Box>
    );
  }

  if (!metrics) {
    return (
      <Alert severity="error">
        Failed to load enterprise metrics. Please try again.
      </Alert>
    );
  }

  const kpiCards = [
    {
      title: 'Active Users',
      value: metrics.userEngagement.totalActiveUsers.toLocaleString(),
      change: '+12%',
      icon: <People />,
      color: '#1976d2',
    },
    {
      title: 'Healthcare Savings',
      value: `$${(metrics.costBenefit.estimatedHealthcareSavings / 1000).toFixed(0)}K`,
      change: '+24%',
      icon: <AttachMoney />,
      color: '#2e7d32',
    },
    {
      title: 'Crisis Prevention',
      value: `${metrics.crisisIntervention.preventionSuccessRate.toFixed(1)}%`,
      change: '+8%',
      icon: <Security />,
      color: '#ed6c02',
    },
    {
      title: 'ROI',
      value: `${metrics.costBenefit.roiCalculation.roi.toFixed(0)}%`,
      change: '+15%',
      icon: <TrendingUp />,
      color: '#9c27b0',
    },
  ];

  const progressData = [
    { name: 'Improving', value: metrics.recoveryTrends.progressTrends.improving, color: '#4caf50' },
    { name: 'Stable', value: metrics.recoveryTrends.progressTrends.stable, color: '#ff9800' },
    { name: 'Declining', value: metrics.recoveryTrends.progressTrends.declining, color: '#f44336' },
  ];

  const engagementData = [
    { period: 'Week 1', users: 1200, sessions: 3400 },
    { period: 'Week 2', users: 1350, sessions: 3800 },
    { period: 'Week 3', users: 1420, sessions: 4100 },
    { period: 'Week 4', users: 1580, sessions: 4500 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          🏢 Enterprise Analytics Dashboard
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => exportReport('pdf')}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => exportReport('excel')}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => setFilters(prev => ({ ...prev, startDate: date || new Date() }))}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => setFilters(prev => ({ ...prev, endDate: date || new Date() }))}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Departments</InputLabel>
              <Select
                multiple
                value={filters.departments}
                onChange={(e) => setFilters(prev => ({ ...prev, departments: e.target.value as string[] }))}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="HR">Human Resources</MenuItem>
                <MenuItem value="IT">Information Technology</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button variant="contained" onClick={loadEnterpriseMetrics} fullWidth>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {kpi.value}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {kpi.change} vs last period
                    </Typography>
                  </Box>
                  <Box sx={{ color: kpi.color, fontSize: 40 }}>
                    {kpi.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="📊 Engagement Analytics" />
          <Tab label="💰 ROI & Cost Benefits" />
          <Tab label="🚨 Crisis Management" />
          <Tab label="📈 Recovery Trends" />
          <Tab label="🏢 Department Breakdown" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Engagement Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.6}
                      name="Active Users"
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stackId="2"
                      stroke="#2e7d32"
                      fill="#2e7d32"
                      fillOpacity={0.6}
                      name="Sessions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Retention Rates
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>7-Day Retention</Typography>
                    <Typography fontWeight="bold">
                      {metrics.userEngagement.retentionRates.day7.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>30-Day Retention</Typography>
                    <Typography fontWeight="bold">
                      {metrics.userEngagement.retentionRates.day30.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>90-Day Retention</Typography>
                    <Typography fontWeight="bold">
                      {metrics.userEngagement.retentionRates.day90.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💰 ROI Calculation
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h3" color="success.main" fontWeight="bold">
                    {metrics.costBenefit.roiCalculation.roi.toFixed(0)}%
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Return on Investment
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="body2">
                      Total Investment: ${metrics.costBenefit.roiCalculation.totalInvestment.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      Total Benefits: ${metrics.costBenefit.roiCalculation.totalBenefits.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      Payback Period: {metrics.costBenefit.roiCalculation.paybackPeriod.toFixed(1)} months
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💵 Cost Savings Breakdown
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Healthcare Savings</Typography>
                    <Typography fontWeight="bold" color="success.main">
                      ${(metrics.costBenefit.estimatedHealthcareSavings / 1000).toFixed(0)}K
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Absenteeism Reduction</Typography>
                    <Typography fontWeight="bold" color="success.main">
                      ${(metrics.costBenefit.absenteeismReduction / 1000).toFixed(0)}K
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Productivity Improvement</Typography>
                    <Typography fontWeight="bold" color="success.main">
                      ${(metrics.costBenefit.productivityImprovement / 1000).toFixed(0)}K
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recovery Progress Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Key Recovery Metrics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography>Average Recovery Days</Typography>
                    <Typography fontWeight="bold">
                      {metrics.recoveryTrends.averageRecoveryDays}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography>AI Effectiveness</Typography>
                    <Typography fontWeight="bold">
                      {metrics.recoveryTrends.aiInteractionEffectiveness.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Wellness Improvement</Typography>
                    <Typography fontWeight="bold" color="success.main">
                      +{metrics.wellnessScores.improvementRate.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default EnterpriseAdminDashboard;
