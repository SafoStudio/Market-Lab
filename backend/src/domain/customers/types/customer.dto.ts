// Use it to type the incoming data
import { CustomerAddress, CustomerStatus } from "./customer.type";

export interface CreateCustomerDto {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthday: string | null;
  address?: CustomerAddress;
}

export interface UpdateCustomerDto extends Partial<Omit<CreateCustomerDto, 'userId'>> {
  status?: CustomerStatus;
}