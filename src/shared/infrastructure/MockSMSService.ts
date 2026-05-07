import { ISMSService } from '../domain/ISMSService';
import { logger } from '../utils/logger';

export class MockSMSService implements ISMSService {
  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    console.log('\n-----------------------------------------');
    console.log('🚀 [MOCK SMS SERVICE]');
    console.log(`📱 To: ${phoneNumber}`);
    console.log(`💬 Message: ${message}`);
    console.log('-----------------------------------------\n');
    
    logger.info(`Mock SMS sent to ${phoneNumber}: ${message}`);
  }
}
