import { Injectable, ForbiddenException } from '@nestjs/common';
import { Permission, Role } from '@shared/types';
import { SupplierDomainEntity } from '../supplier.entity';
import { AccessibleSupplier, SupplierStatus } from '../types';


@Injectable()
export class SupplierAccessService {
  checkSupplierPermission(
    userRoles: string[],
    requiredPermission: Permission,
    action: string
  ): void {
    // Admins have all rights
    if (userRoles.includes(Role.ADMIN)) return;

    //! нужно проверять через PermissionsService
    throw new ForbiddenException(`You don't have permission to ${action}`);
  }

  checkSupplierAccess(
    supplier: AccessibleSupplier,
    userId?: string,
    userRoles?: string[],
    action?: string
  ): void {
    //! Admins can do everything
    if (userRoles && userRoles.includes(Role.ADMIN)) return;

    // Suppliers can only manage their own profile
    if (userRoles && userRoles.includes(Role.SUPPLIER)) {
      if (supplier.userId === userId) return;
    }

    // Buyers and guests can only view active suppliers
    if (action === 'view' && supplier.isActive()) return;

    throw new ForbiddenException(`You don't have permission to ${action} this supplier`);
  }

  checkStatusPermission(status: SupplierStatus, userRoles: Role[]): void {
    const permissionMap = {
      ['approved']: Permission.SUPPLIER_APPROVE,
      ['rejected']: Permission.SUPPLIER_MANAGE,
      ['suspended']: Permission.SUPPLIER_SUSPEND,
      ['pending']: null,
    };

    const requiredPermission = permissionMap[status];
    if (requiredPermission) this.checkSupplierPermission(userRoles, requiredPermission, `change status to ${status}`);
  }

  async canSupplierSupply(supplier: SupplierDomainEntity): Promise<boolean> {
    return supplier.canSupply();
  }
}