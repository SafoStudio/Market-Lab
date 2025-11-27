// Use it to type the incoming data
import { AdminRole, AdminPermissions, AdminStatus } from "./admin.type";

export interface CreateAdminDto {
  userId: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  department?: string;
  permissions?: Partial<AdminPermissions>;
}

export interface UpdateAdminDto {
  firstName?: string;
  lastName?: string;
  role?: AdminRole;
  status?: AdminStatus;
  department?: string;
  permissions?: Partial<AdminPermissions>;
  lastActiveAt?: Date;
}