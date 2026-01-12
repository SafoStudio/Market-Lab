import {
  CustomerRegistrationFormData, CustomerProfileFormData,
  SupplierRegistrationFormData, SupplierProfileFormData
} from '@/core/schemas';


export const getCustomerRegistrationDefaultValues = (): Partial<CustomerRegistrationFormData> => ({
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

export const getCustomerProfileDefaultValues = (): Partial<CustomerProfileFormData> => ({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
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

export const getSupplierRegistrationDefaultValues = (): Partial<SupplierRegistrationFormData> => ({
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

export const getSupplierProfileDefaultValues = (): Partial<SupplierProfileFormData> => ({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
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
});