import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { getMDoNERGuidelines } from './services/llamaCloud';
import { analyzeDPRWithGemini } from './services/gemini';
import { AnalysisState } from './types';
import { Loader2, Mountain, CheckCircle, XCircle } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    isComplete: false,
    analysis: null,
    error: null,
  });
  const [progress, setProgress] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisState({
      isAnalyzing: false,
      isComplete: false,
      analysis: null,
      error: null,
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalysisState({
      isAnalyzing: true,
      isComplete: false,
      analysis: null,
      error: null,
    });

    try {
      // Step 1: Retrieve guidelines
      setProgress('📚 Retrieving MDoNER guidelines from LlamaCloud...');
      const guidelinesQuery = `
        MDoNER PM-DevINE guidelines for DPR evaluation including:
        - Budget requirements and cost estimation guidelines
        - Project timeline and scheduling requirements
        - Technical feasibility criteria
        - Environmental impact assessment requirements
        - Resource allocation guidelines
        - Mandatory documentation and sections
        - Compliance requirements
      `;

      let guidelinesText: string;
      try {
        guidelinesText = await getMDoNERGuidelines(guidelinesQuery);
      } catch (error) {
        console.warn('Could not retrieve guidelines, using fallback');
        guidelinesText = 'General MDoNER project evaluation criteria';
      }

      // Step 2: Analyze DPR
      setProgress('🤖 Analyzing DPR with Gemini 2.5 Flash (this may take a minute)...');
      const analysis = await analyzeDPRWithGemini(selectedFile, guidelinesText);

      setAnalysisState({
        isAnalyzing: false,
        isComplete: true,
        analysis,
        error: null,
      });
      setProgress('');
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisState({
        isAnalyzing: false,
        isComplete: false,
        analysis: null,
        error: error instanceof Error ? error.message : 'An error occurred during analysis',
      });
      setProgress('');
    }
  };

  const checkApiKeys = () => {
    const llamaKey = import.meta.env.VITE_LLAMA_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return { llamaKey: !!llamaKey, geminiKey: !!geminiKey };
  };

  const apiStatus = checkApiKeys();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">
              DPR Evaluation Platform
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Ministry of Development of North Eastern Region (MDoNER)
          </p>
          <p className="text-sm text-gray-400 mt-2">
            AI-powered evaluation of Detailed Project Reports for compliance with MDoNER guidelines
          </p>
        </div>

        {/* API Status Sidebar */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">⚙️ Configuration Status</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                {apiStatus.llamaKey ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-gray-300">LlamaCloud API</span>
              </div>
              <div className="flex items-center gap-2">
                {apiStatus.geminiKey ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-gray-300">Gemini API</span>
              </div>
            </div>
            {(!apiStatus.llamaKey || !apiStatus.geminiKey) && (
              <p className="text-xs text-orange-400 mt-2">
                ⚠️ Please configure your API keys in the .env file
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* File Upload Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">📤 Upload DPR Document</h2>
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              disabled={analysisState.isAnalyzing}
            />

            {selectedFile && !analysisState.isAnalyzing && !analysisState.isComplete && (
              <button
                onClick={handleAnalyze}
                disabled={!apiStatus.llamaKey || !apiStatus.geminiKey}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                🔍 Analyze DPR
              </button>
            )}
          </div>

          {/* Progress Indicator */}
          {analysisState.isAnalyzing && (
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                <p className="text-gray-300">{progress}</p>
              </div>
              <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse w-2/3"></div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {analysisState.error && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    Analysis Failed
                  </h3>
                  <p className="text-gray-300">{analysisState.error}</p>
                  <button
                    onClick={() => setAnalysisState({ ...analysisState, error: null })}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysisState.isComplete && analysisState.analysis && (
            <div>
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <p className="text-green-300 font-semibold">
                  ✅ Analysis Complete!
                </p>
              </div>
              <AnalysisResults analysis={analysisState.analysis} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with ❤️ for the development of North Eastern Region</p>
          <p className="mt-2">
            Powered by LlamaCloud & Gemini 2.5 Flash
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
