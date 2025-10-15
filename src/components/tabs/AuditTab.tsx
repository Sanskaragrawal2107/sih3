import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertTriangle, Shield, CheckCircle2, Clock, TrendingUp, CloudRain, Users, Package, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ComprehensiveAuditReport } from '../../types';

interface AuditTabProps {
  comprehensiveAudit: ComprehensiveAuditReport | null;
  isPerformingAudit: boolean;
}

export const AuditTab: React.FC<AuditTabProps> = ({
  comprehensiveAudit,
  isPerformingAudit,
}) => {
  const { t } = useLanguage();

  if (isPerformingAudit && !comprehensiveAudit) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p className="text-lg font-semibold">Performing Comprehensive Audit...</p>
        <p className="text-sm text-muted-foreground mt-2">Cross-checking facts, validating economics, detecting fraud</p>
      </div>
    );
  }

  if (!comprehensiveAudit) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-lg text-muted-foreground">Comprehensive audit will be performed after analysis completes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Score Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className={`col-span-1 md:col-span-2 border-2 ${
          comprehensiveAudit.overallRiskScore > 70 ? 'border-red-500 bg-red-50 dark:bg-red-950/30' :
          comprehensiveAudit.overallRiskScore > 40 ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30' :
          'border-green-500 bg-green-50 dark:bg-green-950/30'
        }`}>
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">
              {t('overallRiskScore')}
            </CardDescription>
            <CardTitle className="text-5xl font-bold">
              {comprehensiveAudit.overallRiskScore}/100
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={comprehensiveAudit.overallRiskScore} className="h-3" />
            <p className="text-sm mt-2 font-semibold">
              {comprehensiveAudit.overallRiskScore > 70 ? '🔴 High Risk - Immediate Review Required' :
               comprehensiveAudit.overallRiskScore > 40 ? '🟡 Medium Risk - Further Investigation Needed' :
               '✅ Low Risk - Project Appears Sound'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Critical</CardDescription>
            <CardTitle className="text-3xl text-red-600">{comprehensiveAudit.criticalIssues}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Immediate action</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">High Risk</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{comprehensiveAudit.highRiskIssues}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Total Issues</CardDescription>
            <CardTitle className="text-3xl">{comprehensiveAudit.totalIssuesFound}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Flagged items</p>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Indicators */}
      {comprehensiveAudit.fraudIndicators.length > 0 && (
        <Alert variant="destructive" className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <strong className="text-lg">⚠️ {t('fraudIndicators')}</strong>
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
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold">{t('factualVerification')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
              <span className="text-sm font-medium">Land Ownership</span>
              {comprehensiveAudit.factualVerification.landOwnershipVerified ? 
                <Badge variant="default" className="bg-green-600">✓ Verified</Badge> : 
                <Badge variant="destructive">✗ Not Verified</Badge>}
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
              <span className="text-sm font-medium">Timeline Realistic</span>
              {comprehensiveAudit.factualVerification.timelineRealistic ? 
                <Badge variant="default" className="bg-green-600">✓ Realistic</Badge> : 
                <Badge variant="destructive">✗ Unrealistic</Badge>}
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
              <span className="text-sm font-medium">Contractor Credible</span>
              {comprehensiveAudit.factualVerification.contractorCredible ? 
                <Badge variant="default" className="bg-green-600">✓ Credible</Badge> : 
                <Badge variant="destructive">✗ Questionable</Badge>}
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
              <span className="text-sm font-medium">Environmental Compliance</span>
              {comprehensiveAudit.factualVerification.environmentalComplianceChecked ? 
                <Badge variant="default" className="bg-green-600">✓ Checked</Badge> : 
                <Badge variant="destructive">✗ Not Checked</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold">{t('economicValidation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
              <span className="text-sm font-medium">Budget Realistic</span>
              {comprehensiveAudit.economicValidation.budgetRealistic ? 
                <Badge variant="default" className="bg-green-600">✓ Fair</Badge> : 
                <Badge variant="destructive">✗ Questionable</Badge>}
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
              <span className="text-sm font-medium">Land Prices</span>
              {comprehensiveAudit.economicValidation.landPricesFair ? 
                <Badge variant="default" className="bg-green-600">✓ Fair</Badge> : 
                <Badge variant="destructive">✗ Inflated</Badge>}
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
              <span className="text-sm font-medium">Labor Costs</span>
              {comprehensiveAudit.economicValidation.laborCostsFair ? 
                <Badge variant="default" className="bg-green-600">✓ Fair</Badge> : 
                <Badge variant="destructive">✗ Inflated</Badge>}
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
              <span className="text-sm font-medium">Material Costs</span>
              {comprehensiveAudit.economicValidation.materialCostsFair ? 
                <Badge variant="default" className="bg-green-600">✓ Fair</Badge> : 
                <Badge variant="destructive">✗ Inflated</Badge>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guideline Recommendations */}
      {comprehensiveAudit.guidelineRecommendations && comprehensiveAudit.guidelineRecommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            Guideline Compliance & Recommendations ({comprehensiveAudit.guidelineRecommendations.length})
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Analysis of DPR compliance with MDoNER/PM-DevINE guidelines and actionable recommendations
          </p>
          <div className="space-y-4">
            {comprehensiveAudit.guidelineRecommendations.map((rec, idx) => (
              <Card key={idx} className={`border-2 ${
                rec.priority === 'critical' ? 'border-red-500 bg-red-50' :
                rec.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={rec.priority === 'critical' || rec.priority === 'high' ? 'destructive' : 'secondary'} className="text-sm px-3 py-1">
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <Badge variant={
                          rec.currentStatus === 'compliant' ? 'default' :
                          rec.currentStatus === 'partial' ? 'secondary' :
                          'destructive'
                        } className="text-sm px-3 py-1">
                          {rec.currentStatus === 'compliant' ? '✓ Compliant' :
                           rec.currentStatus === 'partial' ? '⚠ Partial' :
                           rec.currentStatus === 'non-compliant' ? '✗ Non-Compliant' :
                           '? Missing'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold">{rec.guidelineReference}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h5 className="font-bold text-sm mb-1">⚠️ Issue:</h5>
                    <p className="text-sm text-muted-foreground pl-4 border-l-2 border-gray-300">{rec.issue}</p>
                  </div>
                  <Separator />
                  <div>
                    <h5 className="font-bold text-sm mb-1 text-primary">💡 Recommendation:</h5>
                    <p className="text-sm pl-4 border-l-2 border-primary">{rec.recommendation}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1 text-green-700">🎯 Action Required:</h5>
                    <p className="text-sm pl-4 border-l-2 border-green-500">{rec.actionRequired}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Feasibility Analysis */}
      {comprehensiveAudit.feasibilityAnalysis && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Feasibility Analysis
          </h2>
          
          {/* Feasibility Score */}
          <Card className={`mb-4 border-2 ${
            comprehensiveAudit.feasibilityAnalysis.overallFeasibility === 'highly-feasible' ? 'border-green-500 bg-green-50' :
            comprehensiveAudit.feasibilityAnalysis.overallFeasibility === 'feasible' ? 'border-blue-500 bg-blue-50' :
            comprehensiveAudit.feasibilityAnalysis.overallFeasibility === 'challenging' ? 'border-orange-500 bg-orange-50' :
            'border-red-500 bg-red-50'
          }`}>
            <CardHeader className="pb-3">
              <CardDescription className="text-sm font-medium">Overall Feasibility</CardDescription>
              <CardTitle className="text-4xl font-bold capitalize">
                {comprehensiveAudit.feasibilityAnalysis.overallFeasibility.replace('-', ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={comprehensiveAudit.feasibilityAnalysis.feasibilityScore} className="h-3 mb-2" />
              <p className="text-sm font-semibold">
                Feasibility Score: {comprehensiveAudit.feasibilityAnalysis.feasibilityScore}/100
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Timeline Feasibility */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline Feasibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm font-medium">Proposed Duration</span>
                  <Badge variant="outline">{comprehensiveAudit.feasibilityAnalysis.timelineFeasibility.proposedDuration}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm font-medium">Is Realistic?</span>
                  {comprehensiveAudit.feasibilityAnalysis.timelineFeasibility.isRealistic ? 
                    <Badge variant="default" className="bg-green-600">✓ Yes</Badge> : 
                    <Badge variant="destructive">✗ No</Badge>}
                </div>
                <Separator />
                <div>
                  <h5 className="font-bold text-sm mb-1 flex items-center gap-1">
                    <CloudRain className="w-4 h-4" /> Weather Impact:
                  </h5>
                  <p className="text-sm text-muted-foreground pl-4 border-l-2 border-blue-300">
                    {comprehensiveAudit.feasibilityAnalysis.timelineFeasibility.weatherImpact}
                  </p>
                </div>
                {comprehensiveAudit.feasibilityAnalysis.timelineFeasibility.seasonalConstraints.length > 0 && (
                  <div>
                    <h5 className="font-bold text-sm mb-1">Seasonal Constraints:</h5>
                    <ul className="text-sm space-y-1 pl-4">
                      {comprehensiveAudit.feasibilityAnalysis.timelineFeasibility.seasonalConstraints.map((constraint, idx) => (
                        <li key={idx} className="text-muted-foreground">• {constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h5 className="font-bold text-sm mb-1 text-primary">💡 Recommendation:</h5>
                  <p className="text-sm pl-4 border-l-2 border-primary">
                    {comprehensiveAudit.feasibilityAnalysis.timelineFeasibility.recommendation}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Resource Availability */}
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Resource Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Users className="w-4 h-4" /> Labor Available
                  </span>
                  {comprehensiveAudit.feasibilityAnalysis.resourceAvailability.laborAvailable ? 
                    <Badge variant="default" className="bg-green-600">✓ Yes</Badge> : 
                    <Badge variant="destructive">✗ No</Badge>}
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm font-medium">Materials Accessible</span>
                  {comprehensiveAudit.feasibilityAnalysis.resourceAvailability.materialsAccessible ? 
                    <Badge variant="default" className="bg-green-600">✓ Yes</Badge> : 
                    <Badge variant="destructive">✗ No</Badge>}
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm font-medium">Equipment Available</span>
                  {comprehensiveAudit.feasibilityAnalysis.resourceAvailability.equipmentAvailable ? 
                    <Badge variant="default" className="bg-green-600">✓ Yes</Badge> : 
                    <Badge variant="destructive">✗ No</Badge>}
                </div>
                {comprehensiveAudit.feasibilityAnalysis.resourceAvailability.concerns.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h5 className="font-bold text-sm mb-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-orange-600" /> Concerns:
                      </h5>
                      <ul className="text-sm space-y-1 pl-4">
                        {comprehensiveAudit.feasibilityAnalysis.resourceAvailability.concerns.map((concern, idx) => (
                          <li key={idx} className="text-muted-foreground">• {concern}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historical Comparison */}
          <Card className="border-2 border-purple-200 mb-4">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Historical Comparison (Past Projects)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded border">
                  <p className="text-xs text-muted-foreground mb-1">Similar Projects Found</p>
                  <p className="text-lg font-bold">
                    {comprehensiveAudit.feasibilityAnalysis.historicalComparison.similarProjectsFound ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="text-xs text-muted-foreground mb-1">Average Duration</p>
                  <p className="text-lg font-bold">{comprehensiveAudit.feasibilityAnalysis.historicalComparison.averageDuration}</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-lg font-bold">{comprehensiveAudit.feasibilityAnalysis.historicalComparison.successRate}</p>
                </div>
              </div>
              {comprehensiveAudit.feasibilityAnalysis.historicalComparison.keyLearnings.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h5 className="font-bold text-sm mb-2">📚 Key Learnings from Past Projects:</h5>
                    <ul className="text-sm space-y-1 pl-4">
                      {comprehensiveAudit.feasibilityAnalysis.historicalComparison.keyLearnings.map((learning, idx) => (
                        <li key={idx} className="text-muted-foreground">• {learning}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Risk Factors */}
          {comprehensiveAudit.feasibilityAnalysis.riskFactors.length > 0 && (
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {comprehensiveAudit.feasibilityAnalysis.riskFactors.map((risk, idx) => (
                    <div key={idx} className={`p-3 rounded border-2 ${
                      risk.impact === 'high' ? 'border-red-300 bg-red-50' :
                      risk.impact === 'medium' ? 'border-orange-300 bg-orange-50' :
                      'border-yellow-300 bg-yellow-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-sm">{risk.factor}</h5>
                        <Badge variant={risk.impact === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {risk.impact.toUpperCase()} IMPACT
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Mitigation:</strong> {risk.mitigation}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Audit Summary */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Audit Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{comprehensiveAudit.summary}</p>
        </CardContent>
      </Card>
    </div>
  );
};
