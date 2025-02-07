"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";
import { cn, getFileIcon, getFileType, Max_File_Size } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { uploadFiles } from "@/lib/appwrite/actions/file.action";
import { usePathname } from "next/navigation";

const FileUploader = ({
  ownerId,
  accountId,
  className,
}: {
  ownerId: string;
  accountId: string;
  className?: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const pathname = usePathname();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > Max_File_Size()) {
          setFiles((prev) => prev.filter((fil) => fil.name !== file.name));

          toast({
            variant: "destructive",
            description: (
              <p className="body-2 bg-red-500">
                <span className="text-white font-semibold">{file.name}</span>{" "}
                seems to be too big! The maximum file size is 50MB.
              </p>
            ),
          });

          return null; // Stop processing this file
        }

        try {
          const fileResult = await uploadFiles({
            file,
            accountId,
            ownerId,
            path: pathname,
          });

          if (fileResult) {
            setFiles((prev) => prev.filter((fil) => fil.name !== file.name));
          }
        } catch (error) {
          console.error("File upload failed:", error);
          toast({
            variant: "destructive",
            description: `Failed to upload ${file.name}. Please try again.`,
          });
        }
      });

      await Promise.all(uploadPromises); // Wait for all uploads to complete
    },
    [accountId, ownerId, pathname]
  ); // Added dependencies

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleCancelUpload = ({
    e,
    file,
  }: {
    e: React.MouseEvent<HTMLSpanElement>;
    file: File;
  }) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((fil) => fil.name !== file.name));
  };

  return (
    <div {...getRootProps()} className=" flex justify-center items-center">
      <input {...getInputProps()} />

      {/* <p>Drag 'n' drop some files here, or click to select files</p> */}
      <Button className={cn("uploader-button active:scale-95", className)}>
        <span className="p-2 text-brand bg-light-400 rounded-full font-bold w-full lg:w-fit">
          <Upload />
        </span>
        <span>Upload</span>
      </Button>

      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading files</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="w-full flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={getFileIcon(extension, type)}
                  />
                  <div className="preview-item-name w-full">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="loading..."
                      width={80}
                      height={26}
                      className="mt-2"
                    />
                  </div>
                  <span
                    className="p-1 text-white bg-gray-300 hover:bg-gray-400 rounded-full cursor-pointer"
                    onClick={(e) => handleCancelUpload({ e, file })}
                  >
                    <X size={16} />
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
