import bcrypt from 'bcryptjs';
import { ICustomerRepository } from '../../customer/domain/ICustomerRepository';
import { Customer } from '../../customer/domain/Customer';
import { AppError } from '../../../shared/errors/AppError';
import { HttpStatus } from '../../../shared/constants/HttpStatus';
import { ResponseMessages } from '../../../shared/constants/ResponseMessages';

export interface SignupDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export class SignupUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  public async execute(data: SignupDTO): Promise<Customer> {
    const existingByPhone = await this.customerRepository.findByPhoneNumber(data.phoneNumber);
    if (existingByPhone) {
      throw new AppError(ResponseMessages.PHONE_ALREADY_REGISTERED, HttpStatus.BAD_REQUEST);
    }

    const existingByEmail = await this.customerRepository.findByEmail(data.email);
    if (existingByEmail) {
      throw new AppError(ResponseMessages.EMAIL_ALREADY_REGISTERED, HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Assuming we create the user with isVerified = false initially.
    // They will need to verify OTP later.
    return await this.customerRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      passwordHash,
      isVerified: false,
    });
  }
}
