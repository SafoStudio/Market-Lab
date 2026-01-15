import {
  Entity, Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index, OneToMany,
  ManyToOne, JoinColumn
} from 'typeorm';
import { ProductOrmEntity } from '../products/product.entity';

@Entity('categories')
@Index(['slug'], { unique: true })
@Index(['parentId', 'order'])
@Index(['status', 'order'])
export class CategoryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  })
  status: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'uuid', nullable: true })
  parentId: string | null;

  @ManyToOne(() => CategoryOrmEntity, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: CategoryOrmEntity;

  @OneToMany(() => CategoryOrmEntity, category => category.parent)
  children: CategoryOrmEntity[];

  @OneToMany(() => ProductOrmEntity, product => product.category)
  products: ProductOrmEntity[];

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metaTitle: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  metaDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}