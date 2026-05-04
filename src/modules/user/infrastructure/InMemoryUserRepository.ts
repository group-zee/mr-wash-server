import { IUserRepository } from '../domain/IUserRepository';
import { User } from '../domain/User';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  public async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}
