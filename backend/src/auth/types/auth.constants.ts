export const ROLES = {
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier',
  ADMIN: 'admin'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];