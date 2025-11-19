import { BaseRepository } from '@shared/interfaces/repository.interface';
import { CustomerEntity } from './customer.entity';

export abstract class CustomerRepository implements BaseRepository<CustomerEntity> {
  abstract findAll(): Promise<CustomerEntity[]>;
  abstract findById(id: string): Promise<CustomerEntity | null>;
  abstract findByEmail(email: string): Promise<CustomerEntity | null>;
  abstract create(customer: CustomerEntity): Promise<CustomerEntity>;
  abstract update(id: string, customer: CustomerEntity): Promise<CustomerEntity>;
  abstract delete(id: string): Promise<void>;
}