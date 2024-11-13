"use client";

import { useState } from "react";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteFileButton } from "./delete-file-button";

type FileType = {
  id: string;
  name: string;
  size: number;
};

export function FileList({
  initialFiles,
  projectId,
}: {
  initialFiles: FileType[];
  projectId: string;
}) {
  const [files, setFiles] = useState(initialFiles);

  const handleFileDeleted = (deletedFileId: string) => {
    setFiles(files.filter(file => file.id !== deletedFileId));
  };

  if (files.length === 0) {
    return <p className="text-gray-500 mt-4">No documents uploaded</p>;
  }

  return (
    <div className="mt-4 space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
        >
          <div className="flex items-center gap-3">
            <File className="h-6 w-6 text-blue-500" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/api/files/${file.id}`}>Download</Link>
            </Button>
            <DeleteFileButton 
              fileId={file.id} 
              projectId={projectId} 
              onDelete={() => handleFileDeleted(file.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
} 