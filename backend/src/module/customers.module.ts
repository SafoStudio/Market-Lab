import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from '@domain/customers/customer.service';
import { CustomersController } from '@controller/customers.controller';
import { CustomerProfileOrmEntity } from '@infrastructure/database/postgres/customers/customer.entity';
import { PostgresCustomerRepository } from '@infrastructure/database/postgres/customers/customer.repository';
import { AddressModule } from './address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerProfileOrmEntity]),
    AddressModule,
  ],
  controllers: [CustomersController],
  providers: [
    CustomerService,
    {
      provide: 'CustomerRepository',
      useClass: PostgresCustomerRepository,
    },
  ],
  exports: [CustomerService, 'CustomerRepository'],
})
export class CustomersModule { }