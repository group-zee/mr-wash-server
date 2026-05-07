import bcrypt from 'bcryptjs';
import { ICustomerRepository } from '../../customer/domain/ICustomerRepository';
import { AppError } from '../../../shared/errors/AppError';
import { generateAccessToken, generateRefreshToken } from '../../../shared/utils/jwt';
import { HttpStatus } from '../../../shared/constants/HttpStatus';
import { ResponseMessages } from '../../../shared/constants/ResponseMessages';

export interface LoginDTO {
  phoneNumber: string;
  password?: string;
}

export class LoginUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) { }

  public async execute(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string; customer: any }> {
    if (!data.password) {
      throw new AppError(ResponseMessages.PASSWORD_REQUIRED, HttpStatus.BAD_REQUEST);
    }

    const customer = await this.customerRepository.findByPhoneNumber(data.phoneNumber);
    if (!customer) {
      throw new AppError(ResponseMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(data.password, customer.passwordHash);
    if (!isMatch) {
      throw new AppError(ResponseMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    if (!customer.isVerified) {
      throw new AppError(ResponseMessages.UNVERIFIED_ACCOUNT, HttpStatus.FORBIDDEN);
    }

    const payload = { id: customer.id, role: 'customer' };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { passwordHash, ...customerData } = customer as any;

    return { accessToken, refreshToken, customer: customerData };
  }
}
