"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  TrendingUp, 
  Users, 
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Building2,
  UserPlus,
  BarChart3
} from "lucide-react";

// Dummy data for Sales dashboard
const salesMetrics = {
  totalRevenue: "$1,850,000",
  monthlyTarget: "$2,000,000",
  targetProgress: 92.5,
  activeLeads: 156,
  convertedLeads: 34,
  conversionRate: 21.8,
  avgDealSize: "$54,400",
  salesTeamSize: 12
};

const salesTeam = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Senior Sales Rep",
    avatar: "/avatars/alex.jpg",
    target: 180000,
    achieved: 165000,
    deals: 12,
    performance: 91.7
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Sales Manager",
    avatar: "/avatars/sarah.jpg",
    target: 200000,
    achieved: 210000,
    deals: 15,
    performance: 105.0
  },
  {
    id: 3,
    name: "Mike Chen",
    role: "Business Development",
    avatar: "/avatars/mike.jpg",
    target: 150000,
    achieved: 132000,
    deals: 9,
    performance: 88.0
  },
  {
    id: 4,
    name: "Emma Davis",
    role: "Account Executive",
    avatar: "/avatars/emma.jpg",
    target: 175000,
    achieved: 185000,
    deals: 11,
    performance: 105.7
  }
];

const recentDeals = [
  {
    id: 1,
    company: "TechCorp Solutions",
    contact: "Robert Smith",
    value: 85000,
    stage: "Negotiation",
    probability: 80,
    expectedClose: "2024-02-15",
    rep: "Sarah Williams"
  },
  {
    id: 2,
    company: "Digital Innovations",
    contact: "Lisa Chen",
    value: 42000,
    stage: "Proposal",
    probability: 60,
    expectedClose: "2024-02-20",
    rep: "Alex Johnson"
  },
  {
    id: 3,
    company: "Global Enterprises",
    contact: "Mark Wilson",
    value: 120000,
    stage: "Qualified",
    probability: 40,
    expectedClose: "2024-03-01",
    rep: "Emma Davis"
  },
  {
    id: 4,
    company: "StartUp Inc",
    contact: "Jennifer Lee",
    value: 28000,
    stage: "Closed Won",
    probability: 100,
    expectedClose: "2024-02-08",
    rep: "Mike Chen"
  }
];

const leadSources = [
  { source: "Website", count: 45, percentage: 28.8 },
  { source: "Referrals", count: 38, percentage: 24.4 },
  { source: "Social Media", count: 32, percentage: 20.5 },
  { source: "Email Campaign", count: 25, percentage: 16.0 },
  { source: "Cold Outreach", count: 16, percentage: 10.3 }
];

const activities = [
  {
    id: 1,
    type: "call",
    description: "Follow-up call with TechCorp Solutions",
    rep: "Sarah Williams",
    time: "2 hours ago",
    company: "TechCorp Solutions"
  },
  {
    id: 2,
    type: "email",
    description: "Sent proposal to Digital Innovations",
    rep: "Alex Johnson",
    time: "4 hours ago",
    company: "Digital Innovations"
  },
  {
    id: 3,
    type: "meeting",
    description: "Demo scheduled with Global Enterprises",
    rep: "Emma Davis",
    time: "6 hours ago",
    company: "Global Enterprises"
  }
];

export default function SalesPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
            <p className="text-muted-foreground">
              Track sales performance and manage pipeline
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Sales Report
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Sales Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesMetrics.totalRevenue}</div>
              <div className="mt-2">
                <Progress value={salesMetrics.targetProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {salesMetrics.targetProgress}% of {salesMetrics.monthlyTarget} target
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesMetrics.activeLeads}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{salesMetrics.convertedLeads} converted this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesMetrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Above industry average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesMetrics.avgDealSize}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last quarter
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="team">Sales Team</TabsTrigger>
            <TabsTrigger value="leads">Lead Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Deals */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Deals</CardTitle>
                  <CardDescription>Latest pipeline activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentDeals.slice(0, 4).map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{deal.company}</p>
                          <p className="text-xs text-muted-foreground">{deal.contact} • {deal.rep}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${deal.value.toLocaleString()}</p>
                        <Badge variant={
                          deal.stage === 'Closed Won' ? 'default' : 
                          deal.stage === 'Negotiation' ? 'secondary' : 'outline'
                        }>
                          {deal.stage}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sales Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest sales team activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'call' ? 'bg-blue-100 text-blue-600' : 
                        activity.type === 'email' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'call' && <Phone className="h-4 w-4" />}
                        {activity.type === 'email' && <Mail className="h-4 w-4" />}
                        {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.rep} • {activity.company} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <CardDescription>Detailed view of all opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{deal.company}</p>
                        <Badge variant={
                          deal.stage === 'Closed Won' ? 'default' : 
                          deal.stage === 'Negotiation' ? 'secondary' : 'outline'
                        }>
                          {deal.stage}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Contact: {deal.contact}</p>
                      <p className="text-xs text-muted-foreground">
                        Expected close: {deal.expectedClose} • Rep: {deal.rep}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold">${deal.value.toLocaleString()}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                        <Progress value={deal.probability} className="w-16 h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Team Performance</CardTitle>
                <CardDescription>Individual performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {salesTeam.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{member.performance}%</p>
                          <p className="text-xs text-muted-foreground">{member.deals} deals</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Target Progress</span>
                          <span>${member.achieved.toLocaleString()} / ${member.target.toLocaleString()}</span>
                        </div>
                        <Progress value={(member.achieved / member.target) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Where our leads are coming from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {leadSources.map((source) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{source.source}</span>
                      <span className="text-sm text-muted-foreground">
                        {source.count} leads ({source.percentage}%)
                      </span>
                    </div>
                    <Progress value={source.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
