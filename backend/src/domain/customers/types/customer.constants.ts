export const CUSTOMER_DEFAULTS: { IS_ACTIVE: boolean; ROLES: ['customer' | 'supplier'] } = {
  IS_ACTIVE: true,
  ROLES: ['customer'],
};

export const CUSTOMER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;