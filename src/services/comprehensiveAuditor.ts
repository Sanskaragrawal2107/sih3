import { GoogleGenerativeAI } from '@google/generative-ai';

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
  overallRiskScore: number; // 0-100
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

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function performComprehensiveAudit(
  dprText: string,
  dprAnalysis: any
): Promise<ComprehensiveAuditReport> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
You are an AI auditor for government infrastructure projects. Act like a REAL HUMAN AUDITOR who reviews projects based on past experience and practical knowledge.

⚠️ CRITICAL IMAGE/OCR REQUIREMENT:
This document may contain SCANNED PAGES, IMAGES, TABLES AS PICTURES, or EMBEDDED VISUALS. You MUST:
- Extract and analyze ALL text from images, scanned pages, tables, charts, and diagrams
- Read BOQ tables, cost estimates, and financial data even if they are in image format
- DO NOT SKIP any visual content - extract text from every image
- Treat scanned documents as fully readable text

YOUR ROLE AS AI AUDITOR:
You are reviewing this project like a senior government auditor with 20+ years of experience. You know:
- How weather affects construction (monsoons, winters, extreme heat)
- How long similar projects ACTUALLY take (not just what's written)
- What can go wrong based on past projects
- Whether timelines are realistic considering ground realities
- Resource availability in different regions
- Common mistakes contractors make

COMPREHENSIVE AUDIT TASKS:

1. FRAUD DETECTION & VERIFICATION:
   - Cross-check factual claims
   - Validate economic parameters against market rates
   - Detect inflated costs, duplicate entries, suspicious patterns
   - Flag high-risk areas

2. GUIDELINE COMPLIANCE & RECOMMENDATIONS:
   - Check compliance with MDoNER/PM-DevINE guidelines
   - Identify missing mandatory components
   - Provide specific recommendations to fix non-compliance
   - Prioritize what needs immediate attention

3. FEASIBILITY ANALYSIS (LIKE A REAL HUMAN AUDITOR):
   **Timeline Feasibility:**
   - Is the proposed timeline realistic?
   - Example: "6-month road construction" - Consider:
     * Monsoon season (3-4 months of rain = no work)
     * Winter delays in hilly areas
     * Festival seasons when labor is unavailable
     * Equipment availability
   
   **Resource Availability:**
   - Is skilled labor available in this region?
   - Are materials easily accessible or need to be transported?
   - Is heavy equipment available locally?
   
   **Historical Comparison:**
   - Based on similar past projects, what's the realistic timeline?
   - What's the typical success rate for such projects?
   - What lessons can we learn from past projects?
   
   **Risk Factors:**
   - Weather impact (monsoon, winter, extreme heat)
   - Geographical challenges (hilly terrain, remote location)
   - Political/social factors
   - Supply chain issues
   - Labor availability

RESPONSE FORMAT (JSON only, no markdown):
{
  "verificationIssues": [
    {
      "category": "economic|factual|timeline|environmental|legal|technical",
      "claim": "exact claim from document",
      "verifiedValue": "actual value found from verification",
      "discrepancy": "brief description of mismatch",
      "source": "source used for verification",
      "riskLevel": "low|medium|high|critical",
      "explanation": "detailed explanation of the issue",
      "recommendation": "what should be done"
    }
  ],
  "factualVerification": {
    "landOwnershipVerified": true/false,
    "timelineRealistic": true/false,
    "contractorCredible": true/false,
    "environmentalComplianceChecked": true/false
  },
  "economicValidation": {
    "budgetRealistic": true/false,
    "landPricesFair": true/false,
    "laborCostsFair": true/false,
    "materialCostsFair": true/false
  },
  "fraudIndicators": ["list of fraud red flags found"],
  "guidelineRecommendations": [
    {
      "guidelineReference": "specific guideline name/section",
      "currentStatus": "compliant|partial|non-compliant|missing",
      "issue": "what's wrong or missing",
      "recommendation": "specific action to fix it",
      "priority": "low|medium|high|critical",
      "actionRequired": "detailed steps to resolve"
    }
  ],
  "feasibilityAnalysis": {
    "timelineFeasibility": {
      "proposedDuration": "extract from document",
      "isRealistic": true/false,
      "weatherImpact": "detailed analysis of how weather affects timeline",
      "seasonalConstraints": ["monsoon delays", "winter issues", etc],
      "recommendation": "realistic timeline with justification"
    },
    "resourceAvailability": {
      "laborAvailable": true/false,
      "materialsAccessible": true/false,
      "equipmentAvailable": true/false,
      "concerns": ["specific concerns about resources"]
    },
    "historicalComparison": {
      "similarProjectsFound": true/false,
      "averageDuration": "typical duration for similar projects",
      "successRate": "success rate of similar projects",
      "keyLearnings": ["lessons from past projects"]
    },
    "riskFactors": [
      {
        "factor": "specific risk (weather, resources, etc)",
        "impact": "low|medium|high",
        "mitigation": "how to address this risk"
      }
    ],
    "overallFeasibility": "highly-feasible|feasible|challenging|not-feasible",
    "feasibilityScore": 0-100
  },
  "summary": "comprehensive summary of audit findings"
}

DPR DOCUMENT:
${dprText.substring(0, 30000)}

EXISTING ANALYSIS CONTEXT:
${JSON.stringify(dprAnalysis, null, 2)}

Think like a real human auditor with years of experience. Consider practical ground realities, not just what's written on paper.
Return ONLY the JSON response.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('Comprehensive Audit Response:', response);
    
    // Extract JSON from response
    let jsonMatch = response.match(/\{[\s\S]*\}/);
    
    // Handle markdown code blocks
    if (!jsonMatch) {
      const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (codeBlockMatch) {
        jsonMatch = [codeBlockMatch[1]];
      }
    }
    
    if (jsonMatch) {
      const auditData = JSON.parse(jsonMatch[0]);
      
      // Calculate statistics
      const issues = auditData.verificationIssues || [];
      const criticalIssues = issues.filter((i: VerificationIssue) => i.riskLevel === 'critical').length;
      const highRiskIssues = issues.filter((i: VerificationIssue) => i.riskLevel === 'high').length;
      const mediumRiskIssues = issues.filter((i: VerificationIssue) => i.riskLevel === 'medium').length;
      const lowRiskIssues = issues.filter((i: VerificationIssue) => i.riskLevel === 'low').length;
      
      // Calculate overall risk score (0-100)
      const overallRiskScore = Math.min(100, 
        (criticalIssues * 25) + 
        (highRiskIssues * 15) + 
        (mediumRiskIssues * 8) + 
        (lowRiskIssues * 3)
      );
      
      return {
        overallRiskScore,
        totalIssuesFound: issues.length,
        criticalIssues,
        highRiskIssues,
        mediumRiskIssues,
        lowRiskIssues,
        verificationIssues: issues,
        factualVerification: auditData.factualVerification || {
          landOwnershipVerified: false,
          timelineRealistic: false,
          contractorCredible: false,
          environmentalComplianceChecked: false,
        },
        economicValidation: auditData.economicValidation || {
          budgetRealistic: false,
          landPricesFair: false,
          laborCostsFair: false,
          materialCostsFair: false,
        },
        fraudIndicators: auditData.fraudIndicators || [],
        guidelineRecommendations: auditData.guidelineRecommendations || [],
        feasibilityAnalysis: auditData.feasibilityAnalysis || {
          timelineFeasibility: {
            proposedDuration: 'Not specified',
            isRealistic: false,
            weatherImpact: 'Not analyzed',
            seasonalConstraints: [],
            recommendation: 'Requires detailed timeline analysis',
          },
          resourceAvailability: {
            laborAvailable: false,
            materialsAccessible: false,
            equipmentAvailable: false,
            concerns: ['Insufficient data for analysis'],
          },
          historicalComparison: {
            similarProjectsFound: false,
            averageDuration: 'No data',
            successRate: 'No data',
            keyLearnings: [],
          },
          riskFactors: [],
          overallFeasibility: 'challenging',
          feasibilityScore: 50,
        },
        summary: auditData.summary || 'Audit completed',
      };
    }
    
    throw new Error('Failed to parse audit response');
  } catch (error) {
    console.error('Error performing comprehensive audit:', error);
    throw error;
  }
}
