import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { ProductImageStorage } from '../types';


@Injectable()
export class ProductFileService {
  constructor(
    @Inject('ProductImageStorage')
    private readonly productImageStorage: ProductImageStorage
  ) { }

  async uploadProductImages(
    files: Express.Multer.File[],
    supplierCompanyName: string,
    productName: string
  ): Promise<string[]> {
    this._validateImages(files);
    return this.productImageStorage.uploadProductImages(files, supplierCompanyName, productName);
  }

  async uploadSupplierLogo(
    file: Express.Multer.File,
    supplierCompanyName: string
  ): Promise<string> {
    this._validateImage(file);
    return this.productImageStorage.uploadSupplierLogo(file, supplierCompanyName);
  }

  async deleteProductImages(
    supplierCompanyName: string,
    productName: string
  ): Promise<void> {
    return this.productImageStorage.deleteProductImages(supplierCompanyName, productName);
  }

  async deleteImageByUrl(imageUrl: string): Promise<void> {
    this._validateImageUrl(imageUrl);
    await this.productImageStorage.deleteImageByUrl(imageUrl);
  }

  async getProductImageUrls(
    supplierCompanyName: string,
    productName: string
  ): Promise<{ main: string | null; gallery: string[] }> {
    return this.productImageStorage.getProductImageUrls(supplierCompanyName, productName);
  }

  private _validateImage(file: Express.Multer.File): void {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`
      );
    }

    if (file.size > maxSize) throw new BadRequestException('File size exceeds 5MB limit');
  }

  private _validateImages(files: Express.Multer.File[]): void {
    const maxFiles = 10;
    if (files.length > maxFiles) throw new BadRequestException(`Maximum ${maxFiles} files allowed`);
    files.forEach(file => this._validateImage(file));
  }

  private _validateImageUrl(imageUrl: string): void {
    try {
      new URL(imageUrl);
    } catch (error) {
      throw new BadRequestException('Invalid image URL format');
    }
  }
}