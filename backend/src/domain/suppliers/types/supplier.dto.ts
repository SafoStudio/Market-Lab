// Use it to type the incoming data
import type { SupplierStatus } from './supplier.type';

export interface CreateSupplierDto {
  name: string;
  phone?: string;
  documents?: string;
}

export interface UpdateSupplierDto {
  name?: string;
  phone?: string;
  documents?: string;
  status?: SupplierStatus;
}