/**
 * 🌐 USE ECOSYSTEM INTEGRATION HOOK
 * 
 * React hook for easy ecosystem integration in web applications
 * Provides unified access to cross-app features and analytics
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import EcosystemIntegrationManager from '../../ecosystem-integration/index.js';

/**
 * 🚀 ECOSYSTEM INTEGRATION HOOK
 * Main hook for ecosystem features
 */
export const useEcosystemIntegration = (config = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ecosystemStatus, setEcosystemStatus] = useState(null);
  
  const ecosystemRef = useRef(null);

  // Initialize ecosystem integration
  useEffect(() => {
    const initializeEcosystem = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create ecosystem manager
        ecosystemRef.current = new EcosystemIntegrationManager({
          appSource: config.appSource || 'webapp',
          enableAnalytics: config.enableAnalytics !== false,
          enableSentimentPipeline: config.enableSentimentPipeline !== false,
          enableBundlePromotion: config.enableBundlePromotion !== false,
          privacyLevel: config.privacyLevel || 'standard',
          ...config
        });

        // Initialize ecosystem
        const initResult = await ecosystemRef.current.initialize();
        
        setIsInitialized(true);
        setEcosystemStatus(initResult);
        
      } catch (err) {
        setError(err.message);
        console.error('Ecosystem initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeEcosystem();

    // Cleanup on unmount
    return () => {
      if (ecosystemRef.current) {
        ecosystemRef.current.shutdown();
      }
    };
  }, [config]);

  // Share data with ecosystem
  const shareData = useCallback(async (eventData, options = {}) => {
    if (!ecosystemRef.current || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      return await ecosystemRef.current.shareData(eventData, options);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isInitialized]);

  // Get cross-app recommendations
  const getCrossAppRecommendations = useCallback(async (userContext = {}) => {
    if (!ecosystemRef.current || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      return await ecosystemRef.current.getCrossAppRecommendations(userContext);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isInitialized]);

  // Analyze sentiment
  const analyzeSentiment = useCallback(async (data, analysisType = 'conversation') => {
    if (!ecosystemRef.current || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      return await ecosystemRef.current.analyzeSentiment(data, analysisType);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isInitialized]);

  // Get bundle promotions
  const getBundlePromotions = useCallback(async (userContext = {}) => {
    if (!ecosystemRef.current || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      return await ecosystemRef.current.getBundlePromotions(userContext);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isInitialized]);

  // Send cross-app notification
  const sendCrossAppNotification = useCallback(async (notification) => {
    if (!ecosystemRef.current || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      return await ecosystemRef.current.sendCrossAppNotification(notification);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isInitialized]);

  // Get ecosystem status
  const getStatus = useCallback(() => {
    if (!ecosystemRef.current) return null;
    return ecosystemRef.current.getEcosystemStatus();
  }, []);

  return {
    // State
    isInitialized,
    isLoading,
    error,
    ecosystemStatus,
    
    // Methods
    shareData,
    getCrossAppRecommendations,
    analyzeSentiment,
    getBundlePromotions,
    sendCrossAppNotification,
    getStatus,
    
    // Direct access to ecosystem manager
    ecosystem: ecosystemRef.current
  };
};

/**
 * 🔒 PRIVACY MANAGEMENT HOOK
 * Hook for privacy controls and consent management
 */
export const usePrivacyManager = () => {
  const [consentStatus, setConsentStatus] = useState({});
  const [privacyDashboard, setPrivacyDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { ecosystem, isInitialized } = useEcosystemIntegration();

  // Request privacy consent
  const requestConsent = useCallback(async (consentRequests) => {
    if (!ecosystem || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      setIsLoading(true);
      const result = await ecosystem.requestPrivacyConsent(consentRequests);
      return result;
    } catch (err) {
      console.error('Failed to request consent:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ecosystem, isInitialized]);

  // Process consent response
  const processConsent = useCallback(async (consentRequestId, decisions) => {
    if (!ecosystem || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      setIsLoading(true);
      const result = await ecosystem.processConsentResponse(consentRequestId, decisions);
      setConsentStatus(prev => ({ ...prev, ...decisions }));
      return result;
    } catch (err) {
      console.error('Failed to process consent:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ecosystem, isInitialized]);

  // Load privacy dashboard
  const loadPrivacyDashboard = useCallback(async (userId) => {
    if (!ecosystem || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      setIsLoading(true);
      const dashboard = await ecosystem.privacyManager.generatePrivacyDashboard(userId);
      setPrivacyDashboard(dashboard);
      return dashboard;
    } catch (err) {
      console.error('Failed to load privacy dashboard:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ecosystem, isInitialized]);

  return {
    consentStatus,
    privacyDashboard,
    isLoading,
    requestConsent,
    processConsent,
    loadPrivacyDashboard
  };
};

/**
 * 💰 BUNDLE PROMOTION HOOK
 * Hook for revenue optimization and bundle recommendations
 */
export const useBundlePromotion = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);
  const [valueDemo, setValueDemo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { ecosystem, isInitialized } = useEcosystemIntegration();

  // Load bundle recommendations
  const loadRecommendations = useCallback(async (userContext = {}) => {
    if (!ecosystem || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      setIsLoading(true);
      const promotions = await ecosystem.getBundlePromotions(userContext);
      
      setRecommendations(promotions.personalizedBundles?.recommendations || []);
      setActivePromotions(promotions.activePromotions?.activePromotions || []);
      setValueDemo(promotions.valueDemo);
      
      return promotions;
    } catch (err) {
      console.error('Failed to load bundle recommendations:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ecosystem, isInitialized]);

  // Track bundle interaction
  const trackInteraction = useCallback(async (interactionType, bundleId, context = {}) => {
    if (!ecosystem || !isInitialized) {
      return;
    }

    try {
      await ecosystem.bundlePromotion.trackBundleInteraction(interactionType, bundleId, context);
    } catch (err) {
      console.error('Failed to track bundle interaction:', err);
    }
  }, [ecosystem, isInitialized]);

  // Initiate upgrade flow
  const initiateUpgrade = useCallback(async (bundleId, upgradeContext = {}) => {
    if (!ecosystem || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      const upgradeFlow = await ecosystem.bundlePromotion.initiateUpgradeFlow(bundleId, upgradeContext);
      return upgradeFlow;
    } catch (err) {
      console.error('Failed to initiate upgrade flow:', err);
      throw err;
    }
  }, [ecosystem, isInitialized]);

  return {
    recommendations,
    activePromotions,
    valueDemo,
    isLoading,
    loadRecommendations,
    trackInteraction,
    initiateUpgrade
  };
};

/**
 * 🧠 SENTIMENT ANALYSIS HOOK
 * Hook for sentiment analysis and emotional intelligence
 */
export const useSentimentAnalysis = () => {
  const [sentimentHistory, setSentimentHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { ecosystem, isInitialized } = useEcosystemIntegration();

  // Analyze text sentiment
  const analyzeText = useCallback(async (text, context = {}) => {
    if (!ecosystem || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      setIsAnalyzing(true);
      
      const analysisData = {
        id: `analysis_${Date.now()}`,
        text: text,
        context: context.type || 'user_input',
        timestamp: new Date().toISOString(),
        ...context
      };

      const result = await ecosystem.analyzeSentiment(analysisData, 'conversation');
      
      // Add to history
      setSentimentHistory(prev => [...prev, {
        ...analysisData,
        result: result,
        analyzedAt: new Date().toISOString()
      }].slice(-50)); // Keep last 50 analyses

      return result;
    } catch (err) {
      console.error('Failed to analyze sentiment:', err);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [ecosystem, isInitialized]);

  // Analyze mood data
  const analyzeMood = useCallback(async (moodData) => {
    if (!ecosystem || !isInitialized) {
      throw new Error('Ecosystem not initialized');
    }

    try {
      setIsAnalyzing(true);
      const result = await ecosystem.analyzeSentiment(moodData, 'mood');
      
      setSentimentHistory(prev => [...prev, {
        type: 'mood_analysis',
        data: moodData,
        result: result,
        analyzedAt: new Date().toISOString()
      }].slice(-50));

      return result;
    } catch (err) {
      console.error('Failed to analyze mood:', err);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [ecosystem, isInitialized]);

  // Get sentiment trends
  const getSentimentTrends = useCallback(() => {
    return sentimentHistory.map(item => ({
      timestamp: item.analyzedAt,
      sentimentScore: item.result?.sentimentScore || 0,
      emotionalState: item.result?.emotionalState,
      type: item.type || 'conversation'
    }));
  }, [sentimentHistory]);

  return {
    sentimentHistory,
    isAnalyzing,
    analyzeText,
    analyzeMood,
    getSentimentTrends
  };
};

// Export all hooks
export default {
  useEcosystemIntegration,
  usePrivacyManager,
  useBundlePromotion,
  useSentimentAnalysis
};
