import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Bot, 
  Users, 
  Target, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Settings, 
  Play, 
  Pause,
  Mail,
  Phone,
  Star,
  CheckCircle,
  Clock,
  CreditCard,
  Filter,
  Download,
  ExternalLink,
  Plus,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckIcon
} from "lucide-react";

// Interfaces
interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  industry: string;
  location: string;
  score: number;
  status: 'new' | 'qualified' | 'contacted' | 'converted' | 'rejected';
  source: string;
  value: number;
  confidence: number;
  created_at: string;
  updated_at: string;
  client_id?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  budget: number;
  target_criteria: any;
  status: 'active' | 'paused' | 'trial' | 'churned';
  leads_delivered: number;
  conversion_rate: number;
  total_revenue: number;
  monthly_fee: number;
  payment_status: 'current' | 'overdue' | 'failed';
  stripe_customer_id?: string;
  created_at: string;
}

interface Analytics {
  total_revenue: number;
  monthly_recurring_revenue: number;
  total_clients: number;
  active_clients: number;
  total_leads: number;
  qualified_leads: number;
  conversion_rate: string;
  avg_lead_score: number;
  growth_metrics: {
    weekly_leads: number;
    monthly_revenue: number;
    client_growth: number;
  };
}

// API base URL - adjust for your deployment
const API_BASE = '/api';

// API utility functions
const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
};

export default function AutoLeadGenPro() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  // New client form state
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    budget: 5000,
    monthly_fee: 497
  });
  
  // Lead generation criteria
  const [leadCriteria, setLeadCriteria] = useState({
    industry: 'Technology',
    company_sizes: ['1,50', '51,200'],
    titles: ['CEO', 'Founder', 'VP', 'Director'],
    locations: ['United States'],
    domain: ''
  });

  // Load initial data
  useEffect(() => {
    loadData();
    checkSystemStatus();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leadsRes, clientsRes, analyticsRes] = await Promise.all([
        api.get('/leads'),
        api.get('/clients'),
        api.get('/analytics')
      ]);
      
      setLeads(leadsRes.leads || []);
      setClients(clientsRes.clients || []);
      setAnalytics(analyticsRes);
    } catch (error) {
      toast.error('Failed to load data. Using demo mode.');
      console.error('Load error:', error);
      // Set some demo data for offline mode
      setAnalytics({
        total_revenue: 0,
        monthly_recurring_revenue: 0,
        total_clients: 0,
        active_clients: 0,
        total_leads: 0,
        qualified_leads: 0,
        conversion_rate: '0.0',
        avg_lead_score: 0,
        growth_metrics: {
          weekly_leads: 0,
          monthly_revenue: 0,
          client_growth: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const health = await api.get('/health');
      setIsAutomationRunning(health.status === 'operational');
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const generateLeads = async () => {
    try {
      setGenerating(true);
      toast.info('Starting lead generation from multiple sources...');
      
      const response = await api.post('/leads/generate', {
        criteria: leadCriteria,
        sources: ['apollo', 'hunter', 'webscraping', 'social']
      });
      
      if (response.success) {
        toast.success(`✅ Generated ${response.leads.length} new leads!`);
        setLeads(prev => [...response.leads, ...prev]);
        
        // Update analytics
        if (analytics) {
          setAnalytics({
            ...analytics,
            total_leads: analytics.total_leads + response.leads.length,
            qualified_leads: analytics.qualified_leads + response.leads.filter((l: Lead) => l.score >= 80).length
          });
        }
      } else {
        toast.error('Lead generation failed');
      }
    } catch (error) {
      toast.error('Error generating leads. Check your API configuration.');
      console.error('Generate leads error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const createClient = async () => {
    if (!newClient.name || !newClient.email || !newClient.company) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await api.post('/clients', newClient);
      
      if (response.success) {
        toast.success('✅ Client created successfully!');
        setClients(prev => [response.client, ...prev]);
        setNewClient({ name: '', email: '', company: '', industry: '', budget: 5000, monthly_fee: 497 });
        
        // Update analytics
        if (analytics) {
          setAnalytics({
            ...analytics,
            total_clients: analytics.total_clients + 1
          });
        }
      } else {
        toast.error('Failed to create client');
      }
    } catch (error) {
      toast.error('Error creating client');
      console.error('Create client error:', error);
    }
  };

  const startAutomation = async (type: string) => {
    try {
      const response = await api.post('/automation/start', {
        type,
        criteria: leadCriteria
      });
      
      if (response.success) {
        toast.success(`✅ ${type.replace('_', ' ')} automation started!`);
        setIsAutomationRunning(true);
      } else {
        toast.error('Automation failed to start');
      }
    } catch (error) {
      toast.error('Error starting automation');
      console.error('Automation error:', error);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading AutoLeadGen Pro...</p>
          <p className="text-sm text-muted-foreground">Connecting to lead generation services</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-slate-500">🚀 Real Lead Generation Platform</p>
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
              
              <Button 
                onClick={generateLeads} 
                disabled={generating}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Generate Leads</>
                )}
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
              { id: 'automation', label: 'Automation', icon: Bot },
              { id: 'payments', label: 'Revenue', icon: CreditCard }
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
            {/* Alert for first-time users */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardContent className="flex items-center gap-3 pt-6">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Welcome to your REAL lead generation platform!
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Click "Generate Leads" above to start finding prospects using Apollo.io, Hunter.io, and web scraping.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics?.total_revenue?.toLocaleString() || '0'}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3" /> MRR: ${analytics?.monthly_recurring_revenue?.toLocaleString() || '0'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.active_clients || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Total: {analytics?.total_clients || 0} clients
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.total_leads || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.conversion_rate || '0'}% conversion rate
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.avg_lead_score || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.qualified_leads || 0} qualified leads
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Latest prospects generated</CardDescription>
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
                    {leads.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No leads yet. Click "Generate Leads" to start!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Clients</CardTitle>
                  <CardDescription>Current paying customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.filter(c => c.status === 'active').slice(0, 5).map(client => (
                      <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">${client.monthly_fee}/mo</p>
                          <p className="text-sm text-muted-foreground">{client.leads_delivered} leads</p>
                        </div>
                      </div>
                    ))}
                    {clients.filter(c => c.status === 'active').length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No active clients yet. Go to Clients tab to add one!</p>
                      </div>
                    )}
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
                <Button 
                  onClick={generateLeads} 
                  disabled={generating}
                  className="gap-2"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Generate More</>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
            
            {/* Lead Generation Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation Criteria</CardTitle>
                <CardDescription>Configure your target audience</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Industry</Label>
                  <Select value={leadCriteria.industry} onValueChange={(value) => setLeadCriteria({...leadCriteria, industry: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Company Domain (for Hunter.io)</Label>
                  <Input 
                    placeholder="example.com"
                    value={leadCriteria.domain}
                    onChange={(e) => setLeadCriteria({...leadCriteria, domain: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="United States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
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
                              <Button size="sm" variant="outline" title="Send Email">
                                <Mail className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" title="Call">
                                <Phone className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" title="View Profile">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {leads.length === 0 && (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No leads generated yet</h3>
                      <p className="text-muted-foreground mb-4">Click "Generate Leads" to start finding prospects</p>
                      <Button onClick={generateLeads} disabled={generating}>
                        {generating ? 'Generating...' : 'Generate First Leads'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'clients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Client Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Create a new client account for lead generation services
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input 
                          value={newClient.name}
                          onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input 
                          type="email"
                          value={newClient.email}
                          onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input 
                        value={newClient.company}
                        onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                        placeholder="Company Name Inc"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Industry</Label>
                        <Select value={newClient.industry} onValueChange={(value) => setNewClient({...newClient, industry: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Consulting">Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Monthly Fee ($)</Label>
                        <Input 
                          type="number"
                          value={newClient.monthly_fee}
                          onChange={(e) => setNewClient({...newClient, monthly_fee: parseInt(e.target.value)})}
                          placeholder="497"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Budget ($)</Label>
                      <Input 
                        type="number"
                        value={newClient.budget}
                        onChange={(e) => setNewClient({...newClient, budget: parseInt(e.target.value)})}
                        placeholder="5000"
                      />
                    </div>
                    <Button onClick={createClient} className="w-full">
                      Create Client
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                        <span className="text-sm text-muted-foreground">Monthly Fee</span>
                        <span className="text-sm font-medium">${client.monthly_fee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Leads Delivered</span>
                        <span className="text-sm font-medium">{client.leads_delivered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                        <span className="text-sm font-medium text-green-600">${client.total_revenue.toLocaleString()}</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">Manage</Button>
                          <Button size="sm" className="flex-1">Generate Leads</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {clients.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No clients yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first client to start generating revenue</p>
                </div>
              )}
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
                  <CardDescription>Automatically find and qualify prospects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-apollo">Apollo.io Integration</Label>
                    <Switch id="auto-apollo" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-hunter">Hunter.io Email Finding</Label>
                    <Switch id="auto-hunter" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-scraping">Web Scraping</Label>
                    <Switch id="auto-scraping" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-social">Social Media Mining</Label>
                    <Switch id="auto-social" />
                  </div>
                  <Button 
                    onClick={() => startAutomation('lead_generation')} 
                    className="w-full mt-4"
                  >
                    Start Lead Generation
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Client Acquisition</CardTitle>
                  <CardDescription>Automatically find and onboard new clients</CardDescription>
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
                  <Button 
                    onClick={() => startAutomation('client_prospecting')} 
                    className="w-full mt-4"
                  >
                    Start Client Acquisition
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics?.monthly_recurring_revenue?.toLocaleString() || '0'}</div>
                  <p className="text-xs text-green-600">Active subscriptions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics?.total_revenue?.toLocaleString() || '0'}</div>
                  <p className="text-xs text-muted-foreground">All time earnings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{analytics?.growth_metrics?.client_growth || 0}%</div>
                  <p className="text-xs text-muted-foreground">Month over month</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Income from lead generation services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.filter(c => c.total_revenue > 0).map(client => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{client.company}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.leads_delivered} leads delivered
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${client.total_revenue.toLocaleString()}</p>
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Paid
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {clients.filter(c => c.total_revenue > 0).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No revenue generated yet. Add clients to start earning!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}