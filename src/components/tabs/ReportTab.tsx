import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DPRAnalysis, RedFlag } from '../../types';

interface ReportTabProps {
  analysis: DPRAnalysis;
}

export const ReportTab: React.FC<ReportTabProps> = ({ analysis }) => {
  const { t } = useLanguage();

  const groupedFlags = {
    Critical: analysis.red_flags.filter((f) => f.severity === 'Critical'),
    High: analysis.red_flags.filter((f) => f.severity === 'High'),
    Medium: analysis.red_flags.filter((f) => f.severity === 'Medium'),
    Low: analysis.red_flags.filter((f) => f.severity === 'Low'),
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'High':
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 'Medium':
        return <Info className="w-6 h-6 text-yellow-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950/30';
      case 'High':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950/30';
      case 'Medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/30';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'destructive';
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const IssueCard: React.FC<{ flag: RedFlag; index: number }> = ({ flag, index }) => (
    <Card className={`border-2 ${getSeverityColor(flag.severity)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              {getSeverityIcon(flag.severity)}
              <Badge variant={getSeverityBadge(flag.severity) as any} className="text-sm px-3 py-1">
                {flag.severity}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {flag.category}
              </Badge>
            </div>
            <CardTitle className="text-lg font-bold">
              {index + 1}. {flag.issue}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-bold text-sm mb-2 text-gray-700 dark:text-gray-300">
            📋 {t('details')}:
          </h4>
          <p className="text-sm leading-relaxed pl-4 border-l-2 border-gray-300">
            {flag.details}
          </p>
        </div>
        
        {flag.guideline_violated && (
          <div>
            <h4 className="font-bold text-sm mb-2 text-red-700 dark:text-red-400">
              ⚠️ Guideline Violated:
            </h4>
            <p className="text-sm leading-relaxed pl-4 border-l-2 border-red-300">
              {flag.guideline_violated}
            </p>
          </div>
        )}
        
        <Separator />
        
        <div>
          <h4 className="font-bold text-sm mb-2 text-green-700 dark:text-green-400">
            💡 {t('recommendation')}:
          </h4>
          <p className="text-sm leading-relaxed pl-4 border-l-2 border-green-300">
            {flag.recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Critical Issues */}
      {groupedFlags.Critical.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-600">
            <AlertCircle className="w-7 h-7" />
            Critical Issues ({groupedFlags.Critical.length})
          </h2>
          <div className="space-y-4">
            {groupedFlags.Critical.map((flag, idx) => (
              <IssueCard key={idx} flag={flag} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* High Severity Issues */}
      {groupedFlags.High.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-7 h-7" />
            High Severity Issues ({groupedFlags.High.length})
          </h2>
          <div className="space-y-4">
            {groupedFlags.High.map((flag, idx) => (
              <IssueCard key={idx} flag={flag} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Medium Severity Issues */}
      {groupedFlags.Medium.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
            <Info className="w-7 h-7" />
            Medium Severity Issues ({groupedFlags.Medium.length})
          </h2>
          <div className="space-y-4">
            {groupedFlags.Medium.map((flag, idx) => (
              <IssueCard key={idx} flag={flag} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Low Severity Issues */}
      {groupedFlags.Low.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600">
            <Info className="w-7 h-7" />
            Low Severity Issues ({groupedFlags.Low.length})
          </h2>
          <div className="space-y-4">
            {groupedFlags.Low.map((flag, idx) => (
              <IssueCard key={idx} flag={flag} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Missing Components */}
      {analysis.missing_components.length > 0 && (
        <Card className="border-2 border-purple-200 bg-purple-50/30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
              {t('missingComponents')} ({analysis.missing_components.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.missing_components.map((component, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <span className="font-bold text-purple-600 text-lg">{idx + 1}.</span>
                  <span className="text-sm leading-relaxed flex-1">{component}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Project Strengths */}
      <Card className="border-2 border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-6 h-6" />
            {t('projectStrengths')} ({analysis.strengths.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed flex-1">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
