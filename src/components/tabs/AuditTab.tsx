import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertTriangle, Info, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ComprehensiveAuditReport, VerificationIssue } from '../../types';

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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
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

  const getRiskBadge = (riskLevel: string) => {
    const variants: Record<string, any> = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline',
    };
    return variants[riskLevel] || 'outline';
  };

  const VerificationIssueCard: React.FC<{ issue: VerificationIssue }> = ({ issue }) => (
    <Card className={`${getRiskColor(issue.riskLevel)} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getRiskBadge(issue.riskLevel)} className="text-sm px-3 py-1">
                {issue.riskLevel.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {issue.category}
              </Badge>
            </div>
            <CardTitle className="text-base font-bold">{issue.discrepancy}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h5 className="font-bold text-sm mb-1">📋 Claim in Document:</h5>
          <p className="text-sm text-muted-foreground pl-4 border-l-2 border-gray-300">{issue.claim}</p>
        </div>
        {issue.verifiedValue && (
          <div>
            <h5 className="font-bold text-sm mb-1">✅ Verified Value:</h5>
            <p className="text-sm text-muted-foreground pl-4 border-l-2 border-green-300">{issue.verifiedValue}</p>
          </div>
        )}
        <Separator />
        <div>
          <h5 className="font-bold text-sm mb-1">💡 Explanation:</h5>
          <p className="text-sm pl-4 border-l-2 border-blue-300">{issue.explanation}</p>
        </div>
        <div>
          <h5 className="font-bold text-sm mb-1 text-primary">🎯 Recommendation:</h5>
          <p className="text-sm pl-4 border-l-2 border-primary">{issue.recommendation}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          <strong>Source:</strong> {issue.source}
        </div>
      </CardContent>
    </Card>
  );

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

      {/* Detailed Verification Issues */}
      {comprehensiveAudit.verificationIssues.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Info className="w-6 h-6" />
            {t('verificationIssues')} ({comprehensiveAudit.verificationIssues.length})
          </h2>
          <div className="space-y-4">
            {comprehensiveAudit.verificationIssues.map((issue, idx) => (
              <VerificationIssueCard key={idx} issue={issue} />
            ))}
          </div>
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
