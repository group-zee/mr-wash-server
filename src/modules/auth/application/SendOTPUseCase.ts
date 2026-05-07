import { ISMSService } from '../../../shared/domain/ISMSService';
import { IOTPRepository } from '../domain/IOTPRepository';

export class SendOTPUseCase {
  constructor(
    private otpRepository: IOTPRepository,
    private smsService: ISMSService
  ) { }

  async execute(phoneNumber: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpRepository.save(phoneNumber, otp);
    await this.smsService.sendSMS(phoneNumber, `Your Mr. Wash verification code is: ${otp}`);
  }
}
