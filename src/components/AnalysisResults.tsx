import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  TrendingUp,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Loader2,
} from "lucide-react";
import {
  DPRAnalysis,
  RedFlag,
  MaterialPrice,
  ComprehensiveAuditReport,
  VerificationIssue,
} from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

interface AnalysisResultsProps {
  analysis: DPRAnalysis;
  materialPrices: MaterialPrice[];
  isFetchingPrices: boolean;
  comprehensiveAudit: ComprehensiveAuditReport | null;
  isPerformingAudit: boolean;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "Critical":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "High":
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case "Medium":
      return <Info className="w-5 h-5 text-yellow-500" />;
    case "Low":
      return <Info className="w-5 h-5 text-blue-500" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  materialPrices,
  isFetchingPrices,
  comprehensiveAudit,
  isPerformingAudit,
}) => {
  const groupedFlags = {
    Critical: analysis.red_flags.filter((f) => f.severity === "Critical"),
    High: analysis.red_flags.filter((f) => f.severity === "High"),
    Medium: analysis.red_flags.filter((f) => f.severity === "Medium"),
    Low: analysis.red_flags.filter((f) => f.severity === "Low"),
  };

  // Prepare data for charts
  const severityData = [
    { name: "Critical", count: groupedFlags.Critical.length, fill: "#ef4444" },
    { name: "High", count: groupedFlags.High.length, fill: "#f97316" },
    { name: "Medium", count: groupedFlags.Medium.length, fill: "#eab308" },
    { name: "Low", count: groupedFlags.Low.length, fill: "#3b82f6" },
  ].filter((item) => item.count > 0);

  const categoryData = analysis.red_flags.reduce((acc: any[], flag) => {
    const existing = acc.find((item) => item.category === flag.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ category: flag.category, count: 1 });
    }
    return acc;
  }, []);

  const complianceData = [
    { subject: "Budget", score: analysis.compliance_score },
    { subject: "Timeline", score: Math.max(0, analysis.compliance_score - 10) },
    { subject: "Technical", score: Math.max(0, analysis.compliance_score - 5) },
    {
      subject: "Environmental",
      score: Math.max(0, analysis.compliance_score - 15),
    },
    {
      subject: "Documentation",
      score: Math.max(0, analysis.compliance_score - 8),
    },
  ];

  // Chart configs
  const complianceChartConfig = {
    score: {
      label: "Compliance Score",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const downloadReport = () => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "dpr_analysis_report.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        {/* Header with Download */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              DPR Evaluation Report
            </h1>
            <p className="text-sm text-gray-600">
              Ministry of Development of North Eastern Region (MDoNER)
            </p>
          </div>
          <Button
            onClick={downloadReport}
            variant="outline"
            className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compliance Score
              </CardDescription>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                {analysis.compliance_score}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    analysis.compliance_score >= 80
                      ? "bg-green-600"
                      : analysis.compliance_score >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${analysis.compliance_score}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compliance Level
              </CardDescription>
              <CardTitle className="text-lg font-semibold text-gray-900">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    analysis.overall_compliance === "High"
                      ? "bg-green-100 text-green-800"
                      : analysis.overall_compliance === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {analysis.overall_compliance}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">Overall Assessment</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Issues
              </CardDescription>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                {analysis.red_flags.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">Items Identified</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Critical Issues
              </CardDescription>
              <CardTitle className="text-2xl font-semibold text-red-600">
                {groupedFlags.Critical.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Immediate Attention Required
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Issues by Severity - Shadcn Pie Chart */}
          {severityData.length > 0 && (
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-gray-600" />
                  Issues Distribution
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Issues by severity level
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={
                    {
                      count: {
                        label: "Count",
                      },
                      Critical: {
                        label: "Critical",
                        color: "#ef4444",
                      },
                      High: {
                        label: "High",
                        color: "#f97316",
                      },
                      Medium: {
                        label: "Medium",
                        color: "#eab308",
                      },
                      Low: {
                        label: "Low",
                        color: "#3b82f6",
                      },
                    } satisfies ChartConfig
                  }
                  className="mx-auto aspect-square max-h-[280px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie data={severityData} dataKey="count" nameKey="name" />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Issues by Category - Shadcn Bar Chart */}
          {categoryData.length > 0 && (
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  Issues by Category
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Issues grouped by evaluation area
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={
                    {
                      count: {
                        label: "Count",
                        color: "#3b82f6",
                      },
                    } satisfies ChartConfig
                  }
                  className="max-h-[280px]"
                >
                  <BarChart
                    data={categoryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Compliance Assessment Radar Chart */}
        <Card className="border border-gray-200 bg-white shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              Compliance Assessment
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Comprehensive evaluation across different criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div>
                <ChartContainer
                  config={complianceChartConfig}
                  className="mx-auto aspect-square max-h-[300px]"
                >
                  <RadarChart data={complianceData}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <PolarGrid gridType="polygon" stroke="hsl(var(--border))" />
                    <Radar
                      dataKey="score"
                      fill="var(--color-score)"
                      fillOpacity={0.1}
                      stroke="var(--color-score)"
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        fillOpacity: 1,
                      }}
                    />
                  </RadarChart>
                </ChartContainer>
              </div>

              {/* Compliance Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  Detailed Scores
                </h4>
                {complianceData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.subject}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.score >= 80
                              ? "bg-green-500"
                              : item.score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {item.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card className="border border-gray-200 bg-white shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {analysis.summary}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Issues and Recommendations */}
        <Card className="border border-gray-200 bg-white shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Identified Issues & Recommendations
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Detailed breakdown of concerns and actionable recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {analysis.red_flags.length === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">
                  No issues identified. The DPR meets all compliance
                  requirements.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger value="all" className="text-sm font-medium">
                    All ({analysis.red_flags.length})
                  </TabsTrigger>
                  <TabsTrigger value="critical" className="text-sm font-medium">
                    Critical ({groupedFlags.Critical.length})
                  </TabsTrigger>
                  <TabsTrigger value="high" className="text-sm font-medium">
                    High ({groupedFlags.High.length})
                  </TabsTrigger>
                  <TabsTrigger value="medium" className="text-sm font-medium">
                    Medium ({groupedFlags.Medium.length})
                  </TabsTrigger>
                  <TabsTrigger value="low" className="text-sm font-medium">
                    Low ({groupedFlags.Low.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-4">
                  {analysis.red_flags.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} />
                  ))}
                </TabsContent>

                <TabsContent value="critical" className="space-y-3 mt-6">
                  {groupedFlags.Critical.length > 0 ? (
                    groupedFlags.Critical.map((flag, idx) => (
                      <RedFlagCard key={idx} flag={flag} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">
                        No critical issues found
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="high" className="space-y-3 mt-6">
                  {groupedFlags.High.length > 0 ? (
                    groupedFlags.High.map((flag, idx) => (
                      <RedFlagCard key={idx} flag={flag} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">
                        No high priority issues found
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="medium" className="space-y-3 mt-6">
                  {groupedFlags.Medium.length > 0 ? (
                    groupedFlags.Medium.map((flag, idx) => (
                      <RedFlagCard key={idx} flag={flag} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">
                        No medium priority issues found
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="low" className="space-y-3 mt-6">
                  {groupedFlags.Low.length > 0 ? (
                    groupedFlags.Low.map((flag, idx) => (
                      <RedFlagCard key={idx} flag={flag} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">
                        No low priority issues found
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Strengths & Missing Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Project Strengths
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Well-executed components of the DPR
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {analysis.strengths.map((strength, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Missing Components */}
          {analysis.missing_components.length > 0 && (
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Missing Components
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Required elements not found in the DPR
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {analysis.missing_components.map((component, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100"
                    >
                      <XCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-800">{component}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Material Price Analysis */}
        <Card className="border border-gray-200 bg-white shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Material Price Analysis
              {isFetchingPrices && (
                <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Fetching prices...
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {materialPrices.some((p) => p.dprPrice)
                ? "Comparing DPR quoted prices with current market rates"
                : "Current market rates for project materials"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFetchingPrices && materialPrices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-gray-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">
                  Fetching current market prices
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please wait while we gather the latest rates
                </p>
              </div>
            ) : materialPrices.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 font-medium">
                  No materials identified
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  No materials found in the DPR for price analysis
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Price Analysis Summary */}
                {materialPrices.some((p) => p.status) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {materialPrices.filter((p) => p.status === "suspicious")
                      .length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            {
                              materialPrices.filter(
                                (p) => p.status === "suspicious"
                              ).length
                            }{" "}
                            Suspicious Items
                          </span>
                        </div>
                        <p className="text-xs text-red-700 mt-1">
                          Prices 30%+ above market rate
                        </p>
                      </div>
                    )}
                    {materialPrices.filter((p) => p.status === "overpriced")
                      .length > 0 && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">
                            {
                              materialPrices.filter(
                                (p) => p.status === "overpriced"
                              ).length
                            }{" "}
                            Overpriced Items
                          </span>
                        </div>
                        <p className="text-xs text-orange-700 mt-1">
                          15-30% above market rates
                        </p>
                      </div>
                    )}
                    {materialPrices.filter((p) => p.status === "fair").length >
                      0 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            {
                              materialPrices.filter((p) => p.status === "fair")
                                .length
                            }{" "}
                            Fair Prices
                          </span>
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          Within acceptable range
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Material Price Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materialPrices.map((price, idx) => (
                    <MaterialPriceCard key={idx} price={price} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comprehensive Verification Report */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              Comprehensive Verification Report
              {isPerformingAudit && (
                <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Processing...
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Fact-checking, economic validation, and compliance verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPerformingAudit && !comprehensiveAudit ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-lg font-semibold">
                  Performing Comprehensive Audit...
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Cross-checking facts, validating economics, detecting fraud
                </p>
              </div>
            ) : comprehensiveAudit ? (
              <div className="space-y-6">
                {/* Risk Score Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Card
                    className={`col-span-1 md:col-span-2 ${
                      comprehensiveAudit.overallRiskScore > 70
                        ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                        : comprehensiveAudit.overallRiskScore > 40
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                        : "border-green-500 bg-green-50 dark:bg-green-950/30"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <CardDescription>Overall Risk Score</CardDescription>
                      <CardTitle className="text-5xl font-bold">
                        {comprehensiveAudit.overallRiskScore}/100
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress
                        value={comprehensiveAudit.overallRiskScore}
                        className="h-3"
                      />
                      <p className="text-sm mt-2">
                        {comprehensiveAudit.overallRiskScore > 70
                          ? "🔴 High Risk - Immediate Review Required"
                          : comprehensiveAudit.overallRiskScore > 40
                          ? "🟡 Medium Risk - Further Investigation Needed"
                          : "✅ Low Risk - Project Appears Sound"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Critical</CardDescription>
                      <CardTitle className="text-3xl text-red-600">
                        {comprehensiveAudit.criticalIssues}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Immediate action
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>High Risk</CardDescription>
                      <CardTitle className="text-3xl text-orange-600">
                        {comprehensiveAudit.highRiskIssues}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Requires review
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Issues</CardDescription>
                      <CardTitle className="text-3xl">
                        {comprehensiveAudit.totalIssuesFound}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Flagged items
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Fraud Indicators */}
                {comprehensiveAudit.fraudIndicators.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDescription>
                      <strong className="text-lg">
                        ⚠️ FRAUD INDICATORS DETECTED
                      </strong>
                      <ul className="mt-2 space-y-1">
                        {comprehensiveAudit.fraudIndicators.map(
                          (indicator, idx) => (
                            <li key={idx} className="text-sm">
                              • {indicator}
                            </li>
                          )
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Verification Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Factual Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Land Ownership</span>
                        {comprehensiveAudit.factualVerification
                          .landOwnershipVerified ? (
                          <Badge variant="default">✓ Verified</Badge>
                        ) : (
                          <Badge variant="destructive">✗ Not Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Timeline Realistic</span>
                        {comprehensiveAudit.factualVerification
                          .timelineRealistic ? (
                          <Badge variant="default">✓ Realistic</Badge>
                        ) : (
                          <Badge variant="destructive">✗ Unrealistic</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Contractor Credible</span>
                        {comprehensiveAudit.factualVerification
                          .contractorCredible ? (
                          <Badge variant="default">✓ Credible</Badge>
                        ) : (
                          <Badge variant="destructive">✗ Questionable</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Environmental Compliance
                        </span>
                        {comprehensiveAudit.factualVerification
                          .environmentalComplianceChecked ? (
                          <Badge variant="default">✓ Checked</Badge>
                        ) : (
                          <Badge variant="destructive">✗ Not Checked</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Economic Validation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Budget Realistic</span>
                        {comprehensiveAudit.economicValidation
                          .budgetRealistic ? (
                          <Badge variant="default">✓ Fair</Badge>
                        ) : (
                          <Badge variant="destructive">✗ Questionable</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Land Prices</span>
                        {comprehensiveAudit.economicValidation
                          .landPricesFair ? (
                          <Badge variant="default">✓ Fair</Badge>
                        ) : (
                          <Badge variant="destructive">✗ Inflated</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Labor Costs</span>
                        {comprehensiveAudit.economicValidation
                          .laborCostsFair ? (
                          <Badge variant="default">✓ Fair</Badge>
                        ) : (
                          <Badge variant="destructive">✗ Inflated</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Material Costs</span>
                        {comprehensiveAudit.economicValidation
                          .materialCostsFair ? (
                          <Badge variant="default">✓ Fair</Badge>
                        ) : (
                          <Badge variant="destructive">✗ Inflated</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Verification Issues */}
                {comprehensiveAudit.verificationIssues.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Verification Issues</CardTitle>
                      <CardDescription>
                        All flagged claims with sources and recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {comprehensiveAudit.verificationIssues.map(
                          (issue, idx) => (
                            <VerificationIssueCard key={idx} issue={issue} />
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Audit Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {comprehensiveAudit.summary}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>
                  Comprehensive audit will be performed after analysis completes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

// Verification Issue Card Component
const VerificationIssueCard: React.FC<{ issue: VerificationIssue }> = ({
  issue,
}) => {
  const getRiskColor = () => {
    switch (issue.riskLevel) {
      case "critical":
        return "border-red-500 bg-red-50 dark:bg-red-950/30";
      case "high":
        return "border-orange-500 bg-orange-50 dark:bg-orange-950/30";
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30";
      default:
        return "border-blue-500 bg-blue-50 dark:bg-blue-950/30";
    }
  };

  const getRiskBadge = () => {
    const variants: Record<string, any> = {
      critical: "destructive",
      high: "destructive",
      medium: "secondary",
      low: "outline",
    };
    return variants[issue.riskLevel] || "outline";
  };

  return (
    <Card className={`${getRiskColor()} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getRiskBadge()}>
                {issue.riskLevel.toUpperCase()}
              </Badge>
              <Badge variant="outline">{issue.category}</Badge>
            </div>
            <CardTitle className="text-base">{issue.discrepancy}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h5 className="font-semibold text-sm mb-1">Claim in Document:</h5>
          <p className="text-sm text-muted-foreground">{issue.claim}</p>
        </div>
        {issue.verifiedValue && (
          <div>
            <h5 className="font-semibold text-sm mb-1">Verified Value:</h5>
            <p className="text-sm text-muted-foreground">
              {issue.verifiedValue}
            </p>
          </div>
        )}
        <Separator />
        <div>
          <h5 className="font-semibold text-sm mb-1">Explanation:</h5>
          <p className="text-sm">{issue.explanation}</p>
        </div>
        <div>
          <h5 className="font-semibold text-sm mb-1 text-primary">
            Recommendation:
          </h5>
          <p className="text-sm">{issue.recommendation}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          <strong>Source:</strong> {issue.source}
        </div>
      </CardContent>
    </Card>
  );
};

// Material Price Card Component
const MaterialPriceCard: React.FC<{ price: MaterialPrice }> = ({ price }) => {
  const getStatusStyles = () => {
    if (price.status) {
      switch (price.status) {
        case "suspicious":
          return {
            cardClass: "border-red-200 bg-red-50",
            badgeClass: "bg-red-100 text-red-800",
            label: "Suspicious",
          };
        case "overpriced":
          return {
            cardClass: "border-orange-200 bg-orange-50",
            badgeClass: "bg-orange-100 text-orange-800",
            label: "Overpriced",
          };
        case "underpriced":
          return {
            cardClass: "border-yellow-200 bg-yellow-50",
            badgeClass: "bg-yellow-100 text-yellow-800",
            label: "Underpriced",
          };
        case "fair":
          return {
            cardClass: "border-green-200 bg-green-50",
            badgeClass: "bg-green-100 text-green-800",
            label: "Fair Price",
          };
      }
    }

    return {
      cardClass: "border-gray-200 bg-white",
      badgeClass: "bg-gray-100 text-gray-800",
      label: "No Status",
    };
  };

  const styles = getStatusStyles();

  return (
    <Card
      className={`border ${styles.cardClass} shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group`}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with Tooltip */}
          <div className="flex items-start justify-between">
            <ShadcnTooltip>
              <TooltipTrigger asChild>
                <h4 className="text-sm font-semibold text-gray-900 cursor-help">
                  {price.material}
                </h4>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Material: {price.material}
                  {price.unit && ` • Unit: ${price.unit}`}
                </p>
              </TooltipContent>
            </ShadcnTooltip>
            {price.status && (
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded transition-colors duration-200 ${styles.badgeClass} hover:opacity-80 cursor-help`}
                  >
                    {styles.label}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    {price.status === "suspicious" &&
                      "Price is significantly higher than market average (30%+)"}
                    {price.status === "overpriced" &&
                      "Price is moderately higher than market average (15-30%)"}
                    {price.status === "underpriced" &&
                      "Price is below market average"}
                    {price.status === "fair" &&
                      "Price is within acceptable market range"}
                  </p>
                </TooltipContent>
              </ShadcnTooltip>
            )}
          </div>

          {/* Current Market Price with enhanced styling */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-100 group-hover:shadow-sm transition-shadow">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Current Market Rate
            </p>
            <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {price.currentPrice}
            </p>
            <p className="text-xs text-gray-500">{price.unit}</p>
          </div>

          {/* DPR Price Comparison with enhanced styling */}
          {price.dprPrice && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                DPR Quoted Price
              </p>
              <p className="text-xl font-semibold text-gray-900">
                {price.dprPrice}
              </p>
              <p className="text-xs text-blue-600">{price.dprUnit}</p>
              {price.variance !== undefined && (
                <div className="mt-3">
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full cursor-help transition-all duration-200 hover:scale-105 ${
                          price.variance > 15
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : price.variance < -15
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {price.variance > 0 ? "+" : ""}
                        {price.variance.toFixed(1)}% variance
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        {price.variance > 15 &&
                          "DPR price is significantly higher than market rate"}
                        {price.variance < -15 &&
                          "DPR price is significantly lower than market rate"}
                        {price.variance >= -15 &&
                          price.variance <= 15 &&
                          "DPR price is within acceptable range of market rate"}
                      </p>
                    </TooltipContent>
                  </ShadcnTooltip>
                </div>
              )}
            </div>
          )}

          {/* Analysis with enhanced styling */}
          {price.analysis && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
              <p className="text-xs font-medium text-amber-800 mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Market Analysis
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                {price.analysis}
              </p>
            </div>
          )}

          {price.priceRange && !price.dprPrice && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-600">
                <span className="font-medium text-gray-700">Price Range:</span>{" "}
                {price.priceRange}
              </p>
            </div>
          )}

          {/* Source Info with enhanced styling */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <p
                    className="truncate cursor-help hover:text-gray-700 transition-colors"
                    title={price.source}
                  >
                    Source: {price.source}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">{price.source}</p>
                </TooltipContent>
              </ShadcnTooltip>
              <p className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                {new Date(price.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// RedFlagCard Component
const RedFlagCard: React.FC<{ flag: RedFlag }> = ({ flag }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "Critical":
        return {
          cardClass: "border-red-200 bg-red-50",
          badgeClass: "bg-red-100 text-red-800",
          iconColor: "text-red-600",
        };
      case "High":
        return {
          cardClass: "border-orange-200 bg-orange-50",
          badgeClass: "bg-orange-100 text-orange-800",
          iconColor: "text-orange-600",
        };
      case "Medium":
        return {
          cardClass: "border-yellow-200 bg-yellow-50",
          badgeClass: "bg-yellow-100 text-yellow-800",
          iconColor: "text-yellow-600",
        };
      default:
        return {
          cardClass: "border-blue-200 bg-blue-50",
          badgeClass: "bg-blue-100 text-blue-800",
          iconColor: "text-blue-600",
        };
    }
  };

  const styles = getSeverityStyles(flag.severity);

  return (
    <Card
      className={`border ${styles.cardClass} shadow-sm hover:shadow-md transition-all duration-300 group`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white ${styles.iconColor} group-hover:scale-110 transition-transform cursor-help`}
              >
                {getSeverityIcon(flag.severity)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Severity: {flag.severity}</p>
            </TooltipContent>
          </ShadcnTooltip>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                {flag.issue}
              </h4>
              <div className="flex items-center gap-2 flex-shrink-0">
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded cursor-help hover:scale-105 transition-transform ${styles.badgeClass}`}
                    >
                      {flag.severity}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {flag.severity === "Critical" &&
                        "Requires immediate attention and resolution"}
                      {flag.severity === "High" &&
                        "Should be addressed before project approval"}
                      {flag.severity === "Medium" &&
                        "Needs review and potential modification"}
                      {flag.severity === "Low" &&
                        "Minor concern for consideration"}
                    </p>
                  </TooltipContent>
                </ShadcnTooltip>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  {flag.category}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-white rounded-lg p-3 border border-gray-100 group-hover:shadow-sm transition-shadow">
                <p className="text-gray-700 leading-relaxed">{flag.details}</p>
              </div>

              {flag.guideline_violated && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-3 border border-red-100">
                  <h6 className="font-medium text-red-900 text-xs uppercase tracking-wide mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Guideline Violated
                  </h6>
                  <p className="text-red-800 text-xs leading-relaxed">
                    {flag.guideline_violated}
                  </p>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <h6 className="font-medium text-blue-900 text-xs uppercase tracking-wide mb-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Recommended Action
                </h6>
                <p className="text-blue-800 text-xs leading-relaxed">
                  {flag.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
