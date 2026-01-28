import {
  Controller, Get, Post, Put,
  Delete, Body, Param,
  Query, UseGuards, ParseUUIDPipe,
  ParseIntPipe, DefaultValuePipe, HttpCode, HttpStatus
} from '@nestjs/common';

import {
  ApiTags, ApiOperation,
  ApiResponse, ApiBearerAuth, ApiQuery, ApiParam
} from '@nestjs/swagger';

import type {
  CreateCategoryDto,
  UpdateCategoryDto
} from '@domain/categories/types';

import { Role } from '@shared/types';
import { Auth, Roles } from '@auth/decorators';
import { CategoryService } from '@domain/categories/category.service';
import { type LanguageCode, SUPPORTED_LANGUAGES } from '@domain/translations/types/translation.type';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // PUBLIC ENDPOINTS

  @Get()
  @ApiOperation({ summary: 'Get category tree with localization' })
  @ApiQuery({
    name: 'language',
    required: false,
    enum: Object.values(SUPPORTED_LANGUAGES),
    description: 'Language code for localization'
  })
  @ApiResponse({ status: 200, description: 'Returns localized category tree' })
  async getTree(@Query('language') language?: LanguageCode) {
    return this.categoryService.getTree(language);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get paginated list of categories' })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 20 })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'archived'] })
  @ApiQuery({ name: 'parentId', required: false, type: String })
  @ApiQuery({
    name: 'language',
    required: false,
    enum: Object.values(SUPPORTED_LANGUAGES)
  })
  async getPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query('status') status?: 'active' | 'inactive' | 'archived',
    @Query('parentId') parentId?: string,
    @Query('language') language?: LanguageCode
  ) {
    const categories = await this.categoryService.findAll(language);

    let filtered = categories;
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }

    if (parentId) {
      filtered = filtered.filter(c => c.parentId === parentId);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
      data: paginated,
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      }
    };
  }

  @Get('parents')
  @ApiOperation({ summary: 'Get all parent categories' })
  @ApiQuery({
    name: 'language',
    required: false,
    enum: Object.values(SUPPORTED_LANGUAGES)
  })
  async getParents(@Query('language') language?: LanguageCode) {
    return this.categoryService.getParents(language);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get children of a category' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({
    name: 'language',
    required: false,
    enum: Object.values(SUPPORTED_LANGUAGES)
  })
  async getChildren(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('language') language?: LanguageCode
  ) {
    return this.categoryService.getChildren(id, language);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiParam({ name: 'slug', type: String })
  @ApiQuery({
    name: 'language',
    required: false,
    enum: Object.values(SUPPORTED_LANGUAGES)
  })
  async getBySlug(
    @Param('slug') slug: string,
    @Query('language') language?: LanguageCode
  ) {
    return this.categoryService.findBySlug(slug, language);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({
    name: 'language',
    required: false,
    enum: Object.values(SUPPORTED_LANGUAGES)
  })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('language') language?: LanguageCode
  ) {
    return this.categoryService.findById(id, language);
  }

  @Get(':id/translations')
  @ApiOperation({ summary: 'Get all translations for category' })
  @ApiParam({ name: 'id', type: String })
  async getTranslations(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getCategoryTranslations(id);
  }

  // ADMIN ENDPOINTS

  @Post()
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new category with translations (Admin only)' })
  async create(@Body() createDto: CreateCategoryDto) {
    return this.categoryService.create(createDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update category with translations (Admin only)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(id, updateDto);
  }

  @Put(':id/translations')
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update category translations (Admin only)' })
  async updateCategoryTranslations(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() translations: Record<LanguageCode, Record<string, string>>
  ) {
    await this.categoryService.updateCategoryTranslations(id, translations);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete category and its translations (Admin only)' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.delete(id);
  }

  @Delete(':id/translations')
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category translations (Admin only)' })
  @ApiQuery({
    name: 'language',
    required: false,
    enum: Object.values(SUPPORTED_LANGUAGES)
  })
  @ApiQuery({
    name: 'field',
    required: false,
    description: 'Field name to delete translations for'
  })
  async deleteCategoryTranslations(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('language') language?: LanguageCode,
    @Query('field') field?: string
  ) {
    await this.categoryService.deleteCategoryTranslations(id, language, field);
  }

  @Put(':id/status/:status')
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Change category status (Admin only)' })
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('status') status: 'active' | 'inactive' | 'archived'
  ) {
    return this.categoryService.toggleStatus(id, status);
  }

  @Post('reorder')
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reorder categories (Admin only)' })
  async reorder(@Body() body: { ids: string[] }) {
    return this.categoryService.reorderCategories(body.ids);
  }
}