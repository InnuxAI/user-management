"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  Info,
  Target,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

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

interface CriteriaData {
  _id?: string;
  rfq_id: string;
  criteria: string[];
  additional_prompt?: string;
  weights?: {
    price: number;
    delivery: number;
    payment_terms: number;
    freight: number;
    experience: number;
    red_flags: number;
  };
  created_at?: string;
  updated_at?: string;
}

interface RFQCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqId: string;
  onSave?: () => void;
}

export function RFQCriteriaModal({ isOpen, onClose, rfqId, onSave }: RFQCriteriaModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [criteriaData, setCriteriaData] = useState<CriteriaData>({
    rfq_id: rfqId,
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

  // Load existing criteria when modal opens
  useEffect(() => {
    if (isOpen && rfqId) {
      // Reset state when opening
      setError(null);
      setSaving(false);
      loadCriteria();
    }
  }, [isOpen, rfqId]);

  const loadCriteria = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.rfqCriteria.get(rfqId);
      if (response.success && response.data) {
        setCriteriaData(response.data);
        setIsEditing(true);
      } else {
        // No existing criteria found - this is normal for new RFQs
        console.log('No existing criteria found for RFQ:', rfqId);
        setIsEditing(false);
        // Reset to default values
        setCriteriaData({
          rfq_id: rfqId,
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
      }
    } catch (err: any) {
      console.error('Failed to load criteria:', err);
      // Only show error for actual API failures, not 404s
      if (err.message && !err.message.includes('404') && !err.message.includes('not found')) {
        setError('Failed to connect to server. Please try again.');
      } else {
        // 404 means no criteria exists yet - this is normal
        console.log('No criteria found (404) - starting in create mode');
      }
      setIsEditing(false);
      // Reset to default values
      setCriteriaData({
        rfq_id: rfqId,
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
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    // Validate criteria
    if (!criteriaData.criteria || criteriaData.criteria.length === 0) {
      setError('Please select at least one analysis criterion');
      setSaving(false);
      return;
    }

    // Validate weights sum to approximately 1.0
    if (criteriaData.weights) {
      const weightsSum = Object.values(criteriaData.weights).reduce((sum, weight) => sum + weight, 0);
      if (Math.abs(weightsSum - 1.0) > 0.01) {
        setError('Weights must sum to 1.0 (100%)');
        setSaving(false);
        return;
      }
    }

    try {
      if (isEditing && criteriaData._id) {
        // Update existing criteria
        const response = await api.rfqCriteria.update(criteriaData._id, {
          criteria: criteriaData.criteria,
          additional_prompt: criteriaData.additional_prompt,
          weights: criteriaData.weights
        });
        
        if (response.success) {
          onSave?.();
          onClose();
        } else {
          setError(response.message || 'Failed to update criteria');
        }
      } else {
        // Create new criteria
        const response = await api.rfqCriteria.create(criteriaData);
        
        if (response.success) {
          onSave?.();
          onClose();
        } else {
          setError(response.message || 'Failed to create criteria');
        }
      }
    } catch (err: any) {
      console.error('Failed to save criteria:', err);
      // Handle specific error cases
      if (err.message && err.message.includes('already exists')) {
        setError('Criteria already exists for this RFQ. Try refreshing and editing instead.');
        // Reload to check if criteria now exists
        setTimeout(() => loadCriteria(), 1000);
      } else {
        setError(err.message || 'Failed to save criteria. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCriterionToggle = (criterion: string) => {
    setCriteriaData(prev => ({
      ...prev,
      criteria: prev.criteria.includes(criterion)
        ? prev.criteria.filter(c => c !== criterion)
        : [...prev.criteria, criterion]
    }));
  };

  const handleWeightChange = (key: string, value: number) => {
    setCriteriaData(prev => ({
      ...prev,
      weights: {
        ...prev.weights!,
        [key]: value
      }
    }));
  };

  const availableCriteria = [
    { value: 'lowest_price', label: 'Lowest Price', desc: 'Most competitive pricing' },
    { value: 'delivery_time', label: 'Delivery Time', desc: 'Fastest delivery schedule' },
    { value: 'payment_terms', label: 'Payment Terms', desc: 'Favorable payment conditions' },
    { value: 'certifications', label: 'Certifications', desc: 'Required certifications and compliance' },
    { value: 'freight_costs', label: 'Freight Costs', desc: 'Shipping and logistics costs' },
    { value: 'experience', label: 'Experience', desc: 'Vendor track record and expertise' },
    { value: 'quality_standards', label: 'Quality Standards', desc: 'Quality control and standards' },
    { value: 'compliance', label: 'Compliance', desc: 'Regulatory and legal compliance' }
  ];

  const weights = [
    { key: 'price', label: 'Price' },
    { key: 'delivery', label: 'Delivery' },
    { key: 'payment_terms', label: 'Payment Terms' },
    { key: 'freight', label: 'Freight' },
    { key: 'experience', label: 'Experience' },
    { key: 'red_flags', label: 'Red Flags' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {isEditing ? 'Edit' : 'Configure'} Analysis Criteria - {rfqId}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading criteria...</span>
            </div>
          ) : (
            <div className="space-y-6 px-1">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isEditing && !error && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No analysis criteria found for this RFQ. Configure the evaluation criteria and scoring weights below.
                  </AlertDescription>
                </Alert>
              )}

              {/* Criteria Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Evaluation Criteria</Label>
                  <TooltipIcon text="Select the criteria that should be used to evaluate and compare vendors" />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {availableCriteria.map((criterion) => (
                    <div key={criterion.value} className="flex items-start space-x-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={criterion.value}
                        checked={criteriaData.criteria.includes(criterion.value)}
                        onCheckedChange={() => handleCriterionToggle(criterion.value)}
                        className="mt-0.5"
                      />
                      <div className="space-y-0.5">
                        <Label htmlFor={criterion.value} className="text-sm font-medium cursor-pointer leading-tight">
                          {criterion.label}
                        </Label>
                        <p className="text-xs text-muted-foreground leading-tight">{criterion.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weights Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Scoring Weights</Label>
                  <TooltipIcon text="Adjust the importance of each scoring factor (must sum to 100%)" />
                </div>
                
                <div className="grid gap-2 p-3 rounded-lg border bg-card">
                  {weights.map((weight) => (
                    <div key={weight.key} className="flex items-center gap-3">
                      <Label className="w-20 text-sm">{weight.label}</Label>
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={criteriaData.weights?.[weight.key as keyof typeof criteriaData.weights] || 0}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            handleWeightChange(weight.key, value);
                          }}
                          className="w-16 text-center text-sm h-8"
                        />
                        <span className="text-xs text-muted-foreground min-w-[40px]">
                          ({Math.round((criteriaData.weights?.[weight.key as keyof typeof criteriaData.weights] || 0) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span className={cn(
                        "font-medium",
                        Math.abs((Object.values(criteriaData.weights || {}).reduce((sum, w) => sum + w, 0)) - 1.0) > 0.01 
                          ? "text-destructive" 
                          : "text-green-600"
                      )}>
                        {Math.round((Object.values(criteriaData.weights || {}).reduce((sum, w) => sum + w, 0)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
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
                  value={criteriaData.additional_prompt || ''}
                  onChange={(e) => setCriteriaData(prev => ({ ...prev, additional_prompt: e.target.value }))}
                  className="min-h-[80px] text-sm"
                />
              </div>

              {/* Summary */}
              {criteriaData.criteria.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <h4 className="font-medium mb-2">Selected Criteria:</h4>
                  <div className="flex flex-wrap gap-2">
                    {criteriaData.criteria.map(criterion => (
                      <Badge key={criterion} variant="outline">
                        {criterion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {saving ? 'Saving...' : (isEditing ? 'Update Criteria' : 'Save Criteria')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}