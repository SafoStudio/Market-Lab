import { Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository as DomainProductRepository } from '@domain/products/product.repository';
import { ProductOrmEntity } from './product.entity';
import { ProductDomainEntity } from '@domain/products/product.entity';
import { ProductStatus } from '@domain/products/types';


@Injectable()
export class PostgresProductRepository extends DomainProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) { super() }

  // BaseRepository
  async create(data: Partial<ProductDomainEntity>): Promise<ProductDomainEntity> {
    const entity = this._toOrmEntity(data as ProductDomainEntity);
    const saved = await this.repository.save(entity);
    return this._toDomainEntity(saved);
  }

  async findById(id: string): Promise<ProductDomainEntity | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['category', 'subcategory']
    });
    return entity ? this._toDomainEntity(entity) : null;
  }

  async update(id: string, data: Partial<ProductDomainEntity>): Promise<ProductDomainEntity | null> {
    if (!await this.exists(id)) return null;

    await this.repository.update(id, this._prepareUpdateData(data));
    const updated = await this.repository.findOne({
      where: { id },
      relations: ['category', 'subcategory']
    });

    return updated ? this._toDomainEntity(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  // QueryableRepository methods
  async findOne(filter: Partial<ProductDomainEntity>): Promise<ProductDomainEntity | null> {
    const query = this._buildWhereQuery(filter);
    const entity = await query.getOne();
    return entity ? this._toDomainEntity(entity) : null;
  }

  async findMany(filter: Partial<ProductDomainEntity>): Promise<ProductDomainEntity[]> {
    const query = this._buildWhereQuery(filter);
    const entities = await query.getMany();
    return entities.map(this._toDomainEntity);
  }

  async findAll(): Promise<ProductDomainEntity[]> {
    const entities = await this.repository.find({
      relations: ['category', 'subcategory']
    });
    return entities.map(this._toDomainEntity);
  }

  // UtilityRepository methods
  async exists(id: string): Promise<boolean> {
    return await this.repository.existsBy({ id });
  }

  // PaginableRepository methods
  async findWithPagination(
    page: number,
    limit: number,
    filter?: Partial<ProductDomainEntity>
  ): Promise<{
    data: ProductDomainEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query = this._buildWhereQuery(filter);

    query.skip(skip).take(limit).orderBy('product.createdAt', 'DESC');

    const [entities, total] = await query.getManyAndCount();

    return {
      data: entities.map(this._toDomainEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Category methods
  async findByCategoryId(categoryId: string): Promise<ProductDomainEntity[]> {
    return this.findMany({ categoryId, status: 'active' });
  }

  async findBySubcategoryId(subcategoryId: string): Promise<ProductDomainEntity[]> {
    return this.findMany({ subcategoryId, status: 'active' });
  }

  async findByCategoryAndSubcategory(
    categoryId: string,
    subcategoryId?: string
  ): Promise<ProductDomainEntity[]> {
    const filter: Partial<ProductDomainEntity> = { categoryId, status: 'active' };
    if (subcategoryId) filter.subcategoryId = subcategoryId;
    return this.findMany(filter);
  }

  // Supplier methods
  async findBySupplierId(supplierId: string): Promise<ProductDomainEntity[]> {
    return this.findMany({ supplierId });
  }

  // Status methods
  async findByStatus(status: ProductStatus): Promise<ProductDomainEntity[]> {
    return this.findMany({ status });
  }

  async findActive(): Promise<ProductDomainEntity[]> {
    return this.findByStatus('active');
  }

  // Search methods
  async findByPriceRange(min: number, max: number): Promise<ProductDomainEntity[]> {
    const query = this._buildBaseQuery()
      .andWhere('product.price BETWEEN :min AND :max', { min, max })
      .orderBy('product.price', 'ASC');

    const entities = await query.getMany();
    return entities.map(this._toDomainEntity);
  }

  async findByTags(tags: string[]): Promise<ProductDomainEntity[]> {
    const query = this._buildBaseQuery();

    tags.forEach((tag, index) => {
      query.andWhere(`product.tags @> :tag${index}`, { [`tag${index}`]: [tag] });
    });

    const entities = await query.getMany();
    return entities.map(this._toDomainEntity);
  }

  async findByName(name: string): Promise<ProductDomainEntity | null> {
    return this.findOne({ name });
  }

  async searchByName(name: string): Promise<ProductDomainEntity[]> {
    const query = this._buildBaseQuery()
      .andWhere('LOWER(product.name) LIKE LOWER(:name)', { name: `%${name}%` });

    const entities = await query.getMany();
    return entities.map(this._toDomainEntity);
  }

  async searchByText(text: string): Promise<ProductDomainEntity[]> {
    const query = this._buildBaseQuery()
      .andWhere(
        '(LOWER(product.name) LIKE LOWER(:text) OR LOWER(product.description) LIKE LOWER(:text))',
        { text: `%${text}%` }
      );

    const entities = await query.getMany();
    return entities.map(this._toDomainEntity);
  }

  async existsBySupplierAndName(supplierId: string, name: string): Promise<boolean> {
    return await this.repository.existsBy({ supplierId, name });
  }

  // Count methods
  async countBySupplier(supplierId: string): Promise<number> {
    return this.repository.count({ where: { supplierId } });
  }

  async countByStatus(status: ProductStatus): Promise<number> {
    return this.repository.count({ where: { status } });
  }

  // Sort methods
  async findSorted(
    sortBy: keyof ProductDomainEntity,
    order: 'ASC' | 'DESC'
  ): Promise<ProductDomainEntity[]> {
    const entities = await this.repository.find({
      where: { status: 'active' },
      relations: ['category', 'subcategory'],
      order: { [sortBy]: order }
    });
    return entities.map(this._toDomainEntity);
  }

  // Update methods
  async updateStatus(id: string, status: ProductStatus): Promise<ProductDomainEntity | null> {
    return this.update(id, { status });
  }

  async updateStock(id: string, stock: number): Promise<ProductDomainEntity | null> {
    return this.update(id, { stock });
  }

  async increaseStock(id: string, quantity: number): Promise<ProductDomainEntity | null> {
    if (!await this.exists(id)) return null;

    await this.repository
      .createQueryBuilder()
      .update(ProductOrmEntity)
      .set({ stock: () => `stock + ${quantity}` })
      .where('id = :id', { id })
      .execute();

    return this.findById(id);
  }

  async decreaseStock(id: string, quantity: number): Promise<ProductDomainEntity | null> {
    if (!await this.exists(id)) return null;

    const product = await this.findById(id);
    if (!product || product.stock < quantity) return null;

    await this.repository
      .createQueryBuilder()
      .update(ProductOrmEntity)
      .set({ stock: () => `stock - ${quantity}` })
      .where('id = :id', { id })
      .andWhere('stock >= :quantity', { quantity })
      .execute();

    return this.findById(id);
  }

  async updatePrice(id: string, price: number): Promise<ProductDomainEntity | null> {
    return this.update(id, { price });
  }

  // Filter methods
  async findLowStock(threshold: number = 10): Promise<ProductDomainEntity[]> {
    const query = this._buildBaseQuery()
      .andWhere('product.stock <= :threshold', { threshold });

    const entities = await query.getMany();
    return entities.map(this._toDomainEntity);
  }

  async findByIds(ids: string[]): Promise<ProductDomainEntity[]> {
    if (ids.length === 0) return [];

    const query = this._buildBaseQuery()
      .andWhere('product.id IN (:...ids)', { ids });

    const entities = await query.getMany();
    return entities.map(this._toDomainEntity);
  }

  // Statistics methods
  async getCategoriesWithCount(): Promise<Array<{ category: string; count: number }>> {
    const detailed = await this.getDetailedCategoriesWithCount();

    return detailed.map(item => ({
      category: item.subcategoryName
        ? `${item.categoryName || item.categoryId} > ${item.subcategoryName || item.subcategoryId}`
        : item.categoryName || item.categoryId || 'Without category',
      count: item.count
    }));
  }

  async getDetailedCategoriesWithCount(): Promise<
    Array<{
      categoryId?: string;
      categoryName?: string;
      subcategoryId?: string;
      subcategoryName?: string;
      count: number;
    }>
  > {
    const result = await this.repository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.subcategory', 'subcategory')
      .select('product.categoryId', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('product.subcategoryId', 'subcategoryId')
      .addSelect('subcategory.name', 'subcategoryName')
      .addSelect('COUNT(*)', 'count')
      .where('product.status = :status', { status: 'active' })
      .groupBy('product.categoryId, category.name, product.subcategoryId, subcategory.name')
      .orderBy('count', 'DESC')
      .getRawMany();

    return result.map(row => ({
      categoryId: row.categoryId || undefined,
      categoryName: row.categoryName || undefined,
      subcategoryId: row.subcategoryId || undefined,
      subcategoryName: row.subcategoryName || undefined,
      count: parseInt(row.count)
    }));
  }

  async getPopularTags(limit: number = 20): Promise<Array<{ tag: string; count: number }>> {
    const result = await this.repository
      .createQueryBuilder('product')
      .select('unnest(product.tags)', 'tag')
      .addSelect('COUNT(*)', 'count')
      .where('product.status = :status', { status: 'active' })
      .groupBy('tag')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(row => ({
      tag: row.tag,
      count: parseInt(row.count)
    }));
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    archived: number;
    draft: number;
    totalStock: number;
    averagePrice: number;
    categoriesCount: number;
  }> {
    const total = await this.repository.count();
    const active = await this.countByStatus('active');
    const inactive = await this.countByStatus('inactive');
    const archived = await this.countByStatus('archived');
    const draft = await this.countByStatus('draft');

    const stockResult = await this.repository
      .createQueryBuilder('product')
      .select('COALESCE(SUM(product.stock), 0)', 'totalStock')
      .getRawOne();

    const priceResult = await this.repository
      .createQueryBuilder('product')
      .select('COALESCE(AVG(product.price), 0)', 'averagePrice')
      .getRawOne();

    const categories = await this.getDetailedCategoriesWithCount();

    return {
      total,
      active,
      inactive,
      archived,
      draft,
      totalStock: parseFloat(stockResult.totalStock) || 0,
      averagePrice: parseFloat(priceResult.averagePrice) || 0,
      categoriesCount: categories.filter(c => c.categoryId).length
    };
  }

  // Helper methods
  private _buildBaseQuery(): SelectQueryBuilder<ProductOrmEntity> {
    return this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subcategory', 'subcategory')
      .where('product.status = :status', { status: 'active' });
  }

  private _buildWhereQuery(filter?: Partial<ProductDomainEntity>): SelectQueryBuilder<ProductOrmEntity> {
    const query = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subcategory', 'subcategory');

    if (filter) {
      this._applyFilters(query, filter);
    }

    return query;
  }

  private _applyFilters(query: SelectQueryBuilder<ProductOrmEntity>, filter: Partial<ProductDomainEntity>) {
    if (filter.id) query.andWhere('product.id = :id', { id: filter.id });
    if (filter.supplierId) query.andWhere('product.supplierId = :supplierId', { supplierId: filter.supplierId });
    if (filter.name) query.andWhere('product.name = :name', { name: filter.name });
    if (filter.description) query.andWhere('product.description = :description', { description: filter.description });
    if (filter.price !== undefined) query.andWhere('product.price = :price', { price: filter.price });
    if (filter.categoryId !== undefined) query.andWhere('product.categoryId = :categoryId', { categoryId: filter.categoryId });
    if (filter.subcategoryId !== undefined) query.andWhere('product.subcategoryId = :subcategoryId', { subcategoryId: filter.subcategoryId });
    if (filter.images !== undefined) this._applyImagesFilter(query, filter.images);
    if (filter.stock !== undefined) query.andWhere('product.stock = :stock', { stock: filter.stock });
    if (filter.status) query.andWhere('product.status = :status', { status: filter.status });
    if (filter.tags !== undefined) this._applyTagsFilter(query, filter.tags);
  }

  private _applyImagesFilter(query: SelectQueryBuilder<ProductOrmEntity>, images: string[] | undefined) {
    if (Array.isArray(images)) {
      if (images.length === 0) {
        query.andWhere('product.images = :emptyArray', { emptyArray: [] });
      } else {
        query.andWhere('product.images @> :images', { images });
      }
    }
  }

  private _applyTagsFilter(query: SelectQueryBuilder<ProductOrmEntity>, tags: string[] | undefined) {
    if (Array.isArray(tags)) {
      if (tags.length === 0) {
        query.andWhere('product.tags = :emptyArray', { emptyArray: [] });
      } else {
        query.andWhere('product.tags @> :tags', { tags });
      }
    }
  }

  private _prepareUpdateData(data: Partial<ProductDomainEntity>): Partial<ProductOrmEntity> {
    const updateData: Partial<ProductOrmEntity> = {};

    if (data.supplierId !== undefined) updateData.supplierId = data.supplierId;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.subcategoryId !== undefined) updateData.subcategoryId = data.subcategoryId;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.tags !== undefined) updateData.tags = data.tags;

    return updateData;
  }

  private _toDomainEntity(ormEntity: ProductOrmEntity): ProductDomainEntity {
    return new ProductDomainEntity(
      ormEntity.id,
      ormEntity.supplierId,
      ormEntity.name,
      ormEntity.description,
      typeof ormEntity.price === 'string' ? parseFloat(ormEntity.price) : ormEntity.price,
      ormEntity.categoryId || undefined,
      ormEntity.subcategoryId || undefined,
      ormEntity.images || [],
      ormEntity.stock,
      ormEntity.status as ProductStatus,
      ormEntity.tags || [],
      ormEntity.createdAt,
      ormEntity.updatedAt
    );
  }

  private _toOrmEntity(domainEntity: ProductDomainEntity): ProductOrmEntity {
    const entity = new ProductOrmEntity();

    if (domainEntity.id) entity.id = domainEntity.id;
    entity.supplierId = domainEntity.supplierId;
    entity.name = domainEntity.name;
    entity.description = domainEntity.description;
    entity.price = domainEntity.price;
    entity.categoryId = domainEntity.categoryId || null;
    entity.subcategoryId = domainEntity.subcategoryId || null;
    entity.images = domainEntity.images;
    entity.stock = domainEntity.stock;
    entity.status = domainEntity.status;
    entity.tags = domainEntity.tags;
    entity.createdAt = domainEntity.createdAt;
    entity.updatedAt = domainEntity.updatedAt;

    return entity;
  }
}