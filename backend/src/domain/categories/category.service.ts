import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException
} from '@nestjs/common';

import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryTreeItem,
  CategoryStatus
} from './types';

import { CategoryRepository } from './category.repository';
import { CategoryDomainEntity } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository
  ) { }

  // Public methods
  async findAll(): Promise<CategoryDomainEntity[]> {
    return this.categoryRepository.findAll();
  }

  async findActive(): Promise<CategoryDomainEntity[]> {
    return this.categoryRepository.findActive();
  }

  async findById(id: string): Promise<CategoryDomainEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async findBySlug(slug: string): Promise<CategoryDomainEntity> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundException(`Category ${slug} not found`);
    return category;
  }

  async getParents(): Promise<CategoryDomainEntity[]> {
    return this.categoryRepository.findParents();
  }

  async getChildren(parentId: string): Promise<CategoryDomainEntity[]> {
    await this.findById(parentId);
    return this.categoryRepository.findChildren(parentId);
  }

  async getTree(): Promise<CategoryTreeItem[]> {
    return this.categoryRepository.getTree();
  }

  // Admin methods
  async create(createDto: CreateCategoryDto): Promise<CategoryDomainEntity> {
    const slug = createDto.slug || this._generateSlug(createDto.name);

    if (await this.categoryRepository.existsBySlug(slug)) {
      throw new ConflictException(`Category with slug "${slug}" already exists`);
    }

    if (createDto.parentId) await this.findById(createDto.parentId);

    const category = CategoryDomainEntity.create({
      ...createDto,
      slug
    });

    const errors = category.validate();
    if (errors.length > 0) throw new BadRequestException(errors.join(', '));

    return this.categoryRepository.create(category);
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<CategoryDomainEntity> {
    const category = await this.findById(id);

    if (updateDto.slug && updateDto.slug !== category.slug) {
      if (await this.categoryRepository.existsBySlug(updateDto.slug)) {
        throw new ConflictException(`Category with slug "${updateDto.slug}" already exists`);
      }
    }

    if (updateDto.parentId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }

    if (updateDto.parentId !== undefined && updateDto.parentId !== category.parentId) {
      if (updateDto.parentId !== null) {
        await this.findById(updateDto.parentId);
      }
      if (updateDto.parentId && await this._wouldCreateCycle(id, updateDto.parentId)) {
        throw new BadRequestException('Cannot create circular category hierarchy');
      }
    }

    category.update(updateDto);

    const errors = category.validate();
    if (errors.length > 0) throw new BadRequestException(errors.join(', '));

    const updated = await this.categoryRepository.update(id, category);
    if (!updated) throw new NotFoundException(`Category ${id} not found after update`);

    return updated;
  }

  async delete(id: string): Promise<void> {
    const category = await this.findById(id);

    const canDelete = await this.canDeleteCategory(id);
    if (!canDelete.canDelete) {
      throw new BadRequestException(canDelete.reason);
    }

    return this.categoryRepository.delete(id);
  }

  async toggleStatus(id: string, status: CategoryStatus): Promise<CategoryDomainEntity> {
    const category = await this.findById(id);

    if (status === 'active') category.activate();
    else category.deactivate();

    if (status === 'active' && category.isChild()) {
      const parent = await this.categoryRepository.findById(category.parentId!);
      if (parent && !parent.isActive()) {
        throw new BadRequestException('Parent category must be active');
      }
    }

    if (status === 'inactive' && category.isParent()) {
      const children = await this.categoryRepository.findChildren(id);
      for (const child of children) {
        if (child.isActive()) {
          child.deactivate();
          await this.categoryRepository.update(child.id, child);
        }
      }
    }

    const updated = await this.categoryRepository.update(id, category);
    if (!updated) throw new NotFoundException(`Category ${id} not found after update`);

    return updated;
  }

  async reorderCategories(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.categoryRepository.update(orderedIds[i], { order: i });
    }
  }

  async validateCategory(
    categoryId?: string,
    subcategoryId?: string
  ): Promise<{ category?: CategoryDomainEntity; subcategory?: CategoryDomainEntity }> {
    if (subcategoryId && !categoryId) {
      throw new BadRequestException('Category must be specified when subcategory is set');
    }

    let category: CategoryDomainEntity | undefined;
    let subcategory: CategoryDomainEntity | undefined;

    if (categoryId) {
      category = await this.findById(categoryId);

      if (!category.isActive()) {
        throw new BadRequestException(`Category "${category.name}" is not active`);
      }

      if (subcategoryId) {
        subcategory = await this.findById(subcategoryId);

        if (subcategory.parentId !== categoryId) {
          throw new BadRequestException(
            `Subcategory "${subcategory.name}" does not belong to category "${category.name}"`
          );
        }

        if (!subcategory.isActive()) {
          throw new BadRequestException(`Subcategory "${subcategory.name}" is not active`);
        }
      }
    }

    return { category, subcategory };
  }


  private _generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async _wouldCreateCycle(categoryId: string, newParentId: string): Promise<boolean> {
    let currentParentId: string | null | undefined = newParentId;

    while (currentParentId) {
      if (currentParentId === categoryId) return true;

      const parent = await this.categoryRepository.findById(currentParentId);
      if (!parent) break;

      currentParentId = parent.parentId;
    }

    return false;
  }

  private async canDeleteCategory(id: string): Promise<{ canDelete: boolean; reason?: string }> {
    const category = await this.categoryRepository.findById(id);
    if (!category) return { canDelete: false, reason: 'Category not found' };

    const children = await this.categoryRepository.findChildren(id);
    if (children.length > 0) {
      return {
        canDelete: false,
        reason: 'Cannot delete category with children. Delete or move children first.'
      };
    }

    // TODO: Проверяем наличие продуктов в этой категории
    // Нужно подключить ProductRepository или ProductService
    // const productCount = await this.productRepository.countByCategory(id);
    // if (productCount > 0) {
    //   return { 
    //     canDelete: false, 
    //     reason: `Cannot delete category with ${productCount} products. Move products first.` 
    //   };
    // }

    return { canDelete: true };
  }
}