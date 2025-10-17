import { z } from 'zod';

export const shipRequestSchema = z.object({
  selectedSize: z.string().min(1, 'Vui lòng chọn kích cỡ hàng hóa'),
  weightRaw: z.string().min(1, 'Vui lòng nhập khối lượng hàng hóa'),
  weight: z.number().positive('Khối lượng phải lớn hơn 0'),
  selectedCategory: z.string().min(1, 'Vui lòng chọn loại hàng hóa'),
  otherCategory: z.string().optional(),
  goodsType: z.enum(['private', 'personal'], {
    errorMap: () => ({ message: 'Vui lòng chọn loại hàng hóa' })
  }),
  driverNote: z.string().optional(),
  pickupLocation: z.object({
    fullAddress: z.string().min(1, 'Vui lòng nhập địa chỉ lấy hàng'),
    receiverName: z.string().optional(),
    receiverPhone: z.string().optional(),
    street: z.string(),
    ward: z.string(),
    district: z.string(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
    country: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }).nullable().refine(val => val !== null, 'Vui lòng chọn địa chỉ lấy hàng'),
  dropoffLocation: z.object({
    fullAddress: z.string().min(1, 'Vui lòng nhập địa chỉ giao hàng'),
    receiverName: z.string().optional(),
    receiverPhone: z.string().optional(),
    street: z.string(),
    ward: z.string(),
    district: z.string(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
    country: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }).nullable().refine(val => val !== null, 'Vui lòng chọn địa chỉ giao hàng'),
}).refine(
  (data) => {
    if (data.selectedCategory === 'Khác') {
      return data.otherCategory && data.otherCategory.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Vui lòng nhập loại hàng hóa khác',
    path: ['otherCategory']
  }
);

export type ShipRequestFormData = z.infer<typeof shipRequestSchema>;