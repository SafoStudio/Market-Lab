import { Injectable, Inject } from '@nestjs/common';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SupplierDomainEntity } from '../supplier.entity';
import { SupplierRepository } from '../supplier.repository';

import { UserRepository } from '@domain/users/user.repository';
import { AddressService } from '@domain/addresses/address.service';
import { AddressResponseDto } from '@domain/addresses/types/address.dto';

import {
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierProfileDto,
  SupplierPublicDto,
  SupplierStatus
} from '../types';


@Injectable()
export class SupplierCoreService {
  constructor(
    @Inject('SupplierRepository')
    protected readonly supplierRepository: SupplierRepository,

    @Inject('UserRepository')
    protected readonly userRepository: UserRepository,

    protected readonly addressService: AddressService,
  ) { }

  async create(createDto: CreateSupplierDto): Promise<SupplierDomainEntity> {
    // Check if the profile already exists
    const existingByUserId = await this.supplierRepository.findByUserId(createDto.userId);
    if (existingByUserId) {
      throw new ConflictException('Supplier profile already exists for this user');
    }

    const existingByRegNumber = await this.supplierRepository.findByRegistrationNumber(createDto.registrationNumber);
    if (existingByRegNumber) {
      throw new ConflictException('Supplier with this registration number already exists');
    }

    const supplier = SupplierDomainEntity.create(createDto);
    const savedSupplier = await this.supplierRepository.create(supplier);

    if (createDto.address) {
      await this.addressService.createAddress({
        entityId: savedSupplier.id,
        entityType: 'supplier',
        country: createDto.address.country,
        city: createDto.address.city,
        street: createDto.address.street,
        building: createDto.address.building,
        postalCode: createDto.address.postalCode,
        state: createDto.address.state,
        lat: createDto.address.lat,
        lng: createDto.address.lng,
        isPrimary: true,
      });
    }

    return savedSupplier;
  }

  async findById(id: string): Promise<SupplierDomainEntity> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async findByUserId(userId: string): Promise<SupplierProfileDto> {
    const supplier = await this.supplierRepository.findByUserId(userId);
    const user = await this.userRepository.findById(userId);
    if (!supplier || !user) throw new NotFoundException('Supplier not found');

    const primaryAddress = await this.addressService.getPrimaryAddress(supplier.id, 'supplier');
    const addresses = await this.addressService.getEntityAddresses(supplier.id, 'supplier');

    const supplierDto: SupplierProfileDto = {
      id: supplier.id,
      userId: supplier.userId,
      companyName: supplier.companyName,
      firstName: supplier.firstName,
      lastName: supplier.lastName,
      registrationNumber: supplier.registrationNumber,
      phone: supplier.phone,
      documents: supplier.documents,
      status: supplier.status,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,

      email: user.email,
      primaryAddress: primaryAddress ? this._mapAddressToResponse(primaryAddress) : null,
      addresses: addresses.map(addr => this._mapAddressToResponse(addr)),
      description: supplier.description,

      isActive: () => supplier.status === SupplierStatus.APPROVED
    };

    return supplierDto;
  }

  async update(id: string, updateDto: UpdateSupplierDto): Promise<SupplierDomainEntity> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    supplier.update(updateDto);

    const updated = await this.supplierRepository.update(id, {
      companyName: supplier.companyName,
      registrationNumber: supplier.registrationNumber,
      phone: supplier.phone,
      firstName: supplier.firstName,
      lastName: supplier.lastName,
      description: supplier.description,
      documents: supplier.documents,
      status: supplier.status,
      updatedAt: supplier.updatedAt
    });

    if (!updated) throw new NotFoundException('Supplier not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.supplierRepository.delete(id);
  }

  async findAllActive(): Promise<SupplierDomainEntity[]> {
    return this.supplierRepository.findByStatus('approved');
  }

  async getPublicSupplierInfo(supplierId: string): Promise<SupplierPublicDto> {
    const supplier = await this.supplierRepository.findById(supplierId);
    if (!supplier) throw new NotFoundException('Supplier not found');

    const user = await this.userRepository.findById(supplier.userId);
    const primaryAddress = await this.addressService.getPrimaryAddress(supplierId, 'supplier');

    return {
      id: supplier.id,
      companyName: supplier.companyName,
      email: user?.email || '',
      phone: supplier.phone,
      status: supplier.status,
      address: primaryAddress ? {
        country: primaryAddress.country,
        city: primaryAddress.city,
        fullAddress: primaryAddress.fullAddress,
      } : undefined,
    };
  }

  protected _mapAddressToResponse(address: any): AddressResponseDto {
    return {
      id: address.id,
      country: address.country,
      city: address.city,
      street: address.street,
      building: address.building,
      postalCode: address.postalCode,
      state: address.state,
      lat: address.lat,
      lng: address.lng,
      isPrimary: address.isPrimary,
      fullAddress: address.fullAddress,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
}