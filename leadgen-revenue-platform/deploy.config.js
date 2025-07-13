// Deployment configuration for AutoLeadGen Pro
// This file provides configuration for multiple deployment platforms

const config = {
  // Application settings
  app: {
    name: 'autoleadgen-pro',
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'production'
  },

  // Cloudflare Workers configuration (RECOMMENDED - FREE TIER)
  cloudflare: {
    name: 'autoleadgen-pro',
    main: 'src/backend/api.ts',
    compatibility_date: '2024-01-01',
    env: {
      // Add your environment variables here
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      APOLLO_API_KEY: process.env.APOLLO_API_KEY,
      HUNTER_API_KEY: process.env.HUNTER_API_KEY,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
    },
    triggers: {
      crons: [
        '0 */4 * * *', // Lead generation every 4 hours
        '0 9,13,17 * * *', // Client outreach 3x daily during business hours
        '0 2 * * *', // Payment processing daily at 2 AM
        '0 8 * * 1' // Weekly reports every Monday at 8 AM
      ]
    }
  },

  // Vercel configuration (FREE TIER)
  vercel: {
    name: 'autoleadgen-pro',
    framework: 'vite',
    buildCommand: 'bun run build',
    outputDirectory: 'dist',
    functions: {
      'api/**.ts': {
        runtime: 'nodejs18.x'
      }
    },
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      APOLLO_API_KEY: process.env.APOLLO_API_KEY,
      HUNTER_API_KEY: process.env.HUNTER_API_KEY,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
    }
  },

  // Railway configuration (FREE TIER + $5/month for persistence)
  railway: {
    name: 'autoleadgen-pro',
    framework: 'nodejs',
    buildCommand: 'bun install && bun run build',
    startCommand: 'bun run serve',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  },

  // Render configuration (FREE TIER)
  render: {
    name: 'autoleadgen-pro',
    type: 'web',
    env: 'node',
    buildCommand: 'bun install && bun run build',
    startCommand: 'bun run serve',
    healthCheckPath: '/api/health',
    envVars: [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'STRIPE_SECRET_KEY',
      'APOLLO_API_KEY',
      'HUNTER_API_KEY',
      'SENDGRID_API_KEY'
    ]
  },

  // Database configuration (Supabase - FREE TIER)
  database: {
    provider: 'supabase',
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    tables: {
      leads: {
        id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
        client_id: 'uuid REFERENCES clients(id)',
        name: 'text',
        email: 'text',
        company: 'text',
        industry: 'text',
        score: 'integer',
        source: 'text',
        status: 'text DEFAULT \'new\'',
        estimated_value: 'numeric',
        contact_info: 'jsonb',
        created_at: 'timestamp DEFAULT now()'
      },
      clients: {
        id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
        name: 'text',
        email: 'text',
        company: 'text',
        industry: 'text',
        monthly_budget: 'numeric',
        target_leads: 'integer',
        status: 'text DEFAULT \'active\'',
        stripe_customer_id: 'text',
        created_at: 'timestamp DEFAULT now()'
      },
      campaigns: {
        id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
        client_id: 'uuid REFERENCES clients(id)',
        name: 'text',
        criteria: 'jsonb',
        status: 'text DEFAULT \'active\'',
        leads_generated: 'integer DEFAULT 0',
        budget_spent: 'numeric DEFAULT 0',
        created_at: 'timestamp DEFAULT now()'
      }
    }
  },

  // Payment processing (Stripe)
  payments: {
    provider: 'stripe',
    currency: 'usd',
    plans: {
      starter: {
        price_id: 'price_starter', // Replace with actual Stripe price ID
        amount: 29900, // $299/month
        leads: 100
      },
      growth: {
        price_id: 'price_growth', // Replace with actual Stripe price ID
        amount: 59900, // $599/month
        leads: 250
      },
      enterprise: {
        price_id: 'price_enterprise', // Replace with actual Stripe price ID
        amount: 99900, // $999/month
        leads: 500
      }
    }
  },

  // Email automation (SendGrid)
  email: {
    provider: 'sendgrid',
    from: process.env.FROM_EMAIL || 'noreply@autoleadgen.pro',
    templates: {
      welcome: 'd-welcome-template-id',
      lead_delivery: 'd-lead-delivery-template-id',
      payment_reminder: 'd-payment-reminder-template-id',
      weekly_report: 'd-weekly-report-template-id'
    }
  },

  // Monitoring and analytics
  monitoring: {
    healthCheck: '/api/health',
    metrics: '/api/metrics',
    logs: {
      level: 'info',
      format: 'json'
    }
  }
};

export default config;