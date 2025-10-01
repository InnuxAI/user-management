// API service for VendorSelector backend integration
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  metadata?: any;
}

interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  metadata: {
    total_count: number;
    page: number;
    per_page: number;
    has_more: boolean;
    total_pages: number;
  };
}

// Helper function to handle API requests
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers here when needed
        ...(options.headers || {})
      },
      ...options
    };

    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    
    // Show error toast
    if (error instanceof Error) {
      toast.error('API Error', {
        description: error.message,
        duration: 5000
      });
    }
    
    throw error;
  }
}

// Add admin role to query parameters for protected endpoints
function addAdminRole(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}user_role=admin`;
}

export const api = {
  // Health and System
  health: () => apiRequest('/health'),
  
  dashboardOverview: () => apiRequest('/dashboard/overview'),
  
  websocketStats: () => apiRequest('/websocket/stats'),

  // Projects
  projects: {
    list: (page = 1, perPage = 20) => 
      apiRequest<any[]>(`/projects?page=${page}&per_page=${perPage}`),
    
    getRFQs: (projectId: string) => 
      apiRequest(`/projects/${projectId}/rfqs`),

    create: (projectData: any) =>
      apiRequest(`/projects`, {
        method: 'POST',
        body: JSON.stringify(projectData)
      }),
  },

  // Vendors
  vendors: {
    list: (page = 1, perPage = 20) => 
      apiRequest<any[]>(`/vendor-select/vendors?page=${page}&per_page=${perPage}`),
    
    create: (vendorData: any) =>
      apiRequest(`/vendor-select/vendors`, {
        method: 'POST',
        body: JSON.stringify(vendorData)
      }),
    
    get: (vendorId: string) => 
      apiRequest(`/vendor-select/vendors/${vendorId}`),
    
    update: (vendorId: string, updateData: any) =>
      apiRequest(`/vendor-select/vendors/${vendorId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      }),
    
    delete: (vendorId: string) =>
      apiRequest(`/vendor-select/vendors/${vendorId}`, {
        method: 'DELETE'
      }),
    
    search: (query: string, limit = 20, offset = 0) =>
      apiRequest(`/vendor-select/vendors/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`)
  },

  // RFQs
  rfqs: {
    getStatus: (rfqId: string) => 
      apiRequest(`/rfqs/${rfqId}/status`),
    
    getVendors: (rfqId: string) => 
      apiRequest(`/rfqs/${rfqId}/vendors`),
    
    forceProcess: (rfqId: string) => 
      apiRequest(`/rfqs/${rfqId}/force-process`, { method: 'POST' }),

    create: (rfqData: any) =>
      apiRequest(`/rfqs`, {
        method: 'POST',
        body: JSON.stringify(rfqData)
      }),
  },

  // Documents (Admin only)
  documents: {
    list: (params: {
      page?: number;
      perPage?: number;
      rfqId?: string;
      vendorId?: string;
      status?: string;
    } = {}) => {
      const { page = 1, perPage = 20, rfqId, vendorId, status } = params;
      
      let query = `page=${page}&per_page=${perPage}`;
      if (rfqId) query += `&rfq_id=${rfqId}`;
      if (vendorId) query += `&vendor_id=${vendorId}`;
      if (status) query += `&status=${status}`;
      
      return apiRequest<any[]>(addAdminRole(`/documents?${query}`));
    },
    
    getViewUrl: (documentId: string) => 
      apiRequest(addAdminRole(`/documents/${documentId}/view`)),
    
    uploadWebhook: (webhookData: any) => 
      apiRequest('/documents/upload-webhook', {
        method: 'POST',
        body: JSON.stringify(webhookData)
      }),
  },

  // Document Types
  documentTypes: {
    list: () => apiRequest('/vendor-select/documents'),
    
    create: (docTypeData: any) =>
      apiRequest(`/vendor-select/documents`, {
        method: 'POST',
        body: JSON.stringify(docTypeData)
      }),
    
    get: (docType: string) => 
      apiRequest(`/vendor-select/documents/${docType}`),
    
    update: (docType: string, updateData: any) =>
      apiRequest(`/vendor-select/documents/${docType}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      }),
    
    delete: (docType: string) =>
      apiRequest(`/vendor-select/documents/${docType}`, {
        method: 'DELETE'
      }),
    
    migrateFromJson: () =>
      apiRequest('/vendor-select/documents/migrate-from-json', {
        method: 'POST'
      })
  },

  // RFQ Analysis Criteria
  rfqCriteria: {
    list: () => apiRequest('/vendor-select/rfq-criteria'),
    
    create: (criteriaData: any) =>
      apiRequest(`/vendor-select/rfq-criteria`, {
        method: 'POST',
        body: JSON.stringify(criteriaData)
      }),
    
    get: (rfqId: string) => 
      apiRequest(`/vendor-select/rfq-criteria/${rfqId}`),
    
    update: (criteriaId: string, updateData: any) =>
      apiRequest(`/vendor-select/rfq-criteria/${criteriaId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      }),
    
    delete: (criteriaId: string) =>
      apiRequest(`/vendor-select/rfq-criteria/${criteriaId}`, {
        method: 'DELETE'
      })
  },

  // Analytics (future endpoints)
  analytics: {
    completionRates: () => apiRequest('/analytics/completion-rates'),
    vendorPerformance: () => apiRequest('/analytics/vendor-performance'),
  }
};

// Real-time data hook integration
export interface DocumentUpdate {
  document_id: string;
  filename: string;
  rfq_id: string;
  vendor_id: string;
  status: 'processing' | 'completed' | 'failed';
  score?: number;
  error?: string;
}

export interface RFQUpdate {
  rfq_id: string;
  project_id?: string;
  status: string;
  completion_percentage: number;
  vendor_count: number;
  document_count: number;
}

export interface SystemUpdate {
  email_subject?: string;
  sender?: string;
  attachment_count?: number;
  rfq_detected?: boolean;
  processed_at?: string;
  status?: string;
}

// Helper functions for frontend integration
export const apiHelpers = {
  // Format document for display
  formatDocument: (doc: any) => ({
    id: doc.id,
    filename: doc.filename,
    rfqId: doc.rfq_id,
    vendorId: doc.vendor_id,
    documentType: doc.document_type,
    processed: doc.processed,
    createdAt: doc.created_at,
    fileSize: doc.file_size,
    aiScore: doc.ai_score,
    status: doc.processed ? 'Received' : 'Pending'
  }),

  // Format vendor data for display
  formatVendor: (vendor: any) => ({
    id: vendor.vendor_id,
    name: vendor.vendor_name || vendor.vendor_id,
    totalDocs: vendor.total_docs,
    receivedDocs: vendor.received_docs,
    pendingDocs: vendor.pending_docs,
    completionPercentage: vendor.completion_percentage,
    avgScore: vendor.avg_score,
    status: vendor.completion_percentage === 100 ? 'Selected' : 'Pending Selection'
  }),

  // Format RFQ status
  formatRFQStatus: (status: any) => ({
    rfqId: status.rfq_id,
    totalDocuments: status.total_documents,
    processedDocuments: status.processed_documents,
    pendingDocuments: status.pending_documents,
    completionPercentage: status.completion_percentage,
    vendorCount: status.vendor_count,
    status: status.status,
    lastUpdated: status.last_updated
  }),

  // Calculate document status badge
  getDocumentStatusBadge: (document: any) => {
    if (document.processed) return 'Received';
    if (document.processing_status === 'failed') return 'Rejected';
    return 'Pending';
  },

  // Calculate vendor status
  getVendorStatus: (vendor: any) => {
    if (vendor.completionPercentage === 100) return 'Selected';
    if (vendor.receivedDocs > 0) return 'Pending Selection';
    return 'Pending Selection';
  },

  // Get score color class
  getScoreColorClass: (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-50';
    if (score >= 8) return 'text-blue-600 bg-blue-50';
    if (score >= 7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  }
};

// Error handling helpers
export const handleApiError = (error: any, context: string) => {
  console.error(`${context}:`, error);
  
  const message = error.message || 'An unexpected error occurred';
  toast.error(`${context} Error`, {
    description: message,
    duration: 5000
  });
  
  return null;
};

export default api;