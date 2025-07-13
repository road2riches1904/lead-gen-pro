#!/usr/bin/env bun

// AutoLeadGen Pro - Automated Deployment Script
// Run with: bun scripts/deploy.js

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync } from 'fs';
import { createInterface } from 'readline';

const execAsync = promisify(exec);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Utility functions
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.cyan}🚀 ${msg}${colors.reset}`)
};

// Create readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

// Check if command exists
async function commandExists(command) {
  try {
    await execAsync(`which ${command}`);
    return true;
  } catch {
    return false;
  }
}

// Check prerequisites
async function checkPrerequisites() {
  log.info('Checking prerequisites...');
  
  // Check if bun is installed
  if (!(await commandExists('bun'))) {
    log.error('Bun is not installed. Please install bun first: https://bun.sh');
    process.exit(1);
  }
  
  // Check if .env file exists
  if (!existsSync('.env')) {
    log.warning('.env file not found. Creating from template...');
    try {
      await execAsync('cp .env.example .env');
      log.warning('Please fill in your API keys in .env file before proceeding.');
      process.exit(1);
    } catch (error) {
      log.error('Failed to create .env file from template');
      process.exit(1);
    }
  }
  
  // Check if node_modules exists
  if (!existsSync('node_modules')) {
    log.info('Installing dependencies...');
    try {
      await execAsync('bun install');
    } catch (error) {
      log.error('Failed to install dependencies');
      process.exit(1);
    }
  }
  
  log.success('Prerequisites check passed');
}

// Validate environment variables
function validateEnv() {
  log.info('Validating environment variables...');
  
  const envContent = readFileSync('.env', 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'APOLLO_API_KEY',
    'HUNTER_API_KEY',
    'STRIPE_SECRET_KEY',
    'SENDGRID_API_KEY',
    'FROM_EMAIL'
  ];
  
  const missingVars = requiredVars.filter(varName => !envVars[varName] || envVars[varName] === 'your_value_here');
  
  if (missingVars.length > 0) {
    log.error('Missing required environment variables:');
    missingVars.forEach(varName => console.log(`  - ${varName}`));
    log.warning('Please fill in all required variables in .env file');
    process.exit(1);
  }
  
  log.success('Environment variables validated');
}

// Test build
async function testBuild() {
  log.info('Testing build process...');
  
  try {
    await execAsync('bun run build');
    log.success('Build completed successfully');
  } catch (error) {
    log.error('Build failed. Please fix errors before deploying.');
    console.error(error.stdout || error.message);
    process.exit(1);
  }
}

// Deploy to Vercel
async function deployVercel() {
  log.info('Deploying to Vercel...');
  
  // Check if vercel CLI is installed
  if (!(await commandExists('vercel'))) {
    log.info('Installing Vercel CLI...');
    try {
      await execAsync('npm install -g vercel');
    } catch (error) {
      log.error('Failed to install Vercel CLI');
      process.exit(1);
    }
  }
  
  // Check if logged in
  try {
    await execAsync('vercel whoami');
  } catch {
    log.info('Please login to Vercel...');
    await execAsync('vercel login');
  }
  
  // Deploy
  log.info('Starting deployment...');
  try {
    const { stdout } = await execAsync('vercel --prod --yes');
    console.log(stdout);
    log.success('Deployment to Vercel completed!');
    log.warning('Don\\'t forget to add environment variables in Vercel dashboard');
  } catch (error) {
    log.error('Deployment failed');
    console.error(error.stdout || error.message);
  }
}

// Deploy to Railway
async function deployRailway() {
  log.info('Deploying to Railway...');
  
  // Check if railway CLI is installed
  if (!(await commandExists('railway'))) {
    log.info('Installing Railway CLI...');
    try {
      await execAsync('npm install -g @railway/cli');
    } catch (error) {
      log.error('Failed to install Railway CLI');
      process.exit(1);
    }
  }
  
  // Login if needed
  try {
    await execAsync('railway whoami');
  } catch {
    log.info('Please login to Railway...');
    await execAsync('railway login');
  }
  
  // Deploy
  log.info('Starting deployment...');
  try {
    const { stdout } = await execAsync('railway up');
    console.log(stdout);
    log.success('Deployment to Railway completed!');
  } catch (error) {
    log.error('Deployment failed');
    console.error(error.stdout || error.message);
  }
}

// Deploy to Render (instructions only)
function deployRender() {
  log.info('Deploying to Render...');
  
  log.warning('For Render deployment:');
  console.log('1. Go to https://render.com');
  console.log('2. Connect your GitHub repository');
  console.log('3. Create a new Web Service');
  console.log('4. Use these settings:');
  console.log('   - Build Command: bun install && bun run build');
  console.log('   - Start Command: bun run serve');
  console.log('   - Environment: Node');
  console.log('5. Add environment variables from your .env file');
  
  log.success('Render deployment instructions provided');
}

// Deploy to Cloudflare Workers
async function deployCloudflare() {
  log.info('Deploying to Cloudflare Workers...');
  
  // Check if wrangler is installed
  if (!(await commandExists('wrangler'))) {
    log.info('Installing Wrangler CLI...');
    try {
      await execAsync('npm install -g wrangler');
    } catch (error) {
      log.error('Failed to install Wrangler CLI');
      process.exit(1);
    }
  }
  
  // Login if needed
  try {
    await execAsync('wrangler whoami');
  } catch {
    log.info('Please login to Cloudflare...');
    await execAsync('wrangler login');
  }
  
  // Check if wrangler.toml exists
  if (!existsSync('wrangler.toml')) {
    log.info('Creating wrangler.toml...');
    const wranglerConfig = `name = "autoleadgen-pro"
main = "src/worker.js"
compatibility_date = "2024-01-01"

[env.production]
vars = { NODE_ENV = "production" }

[[env.production.kv_namespaces]]
binding = "LEADS_KV"
preview_id = "your_preview_id"
id = "your_production_id"

[env.production.triggers]
crons = ["0 */4 * * *", "0 9,13,17 * * *", "0 2 * * *"]`;
    
    await Bun.write('wrangler.toml', wranglerConfig);
    log.warning('Please update wrangler.toml with your KV namespace IDs');
  }
  
  // Deploy
  log.info('Starting deployment...');
  try {
    const { stdout } = await execAsync('wrangler publish');
    console.log(stdout);
    log.success('Deployment to Cloudflare Workers completed!');
  } catch (error) {
    log.error('Deployment failed');
    console.error(error.stdout || error.message);
  }
}

// Show menu
function showMenu() {
  console.log('');
  log.info('Choose deployment option:');
  console.log('1) Vercel (Recommended - Easiest)');
  console.log('2) Railway (Full Backend)');
  console.log('3) Render (Simple Deploy)');
  console.log('4) Cloudflare Workers (Best Performance)');
  console.log('5) Test build only');
  console.log('6) Exit');
  console.log('');
}

// Main function
async function main() {
  console.log('');
  log.header('AutoLeadGen Pro - Deployment Script');
  console.log('======================================');
  
  try {
    // Check prerequisites
    await checkPrerequisites();
    
    // Validate environment
    validateEnv();
    
    // Test build
    await testBuild();
    
    // Show deployment options
    while (true) {
      showMenu();
      const choice = await question('Enter your choice (1-6): ');
      
      switch (choice.trim()) {
        case '1':
          await deployVercel();
          break;
        case '2':
          await deployRailway();
          break;
        case '3':
          deployRender();
          break;
        case '4':
          await deployCloudflare();
          break;
        case '5':
          log.success('Build test completed successfully!');
          break;
        case '6':
          log.info('Deployment cancelled.');
          process.exit(0);
        default:
          log.error('Invalid option. Please choose 1-6.');
          continue;
      }
      break;
    }
    
    console.log('');
    log.success('Deployment process completed!');
    console.log('');
    log.info('Next steps:');
    console.log('1. Verify your platform is working at the provided URL');
    console.log('2. Add environment variables in your hosting dashboard');
    console.log('3. Test lead generation and payment processing');
    console.log('4. Start acquiring your first clients!');
    console.log('');
    log.info('Need help? Check DEPLOYMENT.md or contact support@autoleadgen.pro');
    
  } catch (error) {
    log.error(`Deployment failed: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
if (import.meta.main) {
  main();
}