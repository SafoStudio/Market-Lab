export const ROLES = {
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier',
  ADMIN: 'admin'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  GOOGLE: 'google',
  FACEBOOK: 'facebook'
} as const;

export type AuthProvider = typeof AUTH_PROVIDERS[keyof typeof AUTH_PROVIDERS];

export interface UserPayload {
  id: string;
  email: string;
  roles: Role[];
  regComplete: boolean;
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

