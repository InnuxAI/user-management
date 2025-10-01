import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface AIReportSheetProps {
  isOpen: boolean;
  onClose: () => void;
  rfqId: string;
  selectedDoc: string;
}

interface ReportData {
  overallScore: number;
  recommendation: string;
  detailedAnalysis: {
    category: string;
    score: number;
    analysis: string;
    strengths: string[];
    concerns: string[];
  }[];
  riskFactors: string[];
  complianceCheck: {
    item: string;
    status: "Pass" | "Fail" | "Partial";
  }[];
}

export function AIReportSheet({ isOpen, onClose, rfqId, selectedDoc }: AIReportSheetProps) {
  // Mock AI report data
  const reportData: ReportData = {
    overallScore: 85,
    recommendation: "Document 1 is recommended based on superior quality metrics and compliance standards.",
    detailedAnalysis: [
      {
        category: "Quality Score",
        score: 92,
        analysis: "Excellent quality standards with comprehensive quality management systems in place.",
        strengths: ["ISO 9001 certified", "Proven track record", "Quality control processes"],
        concerns: ["Limited automation in quality checks"]
      },
      {
        category: "Delivery Time",
        score: 78,
        analysis: "Competitive delivery timeline with reliable logistics network.",
        strengths: ["Multiple distribution centers", "Express shipping options"],
        concerns: ["Potential delays during peak seasons", "Limited weekend delivery"]
      },
      {
        category: "Price",
        score: 85,
        analysis: "Competitive pricing with transparent cost structure.",
        strengths: ["Volume discounts available", "No hidden fees", "Price stability"],
        concerns: ["Higher than lowest bidder", "Limited price negotiation flexibility"]
      },
      {
        category: "Compliance",
        score: 95,
        analysis: "Excellent compliance record with all regulatory requirements.",
        strengths: ["Full regulatory compliance", "Regular audits", "Certifications up to date"],
        concerns: ["Minor documentation gaps"]
      },
      {
        category: "Technical Capability",
        score: 88,
        analysis: "Strong technical capabilities with modern infrastructure.",
        strengths: ["Advanced manufacturing equipment", "R&D investment", "Technical support"],
        concerns: ["Limited experience with cutting-edge technologies"]
      }
    ],
    riskFactors: [
      "Single source dependency for specialized components",
      "Limited backup suppliers",
      "Potential supply chain disruptions"
    ],
    complianceCheck: [
      { item: "Financial Stability", status: "Pass" },
      { item: "Legal Standing", status: "Pass" },
      { item: "Insurance Coverage", status: "Pass" },
      { item: "Certifications", status: "Partial" },
      { item: "References", status: "Pass" }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary";
    if (score >= 75) return "text-accent-foreground";
    return "text-destructive";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pass": return "bg-accent/20 text-accent-foreground";
      case "Fail": return "bg-destructive/20 text-destructive";
      case "Partial": return "bg-muted text-muted-foreground";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[60vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">AI Analysis Report</SheetTitle>
          <SheetDescription>
            Detailed analysis for {rfqId} - {selectedDoc}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">Overall Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(reportData.overallScore)}`}>
                  {reportData.overallScore}/100
                </span>
              </div>
              <Progress value={reportData.overallScore} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                {reportData.recommendation}
              </p>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Category Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportData.detailedAnalysis.map((analysis, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{analysis.category}</h4>
                    <span className={`font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}/100
                    </span>
                  </div>
                  <Progress value={analysis.score} className="mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    {analysis.analysis}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-primary mb-2">Strengths</h5>
                      <ul className="text-sm space-y-1">
                        {analysis.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-accent-foreground mb-2">Areas of Concern</h5>
                      <ul className="text-sm space-y-1">
                        {analysis.concerns.map((concern, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {reportData.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    {risk}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Compliance Check */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.complianceCheck.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.item}</span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}