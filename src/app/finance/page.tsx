"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard, 
  PieChart, 
  Receipt,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Wallet,
  Building
} from "lucide-react";

// Dummy data for Finance dashboard
const financeMetrics = {
  totalRevenue: "$2,450,000",
  monthlyGrowth: 12.5,
  expenses: "$1,890,000",
  profit: "$560,000",
  cashFlow: "$340,000",
  pendingInvoices: 23,
  overduePayments: 5
};

const recentTransactions = [
  {
    id: 1,
    type: "income",
    description: "Software License - Enterprise",
    amount: 45000,
    date: "2024-02-08",
    status: "completed",
    category: "Revenue"
  },
  {
    id: 2,
    type: "expense",
    description: "Office Rent - Q1 2024",
    amount: -12000,
    date: "2024-02-07",
    status: "completed",
    category: "Operations"
  },
  {
    id: 3,
    type: "income",
    description: "Consulting Services",
    amount: 8500,
    date: "2024-02-06",
    status: "pending",
    category: "Services"
  },
  {
    id: 4,
    type: "expense",
    description: "Cloud Infrastructure",
    amount: -3200,
    date: "2024-02-05",
    status: "completed",
    category: "Technology"
  }
];

const budgetCategories = [
  { name: "Salaries", allocated: 800000, spent: 720000, percentage: 90 },
  { name: "Marketing", allocated: 200000, spent: 150000, percentage: 75 },
  { name: "Operations", allocated: 300000, spent: 280000, percentage: 93 },
  { name: "Technology", allocated: 150000, spent: 120000, percentage: 80 },
  { name: "Travel", allocated: 50000, spent: 35000, percentage: 70 }
];

const invoices = [
  {
    id: "INV-001",
    client: "Acme Corporation",
    amount: 25000,
    dueDate: "2024-02-15",
    status: "overdue",
    daysOverdue: 5
  },
  {
    id: "INV-002", 
    client: "TechStart Inc.",
    amount: 15000,
    dueDate: "2024-02-20",
    status: "pending",
    daysOverdue: 0
  },
  {
    id: "INV-003",
    client: "Global Solutions",
    amount: 32000,
    dueDate: "2024-02-25",
    status: "paid",
    daysOverdue: 0
  }
];

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor financial performance and manage budgets
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button>
              <Receipt className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeMetrics.totalRevenue}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{financeMetrics.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeMetrics.profit}</div>
              <p className="text-xs text-muted-foreground">
                22.9% profit margin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeMetrics.cashFlow}</div>
              <p className="text-xs text-muted-foreground">
                Available liquidity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeMetrics.pendingInvoices}</div>
              <p className="text-xs text-red-600">
                {financeMetrics.overduePayments} overdue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest financial activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Budget Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                  <CardDescription>Current budget utilization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {budgetCategories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {category.percentage}% utilized
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Detailed view of all financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Transaction Management</h3>
                  <p className="text-muted-foreground">
                    Complete transaction history with filtering, search, and export capabilities.
                  </p>
                  <Button className="mt-4">View All Transactions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Planning</CardTitle>
                <CardDescription>Manage departmental budgets and allocations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <PieChart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Budget Management</h3>
                  <p className="text-muted-foreground">
                    Create, modify, and track budget allocations across departments.
                  </p>
                  <Button className="mt-4">Manage Budgets</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Management</CardTitle>
                <CardDescription>Track and manage customer invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{invoice.id}</p>
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' : 
                          invoice.status === 'overdue' ? 'destructive' : 'secondary'
                        }>
                          {invoice.status === 'paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {invoice.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {invoice.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{invoice.client}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {invoice.dueDate}
                        {invoice.status === 'overdue' && ` (${invoice.daysOverdue} days overdue)`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${invoice.amount.toLocaleString()}</p>
                      {invoice.status !== 'paid' && (
                        <Button size="sm" variant="outline" className="mt-2">
                          Send Reminder
                        </Button>
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
