// Email templates for automated outreach and client communication

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  category: 'welcome' | 'lead_delivery' | 'payment' | 'followup' | 'reporting';
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'client_welcome',
    name: 'Client Welcome Email',
    category: 'welcome',
    subject: 'Welcome to AutoLeadGen Pro - Your Lead Generation Starts Now! 🎯',
    variables: ['client_name', 'company_name', 'industry', 'monthly_budget', 'leads_target'],
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to AutoLeadGen Pro</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your automated lead generation journey starts now!</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-top: 0;">Hi {{client_name}}! 👋</h2>
          
          <p>Welcome to AutoLeadGen Pro! We're excited to help <strong>{{company_name}}</strong> generate high-quality leads in the {{industry}} industry.</p>
          
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">What happens next:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>✅ Lead generation starts within 24 hours</li>
              <li>🎯 First batch of qualified prospects delivered</li>
              <li>🤖 AI scoring ensures only quality leads reach you</li>
              <li>📊 Real-time dashboard access</li>
            </ul>
          </div>
          
          <p>Best regards,<br>The AutoLeadGen Pro Team</p>
        </div>
      </div>`,
    textContent: 'Hi {{client_name}}!\n\nWelcome to AutoLeadGen Pro! We\'re excited to help {{company_name}} generate high-quality leads in the {{industry}} industry.\n\nWhat happens next:\n✅ Lead generation starts within 24 hours\n🎯 First batch of qualified prospects delivered\n🤖 AI scoring ensures only quality leads reach you\n📊 Real-time dashboard access\n\nYour Setup Summary:\n• Industry: {{industry}}\n• Monthly Budget: ${{monthly_budget}}\n• Target Leads: {{leads_target}} per month\n\nBest regards,\nThe AutoLeadGen Pro Team'
  },
  
  {
    id: 'leads_delivered',
    name: 'New Leads Delivered',
    category: 'lead_delivery',
    subject: '🎯 {{leads_count}} New Qualified Leads Ready for {{company_name}}',
    variables: ['client_name', 'company_name', 'leads_count', 'avg_score'],
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎯 New Leads Delivered!</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-top: 0;">Hi {{client_name}}! 🚀</h2>
          
          <p><strong>Great news!</strong> We've generated {{leads_count}} new qualified leads for {{company_name}}.</p>
          <p>Average lead score: {{avg_score}}/100</p>
          
          <p>Best regards,<br>The AutoLeadGen Pro Team</p>
        </div>
      </div>`,
    textContent: `
Hi {{client_name}}!

Great news! We've generated {{leads_count}} new qualified leads for {{company_name}}.

Average lead score: {{avg_score}}/100

Best regards,
The AutoLeadGen Pro Team`
  }
];

// Utility function to replace variables in email content
export function replaceEmailVariables(content: string, variables: Record<string, string | number>): string {
  let result = content;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value));
  });
  
  return result;
}

// Get template by ID
export function getEmailTemplate(id: string): EmailTemplate | undefined {
  return emailTemplates.find(template => template.id === id);
}

// Get templates by category
export function getEmailTemplatesByCategory(category: EmailTemplate['category']): EmailTemplate[] {
  return emailTemplates.filter(template => template.category === category);
}