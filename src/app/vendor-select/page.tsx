"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { AIReportSheet } from "@/components/ai-report-sheet";
import { AIAnalysisSheet } from "@/components/ai-analysis-sheet";
import { VendorSelectSidebar } from "@/components/vendor-select-sidebar";
import { ConnectionStatus } from "@/components/connection-status";
import { DocumentProcessingIndicator, DocumentProcessingBadge } from "@/components/document-processing-indicator";
import { RFQCreationModal } from "@/components/rfq-creation-modal";
import { RFQCriteriaModal } from "@/components/rfq-criteria-modal";

import { RealTimeProvider, useRealTime, useDocumentProcessing, useRFQStatus } from "@/contexts/RealTimeContext";
import { api, apiHelpers, handleApiError } from "@/lib/api";
import { APITest } from "@/components/api-test";
import { toast } from "sonner";
import { ChevronRight, ChevronDown, Search, Filter, Download, Plus, X, Brain, Wifi, Settings } from "lucide-react";
import Link from "next/link";
import { LordIcon, LORDICON_URLS } from "@/components/ui/lord-icon";

interface VendorDetail {
  id: string;
  name: string;
  status: "Selected" | "Pending Selection" | "Rejected";
  totalDocs: number;
  receivedDocs: number;
  pendingDocs: number;
  rejectedDocs: number;
  completionPercentage: number;
  avgScore: number;
  documents: DocumentDetail[];
}

interface DocumentDetail {
  name: string;
  status: "Received" | "Pending" | "Rejected";
  statusBadge: string;
  score: number;
  document_id?: string;
  blob_url?: string;
  blob_name?: string;
}

interface ProjectData {
  id: string;
  name: string;
  rfqs: RFQDetail[];
}

interface RFQDetail {
  id: string;
  vendors: VendorDetail[];
  selectedVendorId?: string;
}

interface Filters {
  projectId: string;
  rfqId: string;
  vendorStatus: string;
  documentStatus: string;
}

interface RFQDocument {
  id: string;
  name: string;
  status: "Waiting" | "Processed";
  score?: string;
}

interface RFQGroup {
  id: string;
  documents: RFQDocument[];
}

export default function VendorSelectPage() {
  return (
    <RealTimeProvider>
      <VendorSelectPageContent />
    </RealTimeProvider>
  );
}

function VendorSelectPageContent() {
  // Real-time hooks
  const realTime = useRealTime();
  const documentProcessing = useDocumentProcessing();
  const rfqStatus = useRFQStatus();
  
  const [selectedRFQ, setSelectedRFQ] = useState<string>("RFQ-001-A");
  const [selectedDocument, setSelectedDocument] = useState<string>("Doc1");
  const [isAIReportOpen, setIsAIReportOpen] = useState(false);
  const [isAIAnalysisOpen, setIsAIAnalysisOpen] = useState(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [criteriaRFQId, setCriteriaRFQId] = useState<string>("");

  // AI Analysis state management
  const [aiAnalysisAvailability, setAiAnalysisAvailability] = useState<Map<string, boolean>>(new Map());
  const [aiAnalysisData, setAiAnalysisData] = useState<any>(null);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    projectId: "",
    rfqId: "",
    vendorStatus: "",
    documentStatus: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Combined state for both API and mock data
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Subscribe to RFQ updates when selected RFQ changes
  useEffect(() => {
    if (selectedRFQ) {
      realTime.subscribeToRFQ(selectedRFQ);
    }
  }, [selectedRFQ, realTime]);
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('[API] Fetching data...');
        
        // Add a small delay to see the loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch projects first
        const projectsResponse = await api.projects.list();
        console.log('[PROJECTS] Response:', projectsResponse);
        
        if (!projectsResponse.success) {
          throw new Error('Failed to fetch projects');
        }
        
        const projects = projectsResponse.data;
        console.log('[PROJECTS] Found:', projects);
        
        // For each project, fetch its RFQs and build the full structure
        const transformedProjects: ProjectData[] = await Promise.all(
          projects.map(async (project: any) => {
            console.log(`[PROJECT] Processing: ${project.id}`);
            try {
              // Fetch RFQs for this project
              const rfqsResponse = await api.projects.getRFQs(project.id);
              console.log(`[RFQS] For ${project.id}:`, rfqsResponse);
              
              if (!rfqsResponse.success) {
                console.warn(`Failed to fetch RFQs for project ${project.id}`);
                return {
                  id: project.id,
                  name: project.name,
                  rfqs: []
                };
              }
              
              const rfqs = rfqsResponse.data;
              console.log(`[RFQS] Data for ${project.id}:`, rfqs);
              
              // For each RFQ, fetch vendors and status
              const transformedRFQs = await Promise.all(
                rfqs.map(async (rfq: any) => {
                  try {
                    console.log(`[VENDORS] Fetching for RFQ ${rfq.rfq_id || rfq.id}...`);
                    const vendorsResponse = await api.rfqs.getVendors(rfq.rfq_id || rfq.id);
                    console.log(`[VENDORS] Response for ${rfq.rfq_id || rfq.id}:`, vendorsResponse);
                    
                    const vendors = vendorsResponse.success 
                      ? vendorsResponse.data.map((vendor: any) => ({
                          id: vendor.vendor_id || vendor.id,
                          name: vendor.vendor_name || vendor.name || vendor.vendor_id || vendor.id,
                          totalDocs: vendor.total_docs || 0,
                          receivedDocs: vendor.received_docs || 0,
                          pendingDocs: vendor.pending_docs || 0,
                          rejectedDocs: vendor.rejected_docs || 0,
                          completionPercentage: vendor.completion_percentage || 0,
                          avgScore: vendor.avg_score || vendor.score || 0,
                          documents: (vendor.documents || []).map((doc: any) => ({
                            name: doc.name || doc.filename || doc.doc_id,
                            status: doc.status === 'processed' ? 'Received' : 
                                   doc.status === 'failed' ? 'Rejected' : 'Pending',
                            statusBadge: doc.status === 'processed' ? 'success' : 
                                        doc.status === 'failed' ? 'danger' : 'Not Received',
                            score: doc.score || doc.ai_score || 0,
                            // Azure Blob Storage fields
                            blob_url: doc.blob_url,
                            blob_name: doc.blob_name,
                            document_id: doc.document_id || doc.id,
                            received_at: doc.received_at || doc.created_at,
                            processing_status: doc.processing_status || doc.status,
                            file_size: doc.file_size || doc.size || 0,
                            document_type: doc.document_type || 'proposal'
                          }))
                        }))
                      : [];
                      
                    console.log(`[VENDORS] Transformed for ${rfq.rfq_id || rfq.id}:`, vendors);
                      
                    return {
                      id: rfq.rfq_id || rfq.id,
                      vendors: vendors
                    };
                  } catch (error) {
                    console.warn(`Failed to fetch data for RFQ ${rfq.rfq_id || rfq.id}:`, error);
                    return {
                      id: rfq.rfq_id || rfq.id,
                      vendors: []
                    };
                  }
                })
              );
              
              const result = {
                id: project.id,
                name: project.name,
                rfqs: transformedRFQs
              };
              console.log(`[PROJECT] Final structure for ${project.id}:`, result);
              return result;
              
            } catch (error) {
              console.warn(`Failed to fetch data for project ${project.id}:`, error);
              return {
                id: project.id,
                name: project.name,
                rfqs: []
              };
            }
          })
        );
        
        console.log('[DATA] All transformed:', transformedProjects);
        setProjectsData(transformedProjects);
        setLoading(false);
        
      } catch (error) {
        console.error('[ERROR] API fetch failed:', error);
        handleApiError(error, 'Failed to load vendor data');
        setLoading(false);
        
        // Fall back to mock data if API fails
        console.log('[FALLBACK] Using mock data...');
        setProjectsData(mockProjectsData);
      }
    };

    fetchData();
  }, []);

  // Check AI analysis availability for all RFQs when data loads
  useEffect(() => {
    const checkAllRFQsAvailability = async () => {
      if (projectsData.length > 0) {
        const allRFQIds = projectsData.flatMap(project => 
          project.rfqs.map(rfq => rfq.id)
        );
        
        // Check availability for all RFQs in parallel
        await Promise.all(
          allRFQIds.map(rfqId => checkAIAnalysisAvailability(rfqId))
        );
      }
    };

    checkAllRFQsAvailability();
  }, [projectsData]);

  // Update data when real-time updates come in
  useEffect(() => {
    if (rfqStatus.latestStatus) {
      setProjectsData(prevData => 
        prevData.map((project: ProjectData) => ({
          ...project,
          rfqs: project.rfqs.map((rfq: any) => 
            rfq.id === rfqStatus.latestStatus.rfq_id 
              ? { ...rfq, status: rfqStatus.latestStatus }
              : rfq
          )
        }))
      );
    }
  }, [rfqStatus.latestStatus]);
  
  // Set current time on client side only to avoid hydration mismatch
  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }) + ' at ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setCurrentTime(timeString);
  }, []);
  
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(["PRJ-2024-001"]));
  const [expandedRFQs, setExpandedRFQs] = useState<Set<string>>(new Set(["RFQ-001-A"]));
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set(["AWS Solutions"]));
  
  // Mock data (fallback)
  const mockProjectsData: ProjectData[] = [
    {
      id: "PRJ-2024-001",
      name: "Cloud Infrastructure Migration",
      rfqs: [
        {
          id: "RFQ-001-A",
          selectedVendorId: "AWS Solutions",
          vendors: [
            {
              id: "AWS Solutions",
              name: "AWS Solutions",
              status: "Selected",
              totalDocs: 4,
              receivedDocs: 3,
              pendingDocs: 1,
              rejectedDocs: 1,
              completionPercentage: 75,
              avgScore: 7.8,
              documents: [
                { name: "Compliance Certificate", status: "Received", statusBadge: "Received", score: 9 },
                { name: "Technical Specifications", status: "Received", statusBadge: "Received", score: 8 },
                { name: "Vendor Quote", status: "Received", statusBadge: "Received", score: 7 },
                { name: "Implementation Plan", status: "Rejected", statusBadge: "Rejected", score: 7 }
              ]
            },
            {
              id: "Microsoft Azure",
              name: "Microsoft Azure",
              status: "Pending Selection",
              totalDocs: 3,
              receivedDocs: 1,
              pendingDocs: 1,
              rejectedDocs: 1,
              completionPercentage: 33,
              avgScore: 6.0,
              documents: [
                { name: "Technical Proposal", status: "Received", statusBadge: "Received", score: 6 },
                { name: "Cost Breakdown", status: "Pending", statusBadge: "Pending", score: 0 },
                { name: "Security Assessment", status: "Rejected", statusBadge: "Rejected", score: 0 }
              ]
            },
            {
              id: "Google Cloud Platform",
              name: "Google Cloud Platform",
              status: "Pending Selection",
              totalDocs: 2,
              receivedDocs: 1,
              pendingDocs: 1,
              rejectedDocs: 0,
              completionPercentage: 50,
              avgScore: 6.0,
              documents: [
                { name: "Infrastructure Proposal", status: "Received", statusBadge: "Received", score: 6 },
                { name: "Migration Timeline", status: "Pending", statusBadge: "Pending", score: 0 }
              ]
            }
          ]
        },
        {
          id: "RFQ-001-B",
          vendors: [
            {
              id: "Digital Security Corp",
              name: "Digital Security Corp",
              status: "Pending Selection",
              totalDocs: 5,
              receivedDocs: 2,
              pendingDocs: 3,
              rejectedDocs: 0,
              completionPercentage: 40,
              avgScore: 7.2,
              documents: [
                { name: "Security Framework", status: "Received", statusBadge: "Received", score: 8 },
                { name: "Compliance Report", status: "Received", statusBadge: "Received", score: 7 },
                { name: "Implementation Plan", status: "Pending", statusBadge: "Pending", score: 0 },
                { name: "Cost Analysis", status: "Pending", statusBadge: "Pending", score: 0 },
                { name: "Timeline", status: "Pending", statusBadge: "Pending", score: 0 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "PRJ-2024-002",
      name: "Enterprise Software Licensing",
      rfqs: [
        {
          id: "RFQ-002-A",
          selectedVendorId: "Microsoft Corp",
          vendors: [
            {
              id: "Microsoft Corp",
              name: "Microsoft Corp",
              status: "Selected",
              totalDocs: 1,
              receivedDocs: 1,
              pendingDocs: 0,
              rejectedDocs: 0,
              completionPercentage: 100,
              avgScore: 8.5,
              documents: [
                { name: "License Agreement", status: "Received", statusBadge: "Received", score: 8.5 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "PRJ-2024-003",
      name: "Security Audit & Consultation",
      rfqs: [
        {
          id: "RFQ-003-A",
          vendors: [
            {
              id: "CyberSec Solutions",
              name: "CyberSec Solutions",
              status: "Pending Selection",
              totalDocs: 1,
              receivedDocs: 1,
              pendingDocs: 0,
              rejectedDocs: 0,
              completionPercentage: 100,
              avgScore: 7.0,
              documents: [
                { name: "Security Assessment", status: "Received", statusBadge: "Received", score: 7 }
              ]
            }
          ]
        }
      ]
    }
  ];

  // Toggle functions for expansion
  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const toggleRFQ = (rfqId: string) => {
    const newExpanded = new Set(expandedRFQs);
    if (newExpanded.has(rfqId)) {
      newExpanded.delete(rfqId);
    } else {
      newExpanded.add(rfqId);
    }
    setExpandedRFQs(newExpanded);
  };

  const toggleVendor = (vendorId: string) => {
    const newExpanded = new Set(expandedVendors);
    if (newExpanded.has(vendorId)) {
      newExpanded.delete(vendorId);
    } else {
      newExpanded.add(vendorId);
    }
    setExpandedVendors(newExpanded);
  };

  // Function to update document status
  const updateDocumentStatus = (projectId: string, rfqId: string, vendorId: string, docIndex: number, newStatus: "Received" | "Pending" | "Rejected") => {
    setProjectsData(prevData => {
      return prevData.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            rfqs: project.rfqs.map(rfq => {
              if (rfq.id === rfqId) {
                return {
                  ...rfq,
                  vendors: rfq.vendors.map(vendor => {
                    if (vendor.id === vendorId) {
                      const updatedDocuments = [...vendor.documents];
                      updatedDocuments[docIndex] = {
                        ...updatedDocuments[docIndex],
                        status: newStatus,
                        statusBadge: newStatus,
                        score: newStatus === "Received" ? updatedDocuments[docIndex].score : 0
                      };

                      // Recalculate vendor statistics
                      const receivedDocs = updatedDocuments.filter(doc => doc.status === "Received").length;
                      const pendingDocs = updatedDocuments.filter(doc => doc.status === "Pending").length;
                      const rejectedDocs = updatedDocuments.filter(doc => doc.status === "Rejected").length;
                      const completionPercentage = Math.round((receivedDocs / updatedDocuments.length) * 100);

                      return {
                        ...vendor,
                        documents: updatedDocuments,
                        receivedDocs,
                        pendingDocs,
                        rejectedDocs,
                        completionPercentage
                      };
                    }
                    return vendor;
                  })
                };
              }
              return rfq;
            })
          };
        }
        return project;
      });
    });
  };

  // Convert project data to sidebar format
  const getSidebarData = () => {
    return projectsData.flatMap(project => 
      project.rfqs.map(rfq => ({
        id: rfq.id,
        documents: rfq.vendors.flatMap(vendor => 
          vendor.documents.map(doc => ({
            id: `${vendor.id}-${doc.name}`,
            name: doc.name,
            status: doc.status === "Received" ? "Processed" as const : "Waiting" as const,
            score: doc.score > 0 ? doc.score.toString() : undefined
          }))
        )
      }))
    );
  };

  const sidebarRFQGroups = getSidebarData();
  
  // Mock data based on the old design (now deprecated, using projectsData instead)
  const rfqGroups: RFQGroup[] = [
    {
      id: "rfq_001",
      documents: [
        { id: "doc1", name: "Doc1", status: "Waiting" },
        { id: "doc2", name: "Doc2", status: "Waiting" }
      ]
    },
    {
      id: "rfq_002",
      documents: [
        { id: "doc1", name: "Doc1", status: "Processed", score: "xyz" },
        { id: "doc2", name: "Doc2", status: "Processed", score: "abc" },
        { id: "doc3", name: "Doc3", status: "Processed", score: "def" }
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  // Filter functions with proper logic
  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

  const filteredData = projectsData.map(project => {
    const filteredRFQs = project.rfqs.filter(rfq => {
      // Global search filter (searches across project name, RFQ ID, and vendor names)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesProject = project.name.toLowerCase().includes(query) || 
                               project.id.toLowerCase().includes(query);
        const matchesRFQ = rfq.id.toLowerCase().includes(query);
        const matchesVendor = rfq.vendors.some(vendor => 
          vendor.name.toLowerCase().includes(query)
        );
        
        if (!matchesProject && !matchesRFQ && !matchesVendor) {
          return false;
        }
      }
      
      // Project ID filter
      if (filters.projectId && !project.id.toLowerCase().includes(filters.projectId.toLowerCase())) {
        return false;
      }
      
      // RFQ ID filter
      if (filters.rfqId && !rfq.id.toLowerCase().includes(filters.rfqId.toLowerCase())) {
        return false;
      }
      
      // Vendor Status filter
      if (filters.vendorStatus && filters.vendorStatus !== 'all') {
        const hasVendorWithStatus = rfq.vendors.some(vendor => {
          return vendor.status.toLowerCase() === filters.vendorStatus?.toLowerCase();
        });
        if (!hasVendorWithStatus) return false;
      }
      
      // Document Status filter
      if (filters.documentStatus && filters.documentStatus !== 'all') {
        const hasDocumentWithStatus = rfq.vendors.some(vendor => 
          vendor.documents.some(doc => 
            doc.status.toLowerCase() === filters.documentStatus?.toLowerCase()
          )
        );
        if (!hasDocumentWithStatus) return false;
      }
      
      return true;
    });

    return { ...project, rfqs: filteredRFQs };
  }).filter(project => project.rfqs.length > 0); // Only show projects with matching RFQs

  const updateFilter = (key: keyof Filters, value: string) => {
    const filterValue = value === "all" ? "" : value;
    setFilters(prev => ({ ...prev, [key]: filterValue }));
  };

  const clearFilter = (key: keyof Filters) => {
    setFilters(prev => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({ projectId: "", rfqId: "", vendorStatus: "", documentStatus: "" });
    setSearchQuery("");
  };

  const handleSendToErp = () => {
    toast.success(`${selectedDocument} has been sent to ERPNext successfully!`, {
      description: `RFQ ${selectedRFQ} data transmitted to ERP system.`
    });
  };

  const handleAIReport = () => {
    setIsAIReportOpen(true);
  };

  // AI Analysis handlers
  const checkAIAnalysisAvailability = async (rfqId: string) => {
    try {
      const response = await api.aiAnalysis.checkAvailability(rfqId);
      if (response.success) {
        setAiAnalysisAvailability(prev => new Map(prev.set(rfqId, response.data.available)));
        return response.data.available;
      }
      return false;
    } catch (error) {
      console.error(`Failed to check AI analysis availability for ${rfqId}:`, error);
      setAiAnalysisAvailability(prev => new Map(prev.set(rfqId, false)));
      return false;
    }
  };

  const handleAIAnalysis = async (rfqId: string) => {
    try {
      setAiAnalysisLoading(true);
      setSelectedRFQ(rfqId);
      
      const response = await api.aiAnalysis.getReport(rfqId);
      if (response.success) {
        setAiAnalysisData(response.data);
        setIsAIAnalysisOpen(true);
      } else {
        toast.error('AI Analysis Not Available', {
          description: 'No AI analysis report found for this RFQ. Documents may still be processing.'
        });
      }
    } catch (error) {
      console.error(`Failed to fetch AI analysis for ${rfqId}:`, error);
      toast.error('AI Analysis Error', {
        description: 'Failed to load AI analysis report. Please try again later.'
      });
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const handleDownloadReport = async (rfqId: string) => {
    try {
      setAiAnalysisLoading(true);
      
      // Call the new PDF download endpoint
      const response = await fetch(`/api/v1/rfqs/${rfqId}/ai-analysis/download-pdf`);
      
      if (response.ok) {
        // Get the filename from response headers
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `AI_Analysis_Report_${rfqId}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        // Create blob from response and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('PDF Report Downloaded', {
          description: `AI analysis report for ${rfqId} has been downloaded as PDF successfully.`
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast.error('Download Failed', {
          description: errorData.error || 'No AI analysis report found for this RFQ. Please generate the analysis first.'
        });
      }
    } catch (error) {
      console.error(`Failed to download AI analysis PDF for ${rfqId}:`, error);
      toast.error('Download Error', {
        description: 'Failed to download AI analysis report. Please try again later.'
      });
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const handleCriteria = (rfqId: string) => {
    setCriteriaRFQId(rfqId);
    setIsCriteriaModalOpen(true);
  };

  const handleCriteriaSave = () => {
    toast.success('Analysis Criteria', {
      description: 'RFQ analysis criteria saved successfully'
    });
  };

  const handleDocumentPreview = async (document: any) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Use the new streaming endpoint that handles Azure authentication
      let streamUrl = '';
      
      if (document.document_id) {
        // Use document ID for streaming endpoint (preferred)
        streamUrl = `${API_BASE_URL}/api/v1/documents/${document.document_id}/stream`;
      } else if (document.blob_name) {
        // Fallback to blob name streaming endpoint
        streamUrl = `${API_BASE_URL}/api/v1/documents/by-blob/${encodeURIComponent(document.blob_name)}/stream`;
      } else {
        throw new Error('No document ID or blob name available for preview');
      }
      
      // Open the streaming URL in a new window
      window.open(streamUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Preview failed:', error);
      alert('Unable to preview document. The document may not be available or there may be a connection issue.');
    }
  };

  const handleDocumentApproval = async (projectId: string, rfqId: string, vendorId: string, docIndex: number, action: 'accept' | 'reject') => {
    try {
      // Find the document to get its ID
      const vendor = projectsData
        .find((p: any) => p.id === projectId)?.rfqs
        .find((r: any) => r.id === rfqId)?.vendors
        .find((v: any) => v.id === vendorId);
      
      if (!vendor || !vendor.documents[docIndex]) {
        toast.error('Document not found');
        return;
      }

      const document = vendor.documents[docIndex];
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const endpoint = action === 'accept' ? 'approve' : 'reject';
      const response = await fetch(`${API_BASE_URL}/api/v1/rfqs/${rfqId}/vendors/${vendorId}/documents/${document.document_id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success(`Document ${action}ed successfully`);
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        toast.error(`Failed to ${action} document`);
      }
    } catch (error) {
      console.error(`Error ${action}ing document:`, error);
      toast.error(`Failed to ${action} document`);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Custom Vendor Select Sidebar */}
      <VendorSelectSidebar
        rfqGroups={sidebarRFQGroups}
        selectedRFQ={selectedRFQ}
        onRFQSelect={setSelectedRFQ}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Header with Search and Filters */}
        <div className="bg-card border-b">
          {/* Title and Actions Bar */}
          <div className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">Vendor Selection Dashboard</h1>
                  <ConnectionStatus />
                </div>
                <p className="text-muted-foreground mt-1 text-sm lg:text-base">
                  Manage and track vendor proposals across multiple projects and RFQs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={() => setIsRFQModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add RFQ
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="px-4 lg:px-6 pb-4">
            <Card className="bg-background">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects, RFQs, or vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="relative">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge 
                            variant="secondary" 
                            className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-blue-600 text-white text-xs"
                          >
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter Options</h4>
                          {activeFiltersCount > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearAllFilters}
                              className="h-8 px-2 text-xs"
                            >
                              Clear All
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Project ID</label>
                            <Select value={filters.projectId || "all"} onValueChange={(value) => updateFilter('projectId', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Project" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Projects</SelectItem>
                                {projectsData.map((project) => (
                                  <SelectItem key={project.id} value={project.id}>
                                    {project.id}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-1 block">RFQ ID</label>
                            <Select value={filters.rfqId || "all"} onValueChange={(value) => updateFilter('rfqId', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select RFQ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All RFQs</SelectItem>
                                {sidebarRFQGroups.map((group) => (
                                  <SelectItem key={group.id} value={group.id}>
                                    {group.id}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-1 block">Vendor Status</label>
                            <Select value={filters.vendorStatus || "all"} onValueChange={(value) => updateFilter('vendorStatus', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Vendor Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Vendor Status</SelectItem>
                                <SelectItem value="selected">Selected</SelectItem>
                                <SelectItem value="pending selection">Pending Selection</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-1 block">Document Status</label>
                            <Select value={filters.documentStatus || "all"} onValueChange={(value) => updateFilter('documentStatus', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Document Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Document Status</SelectItem>
                                <SelectItem value="received">Received</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  {/* Active Filter Badges */}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      {sidebarRFQGroups.length} RFQ{sidebarRFQGroups.length !== 1 ? 's' : ''}
                    </Badge>
                    
                    {filters.projectId && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1">
                        Project: {filters.projectId}
                        <button
                          onClick={() => clearFilter('projectId')}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          title="Clear project filter"
                          aria-label="Clear project filter"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    
                    {filters.rfqId && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 flex items-center gap-1">
                        RFQ: {filters.rfqId}
                        <button
                          onClick={() => clearFilter('rfqId')}
                          className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                          title="Clear RFQ filter"
                          aria-label="Clear RFQ filter"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    
                    {filters.vendorStatus && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                        Vendor: {filters.vendorStatus}
                        <button
                          onClick={() => clearFilter('vendorStatus')}
                          className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
                          title="Clear vendor status filter"
                          aria-label="Clear vendor status filter"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    
                    {filters.documentStatus && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 flex items-center gap-1">
                        Docs: {filters.documentStatus}
                        <button
                          onClick={() => clearFilter('documentStatus')}
                          className="ml-1 hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                          title="Clear document status filter"
                          aria-label="Clear document status filter"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 lg:p-6">
          {/* Document Processing Indicator */}
          {documentProcessing.isProcessing && (
            <div className="mb-4">
              <DocumentProcessingIndicator />
            </div>
          )}
          
          {/* Main Vendor Selection Table */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-64 font-semibold text-left">Project / RFQ / Vendor</TableHead>
                      <TableHead className="w-48 text-center font-semibold">Documents Summary</TableHead>
                      <TableHead className="w-40 text-center font-semibold">Status Overview</TableHead>
                      {/* <TableHead className="w-32 text-center font-semibold">Avg. Score</TableHead> */}
                      <TableHead className="w-36 text-center font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                            <span className="text-muted-foreground">Loading vendor data...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <p>No vendor data found.</p>
                            <p className="text-sm mt-1">Try adjusting your filters or check if data is being loaded from the API.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((project) => (
                      <React.Fragment key={project.id}>
                        {/* Project Row */}
                        <TableRow 
                          className="hover:bg-muted/50 cursor-pointer border-b-2"
                          onClick={() => toggleProject(project.id)}
                        >
                          <TableCell className="font-semibold">
                            <div className="flex items-center gap-2">
                              {expandedProjects.has(project.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <div>
                                <div className="font-semibold text-sm">{project.id}</div>
                                <div className="text-sm text-muted-foreground">{project.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {project.rfqs.length} RFQ{project.rfqs.length !== 1 ? 's' : ''}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {(() => {
                              const totalRFQs = project.rfqs.length;
                              const selectedRFQs = project.rfqs.filter(rfq => rfq.selectedVendorId).length;
                              const reportsGenerated = project.rfqs.filter(rfq => aiAnalysisAvailability.get(rfq.id)).length;
                              
                              if (selectedRFQs > 0) {
                                return <Badge className="bg-green-100 text-green-800">✓ Selected</Badge>;
                              } else if (totalRFQs > 0) {
                                // Always show progress bar for projects with multiple RFQs
                                const percentage = totalRFQs > 0 ? Math.round((reportsGenerated / totalRFQs) * 100) : 0;
                                return (
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="w-24 flex flex-col items-center gap-1">
                                      <Progress 
                                        value={percentage} 
                                        className="h-2 w-full"
                                      />
                                      <div className="text-xs text-muted-foreground">
                                        {reportsGenerated}/{totalRFQs} Reports
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (reportsGenerated > 0) {
                                // Single RFQ with report generated
                                return (
                                  <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                                    <LordIcon src={LORDICON_URLS.report} size={12} trigger="hover" />
                                    Report Generated
                                  </Badge>
                                );
                              } else {
                                // Single RFQ or no RFQs, no reports
                                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Selection</Badge>;
                              }
                            })()}
                          </TableCell>
                          {/* <TableCell className="text-center">-</TableCell> */}
                          <TableCell className="text-center">
                            <Button variant="outline" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>

                        {/* RFQ Rows (shown when project is expanded) */}
                        {expandedProjects.has(project.id) && project.rfqs.map((rfq) => (
                          <React.Fragment key={rfq.id}>
                            <TableRow 
                              className="hover:bg-muted/30 cursor-pointer bg-muted/20"
                              onClick={() => toggleRFQ(rfq.id)}
                            >
                              <TableCell>
                                <div className="flex items-center gap-2 ml-6">
                                  {expandedRFQs.has(rfq.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                  <div className="font-medium text-sm text-purple-700">{rfq.id}</div>
                                  <Badge variant="outline" className="text-xs">
                                    {rfq.vendors.length} vendor{rfq.vendors.length !== 1 ? 's' : ''}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center gap-1">
                                  {rfq.vendors.map((vendor, idx) => (
                                    <div key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                                      {vendor.receivedDocs}/{vendor.totalDocs} docs
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {rfq.selectedVendorId ? (
                                  <Badge className="bg-green-100 text-green-800">✓ Selected</Badge>
                                ) : aiAnalysisAvailability.get(rfq.id) ? (
                                  <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                                    <LordIcon src={LORDICON_URLS.report} size={12} trigger="hover" />
                                    Report Generated
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Selection</Badge>
                                )}
                              </TableCell>
                              {/* <TableCell className="text-center">-</TableCell> */}
                              <TableCell className="text-center">
                                <div className="flex gap-2 justify-center">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            disabled={!aiAnalysisAvailability.get(rfq.id) || aiAnalysisLoading}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAIAnalysis(rfq.id);
                                            }}
                                            className={`${!aiAnalysisAvailability.get(rfq.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                          >
                                            <Brain className="h-4 w-4 mr-1" />
                                            {aiAnalysisLoading && selectedRFQ === rfq.id ? 'Loading...' : 'AI Analysis'}
                                          </Button>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {aiAnalysisAvailability.get(rfq.id) 
                                            ? 'View AI-powered vendor analysis and recommendations' 
                                            : 'Documents Pending for AI Analysis'}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            disabled={!aiAnalysisAvailability.get(rfq.id) || aiAnalysisLoading}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDownloadReport(rfq.id);
                                            }}
                                            className={`h-8 ${!aiAnalysisAvailability.get(rfq.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                          >
                                            <Download className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {aiAnalysisAvailability.get(rfq.id) 
                                            ? 'Download AI analysis report as PDF' 
                                            : 'AI Analysis Required for Download'}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCriteria(rfq.id);
                                          }}
                                          className="h-8"
                                        >
                                          <Settings className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Manage analysis criteria for this RFQ</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  {rfq.selectedVendorId && (
                                    <Button 
                                      variant="default"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendToErp();
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      Send to ERP
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>

                            {/* Vendor Rows (shown when RFQ is expanded) */}
                            {expandedRFQs.has(rfq.id) && rfq.vendors.map((vendor) => (
                              <React.Fragment key={vendor.id}>
                                <TableRow 
                                  className="hover:bg-muted/20 cursor-pointer bg-background"
                                  onClick={() => toggleVendor(vendor.id)}
                                >
                                  <TableCell>
                                    <div className="flex items-center gap-2 ml-12">
                                      {expandedVendors.has(vendor.id) ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                      <div className="flex items-center gap-2">
                                        <div className="font-medium text-sm">{vendor.name}</div>
                                        {vendor.status === "Selected" && (
                                          <Badge className="bg-green-100 text-green-800 text-xs">✓ Selected</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="text-sm">
                                      <div className="font-medium">{vendor.totalDocs} total</div>
                                      <div className="text-xs text-muted-foreground">
                                        <span className="text-green-600">{vendor.receivedDocs} received</span>
                                        {vendor.pendingDocs > 0 && <span className="text-yellow-600"> • {vendor.pendingDocs} pending</span>}
                                        {vendor.rejectedDocs > 0 && <span className="text-red-600"> • {vendor.rejectedDocs} rejected</span>}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      {/* <Badge 
                                        variant={vendor.status === "Selected" ? "default" : "secondary"}
                                        className={vendor.status === "Selected" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                                      >
                                        {vendor.status}
                                      </Badge> */}
                                      <div className="w-20 flex flex-col items-center gap-1">
                                        <Progress 
                                          value={vendor.completionPercentage} 
                                          className="h-2 w-full"
                                        />
                                        <div className="text-xs text-muted-foreground">
                                          {vendor.completionPercentage.toFixed(2)}%
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  {/* <TableCell className="text-center">
                                    {vendor.avgScore > 0 ? (
                                      <span className={`px-2 py-1 rounded-md font-medium text-sm ${getScoreColor(vendor.avgScore * 10)}`}>
                                        {vendor.avgScore}/10
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell> */}
                                  <TableCell className="text-center">
                                    <div className="flex gap-1 justify-center">
                                      {vendor.status === "Selected" ? (
                                        <Button variant="outline" size="sm">View</Button>
                                      ) : (
                                        <>
                                          <Button variant="outline" size="sm">Select</Button>
                                          <Button variant="outline" size="sm">View</Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>

                                {/* Document Details (shown when vendor is expanded) */}
                                {expandedVendors.has(vendor.id) && (
                                  <TableRow className="bg-muted/10">
                                    <TableCell colSpan={5} className="p-0">
                                      <div className="p-4 ml-16 border-l-2 border-muted">
                                        <div className="overflow-x-auto">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead className="text-left w-1/3">Document Name</TableHead>
                                                <TableHead className="text-center w-1/6">Status</TableHead>
                                                <TableHead className="text-center w-1/6">Status Badge</TableHead>
                                                <TableHead className="text-center w-1/6">Actions</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {vendor.documents.map((doc, docIdx) => (
                                                <TableRow key={docIdx}>
                                                  <TableCell className="font-medium text-left w-1/3">{doc.name}</TableCell>
                                                  <TableCell className="text-center w-1/6">
                                                    <span className="text-sm font-medium">
                                                      {doc.status}
                                                    </span>
                                                  </TableCell>
                                                  <TableCell className="text-center w-1/6">
                                                    <Badge 
                                                      variant={doc.status === "Received" ? "default" : doc.status === "Pending" ? "secondary" : "destructive"}
                                                      className={
                                                        doc.status === "Received" ? "bg-green-100 text-green-800" :
                                                        doc.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-red-100 text-red-800"
                                                      }
                                                    >
                                                      {doc.statusBadge}
                                                    </Badge>
                                                  </TableCell>
                                                  <TableCell className="text-center w-1/6">
                                                    <div className="flex gap-1 justify-center">
                                                      {/* Only show View PDF for received documents */}
                                                      {doc.status === "Received" && (
                                                        <Button variant="outline" size="sm" onClick={() => handleDocumentPreview(doc)}>
                                                          View PDF
                                                        </Button>
                                                      )}
                                                      
                                                      {/* Only show Accept/Reject for received documents */}
                                                      {doc.status === "Received" && (
                                                        <>
                                                          <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => handleDocumentApproval(project.id, rfq.id, vendor.id, docIdx, 'accept')}
                                                          >
                                                            ✓
                                                          </Button>
                                                          <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDocumentApproval(project.id, rfq.id, vendor.id, docIdx, 'reject')}
                                                          >
                                                            ✗
                                                          </Button>
                                                        </>
                                                      )}
                                                      
                                                      {/* Show nothing for pending documents */}
                                                      {doc.status === "Pending" && (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                      )}
                                                    </div>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                              <TableRow>
                                                <TableCell colSpan={4} className="text-center">
                                                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Document
                                                  </Button>
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </Table>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Footer Information */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              {currentTime ? `Last updated: ${currentTime}` : 'Loading...'}
            </p>
          </div>
        </ScrollArea>
      </div>

      {/* AI Report Sheet */}
      <AIReportSheet
        isOpen={isAIReportOpen}
        onClose={() => setIsAIReportOpen(false)}
        rfqId={selectedRFQ}
        selectedDoc={selectedDocument}
      />

      {/* AI Analysis Sheet */}
      <AIAnalysisSheet
        isOpen={isAIAnalysisOpen}
        onOpenChange={setIsAIAnalysisOpen}
        rfqId={selectedRFQ}
        selectedVendor={
          projectsData
            .find(p => p.rfqs.some(rfq => rfq.id === selectedRFQ))
            ?.rfqs.find(rfq => rfq.id === selectedRFQ)
            ?.vendors.find(v => v.id === 
              projectsData
                .find(p => p.rfqs.some(rfq => rfq.id === selectedRFQ))
                ?.rfqs.find(rfq => rfq.id === selectedRFQ)
                ?.selectedVendorId
            )?.name
        }
        analysisData={aiAnalysisData}
        loading={aiAnalysisLoading}
      />

      {/* RFQ Creation Modal */}
      <RFQCreationModal
        isOpen={isRFQModalOpen}
        onClose={() => setIsRFQModalOpen(false)}
        onSubmit={(data) => {
          console.log('RFQ Created:', data);
          // Here you would normally send the data to your API
          toast.success('RFQ created successfully!', {
            description: `${data.rfq_id} has been created and is ready for processing.`
          });
          setIsRFQModalOpen(false);
        }}
      />

      {/* RFQ Criteria Modal */}
      <RFQCriteriaModal
        isOpen={isCriteriaModalOpen}
        onClose={() => setIsCriteriaModalOpen(false)}
        rfqId={criteriaRFQId}
        onSave={handleCriteriaSave}
      />
    </div>
  );
}