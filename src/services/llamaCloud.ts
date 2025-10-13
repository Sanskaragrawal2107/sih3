export async function getMDoNERGuidelines(query: string): Promise<string> {
  try {
    // Dynamic import to avoid bundling issues
    const { LlamaCloudIndex } = await import('llamaindex');
    
    const index = new LlamaCloudIndex({
      name: import.meta.env.VITE_LLAMA_INDEX_NAME || 'sih',
      projectName: import.meta.env.VITE_LLAMA_PROJECT_NAME || 'Default',
      organizationId: import.meta.env.VITE_LLAMA_ORG_ID,
      apiKey: import.meta.env.VITE_LLAMA_API_KEY,
    });

    const retriever = index.asRetriever({
      similarityTopK: 5,
    });

    const nodes = await retriever.retrieve(query);
    
    // Combine retrieved content
    const guidelinesText = nodes.map(node => {
      try {
        return (node.node as any).text || (node.node as any).content || '';
      } catch {
        return '';
      }
    }).filter(text => text.length > 0).join('\n\n');
    
    return guidelinesText;
  } catch (error) {
    console.error('Error retrieving guidelines:', error);
    // Return fallback guidelines instead of throwing
    return `
    MDoNER PM-DevINE Guidelines (Fallback):
    
    1. Budget Requirements:
    - Detailed cost estimation with market rates
    - Component-wise budget breakdown
    - O&M provisions for 5 years
    - Contingency provisions (5-10%)
    
    2. Timeline Requirements:
    - Realistic project timeline
    - Milestone-based implementation
    - Critical path analysis
    - Resource availability alignment
    
    3. Technical Standards:
    - BIS/IS standards compliance
    - Environmental clearances
    - Quality control measures
    - Safety protocols
    
    4. Documentation Requirements:
    - Detailed Project Report (DPR)
    - Environmental Impact Assessment
    - Social Impact Assessment
    - Stakeholder consultation records
    `;
  }
}
