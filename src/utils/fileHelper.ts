import { fileService } from "src/service/fileService";

export async function getImageUrlFromFileId(fileId: string): Promise<string | null> {
  try {
    const response = await fileService.getFile({ fileId });
    if (response?.isSuccess && response.value?.presignedUrl) {
      return response.value.presignedUrl;
    }
    return null;
  } catch (error) {
    console.error("Error getting image URL:", error);
    return null;
  }
}