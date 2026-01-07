// Use it to type the incoming data
import { CustomerStatus } from "./customer.type";

export interface CreateCustomerDto {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthday?: string;
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

export interface UpdateCustomerDto extends Partial<Omit<CreateCustomerDto, 'userId'>> {
  status?: CustomerStatus;
}