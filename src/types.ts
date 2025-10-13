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

export interface AnalysisState {
  isAnalyzing: boolean;
  isComplete: boolean;
  analysis: DPRAnalysis | null;
  error: string | null;
}
