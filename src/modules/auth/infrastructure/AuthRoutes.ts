import { Router } from 'express';
import { AuthController } from './AuthController';
import { SignupUseCase } from '../application/SignupUseCase';
import { LoginUseCase } from '../application/LoginUseCase';
import { VendorSignupUseCase } from '../application/VendorSignupUseCase';
import { VendorLoginUseCase } from '../application/VendorLoginUseCase';
import { VerifyOTPUseCase } from '../application/VerifyOTPUseCase';
import { SendOTPUseCase } from '../application/SendOTPUseCase';
import { MongoCustomerRepository } from '../../customer/infrastructure/MongoCustomerRepository';
import { MongoVendorRepository } from '../../vendor/infrastructure/MongoVendorRepository';
import { MongoOTPRepository } from './MongoOTPRepository';
import { MockSMSService } from '../../../shared/infrastructure/MockSMSService';

const router = Router();
// Refreshed routes滋

// DI Setup
const customerRepository = new MongoCustomerRepository();
const vendorRepository = new MongoVendorRepository();
const otpRepository = new MongoOTPRepository();
const smsService = new MockSMSService();

const signupUseCase = new SignupUseCase(customerRepository);
const loginUseCase = new LoginUseCase(customerRepository);
const vendorSignupUseCase = new VendorSignupUseCase(vendorRepository);
const vendorLoginUseCase = new VendorLoginUseCase(vendorRepository);
const sendOTPUseCase = new SendOTPUseCase(otpRepository, smsService);
const verifyOTPUseCase = new VerifyOTPUseCase(customerRepository, vendorRepository, otpRepository);

const authController = new AuthController(
  signupUseCase, 
  loginUseCase, 
  vendorSignupUseCase,
  vendorLoginUseCase,
  verifyOTPUseCase, 
  sendOTPUseCase
);

// Customer Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Vendor Routes
router.post('/vendor/signup', authController.vendorSignup);
router.post('/vendor/login', authController.vendorLogin);

// Shared Routes
router.post('/verify-otp', authController.verifyOTP);
router.post('/send-otp', authController.sendOTP);
router.post('/logout', authController.logout);

export default router;
