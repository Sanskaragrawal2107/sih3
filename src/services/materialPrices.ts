import { GoogleGenerativeAI } from '@google/generative-ai';

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
  variance?: number;
  status?: 'fair' | 'overpriced' | 'underpriced' | 'suspicious';
  analysis?: string;
}

interface DPRMaterialPrice {
  material: string;
  price: string;
  unit: string;
  quantity?: string;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function extractMaterialsWithPricesFromDPR(dprText: string, dprFile?: File): Promise<DPRMaterialPrice[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
You are analyzing a DPR (Detailed Project Report) document. Extract ALL materials with their EXACT prices as mentioned in the document.

⚠️ CRITICAL IMAGE EXTRACTION REQUIREMENT:
This document may contain SCANNED PAGES, IMAGES, or TABLES AS PICTURES. You MUST:
- Extract text from ALL images, scanned pages, and embedded pictures
- Read BOQ (Bill of Quantities) tables even if they are images
- Extract data from cost estimate tables in image format
- Read material rate schedules from scanned documents
- DO NOT SKIP any visual content - treat images as readable text

CRITICAL: Look for these sections carefully (including in images):
1. Bill of Quantities (BOQ) - often in table/image format
2. Cost Estimates / Budget Tables - may be scanned
3. Material Rate Analysis - could be in images
4. Supplier Quotations - might be photos/scans
5. Price Lists / Rate Schedules - often scanned documents
6. Financial Estimates - tables may be images
7. Any tables with material names and rates/prices (IMAGE OR TEXT)

IMPORTANT RULES:
- Extract the EXACT price mentioned in the document (from text OR images)
- If you see a table in an image, read EVERY row and extract all materials with prices
- If you find a price for a material, you MUST include it
- Look for prices in tables, lists, paragraphs, AND IMAGES
- Common formats: "Rs.", "₹", "INR", numbers followed by "per unit"
- Include ALL materials that have prices, even if partial information
- READ SCANNED PAGES: Many DPRs have scanned BOQ tables - extract all data from them

Return ONLY a valid JSON array (no markdown, no explanation):
[
  {
    "material": "exact material name from document (extracted from text or image)",
    "price": "numeric value only (remove currency symbols)",
    "unit": "unit from document (per bag, per ton, per cubic meter, etc.)",
    "quantity": "quantity if mentioned"
  }
]

If NO prices are found in the document (after checking ALL images and text), return an empty array: []

Document Content:
${dprText.substring(0, 25000)}
`;

  try {
    let result;
    
    // If file is provided, use it for better image extraction
    if (dprFile) {
      const fileBuffer = await dprFile.arrayBuffer();
      const base64Data = btoa(
        new Uint8Array(fileBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: dprFile.type,
            data: base64Data,
          },
        },
      ]);
    } else {
      // Fallback to text-only
      result = await model.generateContent(prompt);
    }
    
    const response = result.response.text();
    
    console.log('DPR Price Extraction Response:', response); // Debug log
    
    // Extract JSON array from response (handle markdown code blocks)
    let jsonMatch = response.match(/\[[\s\S]*?\]/);
    
    // If wrapped in markdown code block, extract from there
    if (!jsonMatch) {
      const codeBlockMatch = response.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (codeBlockMatch) {
        jsonMatch = [codeBlockMatch[1]];
      }
    }
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('Extracted DPR Prices:', parsed); // Debug log
      return parsed;
    }
    
    console.log('No prices found in DPR');
    return [];
  } catch (error) {
    console.error('Error extracting material prices from DPR:', error);
    return [];
  }
}

export async function extractMaterialsFromDPR(dprText: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
Analyze this DPR document and extract a list of construction/project materials mentioned.
Focus on:
- Construction materials (cement, steel, sand, gravel, etc.)
- Equipment and machinery
- Raw materials specific to the project
- Any materials with quantities or specifications

Return ONLY a JSON array of material names, nothing else.
Example: ["Cement", "Steel TMT Bars", "Sand", "Gravel", "Bricks"]

DPR Content:
${dprText.substring(0, 15000)}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON array from response
    const jsonMatch = response.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Error extracting materials:', error);
    return [];
  }
}

export async function fetchMaterialPrices(materials: string[] | { material: string; unit?: string }[]): Promise<MaterialPrice[]> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
  });

  const prices: MaterialPrice[] = [];

  for (const item of materials) {
    try {
      // Handle both string array and object array
      const materialName = typeof item === 'string' ? item : item.material;
      const dprUnit = typeof item === 'string' ? undefined : item.unit;
      
      const prompt = `
Search the web for current market prices of "${materialName}" in India${dprUnit ? ` measured in "${dprUnit}"` : ''}.
Provide the latest price information in JSON format:

{
  "material": "${materialName}",
  "currentPrice": "price value",
  "unit": "${dprUnit || 'unit of measurement (per ton, per kg, per cubic meter, etc.)'}",
  "source": "source of information",
  "priceRange": "min-max range if available",
  "trend": "up/down/stable based on recent market trends"
}

CRITICAL REQUIREMENTS:
${dprUnit ? `
- The DPR specifies this material in "${dprUnit}" - SEARCH FOR PRICES IN THIS EXACT UNIT
- If you find prices in different units, CONVERT them to "${dprUnit}" for accurate comparison
- Example: If DPR uses "per bag" but market uses "per ton", convert to "per bag"
` : `
- Use standard construction industry units
`}
- Current wholesale/market rates in India
- Recent price trends (last 3-6 months)
- Reliable sources (government rates, industry reports, market surveys)

Return ONLY valid JSON, nothing else.
`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const priceData = JSON.parse(jsonMatch[0]);
        prices.push({
          ...priceData,
          lastUpdated: new Date().toISOString(),
        });
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error fetching price for ${material}:`, error);
      // Add placeholder data if fetch fails
      prices.push({
        material,
        currentPrice: 'N/A',
        unit: 'N/A',
        source: 'Price unavailable',
        lastUpdated: new Date().toISOString(),
        trend: 'stable',
      });
    }
  }

  return prices;
}

function comparePrices(dprPrice: string, marketPrice: string): {
  variance: number;
  status: 'fair' | 'overpriced' | 'underpriced' | 'suspicious';
  analysis: string;
} {
  // Extract numeric values
  const dprValue = parseFloat(dprPrice.replace(/[^0-9.]/g, ''));
  const marketValue = parseFloat(marketPrice.replace(/[^0-9.]/g, ''));

  if (isNaN(dprValue) || isNaN(marketValue) || marketValue === 0) {
    return {
      variance: 0,
      status: 'fair',
      analysis: 'Unable to compare prices due to invalid data',
    };
  }

  // Calculate percentage variance
  const variance = ((dprValue - marketValue) / marketValue) * 100;

  let status: 'fair' | 'overpriced' | 'underpriced' | 'suspicious';
  let analysis: string;

  if (variance > 30) {
    status = 'suspicious';
    analysis = `⚠️ ALERT: DPR price is ${variance.toFixed(1)}% higher than market rate. This is highly suspicious and requires immediate investigation.`;
  } else if (variance > 15) {
    status = 'overpriced';
    analysis = `🔴 Overpriced: DPR price is ${variance.toFixed(1)}% above market rate. Supplier may be inflating costs.`;
  } else if (variance < -15) {
    status = 'underpriced';
    analysis = `🟡 Underpriced: DPR price is ${Math.abs(variance).toFixed(1)}% below market rate. Quality concerns or unrealistic pricing.`;
  } else {
    status = 'fair';
    analysis = `✅ Fair pricing: DPR price is within ${Math.abs(variance).toFixed(1)}% of market rate. Acceptable range.`;
  }

  return { variance, status, analysis };
}

export async function getMaterialPricesFromDPR(dprFile: File): Promise<MaterialPrice[]> {
  try {
    // Read file content
    const text = await dprFile.text();
    
    // Extract materials with prices from DPR (pass file for image extraction)
    const dprMaterials = await extractMaterialsWithPricesFromDPR(text, dprFile);
    
    if (dprMaterials.length === 0) {
      // Fallback: extract just material names if no prices found
      const materials = await extractMaterialsFromDPR(text);
      if (materials.length === 0) {
        return [];
      }
      const prices = await fetchMaterialPrices(materials);
      return prices;
    }
    
    // Fetch current market prices for materials found in DPR (with units)
    const materialsWithUnits = dprMaterials.map(m => ({
      material: m.material,
      unit: m.unit
    }));
    const marketPrices = await fetchMaterialPrices(materialsWithUnits);
    
    // Merge DPR prices with market prices and perform comparison
    const comparedPrices: MaterialPrice[] = marketPrices.map(marketPrice => {
      const dprMaterial = dprMaterials.find(
        dm => dm.material.toLowerCase() === marketPrice.material.toLowerCase()
      );
      
      if (dprMaterial) {
        const comparison = comparePrices(dprMaterial.price, marketPrice.currentPrice);
        return {
          ...marketPrice,
          dprPrice: `₹${dprMaterial.price}`,
          dprUnit: dprMaterial.unit,
          variance: comparison.variance,
          status: comparison.status,
          analysis: comparison.analysis,
        };
      }
      
      return marketPrice;
    });
    
    return comparedPrices;
  } catch (error) {
    console.error('Error processing DPR for material prices:', error);
    return [];
  }
}
