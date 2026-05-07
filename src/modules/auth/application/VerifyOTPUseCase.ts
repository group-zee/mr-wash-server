import { ICustomerRepository } from '../../customer/domain/ICustomerRepository';
import { IVendorRepository } from '../../vendor/domain/IVendorRepository';
import { IOTPRepository } from '../domain/IOTPRepository';
import { AppError } from '../../../shared/errors/AppError';
import { generateAccessToken, generateRefreshToken } from '../../../shared/utils/jwt';
import { HttpStatus } from '../../../shared/constants/HttpStatus';
import { ResponseMessages } from '../../../shared/constants/ResponseMessages';

export interface VerifyOTPDTO {
  phoneNumber: string;
  otp: string;
  userType?: 'customer' | 'vendor'; // Optional: if provided, check only that repo
}

export class VerifyOTPUseCase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly vendorRepository: IVendorRepository,
    private readonly otpRepository: IOTPRepository
  ) {}

  public async execute(data: VerifyOTPDTO): Promise<{ message: string; accessToken: string; refreshToken: string; user: any; type: string }> {
    const isValid = await this.otpRepository.verify(data.phoneNumber, data.otp);
    
    if (!isValid) {
      throw new AppError(ResponseMessages.INVALID_OTP, HttpStatus.BAD_REQUEST);
    }

    let user: any = null;
    let type = '';

    // Check customer if not explicitly vendor
    if (data.userType !== 'vendor') {
      user = await this.customerRepository.findByPhoneNumber(data.phoneNumber);
      if (user) type = 'customer';
    }

    // Check vendor if not found as customer or explicitly vendor
    if (!user && data.userType !== 'customer') {
      user = await this.vendorRepository.findByPhoneNumber(data.phoneNumber);
      if (user) type = 'vendor';
    }

    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }

    // Verify user
    if (!user.isVerified) {
      if (type === 'customer') {
        await this.customerRepository.update(user.id, { isVerified: true });
      } else {
        await this.vendorRepository.update(user.id, { isVerified: true });
      }
    }

    // Clear OTP after successful verification
    await this.otpRepository.delete(data.phoneNumber);

    const payload = { id: user.id, role: type };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { passwordHash, ...userData } = user as any;

    return { 
      message: ResponseMessages.OTP_VERIFIED_SUCCESS, 
      accessToken, 
      refreshToken, 
      user: { ...userData, role: type },
      type
    };
  }
}
