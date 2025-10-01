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
import { Plus, Edit, Trash2, Search, ArrowLeft, Target, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { api } from '@/lib/api';

interface RFQCriteria {
  rfq_id: string;
  criteria: {
    price_weight: number;
    delivery_weight: number;
    quality_weight: number;
    vendor_reliability_weight: number;
    technical_compliance_weight: number;
    customization_weight: number;
    additional_criteria: {
      [key: string]: number;
    };
  };
  additional_prompts: string[];
  created_at: string;
  updated_at: string;
}

interface RFQCriteriaFormData {
  rfq_id: string;
  price_weight: number;
  delivery_weight: number;
  quality_weight: number;
  vendor_reliability_weight: number;
  technical_compliance_weight: number;
  customization_weight: number;
  additional_criteria: { [key: string]: number };
  additional_prompts: string[];
}

const initialFormData: RFQCriteriaFormData = {
  rfq_id: '',
  price_weight: 30,
  delivery_weight: 20,
  quality_weight: 25,
  vendor_reliability_weight: 15,
  technical_compliance_weight: 10,
  customization_weight: 0,
  additional_criteria: {},
  additional_prompts: []
};

export default function RFQCriteriaManagementPage() {
  const { data: session, status } = useSession();
  const [criteria, setCriteria] = useState<RFQCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<RFQCriteria | null>(null);
  const [formData, setFormData] = useState<RFQCriteriaFormData>(initialFormData);
  const [newCriteriaKey, setNewCriteriaKey] = useState('');
  const [newCriteriaWeight, setNewCriteriaWeight] = useState(0);
  const [newPrompt, setNewPrompt] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user as any).type !== 'Admin') {
      redirect('/dashboard');
    }
    
    fetchCriteria();
  }, [session, status]);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const response = await api.rfqCriteria.list();
      
      if (response.success) {
        setCriteria(response.data || []);
      } else {
        toast.error('Failed to fetch RFQ criteria');
      }
    } catch (error) {
      console.error('Fetch criteria error:', error);
      toast.error('Failed to fetch RFQ criteria');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCriteria = async () => {
    try {
      if (!formData.rfq_id) {
        toast.error('RFQ ID is required');
        return;
      }

      // Validate weights sum to 100
      const totalWeight = formData.price_weight + formData.delivery_weight + 
                         formData.quality_weight + formData.vendor_reliability_weight + 
                         formData.technical_compliance_weight + formData.customization_weight +
                         Object.values(formData.additional_criteria).reduce((sum, weight) => sum + weight, 0);

      if (totalWeight !== 100) {
        toast.error(`Total weights must equal 100%. Current total: ${totalWeight}%`);
        return;
      }

      const criteriaData = {
        rfq_id: formData.rfq_id,
        criteria: {
          price_weight: formData.price_weight,
          delivery_weight: formData.delivery_weight,
          quality_weight: formData.quality_weight,
          vendor_reliability_weight: formData.vendor_reliability_weight,
          technical_compliance_weight: formData.technical_compliance_weight,
          customization_weight: formData.customization_weight,
          additional_criteria: formData.additional_criteria
        },
        additional_prompts: formData.additional_prompts
      };

      const response = await api.rfqCriteria.create(criteriaData);
      
      if (response.success) {
        toast.success('RFQ criteria created successfully');
        setIsCreateModalOpen(false);
        setFormData(initialFormData);
        fetchCriteria();
      } else {
        toast.error(response.message || 'Failed to create RFQ criteria');
      }
    } catch (error) {
      console.error('Create criteria error:', error);
      toast.error('Failed to create RFQ criteria');
    }
  };

  const handleUpdateCriteria = async () => {
    if (!selectedCriteria) return;

    try {
      // Validate weights sum to 100
      const totalWeight = formData.price_weight + formData.delivery_weight + 
                         formData.quality_weight + formData.vendor_reliability_weight + 
                         formData.technical_compliance_weight + formData.customization_weight +
                         Object.values(formData.additional_criteria).reduce((sum, weight) => sum + weight, 0);

      if (totalWeight !== 100) {
        toast.error(`Total weights must equal 100%. Current total: ${totalWeight}%`);
        return;
      }

      const updateData = {
        criteria: {
          price_weight: formData.price_weight,
          delivery_weight: formData.delivery_weight,
          quality_weight: formData.quality_weight,
          vendor_reliability_weight: formData.vendor_reliability_weight,
          technical_compliance_weight: formData.technical_compliance_weight,
          customization_weight: formData.customization_weight,
          additional_criteria: formData.additional_criteria
        },
        additional_prompts: formData.additional_prompts
      };

      const response = await api.rfqCriteria.update(selectedCriteria.rfq_id, updateData);
      
      if (response.success) {
        toast.success('RFQ criteria updated successfully');
        setIsEditSheetOpen(false);
        setSelectedCriteria(null);
        setFormData(initialFormData);
        fetchCriteria();
      } else {
        toast.error(response.message || 'Failed to update RFQ criteria');
      }
    } catch (error) {
      console.error('Update criteria error:', error);
      toast.error('Failed to update RFQ criteria');
    }
  };

  const handleDeleteCriteria = async (rfqId: string) => {
    if (!confirm('Are you sure you want to delete this RFQ criteria? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.rfqCriteria.delete(rfqId);
      
      if (response.success) {
        toast.success('RFQ criteria deleted successfully');
        fetchCriteria();
      } else {
        toast.error(response.message || 'Failed to delete RFQ criteria');
      }
    } catch (error) {
      console.error('Delete criteria error:', error);
      toast.error('Failed to delete RFQ criteria');
    }
  };

  const handleEditCriteria = (criteriaItem: RFQCriteria) => {
    setSelectedCriteria(criteriaItem);
    setFormData({
      rfq_id: criteriaItem.rfq_id,
      price_weight: criteriaItem.criteria.price_weight,
      delivery_weight: criteriaItem.criteria.delivery_weight,
      quality_weight: criteriaItem.criteria.quality_weight,
      vendor_reliability_weight: criteriaItem.criteria.vendor_reliability_weight,
      technical_compliance_weight: criteriaItem.criteria.technical_compliance_weight,
      customization_weight: criteriaItem.criteria.customization_weight,
      additional_criteria: criteriaItem.criteria.additional_criteria || {},
      additional_prompts: criteriaItem.additional_prompts || []
    });
    setIsEditSheetOpen(true);
  };

  const addAdditionalCriteria = () => {
    if (!newCriteriaKey || newCriteriaWeight <= 0) {
      toast.error('Please provide a valid criteria name and weight');
      return;
    }

    setFormData(prev => ({
      ...prev,
      additional_criteria: {
        ...prev.additional_criteria,
        [newCriteriaKey]: newCriteriaWeight
      }
    }));
    setNewCriteriaKey('');
    setNewCriteriaWeight(0);
  };

  const removeAdditionalCriteria = (key: string) => {
    setFormData(prev => {
      const { [key]: _, ...rest } = prev.additional_criteria;
      return {
        ...prev,
        additional_criteria: rest
      };
    });
  };

  const addPrompt = () => {
    if (!newPrompt.trim()) {
      toast.error('Please provide a prompt');
      return;
    }

    setFormData(prev => ({
      ...prev,
      additional_prompts: [...prev.additional_prompts, newPrompt.trim()]
    }));
    setNewPrompt('');
  };

  const removePrompt = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_prompts: prev.additional_prompts.filter((_, i) => i !== index)
    }));
  };

  const calculateTotalWeight = () => {
    return formData.price_weight + formData.delivery_weight + 
           formData.quality_weight + formData.vendor_reliability_weight + 
           formData.technical_compliance_weight + formData.customization_weight +
           Object.values(formData.additional_criteria).reduce((sum, weight) => sum + weight, 0);
  };

  const filteredCriteria = criteria.filter(criteriaItem =>
    criteriaItem.rfq_id.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Link href="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Admin
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">RFQ Analysis Criteria</h1>
                <p className="text-gray-600">Configure evaluation criteria and weights for vendor selection</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add RFQ Criteria
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create RFQ Analysis Criteria</DialogTitle>
                </DialogHeader>
                <CriteriaForm 
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleCreateCriteria}
                  submitButtonText="Create Criteria"
                  isEditing={false}
                  newCriteriaKey={newCriteriaKey}
                  setNewCriteriaKey={setNewCriteriaKey}
                  newCriteriaWeight={newCriteriaWeight}
                  setNewCriteriaWeight={setNewCriteriaWeight}
                  addAdditionalCriteria={addAdditionalCriteria}
                  removeAdditionalCriteria={removeAdditionalCriteria}
                  newPrompt={newPrompt}
                  setNewPrompt={setNewPrompt}
                  addPrompt={addPrompt}
                  removePrompt={removePrompt}
                  calculateTotalWeight={calculateTotalWeight}
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
                    placeholder="Search by RFQ ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  {filteredCriteria.length} criteria set{filteredCriteria.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Criteria Table */}
      <Card>
        <CardHeader>
          <CardTitle>RFQ Analysis Criteria Database</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">RFQ ID</TableHead>
                  <TableHead className="font-semibold">Price Weight</TableHead>
                  <TableHead className="font-semibold">Delivery Weight</TableHead>
                  <TableHead className="font-semibold">Quality Weight</TableHead>
                  <TableHead className="font-semibold">Reliability Weight</TableHead>
                  <TableHead className="font-semibold">Additional Criteria</TableHead>
                  <TableHead className="font-semibold">Prompts</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="text-muted-foreground">Loading RFQ criteria...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCriteria.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchQuery ? 'No RFQ criteria found matching your search.' : 'No RFQ criteria found. Create your first criteria set to get started.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCriteria.map((criteriaItem) => (
                    <TableRow key={criteriaItem.rfq_id}>
                      <TableCell className="font-medium">
                        <Badge variant="secondary" className="font-mono">
                          {criteriaItem.rfq_id}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{criteriaItem.criteria.price_weight}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{criteriaItem.criteria.delivery_weight}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{criteriaItem.criteria.quality_weight}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{criteriaItem.criteria.vendor_reliability_weight}%</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {Object.entries(criteriaItem.criteria.additional_criteria || {}).map(([key, weight]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key}: {weight}%
                            </Badge>
                          ))}
                          {Object.keys(criteriaItem.criteria.additional_criteria || {}).length === 0 && (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {criteriaItem.additional_prompts?.length || 0} prompt{criteriaItem.additional_prompts?.length !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(criteriaItem.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCriteria(criteriaItem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCriteria(criteriaItem.rfq_id)}
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

      {/* Edit Criteria Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-[800px] sm:w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit RFQ Criteria</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <CriteriaForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdateCriteria}
              submitButtonText="Update Criteria"
              isEditing={true}
              newCriteriaKey={newCriteriaKey}
              setNewCriteriaKey={setNewCriteriaKey}
              newCriteriaWeight={newCriteriaWeight}
              setNewCriteriaWeight={setNewCriteriaWeight}
              addAdditionalCriteria={addAdditionalCriteria}
              removeAdditionalCriteria={removeAdditionalCriteria}
              newPrompt={newPrompt}
              setNewPrompt={setNewPrompt}
              addPrompt={addPrompt}
              removePrompt={removePrompt}
              calculateTotalWeight={calculateTotalWeight}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Criteria Form Component
interface CriteriaFormProps {
  formData: RFQCriteriaFormData;
  setFormData: React.Dispatch<React.SetStateAction<RFQCriteriaFormData>>;
  onSubmit: () => void;
  submitButtonText: string;
  isEditing: boolean;
  newCriteriaKey: string;
  setNewCriteriaKey: React.Dispatch<React.SetStateAction<string>>;
  newCriteriaWeight: number;
  setNewCriteriaWeight: React.Dispatch<React.SetStateAction<number>>;
  addAdditionalCriteria: () => void;
  removeAdditionalCriteria: (key: string) => void;
  newPrompt: string;
  setNewPrompt: React.Dispatch<React.SetStateAction<string>>;
  addPrompt: () => void;
  removePrompt: (index: number) => void;
  calculateTotalWeight: () => number;
}

function CriteriaForm({
  formData,
  setFormData,
  onSubmit,
  submitButtonText,
  isEditing,
  newCriteriaKey,
  setNewCriteriaKey,
  newCriteriaWeight,
  setNewCriteriaWeight,
  addAdditionalCriteria,
  removeAdditionalCriteria,
  newPrompt,
  setNewPrompt,
  addPrompt,
  removePrompt,
  calculateTotalWeight
}: CriteriaFormProps) {
  const totalWeight = calculateTotalWeight();
  const isValidWeight = totalWeight === 100;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="rfq_id">RFQ ID *</Label>
        <Input
          id="rfq_id"
          value={formData.rfq_id}
          onChange={(e) => setFormData(prev => ({ ...prev, rfq_id: e.target.value }))}
          disabled={isEditing}
          placeholder="RFQ_001"
          className="font-mono"
        />
        {!isEditing && (
          <p className="text-sm text-muted-foreground mt-1">
            Unique identifier for this RFQ criteria set
          </p>
        )}
      </div>

      {/* Standard Criteria Weights */}
      <div>
        <Label className="text-base font-semibold">Standard Criteria Weights (%)</Label>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <Label htmlFor="price_weight">Price Weight</Label>
            <Input
              id="price_weight"
              type="number"
              min="0"
              max="100"
              value={formData.price_weight}
              onChange={(e) => setFormData(prev => ({ ...prev, price_weight: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="delivery_weight">Delivery Weight</Label>
            <Input
              id="delivery_weight"
              type="number"
              min="0"
              max="100"
              value={formData.delivery_weight}
              onChange={(e) => setFormData(prev => ({ ...prev, delivery_weight: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="quality_weight">Quality Weight</Label>
            <Input
              id="quality_weight"
              type="number"
              min="0"
              max="100"
              value={formData.quality_weight}
              onChange={(e) => setFormData(prev => ({ ...prev, quality_weight: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="vendor_reliability_weight">Vendor Reliability Weight</Label>
            <Input
              id="vendor_reliability_weight"
              type="number"
              min="0"
              max="100"
              value={formData.vendor_reliability_weight}
              onChange={(e) => setFormData(prev => ({ ...prev, vendor_reliability_weight: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="technical_compliance_weight">Technical Compliance Weight</Label>
            <Input
              id="technical_compliance_weight"
              type="number"
              min="0"
              max="100"
              value={formData.technical_compliance_weight}
              onChange={(e) => setFormData(prev => ({ ...prev, technical_compliance_weight: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="customization_weight">Customization Weight</Label>
            <Input
              id="customization_weight"
              type="number"
              min="0"
              max="100"
              value={formData.customization_weight}
              onChange={(e) => setFormData(prev => ({ ...prev, customization_weight: Number(e.target.value) }))}
            />
          </div>
        </div>
      </div>

      {/* Additional Criteria */}
      <div>
        <Label className="text-base font-semibold">Additional Criteria</Label>
        <div className="space-y-3 mt-3">
          {Object.entries(formData.additional_criteria).map(([key, weight]) => (
            <div key={key} className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="flex-1">
                <span className="font-medium">{key}</span>
                <Badge variant="outline" className="ml-2">{weight}%</Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAdditionalCriteria(key)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Input
              placeholder="Criteria name (e.g., sustainability)"
              value={newCriteriaKey}
              onChange={(e) => setNewCriteriaKey(e.target.value)}
            />
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="Weight %"
              value={newCriteriaWeight}
              onChange={(e) => setNewCriteriaWeight(Number(e.target.value))}
              className="w-32"
            />
            <Button type="button" onClick={addAdditionalCriteria}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Weight Validation */}
      <div className={`p-3 rounded-lg ${isValidWeight ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center justify-between">
          <span className={`font-medium ${isValidWeight ? 'text-green-700' : 'text-red-700'}`}>
            Total Weight: {totalWeight}%
          </span>
          <Badge variant={isValidWeight ? 'default' : 'destructive'}>
            {isValidWeight ? 'Valid' : 'Must equal 100%'}
          </Badge>
        </div>
      </div>

      {/* Additional Prompts */}
      <div>
        <Label className="text-base font-semibold">Additional Analysis Prompts</Label>
        <div className="space-y-3 mt-3">
          {formData.additional_prompts.map((prompt, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="flex-1 text-sm">{prompt}</div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePrompt(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Textarea
              placeholder="Additional analysis prompt for the AI agent..."
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              rows={2}
            />
            <Button type="button" onClick={addPrompt}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setFormData(initialFormData)}
        >
          Reset
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit}
          disabled={!isValidWeight}
        >
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
}