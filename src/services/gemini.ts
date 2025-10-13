import { GoogleGenerativeAI } from '@google/generative-ai';
import { DPRAnalysis } from '../types';

export async function analyzeDPRWithGemini(
  file: File,
  guidelinesText: string,
  language: 'en' | 'as' = 'en'
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
    
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      base64Length: base64Data.length
    });

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
✓ THOROUGH: You examine every page, paragraph, table, chart, image, diagram, scanned document, and appendix
✓ OCR-ENABLED: You extract and analyze ALL text from images, scanned pages, tables, charts, diagrams, and embedded pictures
✓ IMAGE-AWARE: You carefully read text within images, screenshots, photos of documents, handwritten notes, and any visual content
✓ TABLE-EXPERT: You extract complete data from tables, BOQ (Bill of Quantities), cost estimates, and financial schedules even if they are images
✓ BALANCED: You identify genuine issues that could impact project success, while acknowledging good practices
✓ EVIDENCE-BASED: You cite specific sections, page numbers, and data points when identifying issues
✓ FAIR: You evaluate against MDoNER guidelines but understand that minor variations are acceptable if justified
✓ COMPREHENSIVE: You evaluate technical, financial, environmental, social, and administrative dimensions
✓ CONSTRUCTIVE: You provide actionable recommendations and acknowledge project strengths
✓ PRACTICAL: You focus on issues that materially affect project viability, not just minor formatting or documentation gaps

IMPORTANT: This document may contain:
- Scanned pages with text in images
- Tables and charts as images
- BOQ (Bill of Quantities) in image format
- Cost estimates and budgets in scanned tables
- Technical drawings and diagrams with annotations
- Photos of documents or handwritten notes
- Screenshots of data or reports

YOU MUST extract and analyze ALL text from these images. Do not skip any visual content. Read every table, chart, and image carefully.

OFFICIAL MDoNER GUIDELINES FOR REFERENCE:
${guidelinesText}

EVALUATION TASK:
Conduct a thorough, page-by-page evaluation of the uploaded DPR document. Examine:

1. **BUDGET & FINANCIAL ANALYSIS** (EXTRACT FROM IMAGES/TABLES)
   - **CRITICAL**: Extract ALL cost data from tables, even if they are images or scanned pages
   - Read BOQ (Bill of Quantities) tables completely, including material names, quantities, rates, and amounts
   - Extract budget tables, cost estimates, and financial schedules from images
   - Verify all cost estimates against market rates and guidelines
   - Check for arithmetic errors in calculations
   - Validate budget allocation across components
   - Assess financial sustainability and O&M provisions
   - Review funding sources and disbursement schedules
   - Identify any unrealistic or inflated cost projections
   - **DO NOT SKIP**: If you see a table or chart as an image, read every cell and extract all data

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
- Critical Severity: ONLY for issues that make the project completely non-viable or violate mandatory legal/regulatory requirements
- High Severity: Significant gaps that could lead to project failure, major cost overruns, or substantial delays
- Medium Severity: Important issues that should be addressed but don't prevent project approval with conditions
- Low Severity: Minor improvements, documentation gaps, or suggestions that would enhance project quality

IMPORTANT GUIDELINES:
- Focus on material issues that affect project success
- Don't flag minor documentation formatting issues as high severity
- Acknowledge when the project has good elements
- Be constructive and solution-oriented
- Only mark as "Critical" if the project truly cannot proceed

Analyze the COMPLETE document now. Be thorough, balanced, and constructive.

${language === 'as' ? `
CRITICAL LANGUAGE REQUIREMENT:
- Write ALL text content in ASSAMESE (অসমীয়া) language
- This includes: issue descriptions, details, recommendations, summary, strengths, missing components
- Use Assamese script (অসমীয়া লিপি) for all text fields
- Keep field names in English (e.g., "issue", "details") but VALUES in Assamese
- Example: "issue": "বাজেট সম্পৰ্কীয় সমস্যা" (not "Budget Issue")
` : `
- Write all content in clear, professional ENGLISH
`}

Return ONLY the JSON object.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 163840, // Increased for complete responses
      },
    });

    // Add timeout and retry logic
    let result;
    let retries = 0;
    const maxRetries = 2;
    
    while (retries <= maxRetries) {
      try {
        result = await model.generateContent([
          promptText,
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
        ]);
        break; // Success, exit loop
      } catch (error: any) {
        retries++;
        if (retries > maxRetries || !error.message?.includes('503')) {
          throw error; // Not a timeout or max retries reached
        }
        console.log(`Retry ${retries}/${maxRetries} after timeout...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }

    if (!result) {
      throw new Error('Failed to get response after retries');
    }

    const response = await result.response;
    
    console.log('Response object:', response);
    console.log('Response candidates:', response.candidates);
    
    // Check if response was blocked by safety filters
    if (!response.candidates || response.candidates.length === 0) {
      console.error('No candidates in response - may be blocked by safety filters');
      throw new Error('Gemini API blocked the response. This may be due to safety filters or content policy. Try with a different document.');
    }

    // Parse response
    let responseText = '';
    try {
      responseText = response.text();
    } catch (textError: any) {
      console.error('Error getting text from response:', textError);
      throw new Error('Failed to extract text from Gemini response. The response may be empty or blocked.');
    }
    
    console.log('Raw Gemini Response (first 500 chars):', responseText.substring(0, 500));
    console.log('Response length:', responseText.length);
    console.log('Full response:', responseText);
    
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

    // Check if response is empty or too short
    if (!responseText || responseText.length < 10) {
      console.error('Empty or invalid response from Gemini');
      throw new Error('Gemini returned an empty response. The document may be too large or the API may be overloaded. Please try again with a smaller file.');
    }

    // Validate JSON before parsing
    try {
      // Try to repair common JSON issues
      let repairedJson = responseText.trim();
      
      console.log('Attempting to parse JSON, length:', repairedJson.length);
      
      // Remove any markdown code blocks
      repairedJson = repairedJson.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Fix unterminated strings and arrays
      if (!repairedJson.endsWith('}')) {
        console.warn('JSON appears incomplete, attempting to repair...');
        
        // If we have an unterminated string, try to close it
        const openQuotes = (repairedJson.match(/"/g) || []).length;
        if (openQuotes % 2 !== 0) {
          console.warn('Unterminated string detected, adding closing quote');
          repairedJson += '"';
        }
        
        // Close any open arrays
        const openBrackets = (repairedJson.match(/\[/g) || []).length;
        const closeBrackets = (repairedJson.match(/\]/g) || []).length;
        if (openBrackets > closeBrackets) {
          const missing = openBrackets - closeBrackets;
          repairedJson += ']'.repeat(missing);
          console.log(`Added ${missing} closing bracket(s)`);
        }
        
        // Close any open braces
        const openBraces = (repairedJson.match(/\{/g) || []).length;
        const closeBraces = (repairedJson.match(/\}/g) || []).length;
        if (openBraces > closeBraces) {
          const missing = openBraces - closeBraces;
          repairedJson += '}'.repeat(missing);
          console.log(`Added ${missing} closing brace(s)`);
        }
      }
      
      // Try to parse
      let analysis: DPRAnalysis;
      try {
        analysis = JSON.parse(repairedJson);
      } catch (firstError: any) {
        console.warn('First parse failed, attempting aggressive repair...', firstError.message);
        
        // More aggressive repair: try to extract valid JSON up to the error
        const errorMatch = firstError.message.match(/position (\d+)/);
        if (errorMatch) {
          const errorPos = parseInt(errorMatch[1]);
          console.log(`Error at position ${errorPos}, truncating and repairing...`);
          
          // Truncate at error position and try to close properly
          let truncated = repairedJson.substring(0, errorPos);
          
          // Remove incomplete field
          const lastComma = truncated.lastIndexOf(',');
          const lastColon = truncated.lastIndexOf(':');
          if (lastColon > lastComma) {
            // We're in the middle of a field value, remove it
            truncated = truncated.substring(0, lastComma > 0 ? lastComma : truncated.lastIndexOf('{'));
          }
          
          // Close all open structures
          const openBrackets = (truncated.match(/\[/g) || []).length;
          const closeBrackets = (truncated.match(/\]/g) || []).length;
          truncated += ']'.repeat(Math.max(0, openBrackets - closeBrackets));
          
          const openBraces = (truncated.match(/\{/g) || []).length;
          const closeBraces = (truncated.match(/\}/g) || []).length;
          truncated += '}'.repeat(Math.max(0, openBraces - closeBraces));
          
          console.log('Attempting to parse truncated JSON...');
          analysis = JSON.parse(truncated);
        } else {
          throw firstError;
        }
      }
      
      // Validate required fields
      if (!analysis.overall_compliance || !analysis.red_flags || !analysis.summary) {
        throw new Error('Incomplete analysis response - missing required fields');
      }
      
      // Ensure arrays exist
      if (!Array.isArray(analysis.red_flags)) {
        analysis.red_flags = [];
      }
      if (!Array.isArray(analysis.missing_components)) {
        analysis.missing_components = [];
      }
      if (!Array.isArray(analysis.strengths)) {
        analysis.strengths = [];
      }
      
      return analysis;
    } catch (parseError: any) {
      console.error('JSON Parse Error:', parseError);
      console.error('Failed to parse response:', responseText.substring(0, 1000));
      
      // If JSON is completely broken, try to extract what we can
      if (parseError.message.includes('Unterminated string') || parseError.message.includes('Unexpected end')) {
        console.warn('Attempting emergency JSON extraction...');
        
        // Return a minimal valid response
        return {
          overall_compliance: 'Medium',
          compliance_score: 50,
          red_flags: [{
            category: 'Technical',
            severity: 'High',
            issue: 'Analysis Incomplete',
            details: 'The AI analysis was interrupted. Please try again with a smaller file or retry the analysis.',
            guideline_violated: 'N/A',
            recommendation: 'Re-upload the document and try again. If the issue persists, try reducing the file size or splitting the document.'
          }],
          missing_components: ['Complete analysis could not be generated'],
          strengths: [],
          summary: 'Analysis was interrupted due to response timeout or size limits. Please retry with a smaller document (< 5MB recommended) or try again later.'
        };
      }
      
      throw new Error(`Failed to parse Gemini response: ${parseError.message}. The response may be incomplete or malformed.`);
    }
  } catch (error: any) {
    console.error('Error analyzing DPR:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('503') || error.message?.includes('timeout')) {
      throw new Error('Gemini API timeout - Your document may be too large or complex. Try: 1) Reducing file size, 2) Waiting a moment and retrying, 3) Checking your internet connection.');
    } else if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your .env file.');
    } else if (error.message?.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please check your API usage limits.');
    } else if (error.message?.includes('400')) {
      throw new Error('Invalid request to Gemini API. The file format may not be supported.');
    } else {
      throw new Error(`Failed to analyze DPR: ${error.message || 'Unknown error'}`);
    }
  }
}
