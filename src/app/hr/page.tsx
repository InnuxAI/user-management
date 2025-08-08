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
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

// Dummy data for HR dashboard
const hrMetrics = {
  totalEmployees: 247,
  newHires: 12,
  activeRecruitments: 8,
  upcomingReviews: 15,
  avgSalary: "$75,000",
  turnoverRate: 3.2
};

const recentHires = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior Developer",
    department: "Engineering",
    startDate: "2024-01-15",
    avatar: "/avatars/sarah.jpg",
    status: "onboarding"
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "UX Designer",
    department: "Design",
    startDate: "2024-01-20",
    avatar: "/avatars/michael.jpg",
    status: "completed"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "Marketing Manager",
    department: "Marketing",
    startDate: "2024-01-25",
    avatar: "/avatars/emily.jpg",
    status: "pending"
  }
];

const leaveRequests = [
  {
    id: 1,
    employee: "John Smith",
    type: "Annual Leave",
    dates: "Feb 15-19, 2024",
    status: "pending",
    reason: "Family vacation"
  },
  {
    id: 2,
    employee: "Lisa Wang",
    type: "Sick Leave",
    dates: "Feb 10, 2024",
    status: "approved",
    reason: "Medical appointment"
  },
  {
    id: 3,
    employee: "David Brown",
    type: "Personal Leave",
    dates: "Feb 20-21, 2024",
    status: "rejected",
    reason: "Personal matters"
  }
];

const departmentStats = [
  { name: "Engineering", count: 85, growth: 12 },
  { name: "Sales", count: 42, growth: 8 },
  { name: "Marketing", count: 28, growth: 5 },
  { name: "HR", count: 15, growth: 2 },
  { name: "Finance", count: 22, growth: 3 }
];

export default function HRPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HR Management</h1>
            <p className="text-muted-foreground">
              Manage employees, recruitment, and HR operations
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrMetrics.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                +{hrMetrics.newHires} new this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Recruitments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrMetrics.activeRecruitments}</div>
              <p className="text-xs text-muted-foreground">
                Across 5 departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrMetrics.upcomingReviews}</div>
              <p className="text-xs text-muted-foreground">
                Due this quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrMetrics.turnoverRate}%</div>
              <p className="text-xs text-muted-foreground">
                -0.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Hires */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Hires</CardTitle>
                  <CardDescription>New employees who joined recently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentHires.map((hire) => (
                    <div key={hire.id} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={hire.avatar} />
                        <AvatarFallback>{hire.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{hire.name}</p>
                        <p className="text-sm text-muted-foreground">{hire.position}</p>
                        <p className="text-xs text-muted-foreground">{hire.department}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          hire.status === 'completed' ? 'default' : 
                          hire.status === 'onboarding' ? 'secondary' : 'outline'
                        }>
                          {hire.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{hire.startDate}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Employee count by department</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {departmentStats.map((dept) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {dept.count} (+{dept.growth})
                        </span>
                      </div>
                      <Progress value={(dept.count / hrMetrics.totalEmployees) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>Manage all employees and their information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Employee Management</h3>
                  <p className="text-muted-foreground">
                    Full employee directory with search, filters, and management tools would be implemented here.
                  </p>
                  <Button className="mt-4">View All Employees</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recruitment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Job Postings</CardTitle>
                <CardDescription>Current open positions and recruitment pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Award className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Recruitment Pipeline</h3>
                  <p className="text-muted-foreground">
                    Job postings, candidate tracking, and interview scheduling tools.
                  </p>
                  <Button className="mt-4">Manage Postings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Pending and recent leave requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{request.employee}</p>
                      <p className="text-sm text-muted-foreground">{request.type} - {request.dates}</p>
                      <p className="text-xs text-muted-foreground">{request.reason}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        request.status === 'approved' ? 'default' : 
                        request.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {request.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {request.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {request.status}
                      </Badge>
                      {request.status === 'pending' && (
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">Approve</Button>
                          <Button size="sm" variant="outline">Reject</Button>
                        </div>
                      )}
                    </div>
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
