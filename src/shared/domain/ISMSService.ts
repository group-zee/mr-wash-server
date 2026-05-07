export interface ISMSService {
  sendSMS(phoneNumber: string, message: string): Promise<void>;
}
