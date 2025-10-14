import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { 
  Leaf, 
  TreePine, 
  Factory, 
  Wind, 
  Droplets, 
  Sun, 
  Recycle, 
  Zap 
} from "lucide-react";

export const SustainabilityTab: React.FC = () => {

  // Mock ESG Scores
  const esgOverallScore = 78;
  const environmentalScore = 82;
  const socialScore = 75;
  const governanceScore = 77;

  // SDG Alignment Data
  const sdgAlignment = [
    { goal: 'SDG 7: Clean Energy', score: 85, icon: Zap, color: 'bg-yellow-500' },
    { goal: 'SDG 9: Infrastructure', score: 90, icon: Factory, color: 'bg-orange-500' },
    { goal: 'SDG 11: Sustainable Cities', score: 75, icon: TreePine, color: 'bg-green-500' },
    { goal: 'SDG 13: Climate Action', score: 80, icon: Wind, color: 'bg-blue-500' },
    { goal: 'SDG 15: Life on Land', score: 70, icon: Leaf, color: 'bg-emerald-500' },
  ];

  // Environmental Metrics
  const environmentalMetrics = [
    { metric: 'Carbon Footprint Reduction', value: 65, target: 70, unit: '%' },
    { metric: 'Renewable Energy Usage', value: 45, target: 50, unit: '%' },
    { metric: 'Water Conservation', value: 80, target: 75, unit: '%' },
    { metric: 'Waste Recycling Rate', value: 55, target: 60, unit: '%' },
    { metric: 'Green Material Usage', value: 70, target: 65, unit: '%' },
    { metric: 'Biodiversity Protection', value: 60, target: 55, unit: 'Score' },
  ];

  // ESG Radar Chart Data
  const esgRadarData = [
    { category: 'Carbon Emissions', score: 82 },
    { category: 'Energy Efficiency', score: 85 },
    { category: 'Water Management', score: 80 },
    { category: 'Waste Management', score: 75 },
    { category: 'Social Impact', score: 78 },
    { category: 'Governance', score: 77 },
  ];

  // Sustainability Timeline
  const sustainabilityTimeline = [
    { phase: 'Planning', environmental: 85, social: 70, governance: 80 },
    { phase: 'Construction', environmental: 75, social: 75, governance: 75 },
    { phase: 'Operation', environmental: 80, social: 80, governance: 78 },
    { phase: 'Maintenance', environmental: 82, social: 75, governance: 77 },
  ];

  // Green Certifications
  const certifications = [
    { name: 'LEED Certification', status: 'Eligible', level: 'Gold' },
    { name: 'GRIHA Rating', status: 'Pending', level: '4 Star' },
    { name: 'ISO 14001', status: 'Compliant', level: 'Certified' },
    { name: 'Energy Star', status: 'Eligible', level: 'Qualified' },
  ];

  // Climate Impact Assessment
  const climateImpact = {
    carbonFootprint: '2,450 tonnes CO2/year',
    carbonOffset: '1,590 tonnes CO2/year',
    netEmissions: '860 tonnes CO2/year',
    equivalentTrees: '39,090 trees planted',
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-2">🌱 Sustainability & ESG Scoring</h2>
        <p className="text-green-100">
          AI-powered assessment of project alignment with sustainability metrics and UN Sustainable Development Goals
        </p>
      </div>

      {/* Overall ESG Score */}
      <Card className="border-2 border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            Overall ESG Score
          </CardTitle>
          <CardDescription>
            Comprehensive Environmental, Social, and Governance assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <div className="text-6xl font-bold text-green-600">{esgOverallScore}</div>
                <div className="absolute -right-8 top-0">
                  <Badge className="bg-green-600 text-white">
                    {getScoreBadge(esgOverallScore)}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 font-semibold">Overall ESG Score</p>
              <Progress value={esgOverallScore} className="mt-2 h-2" />
            </div>

            {/* Environmental */}
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-1">{environmentalScore}</div>
              <p className="text-sm text-gray-600 font-semibold">Environmental</p>
              <Progress value={environmentalScore} className="mt-2 h-2" />
              <div className="flex items-center justify-center gap-1 mt-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-gray-500">Climate Impact</span>
              </div>
            </div>

            {/* Social */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">{socialScore}</div>
              <p className="text-sm text-gray-600 font-semibold">Social</p>
              <Progress value={socialScore} className="mt-2 h-2" />
              <div className="flex items-center justify-center gap-1 mt-2">
                <TreePine className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-500">Community Impact</span>
              </div>
            </div>

            {/* Governance */}
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-1">{governanceScore}</div>
              <p className="text-sm text-gray-600 font-semibold">Governance</p>
              <Progress value={governanceScore} className="mt-2 h-2" />
              <div className="flex items-center justify-center gap-1 mt-2">
                <Factory className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-500">Compliance</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SDG Alignment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">🎯 UN Sustainable Development Goals Alignment</CardTitle>
          <CardDescription>Project contribution to global sustainability targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sdgAlignment.map((sdg, idx) => {
              const Icon = sdg.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${sdg.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{sdg.goal}</span>
                      <span className="text-sm font-bold text-gray-700">{sdg.score}%</span>
                    </div>
                    <Progress value={sdg.score} className="h-2" />
                  </div>
                  <Badge variant={sdg.score >= 80 ? 'default' : 'secondary'}>
                    {sdg.score >= 80 ? 'Strong' : sdg.score >= 60 ? 'Moderate' : 'Weak'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ESG Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">ESG Performance Radar</CardTitle>
            <CardDescription>Multi-dimensional sustainability assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={esgRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="ESG Score"
                  dataKey="score"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sustainability Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Sustainability by Project Phase</CardTitle>
            <CardDescription>ESG scores across project lifecycle</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sustainabilityTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="environmental" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="social" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="governance" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Environmental Performance Metrics
          </CardTitle>
          <CardDescription>Key sustainability indicators vs targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {environmentalMetrics.map((metric, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{metric.metric}</span>
                  <Badge variant={metric.value >= metric.target ? 'default' : 'secondary'}>
                    {metric.value >= metric.target ? '✓ Met' : '⚠ Below'}
                  </Badge>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-green-600">{metric.value}</span>
                  <span className="text-sm text-gray-500 mb-1">{metric.unit}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Current</span>
                  <span>Target: {metric.target}{metric.unit}</span>
                </div>
                <Progress value={(metric.value / metric.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Climate Impact Assessment */}
      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-600" />
            Climate Impact Assessment
          </CardTitle>
          <CardDescription>Carbon footprint and offset analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Factory className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Carbon Footprint</p>
              <p className="text-xl font-bold text-red-600">{climateImpact.carbonFootprint}</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Recycle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Carbon Offset</p>
              <p className="text-xl font-bold text-green-600">{climateImpact.carbonOffset}</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Sun className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Net Emissions</p>
              <p className="text-xl font-bold text-orange-600">{climateImpact.netEmissions}</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <TreePine className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Equivalent Impact</p>
              <p className="text-xl font-bold text-emerald-600">{climateImpact.equivalentTrees}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Green Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Badge className="bg-green-600">🏆</Badge>
            Green Certifications & Standards
          </CardTitle>
          <CardDescription>Environmental compliance and certification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">{cert.name}</p>
                  <p className="text-sm text-gray-600">{cert.level}</p>
                </div>
                <Badge
                  variant={cert.status === 'Compliant' || cert.status === 'Eligible' ? 'default' : 'secondary'}
                >
                  {cert.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* USP & Benefits */}
      <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-800">
            💡 USP: ESG Perspective in Project Evaluation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <p className="text-gray-700">
              <strong>Adds an ESG perspective to project evaluation:</strong> First-of-its-kind integration of
              sustainability scoring in government DPR analysis
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <p className="text-gray-700">
              <strong>Helps MDoNER promote green development:</strong> Incentivizes eco-friendly projects through
              transparent sustainability metrics
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <p className="text-gray-700">
              <strong>Aligns with national climate goals:</strong> Supports India's commitment to Net Zero by 2070
              and SDG targets
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <p className="text-gray-700">
              <strong>Future-ready infrastructure:</strong> Ensures projects are climate-resilient and
              environmentally sustainable
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
