import { z } from 'zod';

export const shipRequestSchema = z.object({
  goodsType: z.enum(['private', 'personal'], {
    errorMap: () => ({ message: 'Vui lòng chọn loại hàng hóa' })
  }),
  driverNote: z.string().optional(),
  pickupLocation: z.object({
    fullAddress: z.string().min(1, 'Vui lòng nhập địa chỉ lấy hàng'),
    street: z.string(),
    ward: z.string(),
    district: z.string(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
    country: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    receiverName: z.string().optional(),
    receiverPhone: z.string().optional(),
    note: z.string().optional(),
  }).nullable().refine(val => val !== null, 'Vui lòng chọn địa chỉ lấy hàng'),
  dropoffLocation: z.object({
    fullAddress: z.string().min(1, 'Vui lòng nhập địa chỉ giao hàng'),
    street: z.string(),
    ward: z.string(),
    district: z.string(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
    country: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    receiverName: z.string().optional(),
    receiverPhone: z.string().optional(),
    note: z.string().optional(),
  }).nullable().refine(val => val !== null, 'Vui lòng chọn địa chỉ giao hàng'),
});

export type ShipRequestFormData = z.infer<typeof shipRequestSchema>;