import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pause,
  Eye,
  MapPin,
  Calendar,
  User,
  FileSearch,
  TrendingUp,
  MessageSquare,
  Bot,
  PhoneCall,
  Mail,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { FileSubmission, Department } from "../types";

// Mock data for departments
const departments: Department[] = [
  {
    id: "submission",
    name: "Initial Submission",
    shortName: "SUB",
    description: "File submitted by contractor/thekedaar",
    icon: "📋",
    color: "bg-blue-500",
    avgProcessingTime: "1 day",
  },
  {
    id: "technical",
    name: "Technical Review Department",
    shortName: "TRD",
    description: "Technical feasibility and compliance review",
    icon: "🔧",
    color: "bg-purple-500",
    avgProcessingTime: "7-10 days",
  },
  {
    id: "finance",
    name: "Finance Department",
    shortName: "FIN",
    description: "Budget analysis and financial verification",
    icon: "💰",
    color: "bg-green-500",
    avgProcessingTime: "5-7 days",
  },
  {
    id: "environment",
    name: "Environmental Clearance",
    shortName: "ENV",
    description: "Environmental impact assessment",
    icon: "🌱",
    color: "bg-emerald-500",
    avgProcessingTime: "14-21 days",
  },
  {
    id: "legal",
    name: "Legal & Compliance",
    shortName: "LEG",
    description: "Legal documentation and regulatory compliance",
    icon: "⚖️",
    color: "bg-orange-500",
    avgProcessingTime: "3-5 days",
  },
  {
    id: "approval",
    name: "Final Approval Authority",
    shortName: "APP",
    description: "Final review and approval by competent authority",
    icon: "✅",
    color: "bg-red-500",
    avgProcessingTime: "2-3 days",
  },
];

// Mock data for file submissions
const mockFileSubmissions: FileSubmission[] = [
  {
    id: "DPR-2024-001",
    fileName: "Highway_Extension_Project_DPR.pdf",
    projectName: "National Highway Extension - Sector 15",
    submittedBy: "Rajesh Kumar Constructions",
    submissionDate: new Date("2024-01-15"),
    fileType: "DPR",
    currentDepartment: "environment",
    status: "on_hold",
    priority: "high",
    estimatedCompletionDate: new Date("2024-02-28"),
    totalEstimatedDays: 45,
    daysInCurrentDepartment: 18,
    budget: 15000000,
    location: "Guwahati, Assam",
    documents: ["DPR_Main.pdf", "Technical_Drawings.pdf", "Cost_Estimate.xlsx"],
    timeline: [
      {
        id: "1",
        departmentId: "submission",
        action: "File Submitted",
        performedBy: "Rajesh Kumar",
        timestamp: new Date("2024-01-15T10:00:00"),
        message: "DPR submitted with all required documents",
        status: "completed",
      },
      {
        id: "2",
        departmentId: "technical",
        action: "Technical Review Completed",
        performedBy: "Er. Amit Sharma",
        timestamp: new Date("2024-01-25T15:30:00"),
        message:
          "Technical specifications approved. Minor revisions suggested for drainage system.",
        status: "completed",
        remarks: "Drainage calculations need adjustment for monsoon capacity",
      },
      {
        id: "3",
        departmentId: "finance",
        action: "Budget Analysis Completed",
        performedBy: "CA. Priya Devi",
        timestamp: new Date("2024-02-02T11:00:00"),
        message:
          "Financial analysis completed. Budget approved with cost optimization suggestions.",
        status: "completed",
      },
      {
        id: "4",
        departmentId: "environment",
        action: "Environmental Assessment - DELAYED",
        performedBy: "Dr. Kishan Singh",
        timestamp: new Date("2024-02-05T09:00:00"),
        message:
          "Environmental impact assessment is underway. Waiting for soil and water quality reports.",
        status: "pending",
        remarks:
          "⚠️ DELAY ALERT: Exceeded 14-day SLA by 4 days. AI Agent initiated contact.",
        aiCommunication: {
          type: "call",
          timestamp: new Date("2024-02-19T14:30:00"),
          recipient: "Dr. Kishan Singh (Environmental Dept Head)",
          summary: "AI Agent called department head. Reason for delay: Awaiting wildlife clearance report from external agency. Expected completion: 3 days. Department head confirmed priority escalation.",
          status: "completed",
        },
      },
    ],
  },
  {
    id: "DPR-2024-002",
    fileName: "School_Building_Project_DPR.pdf",
    projectName: "Government High School Construction",
    submittedBy: "Assam Infrastructure Ltd.",
    submissionDate: new Date("2024-02-01"),
    fileType: "DPR",
    currentDepartment: "finance",
    status: "requires_modification",
    priority: "medium",
    estimatedCompletionDate: new Date("2024-03-15"),
    totalEstimatedDays: 35,
    daysInCurrentDepartment: 9,
    budget: 8500000,
    location: "Jorhat, Assam",
    documents: ["School_DPR.pdf", "Site_Plan.pdf", "Financial_Estimate.xlsx"],
    timeline: [
      {
        id: "1",
        departmentId: "submission",
        action: "File Submitted",
        performedBy: "Mukesh Agarwal",
        timestamp: new Date("2024-02-01T14:00:00"),
        message: "School construction DPR submitted",
        status: "completed",
      },
      {
        id: "2",
        departmentId: "technical",
        action: "Technical Review Completed",
        performedBy: "Er. Suman Das",
        timestamp: new Date("2024-02-08T16:45:00"),
        message:
          "Structural design approved. Foundation specifications meet earthquake safety standards.",
        status: "completed",
      },
      {
        id: "3",
        departmentId: "finance",
        action: "Budget Verification - Modifications Required",
        performedBy: "CA. Ravi Gupta",
        timestamp: new Date("2024-02-10T10:30:00"),
        message:
          "Material costs exceed market rates by 18%. Requires revision and resubmission with justified pricing.",
        status: "pending",
        remarks: "Cement pricing at ₹425/bag vs market rate ₹350/bag. Steel at ₹68,000/ton vs ₹58,000/ton market rate.",
        aiCommunication: {
          type: "sms",
          timestamp: new Date("2024-02-18T09:15:00"),
          recipient: "Mukesh Agarwal (Contractor)",
          summary: "SMS sent to contractor: Finance dept requires material cost revision. Current pricing 18% above market. Please resubmit with corrected BOQ within 5 days.",
          status: "delivered",
        },
      },
    ],
  },
  {
    id: "DPR-2024-003",
    fileName: "Water_Supply_System_DPR.pdf",
    projectName: "Rural Water Supply Enhancement",
    submittedBy: "Northeast Water Solutions",
    submissionDate: new Date("2024-02-10"),
    fileType: "DPR",
    currentDepartment: "approval",
    status: "approved",
    priority: "urgent",
    estimatedCompletionDate: new Date("2024-02-20"),
    totalEstimatedDays: 25,
    daysInCurrentDepartment: 0,
    budget: 12000000,
    location: "Dibrugarh, Assam",
    documents: [
      "Water_Supply_DPR.pdf",
      "Pipeline_Layout.pdf",
      "Hydraulic_Calculations.xlsx",
    ],
    timeline: [
      {
        id: "1",
        departmentId: "submission",
        action: "File Submitted",
        performedBy: "Anita Sharma",
        timestamp: new Date("2024-02-10T09:00:00"),
        message: "Rural water supply project DPR submitted",
        status: "completed",
      },
      {
        id: "2",
        departmentId: "technical",
        action: "Technical Review Completed",
        performedBy: "Er. Bhaskar Jyoti",
        timestamp: new Date("2024-02-12T12:00:00"),
        message: "Pipeline design and hydraulic calculations approved.",
        status: "completed",
      },
      {
        id: "3",
        departmentId: "finance",
        action: "Budget Analysis Completed",
        performedBy: "CA. Meera Devi",
        timestamp: new Date("2024-02-14T14:20:00"),
        message: "Budget approved. Cost-effective solution proposed.",
        status: "completed",
      },
      {
        id: "4",
        departmentId: "environment",
        action: "Environmental Clearance Granted",
        performedBy: "Dr. Rajesh Barua",
        timestamp: new Date("2024-02-16T11:15:00"),
        message:
          "Minimal environmental impact. Clearance granted with standard conditions.",
        status: "completed",
      },
      {
        id: "5",
        departmentId: "legal",
        action: "Legal Verification Completed",
        performedBy: "Adv. Pallavi Das",
        timestamp: new Date("2024-02-17T15:45:00"),
        message: "All legal documents verified. Compliance confirmed.",
        status: "completed",
      },
      {
        id: "6",
        departmentId: "approval",
        action: "Final Approval Granted",
        performedBy: "Shri. Dinesh Kumar, IAS",
        timestamp: new Date("2024-02-18T10:30:00"),
        message:
          "Project approved for implementation. Work order to be issued.",
        status: "completed",
      },
    ],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "rejected":
      return <XCircle className="w-4 h-4 text-red-600" />;
    case "under_review":
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case "requires_modification":
      return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    case "on_hold":
      return <Pause className="w-4 h-4 text-gray-600" />;
    default:
      return <FileText className="w-4 h-4 text-blue-600" />;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    approved: {
      variant: "default",
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    rejected: { variant: "destructive", className: "" },
    under_review: {
      variant: "default",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    requires_modification: {
      variant: "default",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    },
    on_hold: { variant: "secondary", className: "" },
    submitted: { variant: "outline", className: "" },
  };

  const config = variants[status] || variants.submitted;

  return (
    <Badge variant={config.variant} className={config.className}>
      {status.replace("_", " ").toUpperCase()}
    </Badge>
  );
};

const getPriorityBadge = (priority: string) => {
  const variants: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    urgent: { variant: "destructive", className: "" },
    high: {
      variant: "default",
      className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
    medium: {
      variant: "default",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
    low: { variant: "secondary", className: "" },
  };

  const config = variants[priority] || variants.medium;

  return (
    <Badge variant={config.variant} className={config.className}>
      {priority.toUpperCase()}
    </Badge>
  );
};

interface TimelineViewProps {
  file: FileSubmission;
}

const TimelineView: React.FC<TimelineViewProps> = ({ file }) => {
  const currentDeptIndex = departments.findIndex(
    (d) => d.id === file.currentDepartment
  );

  return (
    <div className="space-y-6">
      {/* File Info Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {file.projectName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">File ID: {file.id}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {file.location}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {file.submittedBy}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {file.submissionDate.toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-right">
            {getStatusBadge(file.status)}
            <div className="mt-2">{getPriorityBadge(file.priority)}</div>
          </div>
        </div>
      </div>

      {/* Modern Progress Bar Timeline */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {departments.map((dept, index) => {
            const isCompleted = file.timeline.some(
              (action) =>
                action.departmentId === dept.id && action.status === "completed"
            );
            const isPending = file.timeline.some(
              (action) =>
                action.departmentId === dept.id && action.status === "pending"
            );
            const isCurrent = dept.id === file.currentDepartment;

            return (
              <div key={dept.id} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex items-center">
                  {/* Connecting Line */}
                  {index > 0 && (
                    <div
                      className={`absolute right-1/2 w-full h-1 -z-10 ${
                        isCompleted ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      style={{ right: "50%", width: "100%" }}
                    />
                  )}
                  
                  {/* Status Circle */}
                  <div
                    className={`relative z-10 mx-auto w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                      isCompleted
                        ? "bg-blue-500 border-blue-200 shadow-lg"
                        : isPending || isCurrent
                        ? "bg-blue-400 border-blue-300 shadow-md animate-pulse"
                        : "bg-gray-200 border-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : isPending || isCurrent ? (
                      <Clock className="w-6 h-6 text-white" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Department Label */}
                <div className="mt-3 text-center">
                  <p className={`text-xs font-semibold ${
                    isCurrent ? "text-blue-700" : "text-gray-600"
                  }`}>
                    {dept.shortName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Timeline Cards */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {departments.map((dept, index) => {
          const isCompleted = file.timeline.some(
            (action) =>
              action.departmentId === dept.id && action.status === "completed"
          );
          const isPending = file.timeline.some(
            (action) =>
              action.departmentId === dept.id && action.status === "pending"
          );
          const isCurrent = dept.id === file.currentDepartment;
          const relevantAction = file.timeline.find(
            (action) => action.departmentId === dept.id
          );

          return (
            <div key={dept.id} className="relative flex items-start mb-8">
              {/* Timeline dot */}
              <div
                className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                  isCompleted
                    ? "bg-green-500 border-green-200"
                    : isPending || isCurrent
                    ? "bg-yellow-500 border-yellow-200"
                    : "bg-gray-300 border-gray-200"
                }`}
              >
                <span className="text-2xl">{dept.icon}</span>
              </div>

              {/* Content */}
              <div className="ml-6 flex-1">
                <Card
                  className={`transition-all duration-200 ${
                    isCurrent
                      ? "ring-2 ring-blue-500 shadow-lg"
                      : "hover:shadow-md"
                  }`}
                >
                  <CardHeader
                    className={`pb-3 ${isCurrent ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{dept.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {dept.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Avg: {dept.avgProcessingTime}
                        </div>
                        {isCurrent && (
                          <Badge variant="outline" className="mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            Day {file.daysInCurrentDepartment}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {relevantAction && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {relevantAction.action}
                          </span>
                          <span className="text-xs text-gray-500">
                            {relevantAction.timestamp.toLocaleDateString()}{" "}
                            {relevantAction.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {relevantAction.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          {relevantAction.performedBy}
                        </div>
                        {relevantAction.remarks && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                            <strong>Remarks:</strong> {relevantAction.remarks}
                          </div>
                        )}
                        {relevantAction.aiCommunication && (
                          <div className="mt-3 p-3 bg-purple-50 border-2 border-purple-200 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <Bot className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-purple-900 text-sm">
                                    AI Communication Agent
                                  </span>
                                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                                    {relevantAction.aiCommunication.type === 'call' && (
                                      <><PhoneCall className="w-3 h-3 mr-1" />Call</>
                                    )}
                                    {relevantAction.aiCommunication.type === 'sms' && (
                                      <><MessageSquare className="w-3 h-3 mr-1" />SMS</>
                                    )}
                                    {relevantAction.aiCommunication.type === 'email' && (
                                      <><Mail className="w-3 h-3 mr-1" />Email</>
                                    )}
                                  </Badge>
                                </div>
                                <p className="text-xs text-purple-800 mb-1">
                                  <strong>To:</strong> {relevantAction.aiCommunication.recipient}
                                </p>
                                <p className="text-xs text-purple-800 mb-1">
                                  <strong>Time:</strong> {relevantAction.aiCommunication.timestamp.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                                  {relevantAction.aiCommunication.summary}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}

                  {!relevantAction && index <= currentDeptIndex && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-500 italic">
                        {index < currentDeptIndex
                          ? "Pending review"
                          : "Awaiting submission to this department"}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FileTrackingSystem: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileSubmission | null>(null);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileSearch className="w-6 h-6 text-blue-600" />
              File Tracking System
            </CardTitle>
            <CardDescription>
              Track your submitted files through the government approval process
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Files Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              My Submitted Files
            </CardTitle>
            <CardDescription>
              All files submitted by your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Department</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFileSubmissions.map((file) => {
                  const progressPercentage =
                    (file.timeline.filter((t) => t.status === "completed")
                      .length /
                      departments.length) *
                    100;

                  return (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{file.projectName}</div>
                          <div className="text-sm text-gray-500">{file.id}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {file.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          {getStatusBadge(file.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {
                            departments.find(
                              (d) => d.id === file.currentDepartment
                            )?.shortName
                          }
                          <div className="text-xs text-gray-500">
                            Day {file.daysInCurrentDepartment}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(file.priority)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>
                              {Math.round(progressPercentage)}% Complete
                            </span>
                            <span>
                              {
                                file.timeline.filter(
                                  (t) => t.status === "completed"
                                ).length
                              }
                              /{departments.length}
                            </span>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedFile(file)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Timeline
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                File Timeline - {file.projectName}
                              </DialogTitle>
                              <DialogDescription>
                                Track the progress of your file through
                                different departments
                              </DialogDescription>
                            </DialogHeader>
                            {selectedFile && (
                              <TimelineView file={selectedFile} />
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockFileSubmissions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  mockFileSubmissions.filter((f) => f.status === "approved")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">33% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Under Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {
                  mockFileSubmissions.filter((f) => f.status === "under_review")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">67% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32 days</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                -5 days vs avg
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FileTrackingSystem;
