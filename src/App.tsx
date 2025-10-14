import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { TabbedAnalysis } from "./components/TabbedAnalysis";
import FileTrackingSystem from "./components/FileTrackingSystem";
import HomePage from "./components/HomePage";
import { SustainabilityTab } from "./components/tabs/SustainabilityTab";
import { getMDoNERGuidelines } from "./services/llamaCloud";
import { analyzeDPRWithGemini } from "./services/gemini";
import { getMaterialPricesFromDPR } from "./services/materialPrices";
import { performComprehensiveAudit } from "./services/comprehensiveAuditor";
import { useLanguage } from "./contexts/LanguageContext";
import { ChatProvider, useChatContext } from "./contexts/ChatContext";
import ChatBubble from "./components/Chat-Bubble";
import { AnalysisState } from "./types";
import {
  Loader2,
  FileCheck,
  CheckCircle,
  XCircle,
  Home,
  FileText,
  BarChart3,
  Settings,
  User,
  Languages,
  Globe,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AppContent() {
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
  const { t, language, setLanguage } = useLanguage();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<string>("dashboard");
  const { setAnalysisData, setFileName } = useChatContext();

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
          `Warning: Your file is ${fileSizeMB.toFixed(
            1
          )}MB. Large files may take longer to analyze or timeout.\n\nRecommendation: Files under 10MB work best.\n\nDo you want to proceed anyway?`
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
      setProgress("📚 Retrieving MDoNER guidelines from knowledge base...");
      let guidelinesText: string;
      try {
        guidelinesText = await getMDoNERGuidelines(
          "PM-DevINE scheme guidelines for DPR evaluation"
        );
      } catch (error) {
        console.warn("Could not retrieve guidelines, using fallback");
        guidelinesText = "General MDoNER project evaluation criteria";
      }

      // Step 2: Analyze DPR
      setProgress("🔍 Analyzing DPR document (this may take a minute)...");
      const analysis = await analyzeDPRWithGemini(
        selectedFile,
        guidelinesText,
        language
      );

      setAnalysisState({
        isAnalyzing: false,
        isComplete: true,
        analysis,
        error: null,
        materialPrices: [],
        isFetchingPrices: false,
      });
      setProgress("");

      // Update chat context with analysis data
      setAnalysisData(analysis);
      setFileName(selectedFile.name);

      // Fetch material prices in background (non-blocking)
      if (selectedFile) {
        setAnalysisState((prev) => ({ ...prev, isFetchingPrices: true }));

        const fileText = await selectedFile.text();

        // Material prices
        getMaterialPricesFromDPR(selectedFile)
          .then((prices) => {
            setAnalysisState((prev) => ({
              ...prev,
              materialPrices: prices,
              isFetchingPrices: false,
            }));
          })
          .catch((err) => {
            console.error("Error fetching material prices:", err);
            setAnalysisState((prev) => ({ ...prev, isFetchingPrices: false }));
          });

        // Comprehensive audit (parallel)
        setAnalysisState((prev) => ({ ...prev, isPerformingAudit: true }));
        performComprehensiveAudit(fileText, analysis)
          .then((auditReport) => {
            setAnalysisState((prev) => ({
              ...prev,
              comprehensiveAudit: auditReport,
              isPerformingAudit: false,
            }));
          })
          .catch((err) => {
            console.error("Error performing comprehensive audit:", err);
            setAnalysisState((prev) => ({ ...prev, isPerformingAudit: false }));
          });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisState({
        isAnalyzing: false,
        isComplete: false,
        analysis: null,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during analysis",
      });
      setProgress("");
    }
  };

  // If on home page, show full-screen homepage
  if (activeView === "home") {
    return (
      <>
        <HomePage onNavigateToDashboard={() => setActiveView("dashboard")} />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Top Header Bar */}
      <div className="flex-none">
        <div className="bg-gradient-to-r from-orange-600 via-white to-green-600 h-2"></div>
        <div className="bg-blue-900 text-white shadow-lg">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Government Logo & Title */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                    alt="Government of India"
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-wide">
                    {t("appTitle")}
                  </h1>
                  <p className="text-xs text-blue-200">{t("appSubtitle")}</p>
                </div>
              </div>

              {/* Right: User Avatar & Language Toggle */}
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                    >
                      <Languages className="w-4 h-4 mr-2" />
                      {language === "en" ? "English" : "অসমীয়া"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage("en")}>
                      <Globe className="w-4 h-4 mr-2" />
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("as")}>
                      <Globe className="w-4 h-4 mr-2" />
                      অসমীয়া
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Avatar className="w-10 h-10 border-2 border-white/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                  <AvatarFallback className="bg-blue-600 text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout with Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          {!isSidebarCollapsed && (
            <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex-shrink-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-700">Navigation</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="h-8 w-8 p-0"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="space-y-2">
                  <Button
                    variant={activeView === "home" ? "default" : "ghost"}
                    className="w-full justify-start text-left hover:bg-blue-50"
                    onClick={() => setActiveView("home")}
                  >
                    <Home className="w-4 h-4 mr-3" />
                    Home
                  </Button>
                  <Button
                    variant={activeView === "dashboard" ? "default" : "ghost"}
                    className="w-full justify-start text-left hover:bg-blue-50"
                    onClick={() => setActiveView("dashboard")}
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    Dashboard
                  </Button>
                  <Button
                    variant={
                      activeView === "dpr-analysis" ? "default" : "ghost"
                    }
                    className="w-full justify-start text-left hover:bg-blue-50"
                    onClick={() => setActiveView("dpr-analysis")}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    DPR Analysis
                  </Button>
                  <Button
                    variant={
                      activeView === "file-tracking" ? "default" : "ghost"
                    }
                    className="w-full justify-start text-left hover:bg-blue-50"
                    onClick={() => setActiveView("file-tracking")}
                  >
                    <Search className="w-4 h-4 mr-3" />
                    File Tracking
                  </Button>
                  <Button
                    variant={activeView === "reports" ? "default" : "ghost"}
                    className="w-full justify-start text-left hover:bg-blue-50"
                    onClick={() => setActiveView("reports")}
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    Reports
                  </Button>
                  <Button
                    variant={activeView === "sustainability" ? "default" : "ghost"}
                    className="w-full justify-start text-left hover:bg-green-50"
                    onClick={() => setActiveView("sustainability")}
                  >
                    <Leaf className="w-4 h-4 mr-3 text-green-600" />
                    Sustainability
                  </Button>
                  <Button
                    variant={activeView === "settings" ? "default" : "ghost"}
                    className="w-full justify-start text-left hover:bg-blue-50"
                    onClick={() => setActiveView("settings")}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Button>
                </nav>
              </div>
            </div>
          )}

          {/* Collapsed Sidebar - Expand Button */}
          {isSidebarCollapsed && (
            <div className="w-12 bg-white border-r border-gray-200 shadow-sm flex-shrink-0 flex flex-col items-center py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarCollapsed(false)}
                className="h-10 w-10 p-0 mb-4"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <div className="p-6 space-y-6">
              {/* Conditional Content Based on Active View */}
              {activeView === "file-tracking" && <FileTrackingSystem />}

              {activeView === "dashboard" && (
                <div className="space-y-6">
                  <Card className="shadow-xl border-2 border-blue-200">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-6 h-6" />
                        Project Dashboard
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        Real-time overview of all DPR submissions and approvals
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-2 border-blue-100 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">24</div>
                        <p className="text-xs text-gray-500 mt-1">+3 this month</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-green-100 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">12</div>
                        <p className="text-xs text-gray-500 mt-1">50% success rate</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-yellow-100 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Under Review</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">8</div>
                        <p className="text-xs text-gray-500 mt-1">33% in progress</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-purple-100 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">AI Interventions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-600">15</div>
                        <p className="text-xs text-gray-500 mt-1">Delays prevented</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveView("dpr-analysis")}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          Analyze New DPR
                        </CardTitle>
                        <CardDescription>
                          Upload and analyze a new project report
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveView("file-tracking")}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Search className="w-5 h-5 text-green-600" />
                          Track Files
                        </CardTitle>
                        <CardDescription>
                          Monitor approval progress and status
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveView("reports")}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-purple-600" />
                          View Reports
                        </CardTitle>
                        <CardDescription>
                          Access analytics and insights
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              )}

              {activeView === "reports" && (
                <Card className="shadow-xl border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <BarChart3 className="w-6 h-6" />
                      Reports
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Analysis Reports and Statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <p className="text-gray-600">
                        Reports section coming soon...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeView === "sustainability" && (
                <SustainabilityTab />
              )}

              {activeView === "settings" && (
                <Card className="shadow-xl border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Settings className="w-6 h-6" />
                      Settings
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      System Configuration and Preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <p className="text-gray-600">
                        Settings section coming soon...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeView === "dpr-analysis" && (
                  <>
                    {/* File Upload Section */}
                    {!analysisState.isComplete && (
                      <Card className="shadow-xl border-2 border-blue-200">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                          <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <FileCheck className="w-6 h-6" />
                            {t("uploadTitle")}
                          </CardTitle>
                          <CardDescription className="text-blue-100">
                            {t("uploadDescription")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <FileUpload
                            onFileSelect={handleFileSelect}
                            selectedFile={selectedFile}
                          />

                          {selectedFile && (
                            <div className="mt-6 space-y-4">
                              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                                <p className="text-sm font-semibold text-green-800 mb-2">
                                  ✅ {t("fileSelected")}
                                </p>
                                <p className="text-sm text-gray-700">
                                  <strong>Name:</strong> {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-700">
                                  <strong>Size:</strong>{" "}
                                  {(selectedFile.size / (1024 * 1024)).toFixed(
                                    2
                                  )}{" "}
                                  MB
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
                                    {t("analyzing")}
                                  </>
                                ) : (
                                  <>
                                    <FileCheck className="mr-2 h-5 w-5" />
                                    {t("analyzeButton")}
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
                      <Card className="shadow-xl border-2 border-blue-300">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                            <p className="text-lg font-semibold text-gray-800 mb-2">
                              {progress}
                            </p>
                            <Progress
                              value={undefined}
                              className="w-full max-w-md h-2"
                            />
                            <p className="text-sm text-gray-600 mt-4">
                              This may take 1-2 minutes depending on document
                              size...
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Error Display */}
                    {analysisState.error && (
                      <Alert variant="destructive" className="border-2">
                        <XCircle className="h-5 w-5" />
                        <AlertDescription className="text-base">
                          <strong>Analysis Failed:</strong>{" "}
                          {analysisState.error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Analysis Results */}
                    {analysisState.isComplete && analysisState.analysis && (
                      <div className="space-y-6">
                        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 shadow-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <AlertDescription className="text-green-800 dark:text-green-200 font-semibold text-base">
                            ✅ Analysis Complete! Your DPR evaluation is ready.
                          </AlertDescription>
                        </Alert>

                        <TabbedAnalysis
                          analysis={analysisState.analysis}
                          materialPrices={analysisState.materialPrices || []}
                          isFetchingPrices={
                            analysisState.isFetchingPrices || false
                          }
                          comprehensiveAudit={
                            analysisState.comprehensiveAudit || null
                          }
                          isPerformingAudit={
                            analysisState.isPerformingAudit || false
                          }
                        />
                      </div>
                    )}

                    {/* Footer */}
                    <div className="text-center mt-12 text-muted-foreground text-sm border-t pt-8">
                      <p>
                        Built with ❤️ for the development of North Eastern
                        Region
                      </p>
                      <p className="mt-2">
                        Ministry of Development of North Eastern Region (MDoNER)
                      </p>
                      <p className="mt-1 text-xs">
                        Government of India | भारत सरकार
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBubble />
    </div>
  );
}

function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}

export default App;
