import { IVendorRepository } from '../domain/IVendorRepository';
import { Vendor } from '../domain/Vendor';
import { VendorModel, IVendorDocument } from './models/VendorModel';

export class MongoVendorRepository implements IVendorRepository {
  async create(data: Omit<Vendor, 'id' | 'createdAt'>): Promise<Vendor> {
    const vendor = await VendorModel.create(data);
    return this.toDomain(vendor);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Vendor | null> {
    const vendor = await VendorModel.findOne({ phoneNumber });
    return vendor ? this.toDomain(vendor) : null;
  }

  async findById(id: string): Promise<Vendor | null> {
    const vendor = await VendorModel.findById(id);
    return vendor ? this.toDomain(vendor) : null;
  }

  async update(id: string, data: Partial<Vendor>): Promise<void> {
    await VendorModel.findByIdAndUpdate(id, data);
  }

  private toDomain(doc: IVendorDocument): Vendor {
    return new Vendor(
      doc._id.toString(),
      doc.ownerName,
      doc.phoneNumber,
      doc.idType,
      doc.idFrontUrl,
      doc.idBackUrl,
      doc.passwordHash,
      doc.isVerified,
      doc.createdAt
    );
  }
}
