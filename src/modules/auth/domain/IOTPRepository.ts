export interface IOTPRepository {
  save(phoneNumber: string, otp: string): Promise<void>;
  verify(phoneNumber: string, otp: string): Promise<boolean>;
  delete(phoneNumber: string): Promise<void>;
}
