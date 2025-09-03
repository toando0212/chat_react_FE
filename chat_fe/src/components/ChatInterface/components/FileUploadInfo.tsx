import React from 'react';

interface FileUploadInfoProps {
  uploadedFile: File | null;
  onFileRemove: () => void;
}

const FileUploadInfo: React.FC<FileUploadInfoProps> = ({ uploadedFile, onFileRemove }) => {
  if (!uploadedFile) return null;

  return (
    <div className="file-upload-info">
      <span>{uploadedFile.name}</span>
      <button onClick={onFileRemove}>×</button>
    </div>
  );
};

export default FileUploadInfo;
