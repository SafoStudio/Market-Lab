import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain services
import { CustomerService } from '@domain/customers/customer.service';

// Controllers
import { CustomersController } from '@controller/customers.controller';

// Database infrastructure
import { CustomerProfileOrmEntity } from '@infrastructure/database/postgres/customers/customer.entity';
import { PostgresCustomerRepository } from '@infrastructure/database/postgres/customers/customer.repository';


@Module({
  imports: [TypeOrmModule.forFeature([CustomerProfileOrmEntity])],
  controllers: [CustomersController],
  providers: [
    // Main customer service
    CustomerService,

    // Customer repository
    {
      provide: 'CustomerRepository',
      useClass: PostgresCustomerRepository,
    },
  ],
  exports: [CustomerService, 'CustomerRepository'],
})
export class CustomersModule { }