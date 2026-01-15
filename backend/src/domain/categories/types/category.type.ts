import { Entity } from "@shared/types";

export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived'
} as const;

export type CategoryStatus = typeof CATEGORY_STATUS[keyof typeof CATEGORY_STATUS];
export const DEFAULT_CATEGORY_STATUS = CATEGORY_STATUS.ACTIVE;

export interface CategoryModel extends Entity {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  imageUrl?: string;
  parentId?: string | null;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryTreeItem extends CategoryModel {
  children?: CategoryTreeItem[];
}

export type SubcategoryModel = CategoryModel & {
  parentId: string;
};