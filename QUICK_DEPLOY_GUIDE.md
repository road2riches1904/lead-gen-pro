# ⚡ Quick Deploy Guide - AutoLeadGen Pro

**Get your lead generation platform running in 15 minutes!**

## 🚀 Prerequisites

1. **Download**: Extract your platform files
2. **Install**: Node.js (version 18+) and Bun
3. **Verify**: Run `node --version` and `bun --version`

## 📁 Project Structure

```
autoleadgen-pro/
├── src/
│   ├── App.tsx              # Main dashboard UI
│   ├── backend/api.ts       # Backend logic & API endpoints
│   └── components/ui/       # UI components
├── .env                     # Environment configuration
├── package.json             # Dependencies
└── README.md               # Documentation
```

## ⚙️ 5-Minute Setup

### 1. Install Dependencies
```bash
cd your-platform-folder
bun install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update:

```env
# Start with demo mode
DEMO_MODE=true

# Add real API keys later
SUPABASE_URL=your-supabase-url
APOLLO_API_KEY=your-apollo-key
HUNTER_API_KEY=your-hunter-key
STRIPE_SECRET_KEY=your-stripe-key
```

### 3. Start Platform
```bash
bun dev
```

### 4. Open Browser
Navigate to: `http://localhost:3000`

**🎉 Platform is running in demo mode!**

## 🔑 Connect Real Services

### Supabase (Database) - FREE
1. Create account at [supabase.com](https://supabase.com)
2. New project → Copy URL and anon key
3. Update `.env` with real values

### Apollo.io (Lead Generation) - FREE TIER
1. Sign up at [apollo.io](https://app.apollo.io)
2. Settings → Integrations → Generate API key
3. Free: 50 contacts/month

### Hunter.io (Email Finder) - FREE TIER  
1. Create account at [hunter.io](https://hunter.io)
2. API → API Keys → Copy key
3. Free: 25 searches/month

### Stripe (Payments) - FREE
1. Create account at [stripe.com](https://stripe.com)
2. Developers → API Keys → Copy secret key
3. Start with test mode (sk_test_...)

### Gmail SMTP (Email) - FREE
1. Enable 2FA on Gmail
2. Generate app password
3. Use in SMTP settings

## 🌐 Deploy to Production

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Option 2: Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Option 3: Railway
```bash
npm install -g @railway/cli
railway login
railway deploy
```

### Option 4: DigitalOcean App Platform
1. Connect GitHub repository
2. Auto-deploy from main branch
3. Set environment variables

## 🔧 Environment Variables Reference

```env
# Core Settings
DEMO_MODE=false
NODE_ENV=production
PORT=3000

# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...

# Lead Generation APIs
APOLLO_API_KEY=your_apollo_api_key
HUNTER_API_KEY=your_hunter_api_key

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Automation
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
ENCRYPTION_KEY=32-character-random-string
JWT_SECRET=your-jwt-secret-here
```

## 🔍 Testing Your Setup

### 1. Demo Mode Test
- Dashboard loads without errors
- Can navigate between tabs
- Mock data displays correctly

### 2. API Integration Test
```bash
# Test Apollo API
curl -H "Authorization: Bearer YOUR_APOLLO_KEY" \
     https://api.apollo.io/v1/auth/health

# Test Hunter API
curl https://api.hunter.io/v2/domain-search?domain=example.com&api_key=YOUR_HUNTER_KEY

# Test Stripe
curl https://api.stripe.com/v1/charges \
     -u YOUR_STRIPE_KEY:
```

### 3. Database Test
- Create test client record
- Generate test leads
- Verify data persistence

### 4. Email Test
- Send test outreach email
- Check SMTP logs
- Verify delivery

## 🚨 Troubleshooting

### "Command not found" errors
```bash
# Install missing dependencies
npm install -g bun
npm install -g vercel
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules
bun install
```

### API connection errors
- Verify API keys are correct
- Check rate limits on free tiers
- Ensure environment variables are set

### Database connection issues
- Verify Supabase URL and key
- Check project permissions
- Create required tables

### Email sending failures
- Use Gmail app passwords (not regular password)
- Enable 2-factor authentication
- Check SMTP settings

## 📊 Platform Endpoints

### Frontend Routes
- `/` - Dashboard
- `/leads` - Lead management  
- `/clients` - Client management
- `/prospects` - Prospect finder
- `/automation` - Automation controls

### API Endpoints
- `GET /api/health` - System status
- `GET /api/analytics` - Dashboard metrics
- `POST /api/leads/generate` - Generate new leads
- `GET /api/leads` - Retrieve leads
- `POST /api/prospects/find` - Find prospects
- `POST /api/clients` - Create client
- `POST /api/automation/start` - Start automation

## 🔒 Security Checklist

### Production Deployment
- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong JWT secrets
- [ ] Enable CORS properly
- [ ] Use production API keys
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Add error monitoring

### API Security
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Implement authentication
- [ ] Add request logging
- [ ] Set up monitoring alerts

## 📈 Performance Optimization

### Frontend
- Enable compression (gzip)
- Optimize images and assets
- Use CDN for static files
- Implement lazy loading

### Backend
- Add database indexing
- Implement caching (Redis)
- Use connection pooling
- Monitor API response times

### Database
- Regular backups
- Query optimization
- Index frequently accessed fields
- Monitor connection limits

## 🎯 Ready to Launch!

1. ✅ Platform deployed and accessible
2. ✅ All APIs connected and tested
3. ✅ Database configured and working
4. ✅ Email automation functional
5. ✅ Payment processing ready

**Your automated lead generation platform is live! 🚀**

Start with demo mode to test everything, then connect real services to begin generating revenue.

Need help? Check the troubleshooting section or refer to the complete setup guide.