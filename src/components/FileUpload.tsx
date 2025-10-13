import { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
            ? 'border-muted-foreground/25 bg-muted cursor-not-allowed'
            : 'border-primary/50 bg-background hover:bg-muted/50 cursor-pointer'
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
          <Upload className="w-12 h-12 text-primary mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">
            {selectedFile ? 'File Selected' : 'Upload DPR Document'}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports PDF, DOCX, and TXT files
          </p>
        </label>
      </div>

      {selectedFile && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
