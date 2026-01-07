// Use it to type the incoming data
import { AdminStatus } from "./admin.type";
import { Role } from '@shared/types';

export interface CreateAdminDto {
  email?: string;
  password?: string;

  userId: string;
  firstName: string;
  lastName: string;
  phone: string,
  roles: Role[];
  address?: {
    country?: string;
    city?: string;
    street?: string;
    building?: string;
    postalCode?: string;
    state?: string;
    lat?: number;
    lng?: number;
  };
  department?: string;
}

export interface UpdateAdminDto extends Partial<CreateAdminDto> {
  status?: AdminStatus;
  lastActiveAt?: Date;
}