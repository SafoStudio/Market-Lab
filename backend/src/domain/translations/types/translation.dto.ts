import { TranslationEntityType, LanguageCode } from "./translation.type";

export interface CreateTranslationDto {
  entityId: string;
  entityType: TranslationEntityType;
  languageCode: LanguageCode;
  fieldName: string;
  translationText: string;
}

export interface UpdateTranslationDto {
  translationText: string;
}

export interface BulkTranslationDto {
  entityId: string;
  entityType: TranslationEntityType;
  translations: Record<LanguageCode, Record<string, string>>;
}

export interface TranslationQueryDto {
  entityId?: string;
  entityIds?: string[];
  entityType?: TranslationEntityType;
  languageCode?: LanguageCode;
  fieldName?: string;
}