import { z } from 'zod';
import { addressSchema } from './address-schemas';

// Supplier profile registration step
export const supplierRegistrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]{10,}$/, 'Invalid phone number'),
  address: addressSchema,
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  registrationNumber: z.string().min(5, 'Registration number is required'),
  documents: z.array(z.instanceof(File)).min(1, 'At least one document is required'),
});

// Supplier profile update/edit
export const supplierProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  email: z.string().min(1, 'Email is required').pipe(z.email('Invalid email address')),
  description: z.string().optional(),
  address: addressSchema,
});


export type SupplierRegistrationFormData = z.infer<typeof supplierRegistrationSchema>;
export type SupplierProfileFormData = z.infer<typeof supplierProfileSchema>;
