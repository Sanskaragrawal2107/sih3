import { GoogleGenerativeAI } from '@google/generative-ai';
import { DPRAnalysis } from '../types';

export async function analyzeDPRWithGemini(
  file: File,
  guidelinesText: string
): Promise<DPRAnalysis> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    // Read file as base64
    const fileBuffer = await file.arrayBuffer();
    const base64Data = btoa(
      new Uint8Array(fileBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    const promptText = `You are a Senior DPR (Detailed Project Report) Evaluation Specialist with over 10 years of experience working with the Ministry of Development of North Eastern Region (MDoNER). You have successfully evaluated hundreds of project proposals and have deep expertise in:

- PM-DevINE scheme guidelines and compliance requirements
- Infrastructure project planning and execution in North Eastern states
- Budget analysis and financial feasibility assessment
- Environmental impact evaluation and sustainability planning
- Technical feasibility and engineering standards
- Stakeholder consultation and social impact assessment
- Risk identification and mitigation strategies
- Project timeline and resource allocation optimization

Your evaluation approach is:
✓ METICULOUS: You examine every single page, paragraph, table, chart, image, and appendix
✓ CRITICAL: You identify even minor discrepancies that could escalate into major issues
✓ EVIDENCE-BASED: You cite specific sections, page numbers, and data points when identifying issues
✓ GUIDELINE-DRIVEN: You strictly compare every aspect against official MDoNER guidelines
✓ COMPREHENSIVE: You evaluate technical, financial, environmental, social, and administrative dimensions
✓ CONSTRUCTIVE: You provide actionable recommendations for each identified issue

OFFICIAL MDoNER GUIDELINES FOR REFERENCE:
${guidelinesText}

EVALUATION TASK:
Conduct a thorough, page-by-page evaluation of the uploaded DPR document. Examine:

1. **BUDGET & FINANCIAL ANALYSIS**
   - Verify all cost estimates against market rates and guidelines
   - Check for arithmetic errors in calculations
   - Validate budget allocation across components
   - Assess financial sustainability and O&M provisions
   - Review funding sources and disbursement schedules
   - Identify any unrealistic or inflated cost projections

2. **PROJECT TIMELINE & SCHEDULING**
   - Evaluate feasibility of proposed timelines
   - Check for logical sequencing of activities
   - Assess resource availability alignment with schedule
   - Identify potential delays or bottlenecks
   - Verify milestone definitions and completion criteria

3. **TECHNICAL FEASIBILITY**
   - Review technical specifications and design standards
   - Assess appropriateness of proposed technology/methodology
   - Evaluate technical drawings, blueprints, and diagrams
   - Check for compliance with engineering standards
   - Verify technical capacity and expertise requirements

4. **ENVIRONMENTAL & SOCIAL IMPACT**
   - Review Environmental Impact Assessment (EIA) completeness
   - Check for environmental clearances and approvals
   - Assess sustainability and climate resilience measures
   - Evaluate social impact and community consultation
   - Review Resettlement Action Plan (if applicable)
   - Check for forest clearances and biodiversity considerations

5. **RESOURCE ALLOCATION & MANAGEMENT**
   - Verify human resource planning and availability
   - Assess material and equipment procurement plans
   - Check for land acquisition status and documentation
   - Evaluate contractor selection and management approach
   - Review quality control and monitoring mechanisms

6. **COMPLIANCE & DOCUMENTATION**
   - Verify alignment with PM-DevINE guidelines
   - Check for all mandatory sections and annexures
   - Validate statutory clearances and certificates
   - Review stakeholder consultation documentation
   - Assess Output-Outcome Framework and KPIs
   - Verify Gati Shakti Master Plan alignment

7. **DATA CONSISTENCY & ACCURACY**
   - Cross-verify data across different sections
   - Check for contradictions in figures and statements
   - Validate references and citations
   - Assess data sources and reliability
   - Identify missing or incomplete information

8. **RISK ASSESSMENT**
   - Identify technical, financial, and operational risks
   - Evaluate risk mitigation strategies
   - Assess contingency planning adequacy
   - Review insurance and liability provisions

CRITICAL: You must respond with ONLY valid JSON. No markdown, no code blocks, no explanatory text outside the JSON structure.

OUTPUT FORMAT (strict JSON):
{
    "overall_compliance": "High/Medium/Low",
    "compliance_score": 0-100,
    "red_flags": [
        {
            "category": "Budget/Timeline/Technical/Environmental/Compliance/Resource/Risk/Documentation",
            "severity": "Critical/High/Medium/Low",
            "issue": "Concise issue title",
            "details": "Detailed explanation with specific references to page numbers, sections, or data points",
            "guideline_violated": "Specific MDoNER guideline or requirement violated",
            "recommendation": "Specific, actionable steps to resolve this issue"
        }
    ],
    "missing_components": ["List each missing mandatory component with specific guideline reference"],
    "strengths": ["List positive aspects and well-executed components"],
    "summary": "Comprehensive executive summary of the evaluation findings, overall assessment, and key recommendations"
}

EVALUATION STANDARDS:
- Critical Severity: Issues that make the project non-viable or violate mandatory requirements
- High Severity: Significant gaps that could lead to project failure or major delays
- Medium Severity: Important issues requiring attention before approval
- Low Severity: Minor improvements that would enhance project quality

Analyze the COMPLETE document now. Be thorough, be critical, be specific. Return ONLY the JSON object.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
      },
    });

    const result = await model.generateContent([
      promptText,
      {
        inlineData: {
          mimeType: file.type,
          data: base64Data,
        },
      },
    ]);

    const response = await result.response;

    // Parse response
    let responseText = response.text();
    
    // Remove markdown code blocks if present
    responseText = responseText.trim();
    if (responseText.startsWith('```json')) {
      responseText = responseText.substring(7);
    }
    if (responseText.startsWith('```')) {
      responseText = responseText.substring(3);
    }
    if (responseText.endsWith('```')) {
      responseText = responseText.substring(0, responseText.length - 3);
    }
    responseText = responseText.trim();

    // Try to extract JSON from text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    const analysis: DPRAnalysis = JSON.parse(responseText);
    return analysis;
  } catch (error) {
    console.error('Error analyzing DPR:', error);
    throw new Error('Failed to analyze DPR with Gemini');
  }
}
