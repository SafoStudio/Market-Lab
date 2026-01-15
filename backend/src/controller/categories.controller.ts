import {
  Controller, Get, Post, Put,
  Delete, Body, Param,
  Query, UseGuards, ParseUUIDPipe,
  ParseIntPipe, DefaultValuePipe
} from '@nestjs/common';

import {
  ApiTags, ApiOperation,
  ApiResponse, ApiBearerAuth, ApiQuery
} from '@nestjs/swagger';

import type {
  CreateCategoryDto,
  UpdateCategoryDto
} from '@domain/categories/types';

import { Role } from '@shared/types';
import { Auth, Roles } from '@auth/decorators';
import { CategoryService } from '@domain/categories/category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  @ApiOperation({ summary: 'Get all active categories with tree structure' })
  @ApiResponse({ status: 200, description: 'Returns category tree' })
  async getAll() {
    return this.categoryService.getTree();
  }

  @Get('list')
  @ApiOperation({ summary: 'Get paginated list of categories' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'archived'] })
  @ApiQuery({ name: 'parentId', required: false, type: String })
  async getPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query('status') status?: 'active' | 'inactive' | 'archived',
    @Query('parentId') parentId?: string
  ) {
    // return this.categoryService.findPaginated({ page, limit, status, parentId });
    //! Пока что возвращаем все
    return this.categoryService.findAll();
  }

  @Get('parents')
  @ApiOperation({ summary: 'Get all parent categories' })
  async getParents() {
    return this.categoryService.getParents();
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get children of a category' })
  async getChildren(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getChildren(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new category (Admin only)' })
  async create(@Body() createDto: CreateCategoryDto) {
    return this.categoryService.create(createDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update category (Admin only)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.delete(id);
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