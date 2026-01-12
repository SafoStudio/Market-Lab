import { z } from 'zod';

export const addressSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  street: z.string().min(1, 'Street is required'),
  building: z.string().min(1, 'Building number is required'),
  postalCode: z.string().optional(),
  state: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;