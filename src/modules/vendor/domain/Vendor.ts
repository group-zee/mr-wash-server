export class Vendor {
  constructor(
    public readonly id: string,
    public ownerName: string,
    public phoneNumber: string,
    public idType: string,
    public idFrontUrl: string,
    public idBackUrl: string | null,
    public passwordHash: string,
    public isVerified: boolean,
    public readonly createdAt: Date
  ) {}
}
