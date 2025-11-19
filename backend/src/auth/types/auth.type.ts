export type Role = 'customer' | 'supplier' | 'admin';

export interface UserPayload {
  id: string;
  email: string;
  roles: Role[];
}

export interface SessionUser extends UserPayload {
  name?: string;
  permissions?: string[];
}

export interface ValidateUserResponse {
  success: boolean;
  message?: string;
  payload?: UserPayload;
}

export interface AuthRequest extends Request {
  user: SessionUser;
}
