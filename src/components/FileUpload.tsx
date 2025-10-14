import { useCallback, useState } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        simulateUpload(file);
      }
    },
    [onFileSelect]
  );

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileSelect(file);
          return 100;
        }
        return prev + 10;
      });
    }, 50);
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      const file = event.dataTransfer.files?.[0];
      if (file && !disabled) {
        simulateUpload(file);
      }
    },
    [onFileSelect, disabled]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  const removeFile = () => {
    onFileSelect(null as any);
    setUploadProgress(0);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "docx":
      case "doc":
        return "📝";
      case "txt":
        return "📄";
      default:
        return "📄";
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {!selectedFile && (
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
            id="file-upload"
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-in-out
              ${
                isDragOver
                  ? "border-blue-400 bg-blue-50 scale-[1.02] shadow-lg"
                  : disabled
                  ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-60"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 cursor-pointer"
              }
            `}
          >
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div
                className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300
                ${
                  isDragOver
                    ? "bg-blue-100 text-blue-600 scale-110"
                    : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"
                }
              `}
              >
                <Upload
                  className={`w-8 h-8 transition-transform duration-300 ${
                    isDragOver ? "scale-110" : ""
                  }`}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {isDragOver ? "Drop your file here" : "Upload DPR Document"}
                </h3>
                <p className="text-sm text-gray-600">
                  {isDragOver
                    ? "Release to upload your document"
                    : "Drag and drop your file here, or click to browse"}
                </p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    PDF
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    DOCX
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    TXT
                  </div>
                </div>
              </div>

              {!isDragOver && (
                <Button
                  variant="outline"
                  className="mt-4 px-6 py-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                  disabled={disabled}
                >
                  Choose File
                </Button>
              )}
            </label>
          </div>
        </div>
      )}

      {isUploading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Uploading document...
                </p>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-blue-700 mt-1">
                  {uploadProgress}% complete
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFile && !isUploading && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-2xl">
                {getFileIcon(selectedFile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-green-900 truncate">
                    File uploaded successfully
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-gray-600">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <div className="flex items-center gap-1">
                    {selectedFile.size > 10 * 1024 * 1024 && (
                      <>
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-amber-600">
                          Large file
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full p-2"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
