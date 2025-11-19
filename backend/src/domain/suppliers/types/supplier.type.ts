// Use only within the domain, internal typing..
import { Entity } from '@shared/interfaces/entity.interface';

export type SupplierStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface SupplierModel extends Entity {
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  documents?: string;
  status: SupplierStatus;
}