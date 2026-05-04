import { Router } from 'express';
import { AuthController } from './AuthController';
import { SignupUseCase } from '../application/SignupUseCase';
import { LoginUseCase } from '../application/LoginUseCase';
import { VerifyOTPUseCase } from '../application/VerifyOTPUseCase';
import { MongoCustomerRepository } from '../../customer/infrastructure/MongoCustomerRepository';

const router = Router();

// DI Setup
const customerRepository = new MongoCustomerRepository();
const signupUseCase = new SignupUseCase(customerRepository);
const loginUseCase = new LoginUseCase(customerRepository);
const verifyOTPUseCase = new VerifyOTPUseCase(customerRepository);
const authController = new AuthController(signupUseCase, loginUseCase, verifyOTPUseCase);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);

export default router;
