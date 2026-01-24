import { MinimalRepository } from '@shared/types';
import { TranslationDomainEntity } from './translation.entity';
import { TranslationQueryDto, TranslationEntityType, LanguageCode, TranslationCreateData } from './types';

export abstract class TranslationRepository implements MinimalRepository<TranslationDomainEntity> {
  // BaseRepository methods
  abstract create(data: TranslationDomainEntity): Promise<TranslationDomainEntity>;
  abstract findById(id: string): Promise<TranslationDomainEntity | null>;
  abstract update(id: string, data: Partial<TranslationDomainEntity>): Promise<TranslationDomainEntity | null>;
  abstract delete(id: string): Promise<void>;

  // QueryableRepository methods
  abstract findOne(filter: Partial<TranslationDomainEntity>): Promise<TranslationDomainEntity | null>;
  abstract findMany(filter: Partial<TranslationDomainEntity>): Promise<TranslationDomainEntity[]>;
  abstract findAll(): Promise<TranslationDomainEntity[]>;

  // Translation-specific methods
  abstract findByQuery(query: TranslationQueryDto): Promise<TranslationDomainEntity[]>;

  abstract getTranslationsForEntity(
    entityId: string,
    entityType: TranslationEntityType
  ): Promise<TranslationDomainEntity[]>;

  abstract getTranslationsForEntities(
    entityIds: string[],
    entityType: TranslationEntityType,
    languageCode?: LanguageCode
  ): Promise<TranslationDomainEntity[]>;

  abstract getTranslationsByLanguage(
    entityType: TranslationEntityType,
    languageCode: LanguageCode
  ): Promise<TranslationDomainEntity[]>;

  abstract deleteByEntity(
    entityId: string,
    entityType: TranslationEntityType,
    languageCode?: LanguageCode,
    fieldName?: string
  ): Promise<void>;

  abstract bulkCreate(
    translations: TranslationCreateData[]
  ): Promise<TranslationDomainEntity[]>;

  abstract bulkUpdate(
    updates: Array<{ id: string; translationText: string }>
  ): Promise<TranslationDomainEntity[]>;
}