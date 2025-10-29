import { useState } from "react";
import { UploadFileRequest, UploadFileResponse, GetFileRequest, GetFileResponse } from "src/types";
import { fileService } from "src/service/fileService";

export function useFile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadFileResponse | null>(null);
  const [getFileResult, setGetFileResult] = useState<GetFileResponse | null>(null);

  // Upload file
  const uploadFile = async (fileData: UploadFileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fileService.uploadFile(fileData);
      setResult(response);
      return response;
    } catch (err: any) {
      setError(err?.message || "Upload failed");
      setResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get file (presigned url)
  const getFile = async (request: GetFileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fileService.getFile(request);
      setGetFileResult(response);
      return response;
    } catch (err: any) {
      setError(err?.message || "Get file failed");
      setGetFileResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    getFileResult,
    uploadFile,
    getFile,
  };
}