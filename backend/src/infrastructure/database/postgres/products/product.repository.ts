import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';;
import { ProductRepository as DomainProductRepository} from '@domain/products/product.repository';
import { ProductOrmEntity } from './product.entity';
import { ProductDomainEntity } from '@domain/products/product.entity';


@Injectable()
export class PostgresProductRepository extends DomainProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) { super() }

  async findAll(): Promise<ProductDomainEntity[]> {
    const ormEntities = await this.repository.find({});
    return ormEntities.map(this.toDomainEntity);
  }

  async findById(id: string): Promise<ProductDomainEntity | null> {
    const ormEntities = await this.repository.findOne({ where: { id } });
    return ormEntities ? this.toDomainEntity(ormEntities) : null;
  }

  async create(product: ProductDomainEntity): Promise<ProductDomainEntity> {
    const ormEntity = this.toOrmEntity(product);
    const saveOrmEntity = await this.repository.save(ormEntity);
    return this.toDomainEntity(saveOrmEntity);
  }

  async update(id: string, product: ProductDomainEntity): Promise<ProductDomainEntity> {
    const ormEntity = this.toOrmEntity(product);
    await this.repository.update(id, ormEntity);
    const updatedOrmEntity = await this.repository.findOne({ where: { id } });

    if (!updatedOrmEntity) throw new Error(`Customer with id ${id} not found after update`);
   
    return this.toDomainEntity(updatedOrmEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomainEntity(ormEntities: ProductOrmEntity): ProductDomainEntity{
    return new ProductDomainEntity(
      ormEntities.id,
      ormEntities.name ,
      ormEntities.description,
      ormEntities.price,
      ormEntities.createdAt,
      ormEntities.updatedAt)
  }

  private toOrmEntity(domainEntity: ProductDomainEntity): ProductOrmEntity{
    const ormEntity = new ProductOrmEntity();
   //! Don't set the ID if it's empty - TypeORM will generate it automatically.
   if (domainEntity.id) ormEntity.id = domainEntity.id;

   ormEntity.name = domainEntity.name;
   ormEntity.description = domainEntity.description;
   ormEntity.price = domainEntity.price;
   ormEntity.createdAt = domainEntity.createdAt;
   ormEntity.updatedAt = domainEntity.updatedAt;

   return ormEntity;
  }
}