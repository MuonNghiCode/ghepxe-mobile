import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Vui lòng nhập tên đăng nhập!")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự!")
    .max(50, "Tên đăng nhập không được quá 50 ký tự!")
    .regex(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới!"),
  
  email: z
    .string()
    .min(1, "Vui lòng nhập email!")
    .email("Email không hợp lệ!")
    .max(100, "Email không được quá 100 ký tự!"),
  
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu!")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự!")
    .max(50, "Mật khẩu không được quá 50 ký tự!"),
  
  confirmPassword: z
    .string()
    .min(1, "Vui lòng xác nhận mật khẩu!"),
    
  acceptPolicy: z
    .boolean()
    .refine((val) => val === true, "Vui lòng chấp nhận chính sách điều khoản!")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp!",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email hoặc tên đăng nhập!")
    .max(100, "Email/Username quá dài!"),
  
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu!")
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;