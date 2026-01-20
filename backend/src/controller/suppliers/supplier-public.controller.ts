import { Controller, Get, Param, ParseUUIDPipe, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiNotFoundResponse, } from '@nestjs/swagger';
import { SupplierService } from '@domain/suppliers/services/supplier.service';
import { SupplierPublicResponseDtoSwagger } from '@domain/suppliers/types/supplier.swagger.dto';


@ApiTags('suppliers-public')
@Controller('suppliers')
export class SupplierPublicController {
  constructor(private readonly supplierService: SupplierService) { }

  /**
   * GET ALL ACTIVE SUPPLIERS (Public)
   */
  @Get('public/active')
  @ApiOperation({
    summary: 'Get all active suppliers (Public)',
    description: 'Retrieves list of all active and approved suppliers. Public endpoint accessible without authentication.'
  })
  @ApiOkResponse({
    description: 'Active suppliers list retrieved successfully',
    type: [SupplierPublicResponseDtoSwagger],
  })
  async findAllActive() {
    return this.supplierService.findAllActive();
  }

  /**
   * GET SUPPLIER PUBLIC INFO (Public)
   */
  @Get('public/:id')
  @ApiOperation({
    summary: 'Get supplier public info (Public)',
    description: 'Retrieves public information about a specific supplier. Public endpoint accessible without authentication.'
  })
  @ApiParam({
    name: 'id',
    description: 'Supplier ID (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Supplier public info retrieved successfully',
    type: SupplierPublicResponseDtoSwagger,
  })
  @ApiNotFoundResponse({
    description: 'Supplier not found or not active',
  })
  async getPublicInfo(@Param('id', ParseUUIDPipe) id: string) {
    return this.supplierService.getPublicSupplierInfo(id);
  }
}