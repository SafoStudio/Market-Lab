import { Injectable, Inject } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import type { DocumentStorage } from '../types';
import { SupplierCoreService } from './supplier-core.service';
import { SupplierRepository } from '../supplier.repository';

import { UserRepository } from '@domain/users/user.repository';
import { AddressService } from '@domain/addresses/address.service';


@Injectable()
export class SupplierDocumentsService extends SupplierCoreService {
  constructor(
    @Inject('SupplierRepository')
    supplierRepository: SupplierRepository,

    @Inject('UserRepository')
    userRepository: UserRepository,

    @Inject('DocumentStorage')
    private readonly documentStorage: DocumentStorage,

    addressService: AddressService,
  ) {
    super(supplierRepository, userRepository, addressService);
  }

  async uploadDocuments(
    id: string,
    files: Express.Multer.File[],
    userId: string,
    userRoles: string[]
  ): Promise<{ urls: string[] }> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    const urls = await this.documentStorage.uploadMany(files, supplier.companyName);
    supplier.documents = [...supplier.documents, ...urls];

    await this.supplierRepository.update(id, {
      documents: supplier.documents,
      updatedAt: new Date()
    });

    return { urls };
  }

  async getDocuments(
    id: string,
    userId: string,
    userRoles: string[]
  ): Promise<string[]> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    return await this.documentStorage.getAll(supplier.companyName);
  }

  async deleteDocument(
    id: string,
    documentUrl: string,
    userId: string,
    userRoles: string[]
  ): Promise<void> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    if (!supplier.documents.includes(documentUrl)) {
      throw new NotFoundException('Document not found for this supplier');
    }

    await this.documentStorage.delete(documentUrl, supplier.companyName);
    supplier.removeDocument(documentUrl);

    await this.supplierRepository.update(id, {
      documents: supplier.documents,
      updatedAt: new Date()
    });
  }
}