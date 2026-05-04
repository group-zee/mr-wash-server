import { IUserRepository } from '../domain/IUserRepository';
import { User } from '../domain/User';
import { AppError } from '../../../shared/errors/AppError';

export interface CreateUserDTO {
  name: string;
  email: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    const newUser = new User(
      Math.random().toString(36).substring(7), // Simple ID generator for demo
      data.name,
      data.email,
      new Date()
    );

    return await this.userRepository.save(newUser);
  }
}
