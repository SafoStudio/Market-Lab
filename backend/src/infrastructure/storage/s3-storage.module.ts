import { Module } from '@nestjs/common';
import { S3StorageService } from './s3-storage.service';
import { S3Config } from './s3.config';
import { S3DocumentStorageAdapter } from './s3-doc.adapter';
import { S3ProductImageStorageAdapter } from './s3-product-img.adapter';

@Module({
  providers: [
    S3Config,
    S3StorageService,
    S3DocumentStorageAdapter,
    S3ProductImageStorageAdapter,
  ],
  exports: [
    S3StorageService,
    S3DocumentStorageAdapter,
    S3ProductImageStorageAdapter,
  ],
})
export class S3StorageModule { }