/**
 * 🌐 ECOSYSTEM INTEGRATION FOUNDATION
 * 
 * Main entry point for ecosystem intelligence and cross-app integration
 * Enables unified data sharing, analytics, and revenue optimization
 */

import EcosystemAPI from './EcosystemAPI.js';
import ProviderAnalytics from './ProviderAnalytics.js';
import SentimentDataPipeline from './SentimentDataPipeline.js';
import PrivacyManager from './PrivacyManager.js';
import BundlePromotion from './BundlePromotion.js';

/**
 * 🚀 ECOSYSTEM INTEGRATION MANAGER
 * Orchestrates all ecosystem services and integrations
 */
class EcosystemIntegrationManager {
  constructor(config = {}) {
    this.config = {
      appSource: config.appSource || 'unknown',
      ecosystemAPI: config.ecosystemAPI || 'https://ecosystem-hub.myconfidant.health/api',
      enableAnalytics: config.enableAnalytics !== false,
      enableSentimentPipeline: config.enableSentimentPipeline !== false,
      enableBundlePromotion: config.enableBundlePromotion !== false,
      privacyLevel: config.privacyLevel || 'standard',
      ...config
    };

    // Initialize core ecosystem API
    this.ecosystemAPI = new EcosystemAPI({
      appSource: this.config.appSource,
      ecosystemAPI: this.config.ecosystemAPI
    });

    // Initialize specialized services
    this.providerAnalytics = new ProviderAnalytics(this.ecosystemAPI);
    this.sentimentPipeline = new SentimentDataPipeline(this.ecosystemAPI);
    this.privacyManager = new PrivacyManager(this.ecosystemAPI);
    this.bundlePromotion = new BundlePromotion(this.ecosystemAPI);

    // Integration status
    this.isInitialized = false;
    this.activeServices = [];
  }

  /**
   * 🚀 INITIALIZE ECOSYSTEM INTEGRATION
   * Complete setup for ecosystem intelligence
   */
  async initialize() {
    try {
      console.log('🌐 Initializing Ecosystem Integration...');

      // Initialize sentiment pipeline if enabled
      if (this.config.enableSentimentPipeline) {
        this.sentimentPipeline.initializePipeline();
        this.activeServices.push('sentimentPipeline');
      }

      this.isInitialized = true;
      
      console.log('✅ Ecosystem Integration initialized successfully');
      console.log(`🔗 Active services: ${this.activeServices.join(', ')}`);
      
      return {
        initialized: true,
        appSource: this.config.appSource,
        activeServices: this.activeServices,
        ecosystemAPI: this.config.ecosystemAPI
      };
    } catch (error) {
      console.error('❌ Ecosystem Integration initialization failed:', error);
      throw new Error(`Ecosystem initialization failed: ${error.message}`);
    }
  }

  /**
   * 🔐 AUTHENTICATE WITH ECOSYSTEM
   * Unified SSO authentication
   */
  async authenticateUser(credentials) {
    try {
      const authResult = await this.ecosystemAPI.authenticateUser(credentials);
      
      if (authResult.success) {
        console.log('✅ User authenticated with ecosystem');
        
        // Initialize user-specific services
        await this.initializeUserServices(authResult.user);
      }
      
      return authResult;
    } catch (error) {
      console.error('❌ Ecosystem authentication failed:', error);
      throw error;
    }
  }

  /**
   * 📊 SHARE DATA WITH ECOSYSTEM
   * Standardized data sharing with privacy controls
   */
  async shareData(eventData, options = {}) {
    try {
      // Check privacy consent
      const hasConsent = await this.privacyManager.checkDataSharingConsent(
        eventData.type,
        options.purpose || 'analytics'
      );

      if (!hasConsent.hasConsent) {
        return {
          shared: false,
          reason: 'User consent required',
          consentRequired: true
        };
      }

      // Apply data minimization
      const minimizedData = this.privacyManager.minimizeDataForPurpose(
        eventData,
        options.purpose || 'analytics'
      );

      // Share with ecosystem
      const shareResult = await this.ecosystemAPI.shareEcosystemData(minimizedData.minimizedData);
      
      // Process sentiment analysis if enabled
      if (this.config.enableSentimentPipeline && eventData.text) {
        await this.sentimentPipeline.analyzeConversation(eventData);
      }

      return shareResult;
    } catch (error) {
      console.error('❌ Failed to share data with ecosystem:', error);
      return { shared: false, error: error.message };
    }
  }

  /**
   * 💡 GET CROSS-APP RECOMMENDATIONS
   * AI-powered ecosystem app suggestions
   */
  async getCrossAppRecommendations(userContext = {}) {
    try {
      const recommendations = await this.ecosystemAPI.getCrossAppRecommendations(userContext);
      
      // Enhance with bundle promotions if enabled
      if (this.config.enableBundlePromotion) {
        const bundleRecommendations = await this.bundlePromotion.getPersonalizedBundleRecommendations(userContext);
        recommendations.bundles = bundleRecommendations;
      }
      
      return recommendations;
    } catch (error) {
      console.error('❌ Failed to get cross-app recommendations:', error);
      return { recommendations: [], error: error.message };
    }
  }

  /**
   * 🏥 GENERATE PROVIDER INSIGHTS
   * Healthcare provider analytics dashboard
   */
  async generateProviderInsights(providerId, config = {}) {
    try {
      if (!this.config.enableAnalytics) {
        throw new Error('Provider analytics not enabled');
      }

      const insights = await this.providerAnalytics.generateProviderDashboard(providerId, config);
      return insights;
    } catch (error) {
      console.error('❌ Failed to generate provider insights:', error);
      return { error: error.message };
    }
  }

  /**
   * 🧠 ANALYZE SENTIMENT
   * Process sentiment analysis for user interactions
   */
  async analyzeSentiment(data, analysisType = 'conversation') {
    try {
      if (!this.config.enableSentimentPipeline) {
        throw new Error('Sentiment pipeline not enabled');
      }

      let result;
      switch (analysisType) {
        case 'conversation':
          result = await this.sentimentPipeline.analyzeConversation(data);
          break;
        case 'mood':
          result = await this.sentimentPipeline.analyzeMoodTracking(data);
          break;
        case 'symptoms':
          result = await this.sentimentPipeline.analyzeSymptomCorrelations(data);
          break;
        case 'relationship':
          result = await this.sentimentPipeline.analyzeRelationshipImpact(data);
          break;
        default:
          throw new Error(`Unknown analysis type: ${analysisType}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to analyze sentiment:', error);
      return { error: error.message };
    }
  }

  /**
   * 🔒 MANAGE PRIVACY CONSENT
   * Granular privacy controls
   */
  async requestPrivacyConsent(consentRequests) {
    try {
      return await this.privacyManager.requestGranularConsent(
        this.ecosystemAPI.anonymizedUserId,
        consentRequests
      );
    } catch (error) {
      console.error('❌ Failed to request privacy consent:', error);
      return { error: error.message };
    }
  }

  async processConsentResponse(consentRequestId, decisions) {
    try {
      return await this.privacyManager.processConsentResponse(consentRequestId, decisions);
    } catch (error) {
      console.error('❌ Failed to process consent response:', error);
      return { error: error.message };
    }
  }

  /**
   * 💰 GET BUNDLE PROMOTIONS
   * Revenue optimization through bundle recommendations
   */
  async getBundlePromotions(userContext = {}) {
    try {
      if (!this.config.enableBundlePromotion) {
        return { bundles: [] };
      }

      const promotions = await this.bundlePromotion.getPersonalizedBundleRecommendations(userContext);
      const activePromotions = await this.bundlePromotion.getActivePromotions(userContext.segment);
      
      return {
        personalizedBundles: promotions,
        activePromotions: activePromotions,
        valueDemo: await this.bundlePromotion.demonstrateEcosystemValue(userContext)
      };
    } catch (error) {
      console.error('❌ Failed to get bundle promotions:', error);
      return { bundles: [], error: error.message };
    }
  }

  /**
   * 🔔 SEND CROSS-APP NOTIFICATION
   * Ecosystem-wide notifications
   */
  async sendCrossAppNotification(notification) {
    try {
      return await this.ecosystemAPI.sendCrossAppNotification(notification);
    } catch (error) {
      console.error('❌ Failed to send cross-app notification:', error);
      return { sent: false, error: error.message };
    }
  }

  /**
   * 👤 MANAGE USER PREFERENCES
   * Unified user settings across ecosystem
   */
  async getUserPreferences() {
    try {
      return await this.ecosystemAPI.getUserPreferences();
    } catch (error) {
      console.error('❌ Failed to get user preferences:', error);
      return {};
    }
  }

  async updateUserPreferences(preferences) {
    try {
      return await this.ecosystemAPI.updateUserPreferences(preferences);
    } catch (error) {
      console.error('❌ Failed to update user preferences:', error);
      return { updated: false, error: error.message };
    }
  }

  /**
   * 📊 GET ECOSYSTEM STATUS
   * Integration health and metrics
   */
  getEcosystemStatus() {
    return {
      initialized: this.isInitialized,
      appSource: this.config.appSource,
      activeServices: this.activeServices,
      configuration: {
        analyticsEnabled: this.config.enableAnalytics,
        sentimentPipelineEnabled: this.config.enableSentimentPipeline,
        bundlePromotionEnabled: this.config.enableBundlePromotion,
        privacyLevel: this.config.privacyLevel
      },
      apiEndpoint: this.config.ecosystemAPI,
      lastInitialized: this.isInitialized ? new Date().toISOString() : null
    };
  }

  /**
   * 🔧 INITIALIZE USER SERVICES
   * Setup user-specific ecosystem services
   */
  async initializeUserServices(user) {
    try {
      // Initialize privacy preferences
      const privacyPrefs = await this.privacyManager.getUserPreferences();
      
      // Setup personalized recommendations
      if (this.config.enableBundlePromotion) {
        await this.bundlePromotion.trackBundleInteraction('user_login', null, {
          userId: user.id,
          timestamp: new Date().toISOString()
        });
      }

      console.log('✅ User-specific services initialized');
    } catch (error) {
      console.warn('⚠️ Failed to initialize some user services:', error);
    }
  }

  /**
   * 🛑 SHUTDOWN ECOSYSTEM INTEGRATION
   * Clean shutdown of all services
   */
  async shutdown() {
    try {
      // Stop sentiment pipeline
      if (this.sentimentPipeline) {
        this.sentimentPipeline.stopPipeline();
      }

      this.isInitialized = false;
      this.activeServices = [];
      
      console.log('🛑 Ecosystem Integration shutdown complete');
    } catch (error) {
      console.error('❌ Error during ecosystem shutdown:', error);
    }
  }
}

// Export all components
export {
  EcosystemIntegrationManager,
  EcosystemAPI,
  ProviderAnalytics,
  SentimentDataPipeline,
  PrivacyManager,
  BundlePromotion
};

// Default export
export default EcosystemIntegrationManager;
