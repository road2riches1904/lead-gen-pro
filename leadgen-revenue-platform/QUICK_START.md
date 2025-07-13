# 🚀 AutoLeadGen Pro - Quick Start Guide

**Get your revenue-generating platform running in under 30 minutes!**

## ⚡ 5-Minute Setup (Minimum to Start)

### Step 1: Clone & Install (2 minutes)
```bash
# If you have the files already, skip to Step 2
cd leadgen-revenue-platform
bun install
```

### Step 2: Copy Environment File (1 minute)
```bash
cp .env.example .env
```

### Step 3: Start Platform (30 seconds)
```bash
bun run dev
```

### Step 4: Open Dashboard (30 seconds)
Go to: http://localhost:3000

### Step 5: Generate Test Leads (1 minute)
- Click "Generate Leads" button
- Watch sample leads appear in dashboard
- ✅ **Platform is working!**

## 💰 30-Minute Revenue Setup

### Phase 1: Free Services Setup (10 minutes)

#### 1. Supabase (Database) - FREE
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create account (use Google login for speed)
4. Create new project: "autoleadgen-pro"
5. Copy URL and API key to `.env` file
6. Go to SQL Editor, paste this:

```sql
-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  company TEXT,
  industry TEXT,
  score INTEGER,
  source TEXT,
  status TEXT DEFAULT 'new',
  estimated_value NUMERIC,
  created_at TIMESTAMP DEFAULT now()
);

-- Create clients table  
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  company TEXT,
  industry TEXT,
  monthly_budget NUMERIC,
  target_leads INTEGER,
  status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable row level security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies for access
CREATE POLICY "Allow all operations" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON clients FOR ALL USING (true);
```

#### 2. Apollo.io (Lead Generation) - FREE TRIAL
1. Go to [apollo.io](https://apollo.io)
2. Sign up for free trial (14 days, 50 leads)
3. Go to Settings → API Keys
4. Copy API key to `.env` file

#### 3. Hunter.io (Email Finding) - FREE PLAN
1. Go to [hunter.io](https://hunter.io)
2. Sign up for free (100 searches/month)
3. Go to API → API Keys
4. Copy API key to `.env` file

### Phase 2: Payment Setup (10 minutes)

#### 4. Stripe (Payments) - FREE
1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Go to Developers → API Keys
4. Copy Secret Key to `.env` file
5. Create products:
   - Starter: $299/month (100 leads)
   - Growth: $599/month (250 leads)
   - Enterprise: $999/month (500 leads)

#### 5. SendGrid (Emails) - FREE
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free (100 emails/day)
3. Go to Settings → API Keys
4. Create API key, copy to `.env` file
5. Set FROM_EMAIL to your verified email

### Phase 3: Test Everything (10 minutes)

#### 6. Restart Platform
```bash
# Stop current process (Ctrl+C)
bun run dev
```

#### 7. Test Lead Generation
- Click "Generate Leads" 
- Should see real leads from Apollo.io
- Check quality scores (should be 70+)

#### 8. Test Client Addition
- Click "Add Client"
- Fill out form with test data
- Should create client in database

#### 9. Test Payment Processing
- Use Stripe test card: 4242 4242 4242 4242
- Process $1 test payment
- Check Stripe dashboard for success

## 🎯 Your First Client (Same Day)

### Quick Client Acquisition Script

**Who to Target**: Digital marketing agencies, real estate agents, insurance brokers

**Email Template** (Copy & Paste):
```
Subject: 100 Pre-Qualified Leads for [Company Name] - Free Trial

Hi [First Name],

I noticed [Company Name] specializes in [their service]. I have a question:

How much is a qualified lead worth to your business?

I ask because I've developed an AI system that finds and pre-qualifies leads automatically. It's generating 100+ leads per month for companies like yours.

Would you be interested in a free trial? I'll send you 10 sample leads from your target market within 24 hours - no cost, no obligation.

If the quality is good, we can discuss a monthly plan starting at $299.

Interested in the free sample?

Best regards,
[Your Name]
[Your Phone]
```

### Where to Find Prospects
1. **LinkedIn**: Search "marketing agency owner"
2. **Google**: "digital marketing agency [your city]"
3. **Chamber of Commerce**: Local business directories
4. **Upwork/Fiverr**: Agencies offering lead generation

### Follow-Up Sequence (Send if no response)
- **Day 3**: "Did you see my message about free leads?"
- **Day 7**: "Quick question about your lead generation..."
- **Day 14**: "Final follow-up about free lead sample"

## 📈 Revenue Milestones

### Week 1 Goal: $299 (First Client)
- Target: 1 client × $299/month
- Action: Free trials + follow-up
- Expected: 10 prospects → 1 client

### Month 1 Goal: $1,500 (5 Clients)
- Target: 5 clients × $299/month  
- Action: Proven script + automation
- Expected: 50 prospects → 5 clients

### Month 3 Goal: $10,000 (Mix of Plans)
- Target: 20 clients with mixed pricing
- 10 × Starter ($299) = $2,990
- 7 × Growth ($599) = $4,193  
- 3 × Enterprise ($999) = $2,997
- **Total: $10,180/month**

### Month 6 Goal: $25,000 (Scale & Optimize)
- Target: 50+ clients with referrals
- Focus on higher-value clients
- Add consulting services (+$500/client)
- Implement annual billing (10% discount)

## ⚠️ Common Quick Issues

### "No leads generating"
- Check API keys in `.env`
- Verify Apollo.io credits remaining
- Restart platform: `bun run dev`

### "Database errors"
- Check Supabase URL and key
- Ensure SQL tables were created
- Test connection in Supabase dashboard

### "Payment not working"
- Use Stripe test keys initially
- Test with card: 4242 4242 4242 4242
- Check Stripe dashboard for errors

### "Emails not sending"
- Verify SendGrid API key
- Confirm FROM_EMAIL is verified
- Check SendGrid activity feed

## 🆘 Need Help?

### Instant Help
1. **Check console logs** in browser (F12)
2. **Restart platform** with `bun run dev`
3. **Review .env file** for missing values

### Get Support
- **Email**: support@autoleadgen.pro
- **Phone**: (555) 123-4567
- **Documentation**: Full USER_GUIDE.md

## ✅ Success Checklist

Before going live, ensure:
- [ ] Platform starts without errors
- [ ] Database connection works
- [ ] Leads generate from real sources
- [ ] Payments process successfully  
- [ ] Emails send correctly
- [ ] Dashboard shows real data
- [ ] All automation is enabled

## 🎉 You're Ready!

Once you complete this guide, you have a **fully functional, revenue-generating platform** that works 24/7.

**Next Steps**:
1. Generate your first test leads
2. Send outreach emails to prospects
3. Onboard your first paying client
4. Let automation handle the rest

**Remember**: The faster you start, the faster you earn. Don't overcomplicate it - start with the basics and improve as you grow.

---

*Need the full guide? See USER_GUIDE.md*
*Questions? Email support@autoleadgen.pro*