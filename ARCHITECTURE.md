# Sober Pal - Technical Architecture

## Overview

Sober Pal is a HIPAA-compliant mobile application designed to support individuals in their recovery journey. The architecture follows modern best practices for security, scalability, and maintainability.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Backend API   │    │   External APIs │
│  (React Native)│◄──►│  (Node.js/TS)  │◄──►│   (Claude AI)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Sessions)    │
                       └─────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Cache/Sessions**: Redis
- **Authentication**: JWT + bcrypt
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **API Documentation**: Swagger/OpenAPI

### Mobile App
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation 6
- **UI Components**: React Native Paper
- **Storage**: Expo SecureStore + AsyncStorage
- **HTTP Client**: Axios
- **Testing**: Jest + React Native Testing Library

### External Services
- **AI**: Anthropic Claude API
- **Push Notifications**: Firebase Cloud Messaging
- **Error Tracking**: Sentry (optional)
- **Analytics**: Privacy-compliant analytics (optional)

## Security Architecture

### Data Protection
- **Encryption at Rest**: AES-256-GCM for sensitive data
- **Encryption in Transit**: TLS 1.3 for all communications
- **Key Management**: User-derived encryption keys using PBKDF2
- **Password Security**: bcrypt with 12 rounds

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with secure claims
- **Biometric Auth**: Device-level biometric authentication
- **Session Management**: Redis-based session storage
- **Rate Limiting**: API rate limiting to prevent abuse

### HIPAA Compliance
- **Audit Logging**: Comprehensive audit trails for all data access
- **Data Minimization**: Only collect necessary data
- **Access Controls**: Role-based access control
- **Data Retention**: Configurable data retention policies
- **Breach Detection**: Monitoring for unauthorized access

## Database Design

### Core Entities

#### Users
```sql
- id (UUID, Primary Key)
- email (Encrypted)
- password_hash (bcrypt)
- profile_encrypted (JSON, User-encrypted)
- account_status (Enum)
- preferences (JSON)
- created_at, updated_at
```

#### AI Conversations
```sql
- id (UUID, Primary Key)
- user_id (Foreign Key)
- conversation_type (Enum)
- messages_encrypted (JSON, User-encrypted)
- crisis_detected (Boolean)
- created_at, ended_at
```

#### Crisis Events
```sql
- id (UUID, Primary Key)
- user_id (Foreign Key)
- severity_level (Integer 1-5)
- escalation_actions (JSON)
- resolved_at (Timestamp)
- created_at
```

#### Journal Entries
```sql
- id (UUID, Primary Key)
- user_id (Foreign Key)
- content_encrypted (Text, User-encrypted)
- mood_rating (Integer 1-10)
- ai_analysis_encrypted (JSON, User-encrypted)
- entry_date
```

### Data Encryption Strategy

1. **User Profile Data**: Encrypted with user-derived key
2. **Conversation Messages**: Encrypted with user-derived key
3. **Journal Entries**: Encrypted with user-derived key
4. **Metadata**: Stored in plaintext for querying (non-sensitive)

## API Design

### RESTful Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Token refresh

#### AI Conversations
- `GET /api/v1/ai/conversations` - List conversations
- `POST /api/v1/ai/conversation` - Start new conversation
- `GET /api/v1/ai/conversation/:id` - Get conversation details
- `POST /api/v1/ai/conversation/:id/message` - Send message

#### Crisis Support
- `GET /api/v1/crisis/resources` - Get crisis resources
- `GET /api/v1/crisis/events` - Get user's crisis events
- `POST /api/v1/crisis/:eventId/followup` - Submit follow-up

#### Progress Tracking
- `GET /api/v1/progress/dashboard` - Get progress overview
- `POST /api/v1/progress/milestone` - Add milestone
- `GET /api/v1/progress/coping-strategies` - Get strategies

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Mobile App Architecture

### State Management
```
Store (Redux)
├── auth (Authentication state)
├── conversations (AI chat state)
├── crisis (Crisis support state)
├── progress (Progress tracking state)
└── journal (Journal entries state)
```

### Navigation Structure
```
App Navigator
├── Auth Stack (Unauthenticated)
│   ├── Onboarding
│   ├── Login
│   ├── Register
│   └── Forgot Password
└── Main Stack (Authenticated)
    ├── Tab Navigator
    │   ├── Home
    │   ├── Chat
    │   ├── Journal
    │   ├── Progress
    │   └── Support
    └── Crisis Modal
```

### Security Features
- **Secure Storage**: Sensitive data stored in device keychain
- **Biometric Authentication**: Face ID/Touch ID/Fingerprint
- **App State Protection**: Hide sensitive content when backgrounded
- **Certificate Pinning**: Prevent man-in-the-middle attacks
- **Root/Jailbreak Detection**: Enhanced security checks

## AI Integration

### Claude AI Integration
- **Model**: Claude-3-Sonnet for balanced performance and safety
- **Context Management**: Maintain conversation context while respecting privacy
- **Crisis Detection**: Real-time analysis of user messages for crisis indicators
- **Safety Filters**: Content filtering and appropriate response generation

### AI Safety Measures
- **Crisis Escalation**: Automatic escalation to human resources
- **Professional Boundaries**: Clear limitations and referrals
- **Content Moderation**: Inappropriate content detection and handling
- **Privacy Protection**: No training on user data

## Deployment Architecture

### Development Environment
```
Docker Compose
├── PostgreSQL (Database)
├── Redis (Sessions/Cache)
├── Backend API (Node.js)
└── pgAdmin (Database Admin)
```

### Production Environment
```
Cloud Infrastructure
├── Load Balancer (SSL Termination)
├── API Servers (Auto-scaling)
├── Database Cluster (High Availability)
├── Redis Cluster (Session Storage)
├── File Storage (Encrypted)
└── Monitoring & Logging
```

## Monitoring & Observability

### Logging Strategy
- **Application Logs**: Structured logging with Winston
- **Audit Logs**: HIPAA-compliant audit trails
- **Security Logs**: Authentication and authorization events
- **Performance Logs**: API response times and errors

### Metrics & Monitoring
- **Health Checks**: Endpoint health monitoring
- **Performance Metrics**: Response times, throughput
- **Error Tracking**: Application error monitoring
- **Security Monitoring**: Suspicious activity detection

## Scalability Considerations

### Horizontal Scaling
- **Stateless API**: JWT-based authentication for easy scaling
- **Database Sharding**: User-based sharding strategy
- **Caching Strategy**: Redis for session and frequently accessed data
- **CDN Integration**: Static asset delivery optimization

### Performance Optimization
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Compression**: Response compression for API calls
- **Lazy Loading**: Mobile app lazy loading for better performance

## Disaster Recovery

### Backup Strategy
- **Database Backups**: Automated daily backups with encryption
- **Point-in-Time Recovery**: Transaction log backups
- **Cross-Region Replication**: Geographic redundancy
- **Backup Testing**: Regular restore testing procedures

### Business Continuity
- **High Availability**: Multi-zone deployment
- **Failover Procedures**: Automated failover mechanisms
- **Data Recovery**: Recovery time objectives (RTO) < 4 hours
- **Communication Plan**: User notification procedures

## Compliance & Governance

### HIPAA Compliance
- **Administrative Safeguards**: Policies and procedures
- **Physical Safeguards**: Data center security requirements
- **Technical Safeguards**: Encryption, access controls, audit logs
- **Business Associate Agreements**: Third-party service agreements

### Data Governance
- **Data Classification**: Sensitive data identification
- **Access Controls**: Role-based access management
- **Data Retention**: Automated data lifecycle management
- **Privacy Controls**: User consent and data portability
