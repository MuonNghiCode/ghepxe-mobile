import { BaseApiService } from "src/api";
import { API_ENDPOINTS } from "src/constants";
import {
  GetFileRequest,
  GetFileResponse,
  GetFileResponseData,
  UploadFileRequest,
  UploadFileResponse,
  UploadFileResponseData,
} from "src/types";

class FileService extends BaseApiService {
  async uploadFile(fileData: UploadFileRequest): Promise<UploadFileResponse> {
    // Tạo FormData
    const formData = new FormData();
    formData.append("file", {
      uri: fileData.file.uri,
      name: fileData.file.name,
      type: fileData.file.type,
    } as any);

    // Gửi FormData với header multipart/form-data
    const response = await this.api.post<UploadFileResponse>(
      API_ENDPOINTS.FILE.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async getFile(request: GetFileRequest): Promise<GetFileResponse> {
    const { fileId, expirationMinutes = 2880 } = request;
    const url = `${API_ENDPOINTS.FILE.GET_FILE.replace("{fileId}", fileId)}?expirationMinutes=${expirationMinutes}`;
    return this.get<GetFileResponseData>(url);
  }
}

export const fileService = new FileService();