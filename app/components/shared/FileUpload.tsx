import { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { cn } from '~/lib/cn';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export function FileUpload({
  accept = '.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB
  onFileSelect,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    if (maxSize && file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  }, [maxSize, onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onFileSelect(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <div className={className}>
      {selectedFile ? (
        <div className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
          <File className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span>
            {' '}or drag and drop
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            PDF or DOC up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

