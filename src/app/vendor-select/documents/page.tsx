'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Edit, Trash2, Search, ArrowLeft, FileText, Database } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { api } from '@/lib/api';

interface DocumentType {
  doc_type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface DocumentTypeFormData {
  doc_type: string;
  description: string;
}

const initialFormData: DocumentTypeFormData = {
  doc_type: '',
  description: ''
};

export default function DocumentManagerPage() {
  const { data: session, status } = useSession();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
  const [formData, setFormData] = useState<DocumentTypeFormData>(initialFormData);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      redirect('/auth/login');
    }
    
    fetchDocumentTypes();
  }, [session, status]);

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true);
      const response = await api.documentTypes.list();
      
      if (response.success) {
        setDocumentTypes(response.data || []);
      } else {
        toast.error('Failed to fetch document types');
      }
    } catch (error) {
      console.error('Fetch document types error:', error);
      toast.error('Failed to fetch document types');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocumentType = async () => {
    try {
      if (!formData.doc_type) {
        toast.error('Document type name is required');
        return;
      }

      const response = await api.documentTypes.create(formData);
      
      if (response.success) {
        toast.success('Document type created successfully');
        setIsCreateModalOpen(false);
        setFormData(initialFormData);
        fetchDocumentTypes();
      } else {
        toast.error(response.message || 'Failed to create document type');
      }
    } catch (error) {
      console.error('Create document type error:', error);
      toast.error('Failed to create document type');
    }
  };

  const handleUpdateDocumentType = async () => {
    if (!selectedDocumentType) return;

    try {
      const updateData = {
        description: formData.description
      };

      const response = await api.documentTypes.update(selectedDocumentType.doc_type, updateData);
      
      if (response.success) {
        toast.success('Document type updated successfully');
        setIsEditSheetOpen(false);
        setSelectedDocumentType(null);
        setFormData(initialFormData);
        fetchDocumentTypes();
      } else {
        toast.error(response.message || 'Failed to update document type');
      }
    } catch (error) {
      console.error('Update document type error:', error);
      toast.error('Failed to update document type');
    }
  };

  const handleDeleteDocumentType = async (docType: string) => {
    if (!confirm('Are you sure you want to delete this document type? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.documentTypes.delete(docType);
      
      if (response.success) {
        toast.success('Document type deleted successfully');
        fetchDocumentTypes();
      } else {
        toast.error(response.message || 'Failed to delete document type');
      }
    } catch (error) {
      console.error('Delete document type error:', error);
      toast.error('Failed to delete document type');
    }
  };

  const handleEditDocumentType = (docType: DocumentType) => {
    setSelectedDocumentType(docType);
    setFormData({
      doc_type: docType.doc_type,
      description: docType.description || ''
    });
    setIsEditSheetOpen(true);
  };

  const handleMigrateFromJson = async () => {
    try {
      const response = await api.documentTypes.migrateFromJson();
      
      if (response.success) {
        toast.success('Document types migrated successfully from JSON file');
        fetchDocumentTypes();
      } else {
        toast.warning('Migration completed with some warnings');
        fetchDocumentTypes();
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Failed to migrate document types');
    }
  };

  const filteredDocumentTypes = documentTypes.filter(docType =>
    docType.doc_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    docType.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/vendor-select">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Document Manager</h1>
                <p className="text-gray-600">Manage document classifications for PDF processing</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleMigrateFromJson}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Migrate from JSON
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Document Type
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Document Type</DialogTitle>
                </DialogHeader>
                <DocumentTypeForm 
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleCreateDocumentType}
                  submitButtonText="Create Document Type"
                  isEditing={false}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 min-w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search document types by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  {filteredDocumentTypes.length} document type{filteredDocumentTypes.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>Document Type Database</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Document Type</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Updated</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="text-muted-foreground">Loading document types...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDocumentTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchQuery ? 'No document types found matching your search.' : 'No document types found. Create your first document type to get started.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocumentTypes.map((docType) => (
                    <TableRow key={docType.doc_type}>
                      <TableCell className="font-medium">
                        <Badge variant="secondary" className="font-mono">
                          {docType.doc_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{docType.description || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(docType.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(docType.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDocumentType(docType)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocumentType(docType.doc_type)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Document Type Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>Edit Document Type</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <DocumentTypeForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdateDocumentType}
              submitButtonText="Update Document Type"
              isEditing={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Document Type Form Component
interface DocumentTypeFormProps {
  formData: DocumentTypeFormData;
  setFormData: React.Dispatch<React.SetStateAction<DocumentTypeFormData>>;
  onSubmit: () => void;
  submitButtonText: string;
  isEditing: boolean;
}

function DocumentTypeForm({
  formData,
  setFormData,
  onSubmit,
  submitButtonText,
  isEditing
}: DocumentTypeFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="doc_type">Document Type Name *</Label>
        <Input
          id="doc_type"
          value={formData.doc_type}
          onChange={(e) => setFormData(prev => ({ ...prev, doc_type: e.target.value }))}
          disabled={isEditing}
          placeholder="vendor_quote"
          className="font-mono"
        />
        {!isEditing && (
          <p className="text-sm text-muted-foreground mt-1">
            Use lowercase with underscores (e.g., vendor_quote, technical_specification)
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Quote submitted by vendor for RFQ"
          rows={3}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Brief description of what this document type represents
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setFormData(initialFormData)}
        >
          Reset
        </Button>
        <Button type="button" onClick={onSubmit}>
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
}