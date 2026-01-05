// Use it to type the incoming data
import { SupplierStatus, SupplierModel } from './supplier.type';
import { Address } from '@shared/types';

// incoming DTO
export interface CreateSupplierDto {
  userId: string;
  companyName: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  description: string;
  address: Address;
  phone: string;
  documents: string[];
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