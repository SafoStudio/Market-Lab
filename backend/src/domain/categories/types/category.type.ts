import { Entity } from "@shared/types";
import { WithTranslations } from "@domain/translations/types";

export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived'
} as const;

// for class-validator
export enum CategoryStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export type CategoryStatus = typeof CATEGORY_STATUS[keyof typeof CATEGORY_STATUS];
export const DEFAULT_CATEGORY_STATUS = CATEGORY_STATUS.ACTIVE;

export interface CategoryModel extends Entity, WithTranslations<'category'> {
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

export interface CategoryTreeItem extends CategoryModel {
  children?: CategoryTreeItem[];
}

export type SubcategoryModel = CategoryModel & {
  parentId: string;
};

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