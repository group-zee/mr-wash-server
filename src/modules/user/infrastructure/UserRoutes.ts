import { Router } from 'express';
import { UserController } from './UserController';
import { CreateUserUseCase } from '../application/CreateUserUseCase';
import { InMemoryUserRepository } from './InMemoryUserRepository';

const router = Router();

// Dependency Injection setup (ideally done in a DI container like tsyringe)
const userRepository = new InMemoryUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const userController = new UserController(createUserUseCase);

router.post('/', userController.createUser);

export default router;
