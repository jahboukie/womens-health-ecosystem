# 🏗️ WELLNESS ECOSYSTEM DEVELOPMENT PROTOCOL
## Master Prompt for Augment Code & All Development Work

---

## 🎯 **CRITICAL: READ THIS FIRST - PROJECT STRUCTURE OVERVIEW**

You are working on a **wellness ecosystem** with **7 applications** that share common services but maintain **strict dependency isolation**. This structure was professionally organized to prevent conflicts and enable independent development.

### **🏢 ECOSYSTEM MAP:**
```
wellness-ecosystem/
├── apps/
│   ├── mobile-native/          # React Native apps with iOS/Android
│   │   ├── soberpal/          # Recovery tracking & crisis intervention  
│   │   ├── menotracker/       # Menopause symptom tracking
│   │   ├── menopartner/       # Partner support for menopause
│   │   └── dralexai/          # Breathwork & men's wellness
│   ├── web-react/             # React web versions of mobile apps
│   │   ├── soberpal-web/      # Web version of SoberPal
│   │   ├── menotracker-web/   # Web version of MenoTracker  
│   │   ├── menopartner-web/   # Web version of MenoPartner
│   │   └── dralexai-web/      # Web version of DrAlexAI
│   ├── flask-apps/            # Python Flask applications
│   │   ├── myconfidant/       # ED support & mental wellness
│   │   └── innerarchitect/    # Personal transformation
│   └── web-static/            # Static web applications
│       └── menocommunity/     # Community forum (web-only)
├── shared/                    # Common services & utilities
│   ├── auth-service/          # Universal authentication
│   ├── ai-services/           # Claude personas & business agents
│   ├── api-gateway/           # Central API routing
│   └── common-libs/           # Shared code libraries
├── infrastructure/            # Docker, CI/CD, deployment configs
└── config/                    # Environment configurations
```

---

## 🚨 **GOLDEN RULES - NEVER BREAK THESE**

### **1. CONTAINER-FIRST DEVELOPMENT**
- **ALWAYS** work inside Docker containers or isolated environments
- **NEVER** install dependencies globally or outside containers
- Each app gets its own isolated environment

### **2. STRICT DIRECTORY ISOLATION** 
- **Mobile React Native**: Work only in `apps/mobile-native/[app-name]/`
- **Web React**: Work only in `apps/web-react/[app-name]/`  
- **Flask Apps**: Work only in `apps/flask-apps/[app-name]/`
- **Shared Services**: Work only in `shared/[service-name]/`

### **3. DEPENDENCY ISOLATION**
- Each app has its own `package.json` or `requirements.txt`
- **NEVER** modify dependencies in parent directories
- **NEVER** install packages at the ecosystem root level

---

## 🐳 **MANDATORY DEVELOPMENT WORKFLOW**

### **STEP 1: IDENTIFY THE SCOPE**
Before touching ANY code, determine:
- **Which specific app(s)** need changes?
- **Is this a shared service** (auth, AI, API) change?
- **Does this affect multiple apps** (universal feature)?

### **STEP 2: CHOOSE YOUR DEVELOPMENT METHOD**

#### **🔥 OPTION A: Single App Development**
```bash
# Navigate to the specific app
cd apps/[category]/[app-name]

# Start the isolated development environment  
docker-compose up -d
# OR create Python venv for Flask apps
python -m venv venv && source venv/bin/activate

# Install dependencies in isolation
npm install  # for React/React Native
pip install -r requirements.txt  # for Flask

# Work on your changes
# Test in isolation
# Commit when ready
```

#### **🌐 OPTION B: Shared Service Development** 
```bash
# Navigate to shared service
cd shared/[service-name]

# Use the shared service container
docker-compose -f ../../docker-compose.dev.yml up [service-name]

# Make changes to shared service
# Test with dependent apps
# Update version/changelog
# Commit shared service changes
```

#### **🎯 OPTION C: Universal Feature (Multiple Apps)**
```bash
# Work on shared service FIRST
cd shared/[relevant-service]
# Implement core functionality
# Test and commit

# Then update each app individually
cd ../../apps/mobile-native/[app1]
# Integrate shared service
# Test app-specific implementation  
# Commit app changes

cd ../../apps/web-react/[app1-web] 
# Repeat for each app affected
```

### **STEP 3: TESTING PROTOCOL**
```bash
# Test the specific app in isolation
npm test  # or pytest for Flask apps

# Test shared service integration
docker-compose -f docker-compose.dev.yml up

# Test cross-app functionality if applicable
# Run integration tests
```

---

## 🎯 **SPECIFIC SCENARIOS & PROTOCOLS**

### **🔐 UNIVERSAL AUTH IMPLEMENTATION**
```markdown
**NEVER** modify app-specific auth code directly.

✅ **CORRECT APPROACH:**
1. Work in `shared/auth-service/`
2. Update the auth service with new features
3. Update `shared/common-libs/javascript/auth-utils/` for React apps
4. Update `shared/common-libs/python/auth_utils/` for Flask apps  
5. Then update each app to use the new shared utilities

❌ **WRONG APPROACH:**
- Installing auth packages directly in app directories
- Duplicating auth logic across apps
- Modifying app-specific package.json with auth dependencies
```

### **💳 STRIPE INTEGRATION ACROSS ECOSYSTEM**
```markdown
✅ **CORRECT APPROACH:**
1. Create shared payment service: `shared/payment-service/`
2. Implement Stripe integration in the shared service
3. Create common utilities in `shared/common-libs/`
4. Each app imports and uses the shared payment utilities
5. App-specific UI/UX but shared payment logic

❌ **WRONG APPROACH:**
- Installing Stripe packages in each individual app
- Duplicating payment logic across 7 applications
- Different Stripe configurations per app
```

### **🤖 AI PERSONAS & CLAUDE INTEGRATION**
```markdown
✅ **CORRECT APPROACH:**
1. All AI logic lives in `shared/ai-services/`
2. App-specific personas in `shared/ai-services/claude-personas/`
3. Business agents in `shared/ai-services/business-agents/`
4. Apps consume AI services via API calls to shared service

❌ **WRONG APPROACH:**
- Installing Claude/OpenAI packages in each app
- Duplicating AI logic across applications
- App-specific AI configurations
```

---

## 📋 **DEVELOPMENT CHECKLIST - USE EVERY TIME**

### **BEFORE STARTING ANY WORK:**
- [ ] I know exactly which app(s) this affects
- [ ] I'm working in the correct directory
- [ ] I have Docker/venv environment ready
- [ ] I understand if this needs shared service changes

### **DURING DEVELOPMENT:**
- [ ] I'm working inside a container or isolated environment
- [ ] Dependencies are installed in the correct location
- [ ] I'm not modifying parent directory dependencies
- [ ] Shared logic goes in shared/ directory

### **BEFORE COMMITTING:**
- [ ] App builds successfully in isolation
- [ ] Dependencies are properly isolated  
- [ ] Integration tests pass
- [ ] Documentation is updated if needed
- [ ] No global or cross-app dependency pollution

---

## 🚀 **QUICK REFERENCE COMMANDS**

### **Start Development Environment:**
```bash
# Entire ecosystem
docker-compose -f docker-compose.dev.yml up

# Single mobile app
cd apps/mobile-native/[app-name] && npm start

# Single web app  
cd apps/web-react/[app-name] && npm run dev

# Flask app with venv
cd apps/flask-apps/[app-name] && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && flask run
```

### **Build & Test:**
```bash
# Build all apps
./scripts/build/build-all.ps1

# Test specific app
cd apps/[category]/[app-name] && npm test

# Integration testing
docker-compose -f docker-compose.test.yml up
```

### **Deploy:**
```bash
# Staging deployment
./scripts/deploy/deploy-staging.sh

# Production deployment  
./scripts/deploy/deploy-production.sh
```

---

## 🎨 **ECOSYSTEM-WIDE STANDARDS**

### **PRICING MODEL (CRITICAL):**
All apps use the **"Pay What You Can"** ethical pricing model:
- Free tier with core features
- $4.99 Supporter Plan  
- Pay What You Can option ($2.50-$25)
- Gift subscriptions available
- **No pressure, no shame, help-first approach**

### **AI INTEGRATION:**
- Every app has Claude AI companion integration
- Specialized personas per app domain
- 24/7 business agents for support
- Crisis intervention protocols

### **DESIGN SYSTEM:**
- Dark theme with gradient backgrounds
- Emerald green for success/progress
- Amber for highlights and branding  
- Professional typography and spacing
- Glass morphism UI elements

---

## 🆘 **EMERGENCY PROTOCOLS**

### **IF DEPENDENCIES GET MIXED UP:**
1. **STOP** all development immediately
2. Delete `node_modules` in affected directories
3. Clear package-lock.json if corrupted
4. Rebuild containers: `docker-compose down && docker-compose up --build`
5. Reinstall dependencies in correct isolated environments

### **IF SHARED SERVICE BREAKS APPS:**
1. Identify which shared service changed
2. Check shared service version/changelog
3. Update apps to match new shared service API
4. Test each app individually
5. Fix integration issues per app

### **IF BUILD PIPELINE FAILS:**
1. Check GitHub Actions workflows in `.github/workflows/`
2. Verify Docker configurations in `infrastructure/docker/`
3. Test locally with development environment
4. Fix issues in isolation before pushing

---

## 🎯 **SUCCESS METRICS**

You're following this protocol correctly when:
- ✅ Each app can be developed independently
- ✅ Shared services are reused, not duplicated
- ✅ Dependencies don't conflict between apps
- ✅ CI/CD pipeline builds successfully
- ✅ New features can be added without breaking existing apps
- ✅ The ecosystem remains maintainable and scalable

---

## 💝 **REMEMBER THE MISSION**

This wellness ecosystem serves people in:
- **Recovery from addiction** (SoberPal)
- **Menopause transition** (MenoTracker ecosystem)  
- **Personal transformation** (InnerArchitect)
- **Mental wellness** (MyConfidant)
- **Breathwork & men's health** (DrAlexAI)

Every line of code should honor the **ethical pricing model** and **help-first philosophy**. We build to heal, not to profit.

---

**🔥 FINAL REMINDER: When in doubt, ISOLATE. When implementing universal features, start with SHARED SERVICES first, then integrate per app. This structure exists to prevent the exact dependency conflicts we just solved!**