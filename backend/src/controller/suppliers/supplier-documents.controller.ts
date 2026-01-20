import {
  Controller, Get, Post,
  Delete, Param, Request, UseInterceptors, UploadedFiles,
  BadRequestException, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';

import {
  ApiTags, ApiBody, ApiOperation,
  ApiResponse, ApiBearerAuth, ApiParam,
  ApiConsumes, ApiCreatedResponse, ApiOkResponse,
  ApiNotFoundResponse, ApiForbiddenResponse, ApiBadRequestResponse,
} from '@nestjs/swagger';

import { FilesInterceptor } from '@nestjs/platform-express';

import { SupplierOrAdmin } from '@auth/decorators';
import type { AuthRequest } from '@auth/types';
import { SupplierService } from '@domain/suppliers/services/supplier.service';


@ApiTags('suppliers-documents')
@Controller('suppliers/:id/documents')
export class SupplierDocumentsController {
  constructor(private readonly supplierService: SupplierService) { }

  /**
   * UPLOAD SUPPLIER DOCUMENTS
   */
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  @SupplierOrAdmin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Upload supplier documents',
    description: 'Uploads documents for supplier. Supports multiple file uploads (max 10 files). Supplier or admin access only.'
  })
  @ApiParam({
    name: 'id',
    description: 'Supplier ID (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload supplier documents',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Documents uploaded successfully',
    type: [String],
  })
  @ApiBadRequestResponse({
    description: 'No files uploaded',
  })
  @ApiForbiddenResponse({
    description: 'User not authorized to upload documents for this supplier',
  })
  async uploadDocuments(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: AuthRequest
  ) {
    const userId = req.user.id;
    const userRoles = req.user.roles;

    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return this.supplierService.uploadDocuments(
      id,
      files,
      userId,
      userRoles
    );
  }

  /**
   * GET SUPPLIER DOCUMENTS
   */
  @Get()
  @SupplierOrAdmin()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get supplier documents',
    description: 'Retrieves list of documents uploaded by a supplier. Supplier can view their own documents, admin can view any supplier\'s documents.'
  })
  @ApiParam({
    name: 'id',
    description: 'Supplier ID (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Supplier documents retrieved successfully',
    type: [String],
  })
  @ApiNotFoundResponse({
    description: 'Supplier not found',
  })
  @ApiForbiddenResponse({
    description: 'User not authorized to view documents for this supplier',
  })
  async getDocuments(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthRequest
  ) {
    const userId = req.user.id;
    const userRoles = req.user.roles;
    return this.supplierService.getDocuments(id, userId, userRoles);
  }

  /**
   * DELETE SUPPLIER DOCUMENT
   */
  @Delete(':documentUrl')
  @SupplierOrAdmin()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete supplier document',
    description: 'Deletes a specific document uploaded by a supplier. Supplier can delete their own documents, admin can delete any document.'
  })
  @ApiParam({
    name: 'id',
    description: 'Supplier ID (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'documentUrl',
    description: 'Document URL or filename',
    example: 'https://s3.amazonaws.com/bucket/suppliers/company/documents/file.pdf',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Document deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Document not found',
  })
  @ApiForbiddenResponse({
    description: 'User not authorized to delete this document',
  })
  async deleteDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('documentUrl') documentUrl: string,
    @Request() req: AuthRequest
  ) {
    const userId = req.user.id;
    const userRoles = req.user.roles;
    return this.supplierService.deleteDocument(id, documentUrl, userId, userRoles);
  }
}