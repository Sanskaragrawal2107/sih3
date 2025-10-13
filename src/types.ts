export interface RedFlag {
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  issue: string;
  details: string;
  guideline_violated: string;
  recommendation: string;
}

export interface DPRAnalysis {
  overall_compliance: 'High' | 'Medium' | 'Low';
  compliance_score: number;
  red_flags: RedFlag[];
  missing_components: string[];
  strengths: string[];
  summary: string;
}

export interface MaterialPrice {
  material: string;
  currentPrice: string;
  unit: string;
  source: string;
  lastUpdated: string;
  priceRange?: string;
  trend?: 'up' | 'down' | 'stable';
  dprPrice?: string;
  dprUnit?: string;
  variance?: number; // Percentage difference
  status?: 'fair' | 'overpriced' | 'underpriced' | 'suspicious';
  analysis?: string;
}

export interface VerificationIssue {
  category: 'factual' | 'economic' | 'timeline' | 'environmental' | 'legal' | 'technical';
  claim: string;
  verifiedValue?: string;
  discrepancy: string;
  source: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  recommendation: string;
}

export interface ComprehensiveAuditReport {
  overallRiskScore: number;
  totalIssuesFound: number;
  criticalIssues: number;
  highRiskIssues: number;
  mediumRiskIssues: number;
  lowRiskIssues: number;
  verificationIssues: VerificationIssue[];
  factualVerification: {
    landOwnershipVerified: boolean;
    timelineRealistic: boolean;
    contractorCredible: boolean;
    environmentalComplianceChecked: boolean;
  };
  economicValidation: {
    budgetRealistic: boolean;
    landPricesFair: boolean;
    laborCostsFair: boolean;
    materialCostsFair: boolean;
  };
  fraudIndicators: string[];
  summary: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  isComplete: boolean;
  analysis: DPRAnalysis | null;
  error: string | null;
  materialPrices?: MaterialPrice[];
  isFetchingPrices?: boolean;
  comprehensiveAudit?: ComprehensiveAuditReport | null;
  isPerformingAudit?: boolean;
}
