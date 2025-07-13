import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  BarChart3, 
  Users, 
  Target, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Settings, 
  Play, 
  Pause,
  Bot,
  Mail,
  Phone,
  Star,
  CheckCircle,
  Clock,
  CreditCard,
  Filter,
  Download,
  ExternalLink
} from "lucide-react";

// Types
interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  score: number;
  status: 'new' | 'qualified' | 'contacted' | 'converted' | 'rejected';
  source: string;
  value: number;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  industry: string;
  budget: number;
  targetMarket: string;
  status: 'active' | 'paused' | 'setup';
  leadsDelivered: number;
  conversion: number;
  revenue: number;
}

interface Campaign {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  target: number;
  costPerLead: number;
  budget: number;
  spent: number;
  conversion: number;
}

export default function AutoLeadGenPro() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAutomationRunning, setIsAutomationRunning] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechStart Inc',
      email: 'sarah@techstart.com',
      phone: '+1-555-0123',
      industry: 'Technology',
      location: 'San Francisco, CA',
      score: 92,
      status: 'qualified',
      source: 'LinkedIn Automation',
      value: 50000,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Mike Chen',
      company: 'HealthPlus Medical',
      email: 'mike@healthplus.com',
      phone: '+1-555-0456',
      industry: 'Healthcare',
      location: 'New York, NY',
      score: 88,
      status: 'new',
      source: 'Email Campaign',
      value: 75000,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      company: 'RetailPro Systems',
      email: 'emma@retailpro.com',
      phone: '+1-555-0789',
      industry: 'Retail',
      location: 'Chicago, IL',
      score: 95,
      status: 'contacted',
      source: 'Cold Outreach',
      value: 35000,
      createdAt: '2024-01-13'
    }
  ]);

  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'David Kim',
      company: 'SaaS Solutions Corp',
      industry: 'Software',
      budget: 10000,
      targetMarket: 'B2B Tech Companies',
      status: 'active',
      leadsDelivered: 45,
      conversion: 18.5,
      revenue: 8500
    },
    {
      id: '2',
      name: 'Lisa Rodriguez',
      company: 'Marketing Agency Pro',
      industry: 'Marketing',
      budget: 15000,
      targetMarket: 'Small Businesses',
      status: 'active',
      leadsDelivered: 62,
      conversion: 22.1,
      revenue: 12400
    }
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Tech Startup Outreach',
      clientId: '1',
      clientName: 'SaaS Solutions Corp',
      status: 'active',
      progress: 75,
      target: 50,
      costPerLead: 85,
      budget: 5000,
      spent: 3200,
      conversion: 18.5
    },
    {
      id: '2',
      name: 'SMB Lead Generation',
      clientId: '2',
      clientName: 'Marketing Agency Pro',
      status: 'active',
      progress: 60,
      target: 80,
      costPerLead: 65,
      budget: 7500,
      spent: 4200,
      conversion: 22.1
    }
  ]);

  // Statistics
  const totalRevenue = clients.reduce((sum, client) => sum + client.revenue, 0);
  const totalLeads = leads.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const avgLeadScore = Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length);
  const conversionRate = leads.filter(l => l.status === 'converted').length / totalLeads * 100;

  // Auto-generate leads simulation
  useEffect(() => {
    if (!isAutomationRunning) return;

    const interval = setInterval(() => {
      const names = ['John Smith', 'Jane Doe', 'Robert Brown', 'Alice Green', 'Tom White'];
      const companies = ['TechCorp', 'InnovateLtd', 'BusinessPro', 'StartupInc', 'GrowthCo'];
      const industries = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'];
      const sources = ['LinkedIn Automation', 'Email Campaign', 'Cold Outreach', 'Web Scraping', 'API Integration'];
      
      const newLead: Lead = {
        id: Date.now().toString(),
        name: names[Math.floor(Math.random() * names.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        email: `contact@${companies[Math.floor(Math.random() * companies.length)].toLowerCase()}.com`,
        phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
        industry: industries[Math.floor(Math.random() * industries.length)],
        location: 'Various, US',
        score: Math.floor(Math.random() * 40) + 60,
        status: 'new',
        source: sources[Math.floor(Math.random() * sources.length)],
        value: Math.floor(Math.random() * 80000) + 20000,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setLeads(prev => [newLead, ...prev]);
    }, 30000); // New lead every 30 seconds

    return () => clearInterval(interval);
  }, [isAutomationRunning]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'qualified': return 'bg-green-500';
      case 'contacted': return 'bg-yellow-500';
      case 'converted': return 'bg-purple-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">AutoLeadGen Pro</h1>
                <p className="text-sm text-slate-500">100% Automated Lead Generation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isAutomationRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">
                  {isAutomationRunning ? 'System Active' : 'System Paused'}
                </span>
              </div>
              
              <Button
                onClick={() => setIsAutomationRunning(!isAutomationRunning)}
                variant={isAutomationRunning ? "destructive" : "default"}
                size="sm"
                className="gap-2"
              >
                {isAutomationRunning ? (
                  <><Pause className="w-4 h-4" /> Pause</>  
                ) : (
                  <><Play className="w-4 h-4" /> Start</>
                )}
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'leads', label: 'Leads', icon: Target },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'campaigns', label: 'Campaigns', icon: Zap },
              { id: 'automation', label: 'Automation', icon: Bot },
              { id: 'payments', label: 'Payments', icon: CreditCard }
            ].map(nav => {
              const Icon = nav.icon;
              return (
                <button
                  key={nav.id}
                  onClick={() => setCurrentView(nav.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    currentView === nav.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {nav.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3" /> +12.5% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeClients}</div>
                  <p className="text-xs text-muted-foreground">
                    +{clients.length - activeClients} new this week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLeads}</div>
                  <p className="text-xs text-muted-foreground">
                    {conversionRate.toFixed(1)}% conversion rate
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgLeadScore}</div>
                  <p className="text-xs text-muted-foreground">
                    Quality improving
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Latest qualified prospects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leads.slice(0, 5).map(lead => (
                      <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(lead.status)}`} />
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${getScoreColor(lead.score)}`}>Score: {lead.score}</p>
                          <p className="text-sm text-muted-foreground">${lead.value.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Campaigns</CardTitle>
                  <CardDescription>Monitor campaign progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map(campaign => (
                      <div key={campaign.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{campaign.name}</h3>
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{campaign.clientName}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress: {Math.round(campaign.progress * campaign.target / 100)}/{campaign.target} leads</span>
                            <span>${campaign.costPerLead} CPL</span>
                          </div>
                          <Progress value={campaign.progress} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'leads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Lead Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="text-left p-4 font-medium">Lead</th>
                        <th className="text-left p-4 font-medium">Company</th>
                        <th className="text-left p-4 font-medium">Industry</th>
                        <th className="text-left p-4 font-medium">Score</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Value</th>
                        <th className="text-left p-4 font-medium">Source</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <tr key={lead.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.email}</p>
                            </div>
                          </td>
                          <td className="p-4">{lead.company}</td>
                          <td className="p-4">{lead.industry}</td>
                          <td className="p-4">
                            <span className={`font-medium ${getScoreColor(lead.score)}`}>
                              {lead.score}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant="secondary" 
                              className={`${getStatusColor(lead.status)} text-white`}
                            >
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="p-4">${lead.value.toLocaleString()}</td>
                          <td className="p-4 text-sm">{lead.source}</td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Mail className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Phone className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'clients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Client Management</h2>
              <Button>
                <Users className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map(client => (
                <Card key={client.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </div>
                    <CardDescription>{client.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Industry</span>
                        <span className="text-sm font-medium">{client.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Budget</span>
                        <span className="text-sm font-medium">${client.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Leads Delivered</span>
                        <span className="text-sm font-medium">{client.leadsDelivered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="text-sm font-medium text-green-600">{client.conversion}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Revenue Generated</span>
                        <span className="text-sm font-medium text-green-600">${client.revenue.toLocaleString()}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Target Market</p>
                        <p className="text-sm">{client.targetMarket}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentView === 'automation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Automation Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Generation Automation</CardTitle>
                  <CardDescription>Configure automated lead discovery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-linkedin">LinkedIn Automation</Label>
                    <Switch id="auto-linkedin" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-email">Email Campaigns</Label>
                    <Switch id="auto-email" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-scraping">Web Scraping</Label>
                    <Switch id="auto-scraping" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-social">Social Media Mining</Label>
                    <Switch id="auto-social" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Client Acquisition</CardTitle>
                  <CardDescription>Automated client finding and onboarding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-prospect">Client Prospecting</Label>
                    <Switch id="auto-prospect" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-outreach">Automated Outreach</Label>
                    <Switch id="auto-outreach" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-follow">Follow-up Sequences</Label>
                    <Switch id="auto-follow" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-onboard">Auto Onboarding</Label>
                    <Switch id="auto-onboard" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lead Qualification</CardTitle>
                  <CardDescription>Automated lead scoring and qualification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="min-score">Minimum Lead Score</Label>
                    <Input id="min-score" type="number" defaultValue="75" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="industry-filter">Industry Filter</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="company-size">Company Size</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        <SelectItem value="startup">Startup (1-50)</SelectItem>
                        <SelectItem value="sme">SME (51-500)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (500+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Automation</CardTitle>
                  <CardDescription>Automated billing and payment processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-invoice">Auto Invoicing</Label>
                    <Switch id="auto-invoice" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-payment">Payment Processing</Label>
                    <Switch id="auto-payment" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-reminder">Payment Reminders</Label>
                    <Switch id="auto-reminder" defaultChecked />
                  </div>
                  <div>
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Select defaultValue="net30">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payment Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(totalRevenue * 0.85).toFixed(0)}</div>
                  <p className="text-xs text-green-600">+15.2% vs last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(totalRevenue * 0.15).toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">2 pending invoices</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(totalRevenue * 0.029).toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">2.9% average</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Automated payment processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{client.company}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.leadsDelivered} leads delivered
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${client.revenue.toLocaleString()}</p>
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Paid
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg border-yellow-200 bg-yellow-50">
                    <div>
                      <p className="font-medium">New Client Prospect</p>
                      <p className="text-sm text-muted-foreground">8 leads delivered</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$680</p>
                      <Badge variant="secondary" className="bg-yellow-500 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
