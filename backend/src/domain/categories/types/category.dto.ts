import { CategoryStatus } from "./category.type";

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  status?: CategoryStatus;
  imageUrl?: string;
  parentId?: string | null;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> { }