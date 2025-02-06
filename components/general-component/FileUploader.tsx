import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {}, []);
  console.log(files);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {/* <p>Drag 'n' drop some files here, or click to select files</p> */}
    </div>
  );
};

export default FileUploader;
