import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { TabbedAnalysis } from './components/TabbedAnalysis';
import { GovHeader } from './components/GovHeader';
import { getMDoNERGuidelines } from './services/llamaCloud';
import { analyzeDPRWithGemini } from './services/gemini';
import { getMaterialPricesFromDPR } from './services/materialPrices';
import { performComprehensiveAudit } from './services/comprehensiveAuditor';
import { useLanguage } from './contexts/LanguageContext';
import { AnalysisState } from './types';
import { Loader2, FileCheck, CheckCircle, XCircle } from 'lucide-react';
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
  const { t, language } = useLanguage();

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
      const analysis = await analyzeDPRWithGemini(selectedFile, guidelinesText, language);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Government Header */}
      <GovHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* File Upload Section */}
        {!analysisState.isComplete && (
          <Card className="max-w-3xl mx-auto shadow-xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <FileCheck className="w-6 h-6" />
                {t('uploadTitle')}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {t('uploadDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />
              
              {selectedFile && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-800 mb-2">
                      ✅ {t('fileSelected')}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Name:</strong> {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Size:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={analysisState.isAnalyzing}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 text-lg shadow-lg"
                  >
                    {analysisState.isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t('analyzing')}
                      </>
                    ) : (
                      <>
                        <FileCheck className="mr-2 h-5 w-5" />
                        {t('analyzeButton')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Progress Indicator */}
        {analysisState.isAnalyzing && (
          <Card className="max-w-3xl mx-auto mt-6 shadow-xl border-2 border-blue-300">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                <p className="text-lg font-semibold text-gray-800 mb-2">{progress}</p>
                <Progress value={undefined} className="w-full max-w-md h-2" />
                <p className="text-sm text-gray-600 mt-4">
                  This may take 1-2 minutes depending on document size...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {analysisState.error && (
          <Alert variant="destructive" className="max-w-3xl mx-auto mt-6 border-2">
            <XCircle className="h-5 w-5" />
            <AlertDescription className="text-base">
              <strong>Analysis Failed:</strong> {analysisState.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Analysis Results */}
        {analysisState.isComplete && analysisState.analysis && (
          <div className="mt-6">
            <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 shadow-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200 font-semibold text-base">
                ✅ Analysis Complete! Your DPR evaluation is ready.
              </AlertDescription>
            </Alert>
            
            <TabbedAnalysis 
              analysis={analysisState.analysis} 
              materialPrices={analysisState.materialPrices || []}
              isFetchingPrices={analysisState.isFetchingPrices || false}
              comprehensiveAudit={analysisState.comprehensiveAudit || null}
              isPerformingAudit={analysisState.isPerformingAudit || false}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground text-sm">
          <p>Built with ❤️ for the development of North Eastern Region</p>
          <p className="mt-2">
            Ministry of Development of North Eastern Region (MDoNER)
          </p>
          <p className="mt-1 text-xs">
            Government of India | भारत सरकार
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
