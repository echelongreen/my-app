"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/app/actions/files";
import mammoth from 'mammoth';

export function FileUpload({ projectId }: { projectId: string }) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      // For PDFs, we'll just return a placeholder for now
      // as PDF text extraction requires more complex setup
      return `PDF file: ${file.name}`;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }
    throw new Error('Unsupported file type');
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      try {
        for (const file of acceptedFiles) {
          const text = await processFile(file);
          
          // Convert file to base64
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          
          await uploadFile({
            fileData: {
              name: file.name,
              type: file.type,
              size: file.size,
              base64: base64
            },
            projectId,
            text
          });
        }
        toast({
          title: "Success",
          description: "Files uploaded successfully",
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Error",
          description: "Failed to upload files",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [projectId, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <>
            <Cloud className="h-8 w-8" />
            <p className="text-sm text-gray-500">
              {isDragActive
                ? "Drop the files here"
                : "Drag & drop files here, or click to select files"}
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: PDF, DOCX
            </p>
          </>
        )}
      </div>
    </div>
  );
} 