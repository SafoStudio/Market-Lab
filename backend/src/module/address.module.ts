import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressOrmEntity } from '@infrastructure/database/postgres/address/address.entity';
import { PostgresAddressRepository } from '@infrastructure/database/postgres/address/address.repository';

import { AddressService } from '@domain/addresses/address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressOrmEntity]),
  ],
  controllers: [],
  providers: [
    AddressService,
    {
      provide: 'AddressRepository',
      useClass: PostgresAddressRepository,
    },
  ],
  exports: [
    AddressService,
    'AddressRepository',
  ],
})
export class AddressModule { }