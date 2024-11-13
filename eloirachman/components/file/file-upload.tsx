"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/app/actions/files";
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function FileUpload({ projectId }: { projectId: string }) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ');
      }
      return text;
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
              base64,
            },
            projectId,
            text,
          });
        }
        toast({
          title: "Success",
          description: "Files uploaded successfully",
        });
        window.location.reload();
      } catch (error) {
        console.error("Upload error:", error);
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
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {uploading ? (
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        ) : (
          <Cloud className="h-10 w-10 text-gray-500" />
        )}
        <div className="text-gray-600">
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
        <div className="text-xs text-gray-500">
          PDF, DOCX up to 10MB
        </div>
      </div>
    </div>
  );
} 