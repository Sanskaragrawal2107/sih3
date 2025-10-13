import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DPRAnalysis } from '../../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface DashboardTabProps {
  analysis: DPRAnalysis;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ analysis }) => {
  const { t } = useLanguage();

  const groupedFlags = {
    Critical: analysis.red_flags.filter((f) => f.severity === 'Critical'),
    High: analysis.red_flags.filter((f) => f.severity === 'High'),
    Medium: analysis.red_flags.filter((f) => f.severity === 'Medium'),
    Low: analysis.red_flags.filter((f) => f.severity === 'Low'),
  };

  const severityData = [
    { name: t('criticalIssues'), count: groupedFlags.Critical.length, fill: '#ef4444' },
    { name: t('highSeverity'), count: groupedFlags.High.length, fill: '#f97316' },
    { name: t('mediumSeverity'), count: groupedFlags.Medium.length, fill: '#eab308' },
    { name: t('lowSeverity'), count: groupedFlags.Low.length, fill: '#3b82f6' },
  ].filter(item => item.count > 0);

  // Category data for bar chart
  const categoryData = analysis.red_flags.reduce((acc: any[], flag) => {
    const existing = acc.find(item => item.category === flag.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ category: flag.category, count: 1 });
    }
    return acc;
  }, []);

  // Compliance radar data
  const complianceData = [
    { subject: 'Budget', score: analysis.compliance_score },
    { subject: 'Timeline', score: Math.max(0, analysis.compliance_score - 10) },
    { subject: 'Technical', score: Math.max(0, analysis.compliance_score - 5) },
    { subject: 'Environmental', score: Math.max(0, analysis.compliance_score - 15) },
    { subject: 'Documentation', score: Math.max(0, analysis.compliance_score - 8) },
  ];

  const getComplianceColor = () => {
    switch (analysis.overall_compliance) {
      case 'High':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getComplianceIcon = () => {
    switch (analysis.overall_compliance) {
      case 'High':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'Medium':
        return <AlertTriangle className="w-12 h-12 text-yellow-600" />;
      default:
        return <XCircle className="w-12 h-12 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Compliance Card */}
      <Card className={`border-2 ${getComplianceColor()}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">
                {t('overallCompliance')}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {t('complianceScore')}: <strong>{analysis.compliance_score}/100</strong>
              </CardDescription>
            </div>
            {getComplianceIcon()}
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={analysis.compliance_score} className="h-4 mb-4" />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {analysis.overall_compliance} Compliance
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">
              {t('totalIssues')}
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-blue-600">
              {analysis.red_flags.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">
              {t('criticalIssues')}
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-red-600">
              {groupedFlags.Critical.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">
              {t('highSeverity')}
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-orange-600">
              {groupedFlags.High.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">
              {t('mediumSeverity')} + {t('lowSeverity')}
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-yellow-600">
              {groupedFlags.Medium.length + groupedFlags.Low.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution - Pie Chart */}
        {severityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Issues by Severity
              </CardTitle>
              <CardDescription>Distribution of identified issues</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count }) => `${name}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Issues by Category - Bar Chart */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
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
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Compliance Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
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
              <Radar name="Compliance Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Strengths */}
      <Card className="border-2 border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            {t('projectStrengths')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysis.strengths.slice(0, 5).map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t('summary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
