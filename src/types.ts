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

export interface FeasibilityAnalysis {
  timelineFeasibility: {
    proposedDuration: string;
    isRealistic: boolean;
    weatherImpact: string;
    seasonalConstraints: string[];
    recommendation: string;
  };
  resourceAvailability: {
    laborAvailable: boolean;
    materialsAccessible: boolean;
    equipmentAvailable: boolean;
    concerns: string[];
  };
  historicalComparison: {
    similarProjectsFound: boolean;
    averageDuration: string;
    successRate: string;
    keyLearnings: string[];
  };
  riskFactors: {
    factor: string;
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
  overallFeasibility: 'highly-feasible' | 'feasible' | 'challenging' | 'not-feasible';
  feasibilityScore: number; // 0-100
}

export interface GuidelineRecommendation {
  guidelineReference: string;
  currentStatus: 'compliant' | 'partial' | 'non-compliant' | 'missing';
  issue: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: string;
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
  guidelineRecommendations: GuidelineRecommendation[];
  feasibilityAnalysis: FeasibilityAnalysis;
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

// File Tracking System Types
export interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  avgProcessingTime: string;
}

export interface AICommunication {
  type: 'call' | 'sms' | 'email' | 'whatsapp';
  timestamp: Date;
  recipient: string;
  summary: string;
  status: 'pending' | 'delivered' | 'completed' | 'failed';
}

export interface FileAction {
  id: string;
  departmentId: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  message: string;
  status: 'pending' | 'completed' | 'rejected' | 'on_hold';
  documents?: string[];
  remarks?: string;
  aiCommunication?: AICommunication;
}

export interface FileSubmission {
  id: string;
  fileName: string;
  projectName: string;
  submittedBy: string;
  submissionDate: Date;
  fileType: 'DPR' | 'EIA' | 'Land_Document' | 'Financial_Document' | 'Technical_Drawing';
  currentDepartment: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_modification' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCompletionDate?: Date;
  totalEstimatedDays: number;
  daysInCurrentDepartment: number;
  timeline: FileAction[];
  documents: string[];
  budget?: number;
  location?: string;
}
