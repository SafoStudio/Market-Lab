import {
  CustomerProfileFormData,
  SupplierProfileFormData
} from '@/core/schemas/auth-schemas';

// Type for partial default values (all fields are optional)
export type PartialCustomerProfileFormData = Partial<CustomerProfileFormData> & {
  address?: Partial<CustomerProfileFormData['address']>;
};

export type PartialSupplierProfileFormData = Partial<SupplierProfileFormData> & {
  address?: Partial<SupplierProfileFormData['address']>;
};

// Helpers for creating default values
export const getCustomerDefaultValues = (): PartialCustomerProfileFormData => ({
  firstName: '',
  lastName: '',
  phone: '',
  address: {
    country: '',
    city: '',
    street: '',
    building: '',
    postalCode: '',
    state: '',
  },
  birthDate: undefined,
});

export const getSupplierDefaultValues = (): PartialSupplierProfileFormData => ({
  firstName: '',
  lastName: '',
  phone: '',
  address: {
    country: '',
    city: '',
    street: '',
    building: '',
    postalCode: '',
    state: '',
  },
  companyName: '',
  description: '',
  registrationNumber: '',
  documents: [],
});