import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository as DomainCustomerRepository } from '@domain/customers/customer.repository';
import { CustomerEntity } from '@domain/customers/customer.entity';

@Injectable()
export class PostgresCustomerRepository extends DomainCustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) { super() }

  async findAll(): Promise<CustomerEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(customer: CustomerEntity): Promise<CustomerEntity> {
    return this.repository.save(customer);
  }

  async update(id: string, customer: CustomerEntity): Promise<CustomerEntity> {
    await this.repository.update(id, customer);
    return this.findById(id) as Promise<CustomerEntity>;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}