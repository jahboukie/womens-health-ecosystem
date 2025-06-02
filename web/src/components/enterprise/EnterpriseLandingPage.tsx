import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Business,
  TrendingUp,
  Security,
  Analytics,
  People,
  AttachMoney,
  CheckCircle,
  Star,
  Timeline,
  Shield,
  Speed,
  Integration,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
}));

const EnterpriseLandingPage: React.FC = () => {
  const features = [
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Privacy-Compliant Analytics',
      description: 'HIPAA & PIPEDA compliant analytics with zero individual identification. Get insights while protecting privacy.',
      benefits: ['Aggregated metrics only', 'Real-time dashboards', 'Custom reporting', 'Audit trails'],
    },
    {
      icon: <AttachMoney sx={{ fontSize: 40, color: '#2e7d32' }} />,
      title: 'ROI Calculation Engine',
      description: 'Quantify your wellness investment with industry-standard cost-benefit analysis and payback calculations.',
      benefits: ['Healthcare cost savings', 'Absenteeism reduction', 'Productivity metrics', 'Retention analysis'],
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#ed6c02' }} />,
      title: 'Enterprise Security',
      description: 'Bank-level security with SSO integration, role-based access, and comprehensive audit logging.',
      benefits: ['SAML 2.0 & OAuth', 'Active Directory sync', 'Multi-factor auth', 'Zero-trust architecture'],
    },
    {
      icon: <Integration sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: 'White-Label Platform',
      description: 'Fully customizable branding and deployment options that integrate seamlessly with your ecosystem.',
      benefits: ['Custom branding', 'MDM integration', 'API access', 'Bulk deployment'],
    },
  ];

  const stats = [
    { value: '94%', label: 'Employee Engagement', icon: <People /> },
    { value: '67%', label: 'Healthcare Cost Reduction', icon: <AttachMoney /> },
    { value: '89%', label: 'Crisis Prevention Rate', icon: <Security /> },
    { value: '312%', label: 'Average ROI', icon: <TrendingUp /> },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      title: 'Chief Wellness Officer',
      company: 'Fortune 500 Manufacturing',
      avatar: '/avatars/sarah.jpg',
      quote: 'SoberPal Enterprise transformed our employee wellness program. The ROI analytics alone justified the entire investment.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      title: 'VP Human Resources',
      company: 'Global Technology Corp',
      avatar: '/avatars/michael.jpg',
      quote: 'The privacy-compliant analytics give us insights we never had before, while maintaining complete employee confidentiality.',
      rating: 5,
    },
    {
      name: 'Dr. Emily Rodriguez',
      title: 'Director of Employee Health',
      company: 'Healthcare System',
      avatar: '/avatars/emily.jpg',
      quote: 'As a healthcare organization, HIPAA compliance was non-negotiable. SoberPal exceeded our security requirements.',
      rating: 5,
    },
  ];

  const complianceFeatures = [
    'HIPAA Compliant Healthcare Data',
    'PIPEDA Compliant (Canada)',
    'SOC 2 Type II Certified',
    'ISO 27001 Security Standards',
    'GDPR Ready (European Union)',
    'End-to-End Encryption',
    'Zero-Trust Architecture',
    'Comprehensive Audit Trails',
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            🏢 SoberPal Enterprise
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            The World's Most Advanced Employee Recovery & Wellness Platform
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
            Privacy-compliant analytics • Enterprise security • Proven ROI • White-label ready
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#1976d2',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Schedule Demo
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              View Analytics Demo
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCard>
                <Box sx={{ color: '#1976d2', mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {stat.label}
                </Typography>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            🚀 Enterprise-Grade Features
          </Typography>
          <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mb: 6 }}>
            Everything you need to deploy, manage, and measure employee wellness at scale
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <FeatureCard>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {feature.icon}
                      <Typography variant="h5" fontWeight="bold" sx={{ ml: 2 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                      {feature.description}
                    </Typography>
                    <List dense>
                      {feature.benefits.map((benefit, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle sx={{ fontSize: 20, color: '#2e7d32' }} />
                          </ListItemIcon>
                          <ListItemText primary={benefit} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Compliance Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          🛡️ Bulletproof Compliance & Security
        </Typography>
        <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mb: 6 }}>
          Meet the highest standards for healthcare data protection and enterprise security
        </Typography>
        
        <Grid container spacing={2}>
          {complianceFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Chip
                icon={<Shield />}
                label={feature}
                variant="outlined"
                sx={{ 
                  width: '100%', 
                  height: 48,
                  fontSize: '0.9rem',
                  '&:hover': { bgcolor: '#e3f2fd' }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            💬 What Enterprise Leaders Say
          </Typography>
          <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mb: 6 }}>
            Trusted by Fortune 500 companies and healthcare organizations worldwide
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                      "{testimonial.quote}"
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={testimonial.avatar} sx={{ mr: 2 }}>
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {testimonial.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: '#1976d2', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            🎯 Ready to Transform Your Workplace?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of employees already benefiting from SoberPal Enterprise
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#1976d2',
                px: 4,
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Schedule Enterprise Demo
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                px: 4,
                '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Download ROI Calculator
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
            💼 Enterprise pricing starts at $12/employee/month • 🎯 Volume discounts available • 🔒 HIPAA compliant
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default EnterpriseLandingPage;
