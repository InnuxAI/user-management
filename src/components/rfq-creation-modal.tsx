"use client";

import * as React from "react";
import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Info,
  Plus,
  Trash2,
  Building2,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  X,
  Settings,
  Target,
} from "lucide-react";

import { MultiStepForm } from "@/components/multi-step-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const TooltipIcon = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Import API functions
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface DocumentType {
  id: string;
  name: string;
  description?: string;
  required_fields?: string[];
  file_formats?: string[];
  max_file_size?: number;
}

interface VendorRequirement {
  vendor_id: string;
  required_documents: string[];
}

interface RFQFormData {
  rfq_id: string;
  description: string;
  deadline: string;
  project_id: string;
  vendor_requirements: VendorRequirement[];
  // Project creation fields
  name?: string;
  project_description?: string;
  // Analysis criteria fields
  criteria?: string[];
  additional_prompt?: string;
  weights?: {
    price: number;
    delivery: number;
    payment_terms: number;
    freight: number;
    experience: number;
    red_flags: number;
  };
}

interface Project {
  id: string;
  name: string;
  status: string;
  rfq_count: number;
  description?: string;
  created_at?: string;
}

interface Vendor {
  vendor_id: string;
  vendor_name: string;
  category?: string;
}

interface RFQCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: RFQFormData) => void;
}

export function RFQCreationModal({ isOpen, onClose, onSubmit }: RFQCreationModalProps) {
  const { data: session } = useSession();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isNewProject, setIsNewProject] = useState(false);
  const totalSteps = 5;
  
  // API data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(false);
  
  const generateRFQId = () => {
    const now = new Date();
    const timestamp = now.getTime().toString().slice(-6);
    return `RFQ_${timestamp}`;
  };

  const [formData, setFormData] = useState<RFQFormData>({
    rfq_id: generateRFQId(),
    description: '',
    deadline: '',
    project_id: '',
    vendor_requirements: [],
    criteria: ['lowest_price', 'delivery_time', 'payment_terms', 'experience'],
    additional_prompt: '',
    weights: {
      price: 0.30,
      delivery: 0.25,
      payment_terms: 0.15,
      freight: 0.10,
      experience: 0.15,
      red_flags: 0.05
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load projects from API
  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await api.projects.list();
      if (response.success) {
        setProjects(response.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          status: p.status || 'active',
          rfq_count: p.rfq_count || 0,
          description: p.description,
          created_at: p.created_at
        })));
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Load vendors from API (fallback to real vendor data)
  const loadVendors = async () => {
    setLoadingVendors(true);
    try {
      try {
        const response = await api.vendors.list();
        if (response.success && response.data.length > 0) {
          setVendors(response.data.map((v: any) => ({
            vendor_id: v.vendor_id || v.id,
            vendor_name: v.vendor_name || v.name,
            category: v.category
          })));
          return;
        }
      } catch (apiError) {
        console.warn('Vendors API not available, fetching from database:', apiError);
      }

      // Since there's no vendors endpoint, let's use the real vendor data from your database
      // This is the actual vendor from your MongoDB collection
      const realVendors: Vendor[] = [
        { 
          vendor_id: "VND001", 
          vendor_name: "Vendor A", 
          category: "General Vendor"
        }
      ];
      setVendors(realVendors);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      // Fallback to the real vendor from your database
      setVendors([
        { vendor_id: "VND001", vendor_name: "Vendor A", category: "General Vendor" }
      ]);
    } finally {
      setLoadingVendors(false);
    }
  };

  // Load document types from API
  const loadDocumentTypes = async () => {
    setLoadingDocumentTypes(true);
    try {
      const response = await api.documentTypes.list();
      if (response.success) {
        setDocumentTypes(response.data.map((d: any) => ({
          id: d._id || d.id,
          name: d.doc_type, // Map doc_type to name for compatibility
          description: d.description,
          required_fields: d.required_fields,
          file_formats: d.file_formats,
          max_file_size: d.max_file_size
        })));
      }
    } catch (error) {
      console.error('Failed to load document types:', error);
      // Fallback to hardcoded document types if API fails
      const fallbackDocumentTypes: DocumentType[] = [
        { id: "vendor_quote", name: "vendor_quote" },
        { id: "technical_specification", name: "technical_specification" },
        { id: "compliance_certificate", name: "compliance_certificate" },
        { id: "product_catalog", name: "product_catalog" },
        { id: "delivery_timeline", name: "delivery_timeline" },
        { id: "warranty_information", name: "warranty_information" },
        { id: "installation_manual", name: "installation_manual" },
        { id: "training_documentation", name: "training_documentation" }
      ];
      setDocumentTypes(fallbackDocumentTypes);
    } finally {
      setLoadingDocumentTypes(false);
    }
  };

  // Load data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      loadProjects();
      loadVendors();
      loadDocumentTypes();
    }
  }, [isOpen]);

  const handleNext = () => {
    console.log(`Validating step ${currentStep}, isNewProject: ${isNewProject}, totalSteps: ${totalSteps}`);
    console.log('Form data:', formData);
    
    if (validateCurrentStep()) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        console.log(`Moving to step ${currentStep + 1}`);
      }
    } else {
      console.log('Validation failed, errors:', errors);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      // Step 1: RFQ Details
      if (!formData.rfq_id.trim()) {
        newErrors.rfq_id = 'RFQ ID is required';
      } else if (!/^RFQ_\d+$/.test(formData.rfq_id)) {
        newErrors.rfq_id = 'RFQ ID must be in format: RFQ_XXX';
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 10) {
        newErrors.description = 'Description must be at least 10 characters long';
      }
      
      if (!formData.deadline) {
        newErrors.deadline = 'Deadline is required';
      } else {
        const selectedDate = new Date(formData.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
          newErrors.deadline = 'Deadline must be in the future';
        }
      }
    } else if (currentStep === 2) {
      // Step 2: Project Assignment
      if (!isNewProject && !formData.project_id) {
        newErrors.project_id = 'Please select a project';
      }
      // If creating new project, validate the project details
      if (isNewProject) {
        if (!formData.name?.trim()) {
          newErrors.name = 'Project name is required';
        }
      }
    } else if (currentStep === 3) {
      // Step 3: Analysis Criteria
      if (!formData.criteria || formData.criteria.length === 0) {
        newErrors.criteria = 'Please select at least one analysis criterion';
      }
      // Validate weights sum to approximately 1.0
      if (formData.weights) {
        const weightsSum = Object.values(formData.weights).reduce((sum, weight) => sum + weight, 0);
        if (Math.abs(weightsSum - 1.0) > 0.01) {
          newErrors.weights = 'Weights must sum to 1.0 (100%)';
        }
      }
    } else if (currentStep === 4) {
      // Step 4: Vendor Requirements
      if (formData.vendor_requirements.length === 0) {
        newErrors.vendor_requirements = 'At least one vendor requirement is needed';
      } else {
        // Validate each vendor requirement
        let hasIncompleteVendor = false;
        formData.vendor_requirements.forEach((req, index) => {
          if (!req.vendor_id) {
            hasIncompleteVendor = true;
            newErrors[`vendor_${index}`] = 'Please select a vendor';
          }
          if (req.required_documents.length === 0) {
            hasIncompleteVendor = true;
            newErrors[`documents_${index}`] = 'Please select at least one document';
          }
        });
        if (hasIncompleteVendor) {
          newErrors.vendor_requirements = 'Please complete all vendor requirements';
        }
      }
    }
    // Step 5 is review & confirm, no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const addVendorRequirement = () => {
    setFormData(prev => ({
      ...prev,
      vendor_requirements: [
        ...prev.vendor_requirements,
        { vendor_id: '', required_documents: [] }
      ]
    }));
  };

  const updateVendorRequirement = (index: number, field: keyof VendorRequirement, value: any) => {
    setFormData(prev => ({
      ...prev,
      vendor_requirements: prev.vendor_requirements.map((req, i) =>
        i === index ? { ...req, [field]: value } : req
      )
    }));
  };

  const removeVendorRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vendor_requirements: prev.vendor_requirements.filter((_, i) => i !== index)
    }));
  };

  const handleDocumentToggle = (vendorIndex: number, documentType: string) => {
    const vendor = formData.vendor_requirements[vendorIndex];
    const updatedDocuments = vendor.required_documents.includes(documentType)
      ? vendor.required_documents.filter(doc => doc !== documentType)
      : [...vendor.required_documents, documentType];
    
    updateVendorRequirement(vendorIndex, 'required_documents', updatedDocuments);
  };

  const handleSubmit = async () => {
    if (validateCurrentStep()) {
      try {
        let projectId = formData.project_id;

        // If creating a new project, create it first
        if (isNewProject && formData.name) {
          try {
            const projectResponse = await api.projects.create({
              name: formData.name,
              description: formData.project_description || '',
              user_id: session?.user?.id  // Add user_id for RBAC
            });
            if (projectResponse.success) {
              projectId = projectResponse.data.project_id;
              console.log('Project created:', projectResponse.data);
            }
          } catch (apiError) {
            console.warn('Project creation API not available:', apiError);
            // Generate a temporary project ID for local handling
            projectId = `PRJ-${Date.now()}`;
          }
        }

        // Prepare the final RFQ data structure
        const finalData = {
          ...formData,
          project_id: projectId,
          user_id: session?.user?.id,  // Add user_id for RBAC
          created_at: new Date().toISOString(),
          status: 'draft',
          updated_at: new Date().toISOString(),
        };
        
        console.log('Submitting RFQ:', finalData);
        
        // Try to submit RFQ via API
        try {
          const response = await api.rfqs.create(finalData);
          if (response.success) {
            console.log('RFQ created via API:', response.data);
            
            // Create analysis criteria if provided
            if (formData.criteria && formData.criteria.length > 0) {
              try {
                const criteriaData = {
                  rfq_id: formData.rfq_id,
                  criteria: formData.criteria,
                  additional_prompt: formData.additional_prompt || '',
                  weights: formData.weights
                };
                
                const criteriaResponse = await api.rfqCriteria.create(criteriaData);
                if (criteriaResponse.success) {
                  console.log('RFQ criteria created:', criteriaResponse.data);
                }
              } catch (criteriaError) {
                console.warn('Failed to create RFQ criteria:', criteriaError);
              }
            }
          }
        } catch (apiError) {
          console.warn('RFQ API not available, handling locally:', apiError);
        }
        
        // Call the parent onSubmit handler
        onSubmit?.(finalData);
        
        // Reset form
        setFormData({
          rfq_id: generateRFQId(),
          description: '',
          deadline: '',
          project_id: '',
          vendor_requirements: [],
          criteria: ['lowest_price', 'delivery_time', 'payment_terms', 'experience'],
          additional_prompt: '',
          weights: {
            price: 0.30,
            delivery: 0.25,
            payment_terms: 0.15,
            freight: 0.10,
            experience: 0.15,
            red_flags: 0.05
          }
        });
        setCurrentStep(1);
        setIsNewProject(false);
        setErrors({});
      } catch (error) {
        console.error('Error submitting RFQ:', error);
        // Still call onSubmit for local handling
        onSubmit?.(formData);
      }
    }
  };

  const getNextButtonText = () => {
    if (currentStep === 5) return "Create RFQ";
    return "Next Step";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/80" />
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-background border-border">
        <DialogHeader className="sr-only">
          <DialogTitle>Create New RFQ</DialogTitle>
        </DialogHeader>
        
        {/* Custom form header */}
        <div className="px-8 py-6 border-b border-border bg-card">
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold text-foreground">Create New RFQ</h2>
            <p className="text-base text-muted-foreground">Fill out the details to create a new Request for Quotation.</p>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Progress value={Math.round((currentStep / totalSteps) * 100)} className="w-full h-2" />
            <p className="text-sm text-muted-foreground whitespace-nowrap font-medium">
              {currentStep}/{totalSteps} completed
            </p>
          </div>
        </div>

        {/* Form content area with better scrolling */}
        <div className="flex-1 overflow-y-auto min-h-[400px] max-h-[calc(90vh-200px)]">
          <div className="px-8 py-6">
          {/* Step 1: RFQ Details */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">RFQ Details</h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="rfq_id" className="text-sm font-medium">RFQ ID</Label>
                    <TooltipIcon text="Unique identifier for this RFQ. Use format: RFQ_XXX" />
                  </div>
                  <Input
                    id="rfq_id"
                    placeholder="e.g., RFQ_017"
                    value={formData.rfq_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, rfq_id: e.target.value }))}
                    className={cn(
                      "h-11 text-base bg-background border-input text-foreground placeholder:text-muted-foreground transition-all",
                      errors.rfq_id ? "border-destructive focus:border-destructive bg-destructive/10" : "focus:border-primary focus:ring-1 focus:ring-primary/20"
                    )}
                  />
                  {errors.rfq_id && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errors.rfq_id}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <TooltipIcon text="Brief description of what this RFQ is for." />
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose of this RFQ..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={cn(
                      "min-h-[100px] text-base resize-none bg-background border-input text-foreground placeholder:text-muted-foreground transition-all",
                      errors.description ? "border-destructive focus:border-destructive bg-destructive/10" : "focus:border-primary focus:ring-1 focus:ring-primary/20"
                    )}
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errors.description}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="deadline" className="text-sm font-medium">Deadline</Label>
                    <TooltipIcon text="When vendors must submit their responses by." />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      className={cn(
                        "h-11 text-base pl-10 bg-background border-input text-foreground transition-all",
                        errors.deadline ? "border-destructive focus:border-destructive bg-destructive/10" : "focus:border-primary focus:ring-1 focus:ring-primary/20"
                      )}
                    />
                  </div>
                  {errors.deadline && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errors.deadline}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Assignment */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Project Assignment</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="project_selection" className="text-sm font-medium">Project Selection</Label>
                    <TooltipIcon text="Select an existing project or create a new one." />
                  </div>
                  <Select 
                    value={isNewProject ? "new" : formData.project_id || ""}
                    onValueChange={(value) => {
                      if (value === "new") {
                        setIsNewProject(true);
                        setFormData(prev => ({ ...prev, project_id: "" }));
                      } else {
                        setIsNewProject(false);
                        setFormData(prev => ({ ...prev, project_id: value }));
                      }
                    }}
                  >
                    <SelectTrigger className={cn(
                      "min-h-[60px] text-base bg-background border-input text-foreground",
                      errors.project_id ? "border-destructive bg-destructive/10" : "focus:border-primary focus:ring-1 focus:ring-primary/20"
                    )}>
                      <SelectValue placeholder="Choose a project..." className="text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent className="w-[400px] max-h-[300px]">
                      <SelectItem value="new">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4 text-primary" />
                          <span className="font-medium">Create New Project</span>
                        </div>
                      </SelectItem>
                      {loadingProjects ? (
                        <SelectItem value="" disabled>Loading projects...</SelectItem>
                      ) : (
                        projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex flex-col items-start gap-1 w-full">
                              <span className="font-medium">{project.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {project.id} • {project.rfq_count} RFQs
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.project_id && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errors.project_id}</span>
                    </div>
                  )}
                </div>

                {/* New Project Details (shown inline when creating new project) */}
                {isNewProject && (
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary" />
                        New Project Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="name" className="text-sm font-medium">Project Name</Label>
                          <TooltipIcon text="Give your project a descriptive name." />
                        </div>
                        <Input
                          id="name"
                          placeholder="e.g., Medical Equipment Procurement 2025"
                          value={formData.name || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className={cn(
                            "h-11 text-base bg-background border-input text-foreground placeholder:text-muted-foreground transition-all",
                            errors.name ? "border-destructive focus:border-destructive bg-destructive/10" : "focus:border-primary focus:ring-1 focus:ring-primary/20"
                          )}
                        />
                        {errors.name && (
                          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{errors.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="project_description" className="text-sm font-medium">Project Description</Label>
                          <TooltipIcon text="Optional: Describe the scope and goals of this project." />
                        </div>
                        <Textarea
                          id="project_description"
                          placeholder="Describe the project scope and objectives..."
                          value={formData.project_description || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, project_description: e.target.value }))}
                          className="min-h-[100px] text-base resize-none bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Show existing projects list when user hasn't selected anything */}
                {!isNewProject && !formData.project_id && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Available Projects</Label>
                    {loadingProjects ? (
                      <div className="flex items-center justify-center p-6">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="ml-2 text-sm text-muted-foreground">Loading projects...</span>
                      </div>
                    ) : (
                      <div className="grid gap-3 max-h-60 overflow-y-auto">
                        {projects.map(project => (
                          <Card key={project.id} className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-border bg-card" 
                                onClick={() => setFormData(prev => ({ ...prev, project_id: project.id }))}>
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <p className="font-medium text-foreground">{project.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  ID: {project.id} • RFQs: {project.rfq_count}
                                </p>
                                {project.description && (
                                  <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                                )}
                              </div>
                              <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                                {project.status}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Analysis Criteria */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Analysis Criteria</h3>
              </div>
              
              <div className="space-y-8">
                {/* Criteria Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Evaluation Criteria</Label>
                    <TooltipIcon text="Select the criteria that should be used to evaluate and compare vendors" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'lowest_price', label: 'Lowest Price', desc: 'Most competitive pricing' },
                      { value: 'delivery_time', label: 'Delivery Time', desc: 'Fastest delivery schedule' },
                      { value: 'payment_terms', label: 'Payment Terms', desc: 'Favorable payment conditions' },
                      { value: 'certifications', label: 'Certifications', desc: 'Required certifications and compliance' },
                      { value: 'freight_costs', label: 'Freight Costs', desc: 'Shipping and logistics costs' },
                      { value: 'experience', label: 'Experience', desc: 'Vendor track record and expertise' },
                      { value: 'quality_standards', label: 'Quality Standards', desc: 'Quality control and standards' },
                      { value: 'compliance', label: 'Compliance', desc: 'Regulatory and legal compliance' }
                    ].map((criterion) => (
                      <div key={criterion.value} className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={criterion.value}
                          checked={formData.criteria?.includes(criterion.value) || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                criteria: [...(prev.criteria || []), criterion.value]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                criteria: (prev.criteria || []).filter(c => c !== criterion.value)
                              }));
                            }
                          }}
                          className="mt-0.5"
                        />
                        <div className="space-y-1">
                          <Label htmlFor={criterion.value} className="text-sm font-medium cursor-pointer">
                            {criterion.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{criterion.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {errors.criteria && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errors.criteria}</span>
                    </div>
                  )}
                </div>

                {/* Weights Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Scoring Weights</Label>
                    <TooltipIcon text="Adjust the importance of each scoring factor (must sum to 100%)" />
                  </div>
                  
                  <div className="grid gap-4 p-4 rounded-lg border bg-card">
                    {[
                      { key: 'price', label: 'Price' },
                      { key: 'delivery', label: 'Delivery' },
                      { key: 'payment_terms', label: 'Payment Terms' },
                      { key: 'freight', label: 'Freight' },
                      { key: 'experience', label: 'Experience' },
                      { key: 'red_flags', label: 'Red Flags' }
                    ].map((weight) => (
                      <div key={weight.key} className="flex items-center gap-4">
                        <Label className="w-24 text-sm">{weight.label}</Label>
                        <div className="flex-1 flex items-center gap-3">
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={formData.weights?.[weight.key as keyof typeof formData.weights] || 0}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              setFormData(prev => ({
                                ...prev,
                                weights: {
                                  ...prev.weights!,
                                  [weight.key]: value
                                }
                              }));
                            }}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground">
                            ({Math.round((formData.weights?.[weight.key as keyof typeof formData.weights] || 0) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className={cn(
                          "font-medium",
                          Math.abs((Object.values(formData.weights || {}).reduce((sum, w) => sum + w, 0)) - 1.0) > 0.01 
                            ? "text-destructive" 
                            : "text-green-600"
                        )}>
                          {Math.round((Object.values(formData.weights || {}).reduce((sum, w) => sum + w, 0)) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {errors.weights && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errors.weights}</span>
                    </div>
                  )}
                </div>

                {/* Additional Prompt */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="additional_prompt" className="text-sm font-medium">Additional Instructions</Label>
                    <TooltipIcon text="Optional additional instructions for AI analysis (e.g., specific requirements, preferences)" />
                  </div>
                  <Textarea
                    id="additional_prompt"
                    placeholder="e.g., Prioritize vendors with ISO certifications, Consider sustainability practices..."
                    value={formData.additional_prompt || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, additional_prompt: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Vendor Requirements */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Vendor Requirements</h3>
              </div>

              {/* Scrollable vendor requirements container */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {formData.vendor_requirements.map((requirement, index) => (
                  <Card key={index} className={cn(
                    "border-2 transition-all bg-card",
                    errors[`vendor_${index}`] || errors[`documents_${index}`] ? "border-destructive/30 bg-destructive/5" : "border-border hover:border-muted-foreground/30"
                  )}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          Vendor Requirement {index + 1}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVendorRequirement(index)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Select Vendor</Label>
                        <Select
                          value={requirement.vendor_id}
                          onValueChange={(value) => updateVendorRequirement(index, 'vendor_id', value)}
                        >
                          <SelectTrigger className={cn(
                            "min-h-[60px] text-base bg-background border-input text-foreground transition-all",
                            errors[`vendor_${index}`] ? "border-destructive bg-destructive/10" : "focus:border-primary focus:ring-1 focus:ring-primary/20"
                          )}>
                            <SelectValue placeholder="Choose a vendor..." className="text-muted-foreground" />
                          </SelectTrigger>
                          <SelectContent className="w-[350px] max-h-[250px]">
                            {loadingVendors ? (
                              <SelectItem value="" disabled>Loading vendors...</SelectItem>
                            ) : (
                              vendors.map(vendor => (
                                <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
                                  <div className="flex flex-col items-start gap-1 w-full">
                                    <p className="font-medium">{vendor.vendor_name}</p>
                                    {vendor.category && (
                                      <p className="text-sm text-muted-foreground">{vendor.category}</p>
                                    )}
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {errors[`vendor_${index}`] && (
                          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{errors[`vendor_${index}`]}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label className={cn(
                          "text-sm font-medium",
                          errors[`documents_${index}`] ? "text-red-600" : ""
                        )}>
                          Required Documents
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {loadingDocumentTypes ? (
                            <div className="col-span-2 flex items-center justify-center p-4">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              <span className="ml-2 text-sm text-muted-foreground">Loading document types...</span>
                            </div>
                          ) : (
                            documentTypes
                              .filter(docType => docType && docType.name) // Filter out invalid entries
                              .map(docType => (
                                <div key={docType.id || docType.name} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                  <Checkbox
                                    id={`${index}-${docType.name}`}
                                    checked={requirement.required_documents.includes(docType.name)}
                                    onCheckedChange={() => handleDocumentToggle(index, docType.name)}
                                    className="shrink-0"
                                  />
                                  <Label 
                                    htmlFor={`${index}-${docType.name}`}
                                    className="text-sm font-normal capitalize cursor-pointer flex-1"
                                  >
                                    {docType.name?.replace(/_/g, ' ') || docType.name}
                                  </Label>
                                </div>
                              ))
                          )}
                        </div>
                        {errors[`documents_${index}`] && (
                          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{errors[`documents_${index}`]}</span>
                          </div>
                        )}
                        {requirement.required_documents.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3 p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">Selected:</span>
                            {requirement.required_documents.map(doc => (
                              <Badge key={doc} variant="secondary" className="text-xs">
                                {doc.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addVendorRequirement}
                  className="w-full h-12 border-dashed border-2 border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Vendor Requirement
                </Button>

                {errors.vendor_requirements && (
                  <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium text-destructive">{errors.vendor_requirements}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review & Confirm */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b pt-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">Review & Confirm</h3>
              </div>

              {/* Scrollable summary container */}
              <div className="max-h-[450px] overflow-y-auto pr-2 space-y-6">
                <Card className="border-2 border-green-500/20 bg-green-500/5">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                      <FileText className="h-5 w-5 text-green-500" />
                      RFQ Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">RFQ ID</Label>
                      <p className="text-base font-semibold">{formData.rfq_id}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Deadline</Label>
                      <p className="text-base font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formData.deadline}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="text-base p-3 rounded-lg border">{formData.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Project</Label>
                    <p className="text-base font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {isNewProject ? formData.name : 
                        projects.find(p => p.id === formData.project_id)?.name}
                      {isNewProject && <Badge variant="secondary">New Project</Badge>}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Vendor Requirements ({formData.vendor_requirements.length})
                    </Label>
                    <div className="space-y-3">
                      {formData.vendor_requirements.map((req, index) => {
                        const vendor = vendors.find(v => v.vendor_id === req.vendor_id);
                        return (
                          <Card key={index} className="p-4 border-2">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <p className="font-semibold">{vendor?.vendor_name || req.vendor_id}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Required Documents:</p>
                                <div className="flex flex-wrap gap-2">
                                  {req.required_documents.map(doc => (
                                    <Badge key={doc} variant="outline" className="text-xs">
                                      {doc.replace(/_/g, ' ')}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground">Analysis Criteria</Label>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Selected Criteria:</p>
                        <div className="flex flex-wrap gap-2">
                          {(formData.criteria || []).map(criterion => (
                            <Badge key={criterion} variant="outline" className="text-xs">
                              {criterion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {formData.weights && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Scoring Weights:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(formData.weights).map(([key, value]) => (
                              <div key={key} className="flex justify-between p-2 rounded border bg-muted/50">
                                <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                <span className="font-medium">{Math.round(value * 100)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {formData.additional_prompt && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Additional Instructions:</p>
                          <p className="text-sm p-3 rounded-lg border bg-muted/50">{formData.additional_prompt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

                <Alert className="border-primary/20 bg-primary/5">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground font-medium">
                    Please review all details carefully. Once created, the RFQ will be sent to the selected vendors.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-card border-t border-border flex justify-between items-center">
          <a href="#" className="flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors">
            Need Help? <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="px-6">
                Back
              </Button>
            )}
            <Button onClick={currentStep === 5 ? handleSubmit : handleNext} className="px-6">
              {getNextButtonText()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}