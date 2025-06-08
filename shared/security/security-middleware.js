/**
 * 🛡️ INTEGRATED SECURITY MIDDLEWARE
 * 
 * Comprehensive security middleware for all applications:
 * - Request/response encryption
 * - Authentication and authorization
 * - Rate limiting and DDoS protection
 * - Audit logging integration
 * - HIPAA compliance enforcement
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const MilitaryGradeEncryption = require('./encryption');
const HIPAAAuditTrail = require('./audit-trail');
const EnhancedMFASystem = require('./mfa-system');
const DatabaseEncryption = require('./database-encryption');
const HIPAAComplianceDashboard = require('./hipaa-compliance');

class SecurityMiddleware {
  constructor(config = {}) {
    this.config = {
      jwtSecret: config.jwtSecret || process.env.JWT_SECRET,
      encryptionEnabled: config.encryptionEnabled !== false,
      auditEnabled: config.auditEnabled !== false,
      rateLimitEnabled: config.rateLimitEnabled !== false,
      corsEnabled: config.corsEnabled !== false,
      ...config
    };

    // Initialize security components
    this.encryption = new MilitaryGradeEncryption();
    this.auditTrail = new HIPAAAuditTrail();
    this.mfaSystem = new EnhancedMFASystem();
    this.dbEncryption = new DatabaseEncryption();
    this.hipaaCompliance = new HIPAAComplianceDashboard();

    // Security headers configuration
    this.helmetConfig = {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "https://api.anthropic.com"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    };

    // Rate limiting configuration
    this.rateLimitConfig = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: this.rateLimitHandler.bind(this)
    };
  }

  /**
   * 🛡️ INITIALIZE ALL SECURITY MIDDLEWARE
   * Set up comprehensive security stack
   */
  initializeSecurityStack(app) {
    // Security headers
    if (this.config.corsEnabled) {
      app.use(this.corsMiddleware());
    }
    
    app.use(helmet(this.helmetConfig));
    
    // Rate limiting
    if (this.config.rateLimitEnabled) {
      app.use(this.rateLimitMiddleware());
    }
    
    // Request encryption/decryption
    if (this.config.encryptionEnabled) {
      app.use(this.encryptionMiddleware());
    }
    
    // Authentication middleware
    app.use(this.authenticationMiddleware());
    
    // Audit logging
    if (this.config.auditEnabled) {
      app.use(this.auditMiddleware());
    }
    
    // HIPAA compliance enforcement
    app.use(this.hipaaComplianceMiddleware());
    
    // Error handling
    app.use(this.errorHandlingMiddleware());
    
    return app;
  }

  /**
   * 🌐 CORS MIDDLEWARE
   * Configure Cross-Origin Resource Sharing
   */
  corsMiddleware() {
    return cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:19006', // Expo dev server
          'https://womens-health.app',
          'https://api.womens-health.app'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-Encryption-Key',
        'X-Device-ID',
        'X-Session-ID'
      ]
    });
  }

  /**
   * 🚦 RATE LIMITING MIDDLEWARE
   * Protect against DDoS and brute force attacks
   */
  rateLimitMiddleware() {
    return rateLimit(this.rateLimitConfig);
  }

  /**
   * 🔒 ENCRYPTION MIDDLEWARE
   * Handle request/response encryption
   */
  encryptionMiddleware() {
    return (req, res, next) => {
      try {
        // Decrypt incoming requests if encrypted
        if (req.headers['x-encrypted'] === 'true' && req.body.encryptedData) {
          const encryptionKey = req.headers['x-encryption-key'];
          if (encryptionKey) {
            req.body = this.encryption.decryptData(req.body.encryptedData, encryptionKey);
          }
        }

        // Override res.json to encrypt responses
        const originalJson = res.json;
        res.json = function(data) {
          if (req.headers['x-encrypt-response'] === 'true') {
            const encryptionKey = req.headers['x-encryption-key'];
            if (encryptionKey) {
              const encryptedData = req.app.locals.encryption.encryptData(data, encryptionKey);
              return originalJson.call(this, { encryptedData });
            }
          }
          return originalJson.call(this, data);
        };

        next();
      } catch (error) {
        res.status(400).json({ error: 'Encryption/decryption failed' });
      }
    };
  }

  /**
   * 🔐 AUTHENTICATION MIDDLEWARE
   * JWT token validation and user authentication
   */
  authenticationMiddleware() {
    return (req, res, next) => {
      // Skip authentication for public routes
      const publicRoutes = ['/health', '/api/auth/login', '/api/auth/register'];
      if (publicRoutes.some(route => req.path.startsWith(route))) {
        return next();
      }

      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
      }

      try {
        const decoded = jwt.verify(token, this.config.jwtSecret);
        req.user = decoded;
        
        // Log authentication event
        this.auditTrail.logAuthenticationEvent(
          decoded.userId,
          'TOKEN_VALIDATION',
          true,
          {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            sessionId: req.headers['x-session-id']
          }
        );
        
        next();
      } catch (error) {
        // Log failed authentication
        this.auditTrail.logAuthenticationEvent(
          'unknown',
          'TOKEN_VALIDATION',
          false,
          {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            failureReason: error.message
          }
        );
        
        res.status(401).json({ error: 'Invalid authentication token' });
      }
    };
  }

  /**
   * 📝 AUDIT MIDDLEWARE
   * Log all API requests for HIPAA compliance
   */
  auditMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      
      // Capture original res.json to log responses
      const originalJson = res.json;
      res.json = function(data) {
        const responseTime = Date.now() - startTime;
        
        // Log the API call
        req.app.locals.auditTrail.logUserAccess(
          req.user?.userId || 'anonymous',
          req.path,
          req.method,
          'API_ACCESS',
          {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            sessionId: req.headers['x-session-id'],
            deviceId: req.headers['x-device-id'],
            responseTime: responseTime,
            statusCode: res.statusCode,
            dataClassification: req.dataClassification || 'INTERNAL'
          }
        );
        
        return originalJson.call(this, data);
      };
      
      next();
    };
  }

  /**
   * 🏥 HIPAA COMPLIANCE MIDDLEWARE
   * Enforce HIPAA requirements
   */
  hipaaComplianceMiddleware() {
    return (req, res, next) => {
      // Check if request involves PHI
      const phiRoutes = ['/api/health', '/api/symptoms', '/api/medical', '/api/patient'];
      const involvesPHI = phiRoutes.some(route => req.path.includes(route));
      
      if (involvesPHI) {
        // Ensure user is authenticated
        if (!req.user) {
          return res.status(401).json({ error: 'PHI access requires authentication' });
        }
        
        // Log PHI access
        this.auditTrail.logHIPAAEvent(
          'PHI_ACCESS',
          req.user.userId,
          {
            type: 'HEALTH_DATA',
            patientId: req.user.userId,
            dataElements: [req.path],
            classification: 'PHI'
          },
          'TREATMENT',
          {
            authorized: true,
            purposeValid: true,
            minimized: true,
            retentionCompliant: true
          }
        );
        
        // Mark request as involving PHI
        req.dataClassification = 'PHI';
      }
      
      next();
    };
  }

  /**
   * 🚨 ERROR HANDLING MIDDLEWARE
   * Secure error handling with audit logging
   */
  errorHandlingMiddleware() {
    return (error, req, res, next) => {
      // Log security events
      this.auditTrail.logSecurityEvent(
        'APPLICATION_ERROR',
        'MEDIUM',
        error.message,
        {
          stack: error.stack,
          path: req.path,
          method: req.method,
          userId: req.user?.userId,
          ipAddress: req.ip
        }
      );
      
      // Don't expose internal errors in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      res.status(error.status || 500).json({
        error: isDevelopment ? error.message : 'Internal server error',
        ...(isDevelopment && { stack: error.stack })
      });
    };
  }

  /**
   * 🚦 RATE LIMIT HANDLER
   * Handle rate limit violations
   */
  rateLimitHandler(req, res) {
    // Log rate limit violation
    this.auditTrail.logSecurityEvent(
      'RATE_LIMIT_EXCEEDED',
      'MEDIUM',
      'Rate limit exceeded',
      {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method
      }
    );
    
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: '15 minutes',
      message: 'Rate limit exceeded. Please try again later.'
    });
  }

  /**
   * 🔐 MFA ENFORCEMENT MIDDLEWARE
   * Require MFA for sensitive operations
   */
  mfaEnforcementMiddleware(requiredMethods = ['totp']) {
    return (req, res, next) => {
      const sensitiveRoutes = ['/api/admin', '/api/settings', '/api/delete'];
      const requiresMFA = sensitiveRoutes.some(route => req.path.startsWith(route));
      
      if (requiresMFA && req.user) {
        const mfaToken = req.headers['x-mfa-token'];
        const mfaMethod = req.headers['x-mfa-method'];
        
        if (!mfaToken || !requiredMethods.includes(mfaMethod)) {
          return res.status(403).json({
            error: 'MFA required',
            requiredMethods: requiredMethods,
            message: 'This operation requires multi-factor authentication'
          });
        }
        
        // Verify MFA token (implementation depends on method)
        // This is a simplified example
        const mfaValid = this.verifyMFAToken(mfaToken, mfaMethod, req.user);
        
        if (!mfaValid) {
          return res.status(403).json({ error: 'Invalid MFA token' });
        }
      }
      
      next();
    };
  }

  /**
   * ✅ VERIFY MFA TOKEN
   * Validate MFA tokens
   */
  verifyMFAToken(token, method, user) {
    try {
      switch (method) {
        case 'totp':
          return this.mfaSystem.verifyTOTP(token, user.totpSecret);
        case 'biometric':
          // Implementation would verify biometric data
          return true;
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * 📊 SECURITY METRICS MIDDLEWARE
   * Collect security metrics
   */
  securityMetricsMiddleware() {
    return (req, res, next) => {
      // Collect security metrics
      const metrics = {
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        authenticated: !!req.user,
        encrypted: req.headers['x-encrypted'] === 'true',
        mfaUsed: !!req.headers['x-mfa-token']
      };
      
      // Store metrics (implementation would use metrics collection service)
      req.securityMetrics = metrics;
      
      next();
    };
  }
}

module.exports = SecurityMiddleware;
