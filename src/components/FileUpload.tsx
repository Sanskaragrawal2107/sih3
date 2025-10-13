import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

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
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          disabled
            ? 'border-gray-600 bg-gray-800 cursor-not-allowed'
            : 'border-blue-500 bg-gray-900 hover:bg-gray-800 cursor-pointer'
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <Upload className="w-12 h-12 text-blue-400 mb-4" />
          <p className="text-lg font-semibold text-gray-200 mb-2">
            {selectedFile ? 'File Selected' : 'Upload DPR Document'}
          </p>
          <p className="text-sm text-gray-400">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports PDF, DOCX, and TXT files
          </p>
        </label>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-200">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-400">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
