import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from '@controller/categories.controller';
import { CategoryService } from '@domain/categories/category.service';
import { CategoryOrmEntity } from '@infrastructure/database/postgres/categories/category.entity';
import { PostgresCategoryRepository } from '@infrastructure/database/postgres/categories/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryOrmEntity])
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: 'CategoryRepository',
      useClass: PostgresCategoryRepository
    }
  ],
  exports: [CategoryService]
})
export class CategoriesModule { }