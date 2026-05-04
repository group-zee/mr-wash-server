import { ICustomerRepository } from '../../customer/domain/ICustomerRepository';
import { AppError } from '../../../shared/errors/AppError';
import { generateToken } from '../../../shared/utils/jwt';
import { HttpStatus } from '../../../shared/constants/HttpStatus';
import { ResponseMessages } from '../../../shared/constants/ResponseMessages';

export interface VerifyOTPDTO {
  phoneNumber: string;
  otp: string;
}

export class VerifyOTPUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  public async execute(data: VerifyOTPDTO): Promise<{ message: string; token?: string }> {
    // In a real application, you would verify the OTP against Redis or an OTP service
    // For this demonstration, we'll hardcode OTP '1234' for success.
    if (data.otp !== '1234') {
      throw new AppError(ResponseMessages.INVALID_OTP, HttpStatus.BAD_REQUEST);
    }

    const customer = await this.customerRepository.findByPhoneNumber(data.phoneNumber);
    if (!customer) {
      throw new AppError(ResponseMessages.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!customer.isVerified) {
      await this.customerRepository.update(customer.id, { isVerified: true });
    }

    const token = generateToken({ id: customer.id, role: 'customer' });

    return { message: ResponseMessages.OTP_VERIFIED_SUCCESS, token };
  }
}
