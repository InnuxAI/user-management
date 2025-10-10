'use client';

import React from 'react';
import { ExternalLink, FileText, Download, Eye } from 'lucide-react';

interface Document {
  document_id: string;
  filename: string;
  blob_url: string;
  blob_name?: string;
  received_at: string;
  processing_status: string;
  file_size: number;
  document_type: string;
}

interface DocumentPreviewProps {
  document: Document;
  className?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  document, 
  className = "" 
}) => {
  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'processed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handlePreview = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8001';
      
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
      
      // Fallback to direct blob_url (though this likely won't work due to auth issues)
      if (document.blob_url) {
        console.warn('Falling back to direct blob_url (may fail due to authentication)');
        window.open(document.blob_url, '_blank', 'noopener,noreferrer');
      } else {
        // Show user-friendly error
        alert('Unable to preview document. The document may not be available or there may be a connection issue.');
      }
    }
  };

  const handleDownload = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8001';
      
      // Use the streaming endpoint for download
      let streamUrl = '';
      
      if (document.document_id) {
        streamUrl = `${API_BASE_URL}/api/v1/documents/${document.document_id}/stream`;
      } else if (document.blob_name) {
        streamUrl = `${API_BASE_URL}/api/v1/documents/by-blob/${encodeURIComponent(document.blob_name)}/stream`;
      } else {
        throw new Error('No document ID or blob name available for download');
      }
      
      // Fetch the file through our backend
      const response = await fetch(streamUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.filename || 'document.pdf';
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback to opening in new tab for preview
      try {
        await handlePreview();
      } catch (previewError) {
        console.error('Preview fallback also failed:', previewError);
        alert('Unable to download or preview document. Please try again later.');
      }
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {document.filename}
            </h4>
            <p className="text-xs text-gray-500 capitalize">
              {document.document_type}
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.processing_status)}`}>
          {document.processing_status}
        </span>
      </div>

      {/* Document Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Size:</span>
          <span>{formatFileSize(document.file_size)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Received:</span>
          <span>{formatDate(document.received_at)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Document ID:</span>
          <span className="font-mono">{document.document_id}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={handlePreview}
          className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
        >
          <Eye className="w-3 h-3 mr-1" />
          Preview
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
        >
          <Download className="w-3 h-3 mr-1" />
          Download
        </button>
        <button
          onClick={handlePreview}
          className="flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;