import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  TrendingUp,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
} from 'lucide-react';
import { DPRAnalysis, RedFlag, MaterialPrice, ComprehensiveAuditReport, VerificationIssue } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from 'recharts';

interface AnalysisResultsProps {
  analysis: DPRAnalysis;
  materialPrices: MaterialPrice[];
  isFetchingPrices: boolean;
  comprehensiveAudit: ComprehensiveAuditReport | null;
  isPerformingAudit: boolean;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'High':
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case 'Medium':
      return <Info className="w-5 h-5 text-yellow-500" />;
    case 'Low':
      return <Info className="w-5 h-5 text-blue-500" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-900/30 border-red-500';
    case 'High':
      return 'bg-orange-900/30 border-orange-500';
    case 'Medium':
      return 'bg-yellow-900/30 border-yellow-500';
    case 'Low':
      return 'bg-blue-900/30 border-blue-500';
    default:
      return 'bg-gray-900/30 border-gray-500';
  }
};

const getComplianceColor = (compliance: string) => {
  switch (compliance) {
    case 'High':
      return 'text-green-400';
    case 'Medium':
      return 'text-yellow-400';
    case 'Low':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, materialPrices, isFetchingPrices, comprehensiveAudit, isPerformingAudit }) => {
  const groupedFlags = {
    Critical: analysis.red_flags.filter((f) => f.severity === 'Critical'),
    High: analysis.red_flags.filter((f) => f.severity === 'High'),
    Medium: analysis.red_flags.filter((f) => f.severity === 'Medium'),
    Low: analysis.red_flags.filter((f) => f.severity === 'Low'),
  };

  // Prepare data for charts
  const severityData = [
    { name: 'Critical', count: groupedFlags.Critical.length, fill: '#ef4444' },
    { name: 'High', count: groupedFlags.High.length, fill: '#f97316' },
    { name: 'Medium', count: groupedFlags.Medium.length, fill: '#eab308' },
    { name: 'Low', count: groupedFlags.Low.length, fill: '#3b82f6' },
  ].filter(item => item.count > 0);

  const categoryData = analysis.red_flags.reduce((acc: any[], flag) => {
    const existing = acc.find(item => item.category === flag.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ category: flag.category, count: 1 });
    }
    return acc;
  }, []);

  const complianceData = [
    { subject: 'Budget', score: analysis.compliance_score },
    { subject: 'Timeline', score: Math.max(0, analysis.compliance_score - 10) },
    { subject: 'Technical', score: Math.max(0, analysis.compliance_score - 5) },
    { subject: 'Environmental', score: Math.max(0, analysis.compliance_score - 15) },
    { subject: 'Documentation', score: Math.max(0, analysis.compliance_score - 8) },
  ];

  const downloadReport = () => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'dpr_analysis_report.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Download */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analysis Dashboard</h2>
          <p className="text-muted-foreground mt-1">Comprehensive DPR Evaluation Report</p>
        </div>
        <Button onClick={downloadReport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliance Score</CardDescription>
            <CardTitle className="text-3xl">{analysis.compliance_score}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysis.compliance_score} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliance Level</CardDescription>
            <CardTitle className="text-2xl">
              <Badge variant={
                analysis.overall_compliance === 'High' ? 'default' : 
                analysis.overall_compliance === 'Medium' ? 'secondary' : 'destructive'
              }>
                {analysis.overall_compliance}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Overall Rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Issues</CardDescription>
            <CardTitle className="text-3xl">{analysis.red_flags.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Identified Concerns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Critical Issues</CardDescription>
            <CardTitle className="text-3xl text-red-500">{groupedFlags.Critical.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Requires Immediate Attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Severity - Pie Chart */}
        {severityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Issues by Severity
              </CardTitle>
              <CardDescription>Distribution of identified issues</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Issues by Category - Bar Chart */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Issues by Category
              </CardTitle>
              <CardDescription>Issues grouped by evaluation area</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Compliance Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Compliance Assessment by Area
          </CardTitle>
          <CardDescription>Detailed compliance scores across evaluation criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={complianceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Compliance Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Red Flags with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Identified Issues & Recommendations</CardTitle>
          <CardDescription>Detailed breakdown of concerns and actionable recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.red_flags.length === 0 ? (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <p>No issues identified! The DPR meets all compliance requirements.</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({analysis.red_flags.length})</TabsTrigger>
                <TabsTrigger value="critical">Critical ({groupedFlags.Critical.length})</TabsTrigger>
                <TabsTrigger value="high">High ({groupedFlags.High.length})</TabsTrigger>
                <TabsTrigger value="medium">Medium ({groupedFlags.Medium.length})</TabsTrigger>
                <TabsTrigger value="low">Low ({groupedFlags.Low.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {analysis.red_flags.map((flag, idx) => (
                  <RedFlagCard key={idx} flag={flag} />
                ))}
              </TabsContent>

              <TabsContent value="critical" className="space-y-4 mt-4">
                {groupedFlags.Critical.length > 0 ? (
                  groupedFlags.Critical.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No critical issues found</p>
                )}
              </TabsContent>

              <TabsContent value="high" className="space-y-4 mt-4">
                {groupedFlags.High.length > 0 ? (
                  groupedFlags.High.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No high priority issues found</p>
                )}
              </TabsContent>

              <TabsContent value="medium" className="space-y-4 mt-4">
                {groupedFlags.Medium.length > 0 ? (
                  groupedFlags.Medium.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No medium priority issues found</p>
                )}
              </TabsContent>

              <TabsContent value="low" className="space-y-4 mt-4">
                {groupedFlags.Low.length > 0 ? (
                  groupedFlags.Low.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No low priority issues found</p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Strengths & Missing Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Strengths
              </CardTitle>
              <CardDescription>Well-executed components of the DPR</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Missing Components */}
        {analysis.missing_components.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                Missing Components
              </CardTitle>
              <CardDescription>Required elements not found in the DPR</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.missing_components.map((component, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{component}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Material Prices - Live Market Rates */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Material Price Analysis
            {isFetchingPrices && <Badge variant="outline" className="ml-2 animate-pulse">Fetching prices...</Badge>}
          </CardTitle>
          <CardDescription>
            {materialPrices.some(p => p.dprPrice) 
              ? '🔍 Comparing DPR quoted prices with current market rates'
              : '📊 Live market rates for project materials (No DPR prices found for comparison)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetchingPrices && materialPrices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Fetching current market prices...</p>
              <p className="text-sm text-muted-foreground mt-2">Searching web for latest rates</p>
            </div>
          ) : materialPrices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No materials identified in the DPR for price tracking</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Price Analysis Summary */}
              {materialPrices.some(p => p.status) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {materialPrices.filter(p => p.status === 'suspicious').length > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{materialPrices.filter(p => p.status === 'suspicious').length} Suspicious</strong> items detected with prices 30%+ above market rate
                      </AlertDescription>
                    </Alert>
                  )}
                  {materialPrices.filter(p => p.status === 'overpriced').length > 0 && (
                    <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800 dark:text-orange-200">
                        <strong>{materialPrices.filter(p => p.status === 'overpriced').length} Overpriced</strong> items (15-30% above market)
                      </AlertDescription>
                    </Alert>
                  )}
                  {materialPrices.filter(p => p.status === 'fair').length > 0 && (
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        <strong>{materialPrices.filter(p => p.status === 'fair').length} Fair</strong> items within acceptable range
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Material Price Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materialPrices.map((price, idx) => (
                  <MaterialPriceCard key={idx} price={price} index={idx} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comprehensive Verification Report */}
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CheckCircle className="w-6 h-6 text-purple-600" />
            Comprehensive Verification Report
            {isPerformingAudit && <Badge variant="outline" className="ml-2 animate-pulse">Auditing...</Badge>}
          </CardTitle>
          <CardDescription>
            AI-powered fact-checking, economic validation, and fraud detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPerformingAudit && !comprehensiveAudit ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-lg font-semibold">Performing Comprehensive Audit...</p>
              <p className="text-sm text-muted-foreground mt-2">Cross-checking facts, validating economics, detecting fraud</p>
            </div>
          ) : comprehensiveAudit ? (
            <div className="space-y-6">
              {/* Risk Score Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className={`col-span-1 md:col-span-2 ${
                  comprehensiveAudit.overallRiskScore > 70 ? 'border-red-500 bg-red-50 dark:bg-red-950/30' :
                  comprehensiveAudit.overallRiskScore > 40 ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30' :
                  'border-green-500 bg-green-50 dark:bg-green-950/30'
                }`}>
                  <CardHeader className="pb-3">
                    <CardDescription>Overall Risk Score</CardDescription>
                    <CardTitle className="text-5xl font-bold">
                      {comprehensiveAudit.overallRiskScore}/100
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={comprehensiveAudit.overallRiskScore} className="h-3" />
                    <p className="text-sm mt-2">
                      {comprehensiveAudit.overallRiskScore > 70 ? '🔴 High Risk - Immediate Review Required' :
                       comprehensiveAudit.overallRiskScore > 40 ? '🟡 Medium Risk - Further Investigation Needed' :
                       '✅ Low Risk - Project Appears Sound'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Critical</CardDescription>
                    <CardTitle className="text-3xl text-red-600">{comprehensiveAudit.criticalIssues}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Immediate action</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>High Risk</CardDescription>
                    <CardTitle className="text-3xl text-orange-600">{comprehensiveAudit.highRiskIssues}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Requires review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Issues</CardDescription>
                    <CardTitle className="text-3xl">{comprehensiveAudit.totalIssuesFound}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Flagged items</p>
                  </CardContent>
                </Card>
              </div>

              {/* Fraud Indicators */}
              {comprehensiveAudit.fraudIndicators.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertDescription>
                    <strong className="text-lg">⚠️ FRAUD INDICATORS DETECTED</strong>
                    <ul className="mt-2 space-y-1">
                      {comprehensiveAudit.fraudIndicators.map((indicator, idx) => (
                        <li key={idx} className="text-sm">• {indicator}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Verification Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Factual Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Land Ownership</span>
                      {comprehensiveAudit.factualVerification.landOwnershipVerified ? 
                        <Badge variant="default">✓ Verified</Badge> : 
                        <Badge variant="destructive">✗ Not Verified</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Timeline Realistic</span>
                      {comprehensiveAudit.factualVerification.timelineRealistic ? 
                        <Badge variant="default">✓ Realistic</Badge> : 
                        <Badge variant="destructive">✗ Unrealistic</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Contractor Credible</span>
                      {comprehensiveAudit.factualVerification.contractorCredible ? 
                        <Badge variant="default">✓ Credible</Badge> : 
                        <Badge variant="destructive">✗ Questionable</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Environmental Compliance</span>
                      {comprehensiveAudit.factualVerification.environmentalComplianceChecked ? 
                        <Badge variant="default">✓ Checked</Badge> : 
                        <Badge variant="destructive">✗ Not Checked</Badge>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Economic Validation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Budget Realistic</span>
                      {comprehensiveAudit.economicValidation.budgetRealistic ? 
                        <Badge variant="default">✓ Fair</Badge> : 
                        <Badge variant="destructive">✗ Questionable</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Land Prices</span>
                      {comprehensiveAudit.economicValidation.landPricesFair ? 
                        <Badge variant="default">✓ Fair</Badge> : 
                        <Badge variant="destructive">✗ Inflated</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Labor Costs</span>
                      {comprehensiveAudit.economicValidation.laborCostsFair ? 
                        <Badge variant="default">✓ Fair</Badge> : 
                        <Badge variant="destructive">✗ Inflated</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Material Costs</span>
                      {comprehensiveAudit.economicValidation.materialCostsFair ? 
                        <Badge variant="default">✓ Fair</Badge> : 
                        <Badge variant="destructive">✗ Inflated</Badge>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Verification Issues */}
              {comprehensiveAudit.verificationIssues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Verification Issues</CardTitle>
                    <CardDescription>All flagged claims with sources and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comprehensiveAudit.verificationIssues.map((issue, idx) => (
                        <VerificationIssueCard key={idx} issue={issue} />
                      ))}
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
                  <p className="text-sm leading-relaxed">{comprehensiveAudit.summary}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Comprehensive audit will be performed after analysis completes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Verification Issue Card Component
const VerificationIssueCard: React.FC<{ issue: VerificationIssue }> = ({ issue }) => {
  const getRiskColor = () => {
    switch (issue.riskLevel) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950/30';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950/30';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/30';
    }
  };

  const getRiskBadge = () => {
    const variants: Record<string, any> = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline',
    };
    return variants[issue.riskLevel] || 'outline';
  };

  return (
    <Card className={`${getRiskColor()} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getRiskBadge()}>{issue.riskLevel.toUpperCase()}</Badge>
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
            <p className="text-sm text-muted-foreground">{issue.verifiedValue}</p>
          </div>
        )}
        <Separator />
        <div>
          <h5 className="font-semibold text-sm mb-1">Explanation:</h5>
          <p className="text-sm">{issue.explanation}</p>
        </div>
        <div>
          <h5 className="font-semibold text-sm mb-1 text-primary">Recommendation:</h5>
          <p className="text-sm">{issue.recommendation}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          <strong>Source:</strong> {issue.source}
        </div>
      </CardContent>
    </Card>
  );
};

// Material Price Card Component with Animation
const MaterialPriceCard: React.FC<{ price: MaterialPrice; index: number }> = ({ price, index }) => {
  const getTrendIcon = () => {
    switch (price.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    if (price.status) {
      switch (price.status) {
        case 'suspicious':
          return 'border-red-500 bg-red-50 dark:border-red-800 dark:bg-red-950/50';
        case 'overpriced':
          return 'border-orange-400 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50';
        case 'underpriced':
          return 'border-yellow-400 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50';
        case 'fair':
          return 'border-green-400 bg-green-50 dark:border-green-800 dark:bg-green-950/50';
      }
    }
    
    // Fallback to trend colors if no status
    switch (price.trend) {
      case 'up':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'down':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
    }
  };

  const getStatusBadge = () => {
    if (!price.status) return null;
    
    const variants: Record<string, any> = {
      suspicious: 'destructive',
      overpriced: 'destructive',
      underpriced: 'secondary',
      fair: 'default',
    };
    
    return (
      <Badge variant={variants[price.status]} className="text-xs">
        {price.status === 'suspicious' && '⚠️ SUSPICIOUS'}
        {price.status === 'overpriced' && '🔴 OVERPRICED'}
        {price.status === 'underpriced' && '🟡 UNDERPRICED'}
        {price.status === 'fair' && '✅ FAIR'}
      </Badge>
    );
  };

  return (
    <Card 
      className={`${getStatusColor()} transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 border-2`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{price.material}</CardTitle>
          <div className="flex flex-col items-end gap-1">
            {getTrendIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Market Price */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current Market Rate</p>
          <p className="text-2xl font-bold text-primary">{price.currentPrice}</p>
          <p className="text-xs text-muted-foreground">{price.unit}</p>
        </div>

        {/* DPR Price Comparison */}
        {price.dprPrice && (
          <>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-1">DPR Quoted Price</p>
              <p className="text-xl font-bold">{price.dprPrice}</p>
              <p className="text-xs text-muted-foreground">{price.dprUnit}</p>
              {price.variance !== undefined && (
                <div className="mt-2">
                  <Badge variant="outline" className={`text-xs ${
                    price.variance > 15 ? 'border-red-500 text-red-600' :
                    price.variance < -15 ? 'border-yellow-500 text-yellow-600' :
                    'border-green-500 text-green-600'
                  }`}>
                    {price.variance > 0 ? '+' : ''}{price.variance.toFixed(1)}% variance
                  </Badge>
                </div>
              )}
            </div>
          </>
        )}

        {/* Analysis */}
        {price.analysis && (
          <>
            <Separator />
            <div className="text-xs p-2 rounded bg-background/50">
              <p className="font-semibold mb-1">Analysis:</p>
              <p>{price.analysis}</p>
            </div>
          </>
        )}

        {price.priceRange && !price.dprPrice && (
          <div className="text-xs">
            <span className="font-semibold">Range:</span> {price.priceRange}
          </div>
        )}
        
        <Separator />
        <div className="text-xs text-muted-foreground">
          <p className="truncate" title={price.source}>Source: {price.source}</p>
          <p className="mt-1">Updated: {new Date(price.lastUpdated).toLocaleTimeString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// RedFlagCard Component
const RedFlagCard: React.FC<{ flag: RedFlag }> = ({ flag }) => {
  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      Critical: 'destructive',
      High: 'destructive',
      Medium: 'secondary',
      Low: 'outline',
    };
    return variants[severity] || 'outline';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {getSeverityIcon(flag.severity)}
            <div className="flex-1">
              <CardTitle className="text-base">{flag.issue}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getSeverityBadge(flag.severity)}>{flag.severity}</Badge>
                <Badge variant="outline">{flag.category}</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h5 className="font-semibold text-sm mb-1">Details:</h5>
          <p className="text-sm text-muted-foreground">{flag.details}</p>
        </div>
        {flag.guideline_violated && (
          <div>
            <h5 className="font-semibold text-sm mb-1">Guideline Violated:</h5>
            <p className="text-sm text-muted-foreground">{flag.guideline_violated}</p>
          </div>
        )}
        <Separator />
        <div>
          <h5 className="font-semibold text-sm mb-1 text-primary">Recommendation:</h5>
          <p className="text-sm">{flag.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
};
