import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Security,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Settings,
  People,
  Integration,
  CloudSync,
  ExpandMore,
  ContentCopy,
  Download,
  Upload,
  TestTube,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)<{ status: 'active' | 'inactive' | 'error' | 'testing' }>(({ status, theme }) => ({
  ...(status === 'active' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  }),
  ...(status === 'inactive' && {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[700],
  }),
  ...(status === 'error' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  }),
  ...(status === 'testing' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.contrastText,
  }),
}));

interface SSOProvider {
  id: string;
  name: string;
  type: 'SAML' | 'OAUTH' | 'LDAP' | 'ACTIVE_DIRECTORY';
  status: 'active' | 'inactive' | 'error' | 'testing';
  configured: boolean;
  lastSync?: Date;
  userCount?: number;
  errorMessage?: string;
}

interface SSOConfiguration {
  saml: {
    entryPoint: string;
    issuer: string;
    cert: string;
    callbackUrl: string;
    signatureAlgorithm: string;
  };
  oauth: {
    clientId: string;
    clientSecret: string;
    authorizationURL: string;
    tokenURL: string;
    callbackURL: string;
  };
  activeDirectory: {
    url: string;
    bindDN: string;
    bindCredentials: string;
    searchBase: string;
    domain: string;
  };
}

const SSOConfigurationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [providers, setProviders] = useState<SSOProvider[]>([
    {
      id: 'saml',
      name: 'SAML 2.0',
      type: 'SAML',
      status: 'inactive',
      configured: false,
    },
    {
      id: 'oauth',
      name: 'OAuth 2.0 / OpenID Connect',
      type: 'OAUTH',
      status: 'inactive',
      configured: false,
    },
    {
      id: 'ad',
      name: 'Active Directory',
      type: 'ACTIVE_DIRECTORY',
      status: 'active',
      configured: true,
      lastSync: new Date(),
      userCount: 1247,
    },
    {
      id: 'ldap',
      name: 'LDAP',
      type: 'LDAP',
      status: 'inactive',
      configured: false,
    },
  ]);

  const [configuration, setConfiguration] = useState<SSOConfiguration>({
    saml: {
      entryPoint: '',
      issuer: '',
      cert: '',
      callbackUrl: 'https://api.soberpal.com/api/sso/saml/callback',
      signatureAlgorithm: 'sha256',
    },
    oauth: {
      clientId: '',
      clientSecret: '',
      authorizationURL: '',
      tokenURL: '',
      callbackURL: 'https://api.soberpal.com/api/sso/oauth/callback',
    },
    activeDirectory: {
      url: 'ldap://dc.company.com:389',
      bindDN: 'CN=SoberPal Service,OU=Service Accounts,DC=company,DC=com',
      bindCredentials: '',
      searchBase: 'OU=Users,DC=company,DC=com',
      domain: 'company.com',
    },
  });

  const handleConfigurationSave = async (providerType: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sso/configure/${providerType.toLowerCase()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configuration[providerType.toLowerCase() as keyof SSOConfiguration]),
      });

      if (response.ok) {
        // Update provider status
        setProviders(prev => prev.map(p => 
          p.type === providerType 
            ? { ...p, status: 'active', configured: true }
            : p
        ));
        alert('SSO configuration saved successfully!');
      } else {
        throw new Error('Configuration failed');
      }
    } catch (error) {
      console.error('Configuration save failed:', error);
      alert('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (providerId: string) => {
    setTestingProvider(providerId);
    try {
      const response = await fetch(`/api/sso/test/${providerId}`, {
        method: 'POST',
      });

      const result = await response.json();
      
      if (result.success) {
        setProviders(prev => prev.map(p => 
          p.id === providerId 
            ? { ...p, status: 'active' }
            : p
        ));
        alert('Connection test successful!');
      } else {
        setProviders(prev => prev.map(p => 
          p.id === providerId 
            ? { ...p, status: 'error', errorMessage: result.details }
            : p
        ));
        alert(`Connection test failed: ${result.details}`);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      alert('Connection test failed');
    } finally {
      setTestingProvider(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadMetadata = () => {
    const metadata = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" 
                     entityID="https://api.soberpal.com/sso/saml/your-org">
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                                Location="https://api.soberpal.com/api/sso/saml/your-org/callback"
                                index="0" isDefault="true"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;
    
    const blob = new Blob([metadata], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soberpal-saml-metadata.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🔐 Enterprise SSO Configuration
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Configure Single Sign-On for seamless enterprise authentication
        </Typography>
      </Box>

      {/* Provider Status Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 SSO Provider Status
          </Typography>
          <Grid container spacing={2}>
            {providers.map((provider) => (
              <Grid item xs={12} sm={6} md={3} key={provider.id}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {provider.name}
                  </Typography>
                  <StatusChip 
                    status={provider.status} 
                    label={provider.status.toUpperCase()}
                    sx={{ mt: 1, mb: 1 }}
                  />
                  {provider.userCount && (
                    <Typography variant="body2" color="textSecondary">
                      {provider.userCount} users
                    </Typography>
                  )}
                  {provider.lastSync && (
                    <Typography variant="caption" color="textSecondary">
                      Last sync: {provider.lastSync.toLocaleDateString()}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="🔒 SAML 2.0" />
            <Tab label="🌐 OAuth 2.0" />
            <Tab label="🏢 Active Directory" />
            <Tab label="👥 User Management" />
          </Tabs>
        </Box>

        {/* SAML Configuration */}
        {activeTab === 0 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              SAML 2.0 Configuration
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Configure SAML 2.0 for enterprise identity providers like Okta, Azure AD, or ADFS
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Identity Provider Entry Point"
                  value={configuration.saml.entryPoint}
                  onChange={(e) => setConfiguration(prev => ({
                    ...prev,
                    saml: { ...prev.saml, entryPoint: e.target.value }
                  }))}
                  placeholder="https://your-idp.com/sso/saml"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Issuer (Entity ID)"
                  value={configuration.saml.issuer}
                  onChange={(e) => setConfiguration(prev => ({
                    ...prev,
                    saml: { ...prev.saml, issuer: e.target.value }
                  }))}
                  placeholder="https://your-idp.com"
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Signature Algorithm</InputLabel>
                  <Select
                    value={configuration.saml.signatureAlgorithm}
                    onChange={(e) => setConfiguration(prev => ({
                      ...prev,
                      saml: { ...prev.saml, signatureAlgorithm: e.target.value }
                    }))}
                  >
                    <MenuItem value="sha256">SHA-256</MenuItem>
                    <MenuItem value="sha1">SHA-1</MenuItem>
                    <MenuItem value="sha512">SHA-512</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="X.509 Certificate"
                  value={configuration.saml.cert}
                  onChange={(e) => setConfiguration(prev => ({
                    ...prev,
                    saml: { ...prev.saml, cert: e.target.value }
                  }))}
                  multiline
                  rows={6}
                  placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                  margin="normal"
                />
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Service Provider Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      fullWidth
                      label="Callback URL"
                      value={configuration.saml.callbackUrl}
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                    <Button
                      onClick={() => copyToClipboard(configuration.saml.callbackUrl)}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopy />
                    </Button>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={downloadMetadata}
                    size="small"
                  >
                    Download Metadata
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleConfigurationSave('SAML')}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Save Configuration'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<TestTube />}
                onClick={() => handleTestConnection('saml')}
                disabled={testingProvider === 'saml'}
              >
                {testingProvider === 'saml' ? 'Testing...' : 'Test Connection'}
              </Button>
            </Box>
          </CardContent>
        )}

        {/* OAuth Configuration */}
        {activeTab === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              OAuth 2.0 / OpenID Connect Configuration
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Configure OAuth 2.0 for modern identity providers like Google, Microsoft, or custom OAuth servers
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Client ID"
                  value={configuration.oauth.clientId}
                  onChange={(e) => setConfiguration(prev => ({
                    ...prev,
                    oauth: { ...prev.oauth, clientId: e.target.value }
                  }))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Client Secret"
                  type="password"
                  value={configuration.oauth.clientSecret}
                  onChange={(e) => setConfiguration(prev => ({
                    ...prev,
                    oauth: { ...prev.oauth, clientSecret: e.target.value }
                  }))}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Authorization URL"
                  value={configuration.oauth.authorizationURL}
                  onChange={(e) => setConfiguration(prev => ({
                    ...prev,
                    oauth: { ...prev.oauth, authorizationURL: e.target.value }
                  }))}
                  placeholder="https://your-provider.com/oauth/authorize"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Token URL"
                  value={configuration.oauth.tokenURL}
                  onChange={(e) => setConfiguration(prev => ({
                    ...prev,
                    oauth: { ...prev.oauth, tokenURL: e.target.value }
                  }))}
                  placeholder="https://your-provider.com/oauth/token"
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleConfigurationSave('OAUTH')}
                disabled={loading}
              >
                Save Configuration
              </Button>
              <Button
                variant="outlined"
                startIcon={<TestTube />}
                onClick={() => handleTestConnection('oauth')}
              >
                Test Connection
              </Button>
            </Box>
          </CardContent>
        )}

        {/* Active Directory Configuration */}
        {activeTab === 2 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Directory Configuration
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              <strong>Active Directory is configured and running!</strong> Last sync: {new Date().toLocaleString()}
            </Alert>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Connection Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="LDAP URL"
                      value={configuration.activeDirectory.url}
                      onChange={(e) => setConfiguration(prev => ({
                        ...prev,
                        activeDirectory: { ...prev.activeDirectory, url: e.target.value }
                      }))}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Bind DN"
                      value={configuration.activeDirectory.bindDN}
                      onChange={(e) => setConfiguration(prev => ({
                        ...prev,
                        activeDirectory: { ...prev.activeDirectory, bindDN: e.target.value }
                      }))}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Search Base"
                      value={configuration.activeDirectory.searchBase}
                      onChange={(e) => setConfiguration(prev => ({
                        ...prev,
                        activeDirectory: { ...prev.activeDirectory, searchBase: e.target.value }
                      }))}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Domain"
                      value={configuration.activeDirectory.domain}
                      onChange={(e) => setConfiguration(prev => ({
                        ...prev,
                        activeDirectory: { ...prev.activeDirectory, domain: e.target.value }
                      }))}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Sync Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">1,247</Typography>
                    <Typography variant="body2">Total Users</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">1,198</Typography>
                    <Typography variant="body2">Active Users</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">49</Typography>
                    <Typography variant="body2">Pending Sync</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        )}

        {/* User Management */}
        {activeTab === 3 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                User Management & Provisioning
              </Typography>
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={() => setShowBulkImport(true)}
              >
                Bulk Import Users
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🔄 Auto-Provisioning
                    </Typography>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Enable automatic user provisioning"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Auto-assign roles based on groups"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Auto-deactivate removed users"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      👥 Role Mapping
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Domain Admins" 
                          secondary="Maps to Enterprise Admin"
                        />
                        <ListItemSecondaryAction>
                          <Chip label="Enterprise Admin" size="small" />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="HR Managers" 
                          secondary="Maps to Department Admin"
                        />
                        <ListItemSecondaryAction>
                          <Chip label="Department Admin" size="small" />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Domain Users" 
                          secondary="Maps to Standard User"
                        />
                        <ListItemSecondaryAction>
                          <Chip label="User" size="small" />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkImport} onClose={() => setShowBulkImport(false)} maxWidth="md" fullWidth>
        <DialogTitle>📤 Bulk Import Users</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Upload a CSV file with user information to bulk provision accounts
          </Alert>
          <TextField
            fullWidth
            type="file"
            inputProps={{ accept: '.csv' }}
            margin="normal"
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            CSV format: email, firstName, lastName, department, title, manager
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBulkImport(false)}>Cancel</Button>
          <Button variant="contained">Import Users</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SSOConfigurationPanel;
