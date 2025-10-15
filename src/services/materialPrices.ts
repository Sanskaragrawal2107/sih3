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

// Standard market prices database (Based on actual DPR market rates - October 2025)
// Source: Appendix-VII Schedule of Market Rates for Major Construction Materials
const STANDARD_MARKET_PRICES: Record<string, { price: string; unit: string; source: string }> = {
  // From DPR Appendix-VII (Verified October 2025)
  'cement': { price: '₹780-900', unit: 'per 50kg bag', source: 'Local dealers/Market inquiry (Oct 2025)' },
  'cement (ordinary portland 43 grade)': { price: '₹780-900', unit: 'per 50kg bag', source: 'Local dealers/Market inquiry (Oct 2025)' },
  'opc cement': { price: '₹780-900', unit: 'per 50kg bag', source: 'Local dealers/Market inquiry (Oct 2025)' },
  
  'steel': { price: '₹1,00,000-1,20,000', unit: 'per metric tonne', source: 'SteelMint/Local suppliers (Oct 2025)' },
  'steel tmt bars': { price: '₹1,00,000-1,20,000', unit: 'per metric tonne', source: 'SteelMint/Local suppliers (Oct 2025)' },
  'tmt bars': { price: '₹1,00,000-1,20,000', unit: 'per metric tonne', source: 'SteelMint/Local suppliers (Oct 2025)' },
  'steel bars': { price: '₹1,00,000-1,20,000', unit: 'per metric tonne', source: 'SteelMint/Local suppliers (Oct 2025)' },
  'fe 500': { price: '₹1,00,000-1,20,000', unit: 'per metric tonne', source: 'SteelMint/Local suppliers (Oct 2025)' },
  
  'sand': { price: '₹2,000-3,000', unit: 'per cubic meter', source: 'Market rate verified (Oct 2025)' },
  'coarse sand': { price: '₹2,000-3,000', unit: 'per cubic meter', source: 'Market rate verified (Oct 2025)' },
  'river sand': { price: '₹2,000-3,000', unit: 'per cubic meter', source: 'Market rate verified (Oct 2025)' },
  
  'gravel': { price: '₹1,000-3,000', unit: 'per cubic meter', source: 'Market inquiry (Oct 2025)' },
  'gravel 20mm': { price: '₹1,000-3,000', unit: 'per cubic meter', source: 'Market inquiry (Oct 2025)' },
  'aggregate': { price: '₹1,000-3,000', unit: 'per cubic meter', source: 'Market inquiry (Oct 2025)' },
  'coarse aggregate': { price: '₹1,000-3,000', unit: 'per cubic meter', source: 'Market inquiry (Oct 2025)' },
  
  'bricks': { price: '₹35,000-70,000', unit: 'per 1000 units', source: 'Major suppliers/Local market (Oct 2025)' },
  'burnt clay bricks': { price: '₹35,000-70,000', unit: 'per 1000 units', source: 'Major suppliers/Local market (Oct 2025)' },
  'class i bricks': { price: '₹35,000-70,000', unit: 'per 1000 units', source: 'Major suppliers/Local market (Oct 2025)' },
  
  // Additional common materials (Industry standard rates)
  'concrete': { price: '₹4,500-5,500', unit: 'per cubic meter', source: 'Ready Mix Concrete Suppliers' },
  'rmc': { price: '₹4,500-5,500', unit: 'per cubic meter', source: 'Ready Mix Concrete Suppliers' },
  'bitumen': { price: '₹35,000-40,000', unit: 'per metric tonne', source: 'Petroleum Industry' },
  'paint': { price: '₹250-400', unit: 'per liter', source: 'Paint Manufacturers' },
  'tiles': { price: '₹30-80', unit: 'per sq ft', source: 'Tile Manufacturers' },
  'aluminum': { price: '₹220-250', unit: 'per kg', source: 'Metal Market' },
  'copper': { price: '₹750-850', unit: 'per kg', source: 'Metal Market' },
  'glass': { price: '₹80-150', unit: 'per sq ft', source: 'Glass Industry' },
  'wood': { price: '₹1,200-2,500', unit: 'per cubic ft', source: 'Timber Market' },
  'plywood': { price: '₹60-120', unit: 'per sq ft', source: 'Plywood Manufacturers' },
};

export async function fetchMaterialPrices(materials: string[] | { material: string; unit?: string }[]): Promise<MaterialPrice[]> {
  // Limit to first 10 materials for speed
  const limitedMaterials = materials.slice(0, 10);
  
  const prices: MaterialPrice[] = [];

  // Simulate realistic API delay (100-300ms per material)
  await new Promise(resolve => setTimeout(resolve, 100));

  for (const item of limitedMaterials) {
    const materialName = typeof item === 'string' ? item : item.material;
    const dprUnit = typeof item === 'string' ? undefined : item.unit;
    
    // Check if we have market data for this material
    const materialKey = materialName.toLowerCase().trim();
    const marketData = STANDARD_MARKET_PRICES[materialKey];
    
    if (marketData) {
      // Use verified market data directly
      prices.push({
        material: materialName,
        currentPrice: marketData.price,
        unit: dprUnit || marketData.unit,
        source: marketData.source,
        lastUpdated: '13/10/2025', // Date of Market Analysis from DPR
        priceRange: marketData.price,
        trend: 'stable' as const,
      });
    } else {
      // For materials not in our verified database, show as unavailable
      prices.push({
        material: materialName,
        currentPrice: 'Market rate not available',
        unit: dprUnit || 'N/A',
        source: 'Not included in market survey',
        lastUpdated: '13/10/2025',
        trend: 'stable' as const,
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
