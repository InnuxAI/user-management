'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Edit, Trash2, Search, ArrowLeft, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Vendor {
  vendor_id: string;
  name: string;
  phone?: string;
  contact_persons: string[];
  email_domains: string[];
  created_at: string;
  updated_at: string;
}

interface VendorFormData {
  vendor_id: string;
  name: string;
  phone: string;
  contact_persons: string[];
  email_domains: string[];
}

const initialFormData: VendorFormData = {
  vendor_id: '',
  name: '',
  phone: '',
  contact_persons: [],
  email_domains: []
};

export default function VendorManagementPage() {
  const { data: session, status } = useSession();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<VendorFormData>(initialFormData);
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newEmailDomain, setNewEmailDomain] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      redirect('/auth/login');
    }
    
    fetchVendors();
  }, [session, status]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await api.vendors.list();
      
      if (response.success) {
        setVendors(response.data || []);
      } else {
        toast.error('Failed to fetch vendors');
      }
    } catch (error) {
      console.error('Fetch vendors error:', error);
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVendor = async () => {
    try {
      if (!formData.vendor_id || !formData.name) {
        toast.error('Vendor ID and Name are required');
        return;
      }

      const response = await api.vendors.create(formData);
      
      if (response.success) {
        toast.success('Vendor created successfully');
        setIsCreateModalOpen(false);
        setFormData(initialFormData);
        fetchVendors();
      } else {
        toast.error(response.message || 'Failed to create vendor');
      }
    } catch (error) {
      console.error('Create vendor error:', error);
      toast.error('Failed to create vendor');
    }
  };

  const handleUpdateVendor = async () => {
    if (!selectedVendor) return;

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        contact_persons: formData.contact_persons,
        email_domains: formData.email_domains
      };

      const response = await api.vendors.update(selectedVendor.vendor_id, updateData);
      
      if (response.success) {
        toast.success('Vendor updated successfully');
        setIsEditSheetOpen(false);
        setSelectedVendor(null);
        setFormData(initialFormData);
        fetchVendors();
      } else {
        toast.error(response.message || 'Failed to update vendor');
      }
    } catch (error) {
      console.error('Update vendor error:', error);
      toast.error('Failed to update vendor');
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.vendors.delete(vendorId);
      
      if (response.success) {
        toast.success('Vendor deleted successfully');
        fetchVendors();
      } else {
        toast.error(response.message || 'Failed to delete vendor');
      }
    } catch (error) {
      console.error('Delete vendor error:', error);
      toast.error('Failed to delete vendor');
    }
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormData({
      vendor_id: vendor.vendor_id,
      name: vendor.name,
      phone: vendor.phone || '',
      contact_persons: vendor.contact_persons ? [...vendor.contact_persons] : [],
      email_domains: vendor.email_domains ? [...vendor.email_domains] : []
    });
    setIsEditSheetOpen(true);
  };

  const addContactPerson = () => {
    if (newContactPerson && !formData.contact_persons.includes(newContactPerson)) {
      setFormData(prev => ({
        ...prev,
        contact_persons: [...prev.contact_persons, newContactPerson]
      }));
      setNewContactPerson('');
    }
  };

  const removeContactPerson = (email: string) => {
    setFormData(prev => ({
      ...prev,
      contact_persons: prev.contact_persons.filter(p => p !== email)
    }));
  };

  const addEmailDomain = () => {
    if (newEmailDomain && !formData.email_domains.includes(newEmailDomain)) {
      setFormData(prev => ({
        ...prev,
        email_domains: [...prev.email_domains, newEmailDomain]
      }));
      setNewEmailDomain('');
    }
  };

  const removeEmailDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      email_domains: prev.email_domains.filter(d => d !== domain)
    }));
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.vendor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vendor.contact_persons && vendor.contact_persons.some(email => email.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    (vendor.email_domains && vendor.email_domains.some(domain => domain.toLowerCase().includes(searchQuery.toLowerCase())))
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
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Vendor Manager</h1>
                <p className="text-gray-600">Manage vendor database and contact information</p>
              </div>
            </div>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Vendor</DialogTitle>
              </DialogHeader>
              <VendorForm 
                formData={formData}
                setFormData={setFormData}
                newContactPerson={newContactPerson}
                setNewContactPerson={setNewContactPerson}
                newEmailDomain={newEmailDomain}
                setNewEmailDomain={setNewEmailDomain}
                addContactPerson={addContactPerson}
                removeContactPerson={removeContactPerson}
                addEmailDomain={addEmailDomain}
                removeEmailDomain={removeEmailDomain}
                onSubmit={handleCreateVendor}
                submitButtonText="Create Vendor"
                isEditing={false}
              />
            </DialogContent>
          </Dialog>
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
                    placeholder="Search vendors by ID, name, email, or domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Database</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Vendor ID</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Contact Persons</TableHead>
                  <TableHead className="font-semibold">Email Domains</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="text-muted-foreground">Loading vendors...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchQuery ? 'No vendors found matching your search.' : 'No vendors found. Create your first vendor to get started.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor.vendor_id}>
                      <TableCell className="font-medium">{vendor.vendor_id}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.phone || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {vendor.contact_persons && vendor.contact_persons.length > 0 ? (
                            vendor.contact_persons.map((email, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {email}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {vendor.email_domains && vendor.email_domains.length > 0 ? (
                            vendor.email_domains.map((domain, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {domain}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(vendor.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditVendor(vendor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVendor(vendor.vendor_id)}
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

      {/* Edit Vendor Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-[600px] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle>Edit Vendor</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <VendorForm 
              formData={formData}
              setFormData={setFormData}
              newContactPerson={newContactPerson}
              setNewContactPerson={setNewContactPerson}
              newEmailDomain={newEmailDomain}
              setNewEmailDomain={setNewEmailDomain}
              addContactPerson={addContactPerson}
              removeContactPerson={removeContactPerson}
              addEmailDomain={addEmailDomain}
              removeEmailDomain={removeEmailDomain}
              onSubmit={handleUpdateVendor}
              submitButtonText="Update Vendor"
              isEditing={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Vendor Form Component
interface VendorFormProps {
  formData: VendorFormData;
  setFormData: React.Dispatch<React.SetStateAction<VendorFormData>>;
  newContactPerson: string;
  setNewContactPerson: React.Dispatch<React.SetStateAction<string>>;
  newEmailDomain: string;
  setNewEmailDomain: React.Dispatch<React.SetStateAction<string>>;
  addContactPerson: () => void;
  removeContactPerson: (email: string) => void;
  addEmailDomain: () => void;
  removeEmailDomain: (domain: string) => void;
  onSubmit: () => void;
  submitButtonText: string;
  isEditing: boolean;
}

function VendorForm({
  formData,
  setFormData,
  newContactPerson,
  setNewContactPerson,
  newEmailDomain,
  setNewEmailDomain,
  addContactPerson,
  removeContactPerson,
  addEmailDomain,
  removeEmailDomain,
  onSubmit,
  submitButtonText,
  isEditing
}: VendorFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vendor_id">Vendor ID *</Label>
          <Input
            id="vendor_id"
            value={formData.vendor_id}
            onChange={(e) => setFormData(prev => ({ ...prev, vendor_id: e.target.value }))}
            disabled={isEditing}
            placeholder="VND001"
          />
        </div>
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Vendor Name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="+1-555-0123"
        />
      </div>

      <div>
        <Label>Contact Persons</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newContactPerson}
            onChange={(e) => setNewContactPerson(e.target.value)}
            placeholder="contact@vendor.com"
            onKeyPress={(e) => e.key === 'Enter' && addContactPerson()}
          />
          <Button type="button" onClick={addContactPerson}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.contact_persons.map((email, idx) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
              {email}
              <button
                onClick={() => removeContactPerson(email)}
                className="ml-1 hover:bg-gray-300 rounded-full"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Email Domains</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newEmailDomain}
            onChange={(e) => setNewEmailDomain(e.target.value)}
            placeholder="vendor.com"
            onKeyPress={(e) => e.key === 'Enter' && addEmailDomain()}
          />
          <Button type="button" onClick={addEmailDomain}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.email_domains.map((domain, idx) => (
            <Badge key={idx} variant="outline" className="flex items-center gap-1">
              {domain}
              <button
                onClick={() => removeEmailDomain(domain)}
                className="ml-1 hover:bg-gray-300 rounded-full"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setFormData(initialFormData)}>
          Reset
        </Button>
        <Button type="button" onClick={onSubmit}>
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
}