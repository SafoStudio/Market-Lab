import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationOrmEntity } from '@infrastructure/database/postgres/translations/translation.entity';
import { PostgresTranslationRepository } from '@infrastructure/database/postgres/translations/translation.repository';
import { TranslationService } from '@domain/translations/translation.service';
import { TranslationController } from '@controller/translations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TranslationOrmEntity]),
  ],
  controllers: [TranslationController],
  providers: [
    TranslationService,
    {
      provide: 'TranslationRepository',
      useClass: PostgresTranslationRepository,
    },
  ],
  exports: [
    TranslationService,
    'TranslationRepository',
  ],
})
export class TranslationsModule { }