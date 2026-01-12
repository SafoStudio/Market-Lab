import { z } from 'zod';
import { addressSchema } from './address-schemas';

// Customer profile registration step
export const customerRegistrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]{10,}$/, 'Invalid phone number'),
  address: addressSchema,
  birthDate: z.date().optional(),
});

// Customer profile update/edit
export const customerProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]{10,}$/, 'Invalid phone number'),
  email: z.string().min(1, 'Email is required').pipe(z.email('Invalid email address')),
  address: addressSchema,
  birthDate: z.date().optional(),
});


export type CustomerRegistrationFormData = z.infer<typeof customerRegistrationSchema>;
export type CustomerProfileFormData = z.infer<typeof customerProfileSchema>;