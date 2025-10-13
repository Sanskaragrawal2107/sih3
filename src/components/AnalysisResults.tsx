import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  TrendingUp,
} from 'lucide-react';
import { DPRAnalysis, RedFlag } from '../types';

interface AnalysisResultsProps {
  analysis: DPRAnalysis;
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

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const groupedFlags = {
    Critical: analysis.red_flags.filter((f) => f.severity === 'Critical'),
    High: analysis.red_flags.filter((f) => f.severity === 'High'),
    Medium: analysis.red_flags.filter((f) => f.severity === 'Medium'),
    Low: analysis.red_flags.filter((f) => f.severity === 'Low'),
  };

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
      {/* Overall Assessment */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Overall Assessment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Compliance Level</p>
            <p
              className={`text-2xl font-bold ${getComplianceColor(
                analysis.overall_compliance
              )}`}
            >
              {analysis.overall_compliance}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Compliance Score</p>
            <p className="text-2xl font-bold text-white">
              {analysis.compliance_score}/100
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-3">📝 Executive Summary</h3>
        <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Red Flags */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          🚩 Red Flags Identified
        </h3>

        {analysis.red_flags.length === 0 ? (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <p>No red flags identified!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Critical Issues */}
            {groupedFlags.Critical.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-3">
                  🔴 Critical Issues ({groupedFlags.Critical.length})
                </h4>
                <div className="space-y-3">
                  {groupedFlags.Critical.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} />
                  ))}
                </div>
              </div>
            )}

            {/* High Priority Issues */}
            {groupedFlags.High.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-orange-400 mb-3">
                  🟠 High Priority Issues ({groupedFlags.High.length})
                </h4>
                <div className="space-y-3">
                  {groupedFlags.High.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} />
                  ))}
                </div>
              </div>
            )}

            {/* Medium Priority Issues */}
            {groupedFlags.Medium.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-3">
                  🟡 Medium Priority Issues ({groupedFlags.Medium.length})
                </h4>
                <div className="space-y-3">
                  {groupedFlags.Medium.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} />
                  ))}
                </div>
              </div>
            )}

            {/* Low Priority Issues */}
            {groupedFlags.Low.length > 0 && (
              <details className="cursor-pointer">
                <summary className="text-lg font-semibold text-blue-400 mb-3">
                  🟢 Low Priority Issues ({groupedFlags.Low.length})
                </summary>
                <div className="space-y-3 mt-3">
                  {groupedFlags.Low.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} />
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {/* Missing Components */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          📋 Missing Components
        </h3>
        {analysis.missing_components.length === 0 ? (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <p>All required components are present</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {analysis.missing_components.map((component, idx) => (
              <li key={idx} className="flex items-start gap-2 text-orange-300">
                <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{component}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Strengths */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">💪 Strengths</h3>
        {analysis.strengths.length === 0 ? (
          <p className="text-gray-400">No specific strengths identified</p>
        ) : (
          <ul className="space-y-2">
            {analysis.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2 text-green-300">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={downloadReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Analysis Report (JSON)
        </button>
      </div>
    </div>
  );
};

const RedFlagCard: React.FC<{ flag: RedFlag }> = ({ flag }) => {
  return (
    <div
      className={`border-l-4 rounded-lg p-4 ${getSeverityColor(flag.severity)}`}
    >
      <div className="flex items-start gap-3">
        {getSeverityIcon(flag.severity)}
        <div className="flex-1">
          <h5 className="font-semibold text-white mb-1">
            {flag.category} - {flag.issue}
          </h5>
          <p className="text-sm text-gray-300 mb-2">{flag.details}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">
              <span className="font-medium">Guideline Violated:</span>{' '}
              {flag.guideline_violated}
            </p>
            <p className="text-gray-400">
              <span className="font-medium">Recommendation:</span>{' '}
              {flag.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
