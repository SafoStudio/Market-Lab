import { Entity } from "@shared/types"

export interface AddressModel extends Entity {
  entityId: string;
  entityType: 'supplier' | 'customer';
  country: string,
  city: string,
  street: string,
  building: string,
  postalCode?: string,
  state?: string,
  lat?: number,
  lng?: number,
  isPrimary: boolean
}