export interface Product {
  id: string;
  name: string;
  size: string;
  weight: string;
  imageUri?: string;
  imageFileId?: string; // Thêm trường này
  imageUrl?: string;    // URL sau khi upload
}