import bcrypt from 'bcryptjs';
import { IVendorRepository } from '../../vendor/domain/IVendorRepository';
import { Vendor } from '../../vendor/domain/Vendor';
import { AppError } from '../../../shared/errors/AppError';
import { HttpStatus } from '../../../shared/constants/HttpStatus';
import { ResponseMessages } from '../../../shared/constants/ResponseMessages';

export interface VendorSignupDTO {
  ownerName: string;
  phoneNumber: string;
  idType: string;
  idFrontUrl: string;
  idBackUrl?: string;
  password: string;
}

export class VendorSignupUseCase {
  constructor(private readonly vendorRepository: IVendorRepository) {}

  public async execute(data: VendorSignupDTO): Promise<Vendor> {
    const existing = await this.vendorRepository.findByPhoneNumber(data.phoneNumber);
    if (existing) {
      throw new AppError(ResponseMessages.PHONE_ALREADY_REGISTERED, HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    return await this.vendorRepository.create({
      ownerName: data.ownerName,
      phoneNumber: data.phoneNumber,
      idType: data.idType,
      idFrontUrl: data.idFrontUrl,
      idBackUrl: data.idBackUrl || null,
      passwordHash,
      isVerified: false,
    });
  }
}
