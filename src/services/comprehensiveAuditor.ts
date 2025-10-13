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
  summary: string;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function performComprehensiveAudit(
  dprText: string,
  dprAnalysis: any
): Promise<ComprehensiveAuditReport> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
You are an AI auditor for government infrastructure projects. Perform a COMPREHENSIVE verification of this DPR document.

⚠️ CRITICAL IMAGE/OCR REQUIREMENT:
This document may contain SCANNED PAGES, IMAGES, TABLES AS PICTURES, or EMBEDDED VISUALS. You MUST:
- Extract and analyze ALL text from images, scanned pages, tables, charts, and diagrams
- Read BOQ tables, cost estimates, and financial data even if they are in image format
- DO NOT SKIP any visual content - extract text from every image
- Treat scanned documents as fully readable text

CRITICAL INSTRUCTIONS:
1. Cross-check ALL factual claims by searching online (from text AND images)
2. Validate ALL economic parameters against market rates (extract from tables/images)
3. Detect inconsistencies, fraud indicators, and suspicious claims
4. Flag high-risk areas with detailed explanations
5. Provide sources for every verification
6. READ ALL IMAGES: Extract complete data from scanned BOQ, budget tables, and cost estimates

VERIFICATION CHECKLIST:

A. FACTUAL CLAIMS TO VERIFY:
   - Land ownership details (cross-check with public records if mentioned)
   - Project location and area details
   - Contractor/supplier credentials
   - Timeline and milestones (check if realistic)
   - Environmental clearances mentioned
   - Rehabilitation plans (if any)
   - Population/demographic data
   - Infrastructure claims (existing facilities, connectivity)

B. ECONOMIC PARAMETERS TO VALIDATE:
   - Land acquisition costs (compare with circle rates/market rates)
   - Compensation amounts (check if fair and legal)
   - Labor costs (compare with minimum wages and market rates)
   - Material costs (compare with current market prices)
   - Equipment costs
   - Administrative costs
   - Contingency provisions
   - Total project budget (check if realistic)

C. FRAUD INDICATORS TO DETECT:
   - Inflated costs (>30% above market rate)
   - Duplicate claims or entries
   - Unrealistic timelines
   - Missing mandatory information
   - Suspicious round numbers
   - Inconsistent data across sections
   - Over-estimation of quantities
   - Under-estimation of risks

D. HIGH-RISK AREAS:
   - Budget items with no justification
   - Claims without supporting evidence
   - Unusual payment terms
   - Vague specifications
   - Missing regulatory approvals

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
  "summary": "comprehensive summary of audit findings"
}

DPR DOCUMENT:
${dprText.substring(0, 30000)}

EXISTING ANALYSIS CONTEXT:
${JSON.stringify(dprAnalysis, null, 2)}

Perform thorough verification and return ONLY the JSON response.
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
        summary: auditData.summary || 'Audit completed',
      };
    }
    
    throw new Error('Failed to parse audit response');
  } catch (error) {
    console.error('Error performing comprehensive audit:', error);
    throw error;
  }
}
