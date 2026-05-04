import { BaseRepository } from '../../../shared/infrastructure/BaseRepository';
import { Customer } from '../domain/Customer';
import { ICustomerRepository } from '../domain/ICustomerRepository';
import { CustomerModel, ICustomerDocument } from './models/CustomerModel';

export class MongoCustomerRepository
  extends BaseRepository<Customer, ICustomerDocument>
  implements ICustomerRepository
{
  constructor() {
    super(CustomerModel);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.model.findOne({ email }).exec();
    return customer ? (customer.toObject() as unknown as Customer) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Customer | null> {
    const customer = await this.model.findOne({ phoneNumber }).exec();
    return customer ? (customer.toObject() as unknown as Customer) : null;
  }
}
