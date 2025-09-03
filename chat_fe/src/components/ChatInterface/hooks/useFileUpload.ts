import { useState } from 'react';

const useFileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (file: File): boolean => {
    setError(null);
    if (file.size > 5 * 1024) {
      setError('File exceeds 5KB.');
      setUploadedFile(null);
      setFileContent(null);
      return false; // indicate rejection so caller can clear input element
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      setUploadedFile(file);
    };
    reader.onerror = () => {
      setError('Could not read file. Please try again.');
      setUploadedFile(null);
      setFileContent(null);
    };
    reader.readAsText(file);

    return true;
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setFileContent(null);
  };

  return { uploadedFile, fileContent, error, handleFileUpload, removeUploadedFile };
};

export default useFileUpload;
