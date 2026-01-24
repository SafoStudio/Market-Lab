import { CategoryStatus, TranslatableCategoryField } from "./category.type";
import { LanguageCode } from "@domain/translations/types";

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
  translations?: Record<LanguageCode, Partial<Record<TranslatableCategoryField, string>>>;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> { }