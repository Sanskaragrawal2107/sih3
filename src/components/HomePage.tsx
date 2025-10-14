import React from "react";
import {
  ArrowRight,
  Shield,
  BarChart3,
  FileCheck,
  Bot,
  Clock,
  Eye,
  Phone,
  MessageSquare,
  AlertCircle,
  Target,
  Users,
  Globe,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HomePageProps {
  onNavigateToDashboard: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToDashboard }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  className="w-8 h-8"
                />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Smart India Hackathon 2025</h2>
                <p className="text-xs text-gray-600">DPR Transparency & Tracking System</p>
              </div>
            </div>
            <Button
              onClick={onNavigateToDashboard}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              View Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - SIH Project Style */}
      <div className="relative pt-24 pb-16 px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Project Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 mb-4">
                <span className="text-xs font-semibold text-orange-700">SIH 2025 Problem Statement</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                DPR Transparency & Real-Time Tracking System
              </h1>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                An AI-powered solution to eliminate file delays, ensure accountability, and bring complete transparency to government project approvals.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Real-Time File Tracking</p>
                    <p className="text-sm text-gray-600">Visual timeline showing exact location of every DPR</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">AI Communication Agent</p>
                    <p className="text-sm text-gray-600">Automated calls/SMS to prevent delays</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Fraud Detection</p>
                    <p className="text-sm text-gray-600">AI analyzes material costs vs market rates</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={onNavigateToDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                Explore Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Right: Problem Statement */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Problem Statement</h3>
                  <p className="text-sm text-gray-600">Ministry of Development - NER</p>
                </div>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  <strong>Current Challenge:</strong> DPRs (Detailed Project Reports) get lost in bureaucratic processes with zero visibility and accountability.
                </p>
                <p className="leading-relaxed">
                  <strong>Impact:</strong> Projects worth crores face months of delays. Contractors have no idea where their files are stuck.
                </p>
                <p className="leading-relaxed">
                  <strong>Our Solution:</strong> Real-time tracking with AI-powered communication that automatically escalates delays and ensures transparency.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">6</div>
                    <div className="text-xs text-gray-600">Departments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-xs text-gray-600">Visibility</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">AI</div>
                    <div className="text-xs text-gray-600">Powered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Architecture
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built with modern tech stack for scalability, security, and real-time performance
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• React + TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• shadcn/ui</li>
                  <li>• Real-time updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">AI/ML</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Gemini AI API</li>
                  <li>• NLP for analysis</li>
                  <li>• Fraud detection</li>
                  <li>• Price verification</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Twilio API</li>
                  <li>• SMS/Voice calls</li>
                  <li>• WhatsApp integration</li>
                  <li>• Email notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Node.js/Express</li>
                  <li>• PostgreSQL</li>
                  <li>• WebSocket</li>
                  <li>• RESTful APIs</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Core Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Three pillars of our solution: Track, Communicate, Analyze
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Feature 1: Real-Time Tracking */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl mb-2">Live Tracking</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Watch your DPR move through departments in real-time. No more guessing games.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-700">Stage-by-stage visualization</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-700">Instant status notifications</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-700">Predicted completion dates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature 2: AI Communication Agent */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl mb-2">AI Agent</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Your 24/7 assistant that never lets delays happen. Calls, texts, escalates—automatically.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Auto-calls delayed departments</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Smart SMS reminders</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <FileCheck className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Transcribed call summaries</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature 3: Intelligent Analysis */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl mb-2">Fraud Detection</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    AI catches inflated costs and suspicious patterns before they become problems.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Real-time price verification</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Anomaly detection alerts</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Compliance scoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transparency Timeline Showcase */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 md:p-16 border border-gray-200">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 mb-6">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">The Game Changer</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Transparency Timeline
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  with Smart AI Agent
                </span>
              </h2>
              <p className="text-2xl text-gray-700 font-medium">
                "No More Lost Files — Real-Time Accountability at Every Step"
              </p>
            </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Visual Representation */}
            <div className="space-y-6">
              <div className="relative">
                {/* Timeline Steps */}
                <div className="space-y-4">
                  {[
                    { label: "Submission", status: "completed", color: "bg-green-500" },
                    { label: "Technical Review", status: "completed", color: "bg-green-500" },
                    { label: "Finance Dept", status: "active", color: "bg-blue-500" },
                    { label: "Environmental", status: "pending", color: "bg-gray-300" },
                    { label: "Legal Review", status: "pending", color: "bg-gray-300" },
                    { label: "Final Approval", status: "pending", color: "bg-gray-300" },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${step.color} flex-shrink-0`} />
                      <div className="flex-1">
                        <div className={`h-3 rounded-full ${step.color} transition-all`} 
                             style={{ width: step.status === 'completed' ? '100%' : step.status === 'active' ? '60%' : '0%' }} />
                      </div>
                      <span className={`text-sm font-medium ${step.status === 'active' ? 'text-blue-700' : 'text-gray-600'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Agent Alert */}
              <div className="mt-8 p-5 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Bot className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">
                      AI Agent Detected Delay
                    </p>
                    <p className="text-sm text-amber-800">
                      Finance Dept exceeded 7-day SLA. Automated call initiated to
                      department head. Call summary available on dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Key Benefits */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Complete Visibility
                  </h3>
                  <p className="text-sm text-gray-600">
                    Each DPR's approval journey is visually tracked with a stage-wise
                    timeline showing exactly where files are held up
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Automated Escalation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Autonomous communication agent automatically calls or messages
                    concerned departments if delays occur
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-green-50 rounded-xl border border-green-200">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    AI Call Summaries
                  </h3>
                  <p className="text-sm text-gray-600">
                    Generates AI-transcribed call summaries displayed directly on
                    project dashboard for full transparency
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Clear Accountability
                  </h3>
                  <p className="text-sm text-gray-600">
                    Provides real-time clarity on "who, where, and why" delays happen
                    — ensuring transparent governance
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Project Impact */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Expected Impact
            </h2>
            <p className="text-lg text-blue-100">
              Measurable improvements in government project management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">85%</div>
              <div className="text-blue-100 font-medium mb-2">Faster Approvals</div>
              <div className="text-sm text-blue-200">Reduce average processing time from 45 to 7 days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100 font-medium mb-2">Transparency</div>
              <div className="text-sm text-blue-200">Complete visibility into every stage of approval</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">₹Cr+</div>
              <div className="text-blue-100 font-medium mb-2">Fraud Prevention</div>
              <div className="text-sm text-blue-200">AI detects inflated costs and suspicious patterns</div>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={onNavigateToDashboard}
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-lg font-semibold shadow-xl"
            >
              Explore Working Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-3">Project Info</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Smart India Hackathon 2025 submission for Ministry of Development of North Eastern Region (MDoNER)
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Technology Stack</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>React + TypeScript</li>
                <li>Gemini AI API</li>
                <li>Twilio Communication</li>
                <li>Real-time WebSocket</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Team</h3>
              <p className="text-sm text-gray-400">
                Built by passionate developers committed to solving real government challenges
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-semibold">Government of India | भारत सरकार</span>
            </div>
            <p className="text-xs text-gray-500">
              SIH 2024 - DPR Transparency & Tracking System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
