import { Injectable } from '@nestjs/common';
import { ProductImageStorage } from '@domain/products/types';
import { S3StorageService } from './s3-storage.service';

@Injectable()
export class S3ProductImageStorageAdapter implements ProductImageStorage {
  constructor(private readonly s3StorageService: S3StorageService) { }

  async uploadProductImages(
    files: Express.Multer.File[],
    supplierCompanyName: string,
    productName: string
  ): Promise<string[]> {
    const uploadDtos = files.map(file => ({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    }));

    const results = await this.s3StorageService.uploadProductImages(
      uploadDtos,
      supplierCompanyName,
      productName
    );

    return results.map(result => result.url);
  }

  async getProductImageUrls(
    supplierCompanyName: string,
    productName: string
  ): Promise<{ main: string | null; gallery: string[] }> {
    return this.s3StorageService.getProductImageUrls(supplierCompanyName, productName);
  }

  async deleteProductImages(
    supplierCompanyName: string,
    productName: string
  ): Promise<void> {
    await this.s3StorageService.deleteProductImages(supplierCompanyName, productName);
  }

  async deleteImageByUrl(imageUrl: string): Promise<void> {
    const url = new URL(imageUrl);
    const fileKey = url.pathname.substring(1);
    await this.s3StorageService.deleteSupplierDocument(fileKey);
  }

  async uploadSupplierLogo(
    file: Express.Multer.File,
    supplierCompanyName: string
  ): Promise<string> {
    const uploadDto = {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    };

    const result = await this.s3StorageService.uploadSupplierLogo(
      uploadDto,
      supplierCompanyName
    );

    return result.url;
  }
}