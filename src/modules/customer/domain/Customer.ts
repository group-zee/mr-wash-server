export class Customer {
  constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phoneNumber: string,
    public passwordHash: string,
    public avatarUrl: string | null,
    public isVerified: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}
}
