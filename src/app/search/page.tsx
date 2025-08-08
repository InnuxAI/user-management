"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar,
  Clock,
  User,
  Building,
  Tag,
  Star,
  ExternalLink
} from "lucide-react";

// Dummy search results data
const searchResults = {
  documents: [
    {
      id: 1,
      title: "Medical Equipment Procurement Guidelines 2024",
      type: "PDF",
      size: "2.4 MB",
      lastModified: "2024-02-05",
      author: "Dr. Sarah Johnson",
      department: "Procurement",
      tags: ["guidelines", "medical equipment", "procurement"],
      rating: 4.8,
      description: "Comprehensive guidelines for medical equipment procurement procedures, vendor evaluation, and compliance requirements."
    },
    {
      id: 2,
      title: "Hospital Safety Protocols - Emergency Procedures",
      type: "DOCX",
      size: "1.2 MB",
      lastModified: "2024-02-03",
      author: "Michael Chen",
      department: "Safety",
      tags: ["safety", "emergency", "protocols"],
      rating: 4.9,
      description: "Detailed emergency procedures and safety protocols for hospital staff during various emergency situations."
    },
    {
      id: 3,
      title: "Patient Care Standards and Best Practices",
      type: "PDF",
      size: "3.1 MB",
      lastModified: "2024-01-28",
      author: "Emily Rodriguez",
      department: "Quality Assurance",
      tags: ["patient care", "standards", "best practices"],
      rating: 4.7,
      description: "Evidence-based standards and best practices for patient care across different departments and specialties."
    }
  ],
  users: [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@vetamed.com",
      department: "Procurement",
      role: "Department Head",
      lastActive: "2024-02-08",
      avatar: "/avatars/sarah.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@vetamed.com",
      department: "Safety",
      role: "Safety Officer",
      lastActive: "2024-02-07",
      avatar: "/avatars/michael.jpg"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@vetamed.com",
      department: "Quality Assurance",
      role: "QA Manager",
      lastActive: "2024-02-06",
      avatar: "/avatars/emily.jpg"
    }
  ],
  projects: [
    {
      id: 1,
      name: "Digital Health Records Migration",
      status: "In Progress",
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      team: ["Dr. Sarah Johnson", "Michael Chen", "3 others"],
      progress: 65,
      description: "Migration of all patient records to new digital health management system."
    },
    {
      id: 2,
      name: "Emergency Response System Upgrade",
      status: "Planning",
      startDate: "2024-03-01",
      endDate: "2024-08-15",
      team: ["Emily Rodriguez", "Michael Chen", "5 others"],
      progress: 15,
      description: "Comprehensive upgrade of hospital emergency response and communication systems."
    },
    {
      id: 3,
      name: "Patient Satisfaction Improvement Initiative",
      status: "Completed",
      startDate: "2023-10-01",
      endDate: "2024-01-31",
      team: ["Dr. Sarah Johnson", "Emily Rodriguez", "4 others"],
      progress: 100,
      description: "Multi-phase initiative to improve patient satisfaction scores and experience quality."
    }
  ]
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredResults, setFilteredResults] = useState(searchResults);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredResults(searchResults);
      return;
    }

    const filtered = {
      documents: searchResults.documents.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.description.toLowerCase().includes(query.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ),
      users: searchResults.users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.department.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase())
      ),
      projects: searchResults.projects.filter(project => 
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase())
      )
    };

    setFilteredResults(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Planning': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Search</h1>
            <p className="text-muted-foreground">
              Find documents, users, and projects across the platform
            </p>
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for documents, users, projects..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All Results ({filteredResults.documents.length + filteredResults.users.length + filteredResults.projects.length})
            </TabsTrigger>
            <TabsTrigger value="documents">Documents ({filteredResults.documents.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({filteredResults.users.length})</TabsTrigger>
            <TabsTrigger value="projects">Projects ({filteredResults.projects.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Documents Section */}
            {filteredResults.documents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Documents</h3>
                <div className="grid gap-4">
                  {filteredResults.documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <FileText className="h-5 w-5 text-blue-500 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-medium hover:text-primary cursor-pointer">{doc.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {doc.author}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {doc.department}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {doc.lastModified}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {doc.rating}
                                </span>
                              </div>
                              <div className="flex gap-1 mt-2">
                                {doc.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{doc.type}</Badge>
                            <Badge variant="outline">{doc.size}</Badge>
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Users Section */}
            {filteredResults.users.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Users</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredResults.users.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.role}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>{user.department}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Last active: {user.lastActive}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {filteredResults.projects.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Projects</h3>
                <div className="grid gap-4">
                  {filteredResults.projects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{project.name}</h4>
                              <Badge variant={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{project.startDate} - {project.endDate}</span>
                              <span>Team: {project.team.join(", ")}</span>
                              <span>Progress: {project.progress}%</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            {filteredResults.documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="h-5 w-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium hover:text-primary cursor-pointer">{doc.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {doc.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {doc.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {doc.lastModified}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {doc.rating}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{doc.type}</Badge>
                      <Badge variant="outline">{doc.size}</Badge>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredResults.users.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{user.department}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last active: {user.lastActive}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {filteredResults.projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{project.startDate} - {project.endDate}</span>
                        <span>Team: {project.team.join(", ")}</span>
                        <span>Progress: {project.progress}%</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
