import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../application/CreateUserUseCase';

export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email } = req.body;
      const user = await this.createUserUseCase.execute({ name, email });
      res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
