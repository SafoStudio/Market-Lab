import { z } from 'zod';
import { ADMIN_ROLES } from '@/core/types/adminTypes';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').pipe(z.email('Enter a valid email address')),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').pipe(z.email('Enter a valid email address')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const adminCreateSchema = z.object({
  email: z.string().min(1, 'Email is required').pipe(z.email('Enter a valid email address')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required'),
  role: z.enum([ADMIN_ROLES.ADMIN, ADMIN_ROLES.MODERATOR, ADMIN_ROLES.SUPPORT]),
  department: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().pipe(z.email('Enter a valid email address')),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AdminCreateFormData = z.infer<typeof adminCreateSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;