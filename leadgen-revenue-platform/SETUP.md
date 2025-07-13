# 🚀 AutoLeadGen Pro - Complete Setup Guide

## Overview
This guide will walk you through setting up a **fully functional lead generation platform** that can start generating revenue immediately with **zero upfront costs**. All services used have generous free tiers.

## 📋 Quick Start Checklist
- [ ] Set up Supabase database (FREE)
- [ ] Configure Apollo.io for lead generation (10,000 free credits)
- [ ] Set up Hunter.io for email finding (25 free searches/month)
- [ ] Configure Stripe for payments (only pay when you earn)
- [ ] Set up email automation with SendGrid (100 emails/day free)
- [ ] Deploy to Cloudflare Workers (FREE tier)

---

## 🗄️ 1. Database Setup (Supabase - FREE)

### Sign up for Supabase
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization and project
4. Note your Project URL and API keys

### Create Database Tables
Run this SQL in your Supabase SQL editor:

```sql
-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  industry TEXT,
  location TEXT,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'contacted', 'converted', 'rejected')),
  source TEXT NOT NULL,
  value INTEGER DEFAULT 0,
  confidence DECIMAL DEFAULT 0,
  client_id UUID REFERENCES clients(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT NOT NULL,
  industry TEXT,
  budget INTEGER DEFAULT 0,
  target_criteria JSONB DEFAULT '{}',
  status TEXT DEFAULT 'trial' CHECK (status IN ('active', 'paused', 'trial', 'churned')),
  leads_delivered INTEGER DEFAULT 0,
  conversion_rate DECIMAL DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  monthly_fee INTEGER DEFAULT 497,
  payment_status TEXT DEFAULT 'current' CHECK (payment_status IN ('current', 'overdue', 'failed')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  target_criteria JSONB DEFAULT '{}',
  budget INTEGER DEFAULT 0,
  spent INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  leads_target INTEGER DEFAULT 50,
  cost_per_lead INTEGER DEFAULT 0,
  automation_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_leads_client_id ON leads(client_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
CREATE POLICY "Enable all operations for authenticated users" ON leads
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON clients
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON campaigns
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 🎯 2. Lead Generation APIs

### Apollo.io Setup (10,000 FREE credits)
1. Go to [apollo.io](https://www.apollo.io)
2. Sign up for free account
3. Navigate to Settings > API
4. Generate API key
5. Add to `.env`: `APOLLO_API_KEY=your-key-here`

**What you get:**
- 10,000 free contact credits
- Access to 265M+ contacts
- Company and contact search
- Email finder and phone numbers

### Hunter.io Setup (25 FREE searches/month)
1. Go to [hunter.io](https://hunter.io)
2. Sign up for free account
3. Go to API section
4. Copy your API key
5. Add to `.env`: `HUNTER_API_KEY=your-key-here`

**What you get:**
- 25 free email searches per month
- Email verification
- Domain search
- 99% email accuracy rate

---

## 💳 3. Payment Processing (Stripe)

### Stripe Setup (Only pay when you earn!)
1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Get your API keys from Dashboard > Developers > API keys
4. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_your-key
   STRIPE_PUBLISHABLE_KEY=pk_test_your-key
   ```

**Pricing:**
- 2.9% + $0.30 per successful transaction
- No monthly fees
- Only pay when you collect payments

### Set up Products and Prices
In Stripe Dashboard:
1. Go to Products
2. Create product: "Lead Generation Service"
3. Add prices:
   - $497/month for premium service
   - $297/month for basic service
   - $97/month for starter service

---

## 📧 4. Email Automation (SendGrid - FREE)

### SendGrid Setup (100 emails/day FREE)
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free account
3. Complete sender authentication
4. Create API key with full access
5. Add to `.env`: `SENDGRID_API_KEY=your-key-here`

**What you get:**
- 100 emails per day forever free
- Delivery analytics
- Template management
- Webhook events

### Email Templates
Create these templates in SendGrid:
1. **Welcome Email** - New client onboarding
2. **Lead Notification** - New leads delivered
3. **Payment Reminder** - Overdue payments
4. **Weekly Report** - Performance summary

---

## 🤖 5. Automation Workflows

### Zapier Integration (Optional)
1. Create Zapier account
2. Set up webhook to trigger on new leads
3. Connect to:
   - Slack notifications
   - Google Sheets logging
   - CRM integration

### Automated Sequences
The platform includes these automated workflows:

#### Lead Generation
- **Frequency**: Every 6 hours
- **Sources**: Apollo.io, Hunter.io, Web scraping
- **Processing**: Score leads, remove duplicates, assign to clients

#### Client Communication  
- **Welcome sequence**: 3-email onboarding
- **Lead delivery**: Instant notifications
- **Weekly reports**: Performance summaries

#### Payment Processing
- **Auto-billing**: Monthly subscription charges
- **Payment reminders**: For overdue accounts
- **Revenue tracking**: Real-time analytics

---

## 🚀 6. Deployment Options

### Option A: Cloudflare Workers (FREE)
1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Deploy: `wrangler publish`

**Free Tier Includes:**
- 100,000 requests per day
- 10ms CPU time per request
- Built-in CDN

### Option B: Vercel (FREE)
1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy automatically

### Option C: Railway/Render (FREE tier available)
1. Connect repo
2. Set environment variables
3. Deploy with one click

---

## 🔧 7. Configuration

### Copy Environment Variables
```bash
cp .env.example .env
```

### Fill in your API keys
Edit `.env` file with your actual values from the services above.

### Install Dependencies
```bash
bun install
```

### Run Development Server
```bash
bun dev
```

### Build for Production
```bash
bun build
```

---

## 💰 8. Revenue Generation Strategy

### Pricing Tiers
- **Starter**: $97/month - 50 leads
- **Professional**: $297/month - 200 leads  
- **Enterprise**: $497/month - 500 leads

### Lead Generation Costs
- Apollo.io: ~$0.10 per lead
- Hunter.io: ~$0.50 per verified email
- Web scraping: Essentially free
- **Your profit margin**: 80-90%

### Revenue Projections
With just 10 clients at $297/month:
- **Monthly Revenue**: $2,970
- **Annual Revenue**: $35,640
- **Lead costs**: ~$300/month
- **Net profit**: ~$32,000/year

---

## 🛠️ 9. Troubleshooting

### Common Issues

#### API Keys Not Working
- Double-check spelling and spaces
- Ensure keys have proper permissions
- Check API quotas and limits

#### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure tables are created

#### Payment Processing Errors
- Use test keys in development
- Verify webhook endpoints
- Check Stripe dashboard for logs

### Getting Help
- Check the `/api/health` endpoint for system status
- Review browser console for frontend errors
- Check server logs for API issues

---

## 🎯 10. Next Steps

Once your platform is running:

1. **Test lead generation** - Generate your first leads
2. **Add a test client** - Set up billing and automation
3. **Customize workflows** - Adjust for your market
4. **Scale up** - Add more data sources and automation
5. **Market your service** - Start acquiring paying clients

## 🆘 Support

Need help? Check these resources:
- Review error messages in browser console
- Test API endpoints directly
- Verify environment variables are set
- Check service status pages (Stripe, Supabase, etc.)

---

**🎉 Congratulations!** You now have a fully functional lead generation platform that can start generating revenue immediately. The total setup time should be 2-3 hours, and you can start finding your first clients right away.