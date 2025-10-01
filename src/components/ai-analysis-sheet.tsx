"use client";

import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, TrendingUp, Award, FileText, Database } from "lucide-react";

interface AIAnalysisSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rfqId: string;
  selectedVendor?: string;
}

export function AIAnalysisSheet({ isOpen, onOpenChange, rfqId, selectedVendor }: AIAnalysisSheetProps) {
  // Dummy data template for AI analysis - this format should be used for AI output
  const analysisData = {
    rfqId: rfqId,
    recommendedVendor: selectedVendor || "AWS Solutions",
    overallScore: 4.2,
    confidence: 92,
    analysisDate: new Date().toLocaleDateString(),
    
    // Key decision factors with weights
    decisionFactors: [
      {
        factor: "Price Competitiveness",
        weight: 15,
        score: 4.5,
        reasoning: "Competitive pricing within 5% of lowest quote, excellent value proposition for comprehensive service package."
      },
      {
        factor: "On-Time Delivery Rate", 
        weight: 20,
        score: 4.8,
        reasoning: "Consistent 97% on-time delivery rate based on historical performance data and supply chain optimization."
      },
      {
        factor: "Quality & Defect Rate",
        weight: 25,
        score: 4.2,
        reasoning: "Low defect rate of 1.5%, strong quality control processes, and comprehensive testing protocols."
      },
      {
        factor: "Compliance & Risk",
        weight: 20,
        score: 4.0,
        reasoning: "Excellent compliance record with ISO certifications, moderate financial risk profile, strong governance."
      },
      {
        factor: "Innovation & Service",
        weight: 20,
        score: 4.1,
        reasoning: "Good innovation capability, responsive customer service, and proven track record in similar projects."
      }
    ],

    // Detailed vendor comparison based on KPI methodology
    vendorComparison: [
      {
        vendor: "AWS Solutions",
        priceCompetitiveness: 4.5,
        onTimeDelivery: 4.8,
        defectRate: 4.2,
        leadTime: 4.3,
        orderAccuracy: 4.6,
        customerService: 4.7,
        complianceRate: 4.5,
        supplierReputation: 4.8,
        innovationCapability: 4.1,
        riskProfile: 4.0,
        totalScore: 4.2,
        status: "Recommended"
      },
      {
        vendor: "TechCorp Global",
        priceCompetitiveness: 3.8,
        onTimeDelivery: 4.1,
        defectRate: 3.9,
        leadTime: 3.7,
        orderAccuracy: 4.0,
        customerService: 3.8,
        complianceRate: 4.2,
        supplierReputation: 4.0,
        innovationCapability: 3.5,
        riskProfile: 3.8,
        totalScore: 3.9,
        status: "Alternative"
      },
      {
        vendor: "Innovation Labs",
        priceCompetitiveness: 4.2,
        onTimeDelivery: 3.5,
        defectRate: 3.2,
        leadTime: 3.1,
        orderAccuracy: 3.6,
        customerService: 3.4,
        complianceRate: 3.8,
        supplierReputation: 3.7,
        innovationCapability: 4.5,
        riskProfile: 3.3,
        totalScore: 3.6,
        status: "Not Recommended"
      }
    ],

    // KPI Scoring methodology
    kpiMethodology: [
      {
        kpi: "Price Competitiveness",
        scoreScale: "1–5",
        sampleScoring: "5: Lowest quote, 3: Within 10% of lowest, 1: Highest",
        dataSource: "Vendor quotes, ERP price records"
      },
      {
        kpi: "On-Time Delivery Rate",
        scoreScale: "1–5",
        sampleScoring: "5: 98–100%, 3: 90–94%, 1: <80% on time",
        dataSource: "PO records, supply chain logs"
      },
      {
        kpi: "Defect Rate",
        scoreScale: "1–5",
        sampleScoring: "5: <1%, 3: 2–4%, 1: >7% defective",
        dataSource: "QC inspection reports, RMA logs (Returns management authorization)"
      },
      {
        kpi: "Lead Time",
        scoreScale: "1–5",
        sampleScoring: "5: Always within SLA, 3: 10–20% over, 1: >30% over",
        dataSource: "Order timestamps, logistics reports"
      },
      {
        kpi: "Order Accuracy",
        scoreScale: "1–5",
        sampleScoring: "5: 99–100% correct, 3: 94–96%, 1: <90%",
        dataSource: "ERP/Purchasing audits"
      },
      {
        kpi: "Customer Service",
        scoreScale: "1–5",
        sampleScoring: "5: Immediate response, 3: Average, 1: Poor",
        dataSource: "Communication logs, survey results"
      },
      {
        kpi: "Compliance Rate",
        scoreScale: "1–5",
        sampleScoring: "5: Fully compliant, 3: Minor issues, 1: Major failures",
        dataSource: "Audit results, certifications (iso, environmental and regulatory compliance certifications)"
      },
      {
        kpi: "Supplier Reputation",
        scoreScale: "1–5",
        sampleScoring: "5: Excellent, 3: Average, 1: Negative",
        dataSource: "Buyer feedback, reviews"
      },
      {
        kpi: "Innovation Capability",
        scoreScale: "1–5",
        sampleScoring: "5: Consistent innovations, 3: Occasional, 1: None",
        dataSource: "Proposal/award documentation"
      },
      {
        kpi: "Risk Profile",
        scoreScale: "1–5",
        sampleScoring: "5: Low & managed, 3: Moderate, 1: High risk",
        dataSource: "Financial/risk databases"
      }
    ],

    // Key advantages of recommended vendor
    keyAdvantages: [
      "Comprehensive cloud infrastructure with 99.9% uptime SLA",
      "Dedicated AI/ML team with 5+ years experience in similar projects", 
      "Proven integration capabilities with existing enterprise systems",
      "24/7 support with guaranteed 4-hour response time",
      "Compliance certifications: ISO 27001, SOC 2 Type II, GDPR ready"
    ],

    // Potential concerns and mitigation
    concerns: [
      {
        issue: "Higher initial setup costs compared to competitors",
        mitigation: "Cost is offset by faster implementation and reduced long-term maintenance",
        severity: "Low"
      },
      {
        issue: "Limited local presence in certain regions",
        mitigation: "Strong remote support capabilities and partner network coverage",
        severity: "Medium"
      }
    ],

    // Final recommendation summary
    recommendation: {
      decision: "APPROVE",
      reasoning: "AWS Solutions provides the best balance of technical capability, delivery confidence, and long-term value. Despite higher initial costs, the comprehensive solution and proven track record justify the investment.",
      nextSteps: [
        "Schedule final stakeholder review meeting",
        "Negotiate final contract terms and SLA details", 
        "Prepare project kickoff timeline",
        "Establish communication protocols and project governance"
      ]
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[60vw] max-w-[90vw] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-xl font-bold text-foreground">AI Analysis Report</SheetTitle>
          <SheetDescription className="text-base text-muted-foreground">
            Comprehensive analysis for RFQ {rfqId} - Generated on {analysisData.analysisDate}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Executive Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Award className="h-5 w-5 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{analysisData.overallScore}/5</div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="text-center p-4 bg-accent/50 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-accent-foreground">{analysisData.confidence}%</div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
              </div>
              <div className="p-4 bg-muted/30 border border-border rounded-lg">
                <div className="font-semibold mb-2 text-foreground">Recommended Vendor: {analysisData.recommendedVendor}</div>
                <Badge className="bg-accent text-accent-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {analysisData.recommendation.decision}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Decision Factors Analysis */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Decision Factors Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisData.decisionFactors.map((factor, index) => (
                <div key={index} className="border border-border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-border text-muted-foreground">{factor.weight}% weight</Badge>
                      <span className="font-bold text-lg text-foreground">{factor.score}/5</span>
                    </div>
                  </div>
                  <Progress value={factor.score * 20} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{factor.reasoning}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Vendor Comparison */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                Comprehensive Vendor Comparison Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Vendor</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Price</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Delivery</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Quality</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Lead Time</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Accuracy</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Service</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Compliance</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Reputation</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Innovation</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Risk</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Total</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisData.vendorComparison.map((vendor, index) => (
                      <tr key={index} className="border-b border-muted">
                        <td className="py-3 px-2 font-medium text-foreground">{vendor.vendor}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.priceCompetitiveness}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.onTimeDelivery}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.defectRate}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.leadTime}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.orderAccuracy}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.customerService}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.complianceRate}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.supplierReputation}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.innovationCapability}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{vendor.riskProfile}</td>
                        <td className="py-3 px-2 text-center font-bold text-foreground">{vendor.totalScore}</td>
                        <td className="py-3 px-2 text-center">
                          <Badge 
                            variant={vendor.status === "Recommended" ? "default" : "secondary"}
                            className={
                              vendor.status === "Recommended" ? "bg-primary text-primary-foreground" :
                              vendor.status === "Alternative" ? "bg-secondary text-secondary-foreground" :
                              "bg-muted text-muted-foreground"
                            }
                          >
                            {vendor.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Key Advantages */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                Key Advantages - {analysisData.recommendedVendor}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisData.keyAdvantages.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{advantage}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Concerns & Mitigation */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Concerns & Mitigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisData.concerns.map((concern, index) => (
                <div key={index} className="border-l-4 border-primary/50 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{concern.issue}</span>
                    <Badge 
                      variant="outline" 
                      className={
                        concern.severity === "High" ? "text-destructive border-destructive/50" : 
                        concern.severity === "Medium" ? "text-muted-foreground border-border" : 
                        "text-primary border-primary/50"
                      }
                    >
                      {concern.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Mitigation:</strong> {concern.mitigation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* KPI Methodology Accordion */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Database className="h-5 w-5 text-primary" />
                Analysis Methodology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="methodology" className="border-border">
                  <AccordionTrigger className="text-foreground hover:text-primary">
                    How we analyse and get the perfect vendor
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="text-sm text-muted-foreground mb-4">
                      Our AI analysis uses a comprehensive 10-factor scoring system to evaluate vendors objectively. 
                      Each factor is scored on a scale of 1-5 based on quantitative data and industry benchmarks.
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-border rounded-lg">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground border-b border-border">KPI</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground border-b border-border">Score Scale</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground border-b border-border">Sample Scoring</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground border-b border-border">Data Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisData.kpiMethodology.map((kpi, index) => (
                            <tr key={index} className="border-b border-muted last:border-b-0">
                              <td className="py-3 px-4 font-medium text-foreground">{kpi.kpi}</td>
                              <td className="py-3 px-4 text-muted-foreground">{kpi.scoreScale}</td>
                              <td className="py-3 px-4 text-muted-foreground">{kpi.sampleScoring}</td>
                              <td className="py-3 px-4 text-muted-foreground">{kpi.dataSource}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 p-3 bg-accent/30 border border-border rounded-lg">
                      <div className="text-sm font-medium text-accent-foreground mb-2">Scoring Methodology:</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Each KPI is weighted based on business impact and project requirements</li>
                        <li>• Scores are normalized and aggregated to produce a final vendor ranking</li>
                        <li>• Data sources include historical performance, supplier audits, and market intelligence</li>
                        <li>• AI algorithms identify patterns and correlations across multiple data points</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Final Recommendation */}
          <Card className="border-accent/50 bg-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent-foreground">
                <Award className="h-5 w-5" />
                Final Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="font-semibold mb-2 text-foreground">Decision: {analysisData.recommendation.decision}</div>
                <p className="text-sm text-muted-foreground mb-4">{analysisData.recommendation.reasoning}</p>
                
                <div className="space-y-2">
                  <div className="font-medium text-sm text-foreground">Next Steps:</div>
                  <ul className="space-y-1">
                    {analysisData.recommendation.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="font-medium text-primary">{index + 1}.</span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/*
AI OUTPUT FORMAT TEMPLATE:
The above component expects AI analysis data in this exact structure:

{
  rfqId: string,
  recommendedVendor: string,
  overallScore: number, // 0-5 (changed from 0-10)
  confidence: number, // 0-100 percentage
  analysisDate: string,
  
  decisionFactors: [
    {
      factor: string, // e.g., "Price Competitiveness", "On-Time Delivery Rate"
      weight: number, // percentage weight in decision
      score: number, // 0-5 score for this factor (changed from 0-10)
      reasoning: string // detailed explanation
    }
  ],

  vendorComparison: [
    {
      vendor: string,
      priceCompetitiveness: number, // 1-5 scale
      onTimeDelivery: number, // 1-5 scale
      defectRate: number, // 1-5 scale
      leadTime: number, // 1-5 scale
      orderAccuracy: number, // 1-5 scale
      customerService: number, // 1-5 scale
      complianceRate: number, // 1-5 scale
      supplierReputation: number, // 1-5 scale
      innovationCapability: number, // 1-5 scale
      riskProfile: number, // 1-5 scale
      totalScore: number, // calculated average
      status: "Recommended" | "Alternative" | "Not Recommended"
    }
  ],

  kpiMethodology: [
    {
      kpi: string, // KPI name
      scoreScale: string, // "1–5"
      sampleScoring: string, // scoring criteria
      dataSource: string // data source description
    }
  ],

  keyAdvantages: string[], // Array of advantage descriptions

  concerns: [
    {
      issue: string,
      mitigation: string,
      severity: "Low" | "Medium" | "High"
    }
  ],

  recommendation: {
    decision: "APPROVE" | "REJECT" | "REVIEW",
    reasoning: string,
    nextSteps: string[]
  }
}

KPI SCORING METHODOLOGY:
All KPIs use a 1-5 scale based on quantitative data:
- Price Competitiveness: 5=Lowest quote, 3=Within 10% of lowest, 1=Highest
- On-Time Delivery Rate: 5=98-100%, 3=90-94%, 1=<80% on time
- Defect Rate: 5=<1%, 3=2-4%, 1=>7% defective
- Lead Time: 5=Always within SLA, 3=10-20% over, 1=>30% over
- Order Accuracy: 5=99-100% correct, 3=94-96%, 1=<90%
- Customer Service: 5=Immediate response, 3=Average, 1=Poor
- Compliance Rate: 5=Fully compliant, 3=Minor issues, 1=Major failures
- Supplier Reputation: 5=Excellent, 3=Average, 1=Negative
- Innovation Capability: 5=Consistent innovations, 3=Occasional, 1=None
- Risk Profile: 5=Low & managed, 3=Moderate, 1=High risk
*/