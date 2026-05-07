import { Vendor } from './Vendor';

export interface IVendorRepository {
  create(data: Omit<Vendor, 'id' | 'createdAt'>): Promise<Vendor>;
  findByPhoneNumber(phoneNumber: string): Promise<Vendor | null>;
  update(id: string, data: Partial<Vendor>): Promise<void>;
  findById(id: string): Promise<Vendor | null>;
}
