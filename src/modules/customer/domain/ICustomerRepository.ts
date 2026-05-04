import { IRepository } from '../../../shared/domain/IRepository';
import { Customer } from './Customer';

export interface ICustomerRepository extends IRepository<Customer> {
  findByEmail(email: string): Promise<Customer | null>;
  findByPhoneNumber(phoneNumber: string): Promise<Customer | null>;
}
