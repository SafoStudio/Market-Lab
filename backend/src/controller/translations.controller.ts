import {
  Controller,
  Get, Post, Delete,
  Body, Param, Query,
  HttpCode, HttpStatus
} from '@nestjs/common';

import type {
  BulkTranslationDto,
  TranslationQueryDto,
  LanguageCode,
  TranslationEntityType
} from '../domain/translations/types';

import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TranslationService } from '../domain/translations/translation.service';

@ApiTags('Translations')
@Controller('translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) { }

  @Get()
  @ApiOperation({ summary: 'Search translations' })
  async searchTranslations(@Query() query: TranslationQueryDto) {
    return this.translationService.searchTranslations(query);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bulk save translations' })
  async bulkSave(@Body() dto: BulkTranslationDto) {
    await this.translationService.saveTranslations(
      dto.entityId,
      dto.entityType,
      dto.translations
    );
  }

  @Delete(':entityType/:entityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all translations for entity' })
  @ApiQuery({ name: 'languageCode', required: false, enum: ['en', 'uk'] })
  @ApiQuery({ name: 'fieldName', required: false, type: String })
  async deleteTranslations(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('languageCode') languageCode?: LanguageCode,
    @Query('fieldName') fieldName?: string
  ) {
    await this.translationService.deleteTranslations(
      entityId,
      entityType as TranslationEntityType,
      languageCode,
      fieldName
    );
  }
}