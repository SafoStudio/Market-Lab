// Use it to type the incoming data
import { SupplierStatus, SupplierModel } from './supplier.type';

// incoming DTO
export interface CreateSupplierDto {
  userId: string;
  companyName: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  description: string;
  phone: string;
  documents: string[];
  address?: {
    country: string;
    city: string;
    street: string;
    building: string;
    postalCode?: string;
    state?: string;
    lat?: number;
    lng?: number;
  };
}

export interface UpdateSupplierDto extends Partial<Omit<CreateSupplierDto, 'userId'>> {
  status?: SupplierStatus;
}

// Outgoing DTO for a profile with email
export type SupplierProfileDto = SupplierModel & {
  email: string;
};

export type SupplierPublicDto = {
  id: string;
  companyName: string;
  address: Address;
  email: string;
  phone: string;
  // rating, number of reviews, etc.
};