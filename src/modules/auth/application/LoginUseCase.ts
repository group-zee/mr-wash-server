import bcrypt from 'bcryptjs';
import { ICustomerRepository } from '../../customer/domain/ICustomerRepository';
import { AppError } from '../../../shared/errors/AppError';
import { generateToken } from '../../../shared/utils/jwt';
import { HttpStatus } from '../../../shared/constants/HttpStatus';
import { ResponseMessages } from '../../../shared/constants/ResponseMessages';

export interface LoginDTO {
  phoneNumber: string;
  password?: string; // Optional if doing OTP-only login, but user requested password login
}

export class LoginUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  public async execute(data: LoginDTO): Promise<{ token: string; customer: any }> {
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

    const token = generateToken({ id: customer.id, role: 'customer' });

    // Exclude passwordHash from response
    const { passwordHash, ...customerData } = customer as any;

    return { token, customer: customerData };
  }
}
