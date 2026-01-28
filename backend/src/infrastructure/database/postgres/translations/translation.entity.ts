import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';

@Entity('translations')
@Index(['entityId', 'entityType', 'languageCode', 'fieldName'], { unique: true })
@Index(['entityType', 'languageCode'])
@Index(['entityId', 'entityType'])
export class TranslationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'varchar', length: 50 })
  entityType: string;

  @Column({ type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'varchar', length: 100 })
  fieldName: string;

  @Column({ type: 'text' })
  translationText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}