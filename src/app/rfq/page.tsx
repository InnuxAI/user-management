"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Calendar,
  Building,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";

// Dummy RFQ data
const rfqData = [
  {
    id: "RFQ-001",
    hospitalName: "City General Hospital",
    manufacturerName: "MedTech Solutions Inc.",
    priceExpected: 150000,
    priceGiven: 145000,
    dateProcessed: "2024-02-08",
    status: "Approved",
    category: "Imaging Equipment",
    description: "MRI Scanner - 1.5T",
    contactPerson: "Dr. Sarah Johnson",
    submittedDate: "2024-02-01"
  },
  {
    id: "RFQ-002",
    hospitalName: "Metro Medical Center",
    manufacturerName: "HealthCare Devices Ltd.",
    priceExpected: 75000,
    priceGiven: 82000,
    dateProcessed: "2024-02-07",
    status: "Under Review",
    category: "Surgical Equipment",
    description: "Surgical Robot System",
    contactPerson: "Michael Chen",
    submittedDate: "2024-01-28"
  },
  {
    id: "RFQ-003",
    hospitalName: "Regional Health Network",
    manufacturerName: "BioMed Innovations",
    priceExpected: 25000,
    priceGiven: 23500,
    dateProcessed: "2024-02-06",
    status: "Rejected",
    category: "Monitoring Equipment",
    description: "Patient Monitoring System (10 units)",
    contactPerson: "Emily Rodriguez",
    submittedDate: "2024-01-25"
  },
  {
    id: "RFQ-004",
    hospitalName: "Children's Hospital",
    manufacturerName: "PediCare Medical",
    priceExpected: 45000,
    priceGiven: 44000,
    dateProcessed: "2024-02-05",
    status: "Pending",
    category: "Pediatric Equipment",
    description: "Pediatric Ventilator System",
    contactPerson: "Dr. Lisa Wang",
    submittedDate: "2024-01-30"
  },
  {
    id: "RFQ-005",
    hospitalName: "University Medical Center",
    manufacturerName: "Advanced Medical Systems",
    priceExpected: 200000,
    priceGiven: 195000,
    dateProcessed: "2024-02-04",
    status: "Approved",
    category: "Laboratory Equipment",
    description: "Automated Lab Analysis System",
    contactPerson: "David Brown",
    submittedDate: "2024-01-22"
  },
  {
    id: "RFQ-006",
    hospitalName: "Emergency Care Hospital",
    manufacturerName: "QuickResponse Medical",
    priceExpected: 35000,
    priceGiven: 38000,
    dateProcessed: "2024-02-03",
    status: "Under Review",
    category: "Emergency Equipment",
    description: "Portable Defibrillator Units (5 units)",
    contactPerson: "Jennifer Lee",
    submittedDate: "2024-01-20"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Approved':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'Under Review':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'Rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'Pending':
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Approved': return 'default';
    case 'Under Review': return 'secondary';
    case 'Rejected': return 'destructive';
    case 'Pending': return 'outline';
    default: return 'outline';
  }
};

export default function RFQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(rfqData);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterData(query, selectedStatus);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    filterData(searchQuery, status);
  };

  const filterData = (query: string, status: string) => {
    let filtered = rfqData;

    if (status !== "all") {
      filtered = filtered.filter(item => item.status === status);
    }

    if (query.trim()) {
      filtered = filtered.filter(item =>
        item.hospitalName.toLowerCase().includes(query.toLowerCase()) ||
        item.manufacturerName.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const calculateStats = () => {
    const total = rfqData.length;
    const approved = rfqData.filter(item => item.status === 'Approved').length;
    const pending = rfqData.filter(item => item.status === 'Pending').length;
    const underReview = rfqData.filter(item => item.status === 'Under Review').length;
    const totalValue = rfqData.reduce((sum, item) => sum + item.priceGiven, 0);

    return { total, approved, pending, underReview, totalValue };
  };

  const stats = calculateStats();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Request for Quotation (RFQ)</h1>
            <p className="text-muted-foreground">
              Manage and track RFQ submissions from hospitals and manufacturers
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New RFQ
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total RFQs</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All submissions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.approved / stats.total) * 100).toFixed(1)}% approval rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.underReview + stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Pending decisions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Quoted amounts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by hospital, manufacturer, or RFQ ID..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === "all" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={selectedStatus === "Approved" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("Approved")}
                  size="sm"
                >
                  Approved
                </Button>
                <Button
                  variant={selectedStatus === "Under Review" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("Under Review")}
                  size="sm"
                >
                  Under Review
                </Button>
                <Button
                  variant={selectedStatus === "Pending" ? "default" : "outline"}
                  onClick={() => handleStatusFilter("Pending")}
                  size="sm"
                >
                  Pending
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RFQ Table */}
        <Card>
          <CardHeader>
            <CardTitle>RFQ Submissions</CardTitle>
            <CardDescription>
              Complete list of all RFQ submissions with status and pricing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Hospital Name</TableHead>
                    <TableHead>Manufacturer Name</TableHead>
                    <TableHead>Price Expected</TableHead>
                    <TableHead>Price Given</TableHead>
                    <TableHead>Date Processed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((rfq) => (
                    <TableRow key={rfq.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{rfq.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rfq.hospitalName}</div>
                          <div className="text-sm text-muted-foreground">{rfq.contactPerson}</div>
                        </div>
                      </TableCell>
                      <TableCell>{rfq.manufacturerName}</TableCell>
                      <TableCell>
                        <div className="font-medium">${rfq.priceExpected.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${rfq.priceGiven.toLocaleString()}</div>
                        <div className={`text-sm ${
                          rfq.priceGiven <= rfq.priceExpected 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {rfq.priceGiven <= rfq.priceExpected ? '↓' : '↑'} 
                          {Math.abs(((rfq.priceGiven - rfq.priceExpected) / rfq.priceExpected) * 100).toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{rfq.dateProcessed}</div>
                        <div className="text-sm text-muted-foreground">
                          Submitted: {rfq.submittedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(rfq.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(rfq.status)}
                          {rfq.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{rfq.category}</div>
                          <div className="text-xs text-muted-foreground">{rfq.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No RFQ submissions found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
