import { Entity } from "@shared/types";
import { LanguageCode } from "@domain/translations/types";

export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived'
} as const;

export type CategoryStatus = typeof CATEGORY_STATUS[keyof typeof CATEGORY_STATUS];
export const DEFAULT_CATEGORY_STATUS = CATEGORY_STATUS.ACTIVE;

export const TRANSLATABLE_CATEGORY_FIELDS = [
  'name',
  'description',
  'metaTitle',
  'metaDescription'
] as const;

export type TranslatableCategoryField = typeof TRANSLATABLE_CATEGORY_FIELDS[number];

export interface CategoryModel extends Entity {
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  imageUrl?: string;
  parentId?: string | null;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  translations?: Record<LanguageCode, Partial<Record<TranslatableCategoryField, string>>>;
}

export interface CategoryTreeItem extends CategoryModel {
  children?: CategoryTreeItem[];
}

export type SubcategoryModel = CategoryModel & {
  parentId: string;
};

export interface LocalizedCategory extends Omit<CategoryModel, 'translations'> {
  languageCode: LanguageCode;
}

export interface CategoryValidationResult {
  category?: CategoryModel;
  subcategory?: CategoryModel;
}

export interface BasicCategory extends Entity {
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  imageUrl?: string;
  parentId?: string | null;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
}