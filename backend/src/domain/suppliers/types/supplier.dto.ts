// Use it to type the incoming data
import { SupplierStatus } from './supplier.type';

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