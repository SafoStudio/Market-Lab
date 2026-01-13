import { FullRepository } from '@shared/types';
import { CategoryDomainEntity } from './category.entity';
import { CategoryTreeItem, CategoryStatus } from './types/category.type';

export abstract class CategoryRepository implements FullRepository<CategoryDomainEntity> {
  // BaseRepository methods
  abstract create(data: Partial<CategoryDomainEntity>): Promise<CategoryDomainEntity>;
  abstract findById(id: string): Promise<CategoryDomainEntity | null>;
  abstract update(id: string, data: Partial<CategoryDomainEntity>): Promise<CategoryDomainEntity | null>;
  abstract delete(id: string): Promise<void>;

  // QueryableRepository methods
  abstract findOne(filter: Partial<CategoryDomainEntity>): Promise<CategoryDomainEntity | null>;
  abstract findMany(filter: Partial<CategoryDomainEntity>): Promise<CategoryDomainEntity[]>;
  abstract findAll(): Promise<CategoryDomainEntity[]>;

  // UtilityRepository methods
  abstract exists(id: string): Promise<boolean>;

  // PaginableRepository methods
  abstract findWithPagination(
    page: number,
    limit: number,
    filter?: Partial<CategoryDomainEntity>
  ): Promise<{
    data: CategoryDomainEntity[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  // Category-specific methods
  abstract findBySlug(slug: string): Promise<CategoryDomainEntity | null>;

  abstract findByParentId(parentId: string | null): Promise<CategoryDomainEntity[]>;
  abstract findParents(): Promise<CategoryDomainEntity[]>;
  abstract findChildren(parentId: string): Promise<CategoryDomainEntity[]>;

  abstract findByStatus(status: CategoryStatus): Promise<CategoryDomainEntity[]>;
  abstract findActive(): Promise<CategoryDomainEntity[]>;

  abstract getTree(): Promise<CategoryTreeItem[]>;

  abstract existsBySlug(slug: string): Promise<boolean>;
  abstract existsByParentAndName(parentId: string | null, name: string): Promise<boolean>;
}