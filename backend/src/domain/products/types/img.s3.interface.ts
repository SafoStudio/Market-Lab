export interface ProductImageStorage {
  uploadProductImages(
    files: Express.Multer.File[],
    supplierCompanyName: string,
    productName: string
  ): Promise<string[]>;

  getProductImageUrls(
    supplierCompanyName: string,
    productName: string
  ): Promise<{ main: string | null; gallery: string[] }>;

  deleteProductImages(
    supplierCompanyName: string,
    productName: string
  ): Promise<void>;

  deleteImageByUrl(imageUrl: string): Promise<void>;

  uploadSupplierLogo(
    file: Express.Multer.File,
    supplierCompanyName: string
  ): Promise<string>;
}