import { IOTPRepository } from '../domain/IOTPRepository';
import { OTPModel } from './models/OTPModel';

export class MongoOTPRepository implements IOTPRepository {
  async save(phoneNumber: string, otp: string): Promise<void> {
    await OTPModel.findOneAndUpdate(
      { phoneNumber },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );
  }

  async verify(phoneNumber: string, otp: string): Promise<boolean> {
    const record = await OTPModel.findOne({ phoneNumber, otp });
    return !!record;
  }

  async delete(phoneNumber: string): Promise<void> {
    await OTPModel.deleteOne({ phoneNumber });
  }
}
