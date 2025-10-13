import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { getMDoNERGuidelines } from './services/llamaCloud';
import { analyzeDPRWithGemini } from './services/gemini';
import { getMaterialPricesFromDPR } from './services/materialPrices';
import { performComprehensiveAudit } from './services/comprehensiveAuditor';
import { AnalysisState } from './types';
import { Loader2, FileCheck, CheckCircle, XCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    isComplete: false,
    analysis: null,
    error: null,
    materialPrices: [],
    isFetchingPrices: false,
    comprehensiveAudit: null,
    isPerformingAudit: false,
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

    try {
      // Check file size (warn if > 10MB)
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (fileSizeMB > 10) {
        const proceed = window.confirm(
          `Warning: Your file is ${fileSizeMB.toFixed(1)}MB. Large files may take longer to analyze or timeout.\n\nRecommendation: Files under 10MB work best.\n\nDo you want to proceed anyway?`
        );
        if (!proceed) return;
      }

      setAnalysisState({
        isAnalyzing: true,
        isComplete: false,
        analysis: null,
        error: null,
      });

      // Step 1: Retrieve guidelines
      setProgress('📚 Retrieving MDoNER guidelines from knowledge base...');
      let guidelinesText: string;
      try {
        guidelinesText = await getMDoNERGuidelines(
          'PM-DevINE scheme guidelines for DPR evaluation'
        );
      } catch (error) {
        console.warn('Could not retrieve guidelines, using fallback');
        guidelinesText = 'General MDoNER project evaluation criteria';
      }

      // Step 2: Analyze DPR
      setProgress('🔍 Analyzing DPR document (this may take a minute)...');
      const analysis = await analyzeDPRWithGemini(selectedFile, guidelinesText);

      setAnalysisState({
        isAnalyzing: false,
        isComplete: true,
        analysis,
        error: null,
        materialPrices: [],
        isFetchingPrices: false,
      });
      setProgress('');

      // Fetch material prices in background (non-blocking)
      if (selectedFile) {
        setAnalysisState(prev => ({ ...prev, isFetchingPrices: true }));
        
        const fileText = await selectedFile.text();
        
        // Material prices
        getMaterialPricesFromDPR(selectedFile)
          .then(prices => {
            setAnalysisState(prev => ({
              ...prev,
              materialPrices: prices,
              isFetchingPrices: false,
            }));
          })
          .catch(err => {
            console.error('Error fetching material prices:', err);
            setAnalysisState(prev => ({ ...prev, isFetchingPrices: false }));
          });

        // Comprehensive audit (parallel)
        setAnalysisState(prev => ({ ...prev, isPerformingAudit: true }));
        performComprehensiveAudit(fileText, analysis)
          .then(auditReport => {
            setAnalysisState(prev => ({
              ...prev,
              comprehensiveAudit: auditReport,
              isPerformingAudit: false,
            }));
          })
          .catch(err => {
            console.error('Error performing comprehensive audit:', err);
            setAnalysisState(prev => ({ ...prev, isPerformingAudit: false }));
          });
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileCheck className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              DPR Evaluation Platform
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Ministry of Development of North Eastern Region (MDoNER)
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Comprehensive evaluation of Detailed Project Reports for compliance with MDoNER guidelines
          </p>
        </div>

        {/* Configuration Status */}
        <div className="max-w-6xl mx-auto mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  {apiStatus.llamaKey ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <Badge variant={apiStatus.llamaKey ? "default" : "destructive"}>
                    Knowledge Base
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {apiStatus.geminiKey ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <Badge variant={apiStatus.geminiKey ? "default" : "destructive"}>
                    Analysis Engine
                  </Badge>
                </div>
              </div>
              {(!apiStatus.llamaKey || !apiStatus.geminiKey) && (
                <Alert className="mt-3">
                  <AlertDescription>
                    Please configure your API keys in the .env file for full functionality.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* File Upload Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📤 Upload DPR Document
              </CardTitle>
              <CardDescription>
                Upload your Detailed Project Report for comprehensive evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                disabled={analysisState.isAnalyzing}
              />

              {selectedFile && !analysisState.isAnalyzing && !analysisState.isComplete && (
                <Button
                  onClick={handleAnalyze}
                  disabled={!apiStatus.llamaKey || !apiStatus.geminiKey}
                  className="mt-6 w-full"
                  size="lg"
                >
                  🔍 Analyze DPR
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          {analysisState.isAnalyzing && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <p className="text-muted-foreground">{progress}</p>
                </div>
                <Progress value={66} className="w-full" />
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {analysisState.error && (
            <Alert variant="destructive" className="mb-6">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Analysis Failed</h4>
                  <p>{analysisState.error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnalysisState({ ...analysisState, error: null })}
                  className="ml-4"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Analysis Results */}
          {analysisState.isComplete && analysisState.analysis && (
            <div>
              <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200 font-semibold">
                  ✅ Analysis Complete! Your DPR evaluation is ready.
                </AlertDescription>
              </Alert>
              <AnalysisResults 
                analysis={analysisState.analysis} 
                materialPrices={analysisState.materialPrices || []}
                isFetchingPrices={analysisState.isFetchingPrices || false}
                comprehensiveAudit={analysisState.comprehensiveAudit || null}
                isPerformingAudit={analysisState.isPerformingAudit || false}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground text-sm">
          <p>Built with ❤️ for the development of North Eastern Region</p>
          <p className="mt-2">
            Ministry of Development of North Eastern Region (MDoNER)
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
