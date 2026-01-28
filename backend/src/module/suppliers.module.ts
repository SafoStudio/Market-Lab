import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './address.module';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from './users.module';
import { TranslationsModule } from './translations.module';

// Domain services
import {
  SupplierService,
  SupplierCoreService,
  SupplierAccessService,
  SupplierAdminService,
  SupplierDocumentsService
} from '@domain/suppliers/services';

// Controllers
import {
  SupplierPublicController,
  SupplierProfileController,
  SupplierAdminController,
  SupplierDocumentsController
} from '@controller/suppliers';


// Database infrastructure
import { SupplierProfileOrmEntity } from '@infrastructure/database/postgres/suppliers/supplier.entity';
import { PostgresSupplierRepository } from '@infrastructure/database/postgres/suppliers/supplier.repository';

// S3 Storage
import { S3StorageModule } from '@infrastructure/storage/s3-storage.module';
import { S3DocumentStorageAdapter } from '@infrastructure/storage/s3-doc.adapter';


@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierProfileOrmEntity]),
    ConfigModule.forRoot(),
    AuthModule,
    AddressModule,
    S3StorageModule,
    UsersModule,
    TranslationsModule,
  ],
  controllers: [
    SupplierPublicController,
    SupplierProfileController,
    SupplierAdminController,
    SupplierDocumentsController,
  ],
  providers: [
    SupplierService,
    SupplierCoreService,
    SupplierAccessService,
    SupplierAdminService,
    SupplierDocumentsService,

    // Supplier repository
    {
      provide: 'SupplierRepository',
      useClass: PostgresSupplierRepository,
    },

    // S3 storage via abstract interface
    {
      provide: 'DocumentStorage',
      useExisting: S3DocumentStorageAdapter,
    },

    // Direct access to the S3 service
    S3DocumentStorageAdapter,
  ],
  exports: [
    SupplierService,
  ],
})
export class SuppliersModule { }