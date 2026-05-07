import bcrypt from 'bcryptjs';
import { IVendorRepository } from '../../vendor/domain/IVendorRepository';
import { AppError } from '../../../shared/errors/AppError';
import { generateAccessToken, generateRefreshToken } from '../../../shared/utils/jwt';
import { HttpStatus } from '../../../shared/constants/HttpStatus';
import { ResponseMessages } from '../../../shared/constants/ResponseMessages';

export interface VendorLoginDTO {
  phoneNumber: string;
  password?: string;
}

export class VendorLoginUseCase {
  constructor(private readonly vendorRepository: IVendorRepository) {}

  public async execute(data: VendorLoginDTO): Promise<{ accessToken: string; refreshToken: string; vendor: any }> {
    const vendor = await this.vendorRepository.findByPhoneNumber(data.phoneNumber);

    if (!vendor) {
      throw new AppError(ResponseMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    if (data.password) {
      const isPasswordValid = await bcrypt.compare(data.password, vendor.passwordHash);
      if (!isPasswordValid) {
        throw new AppError(ResponseMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
      }
    }

    if (!vendor.isVerified) {
      throw new AppError(ResponseMessages.UNVERIFIED_ACCOUNT, HttpStatus.FORBIDDEN);
    }

    const payload = { id: vendor.id, role: 'vendor' };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { passwordHash, ...vendorData } = vendor as any;

    return { 
      accessToken, 
      refreshToken, 
      vendor: { ...vendorData, role: 'vendor' } 
    };
  }
}
