import { Request, Response, NextFunction } from 'express';
import { SignupUseCase } from '../application/SignupUseCase';
import { LoginUseCase } from '../application/LoginUseCase';
import { VendorSignupUseCase } from '../application/VendorSignupUseCase';
import { VendorLoginUseCase } from '../application/VendorLoginUseCase';
import { VerifyOTPUseCase } from '../application/VerifyOTPUseCase';
import { SendOTPUseCase } from '../application/SendOTPUseCase';
import { HttpStatus } from '../../../shared/constants/HttpStatus';
import { ResponseMessages } from '../../../shared/constants/ResponseMessages';

export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly vendorSignupUseCase: VendorSignupUseCase,
    private readonly vendorLoginUseCase: VendorLoginUseCase,
    private readonly verifyOTPUseCase: VerifyOTPUseCase,
    private readonly sendOTPUseCase: SendOTPUseCase
  ) { }

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.signupUseCase.execute(req.body);
      await this.sendOTPUseCase.execute(customer.phoneNumber);

      res.status(HttpStatus.CREATED).json({
        status: ResponseMessages.SUCCESS,
        message: ResponseMessages.SIGNUP_SUCCESS,
        data: { id: customer.id, phoneNumber: customer.phoneNumber },
      });
    } catch (error) {
      next(error);
    }
  };

  public vendorSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Received Vendor Signup Request:', req.body);
      const vendor = await this.vendorSignupUseCase.execute(req.body);
      console.log('Vendor Created Successfully:', vendor.id);
      
      await this.sendOTPUseCase.execute(vendor.phoneNumber);
      console.log('OTP Sent to:', vendor.phoneNumber);

      res.status(HttpStatus.CREATED).json({
        status: ResponseMessages.SUCCESS,
        message: ResponseMessages.SIGNUP_SUCCESS,
        data: { id: vendor.id, phoneNumber: vendor.phoneNumber },
      });
    } catch (error: any) {
      console.error('Vendor Signup Error:', error);
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      this.setTokenCookies(res, result.accessToken, result.refreshToken);
      
      res.status(HttpStatus.OK).json({
        status: ResponseMessages.SUCCESS,
        message: ResponseMessages.LOGIN_SUCCESS,
        data: { customer: result.customer },
      });
    } catch (error) {
      next(error);
    }
  };

  public vendorLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.vendorLoginUseCase.execute(req.body);
      this.setTokenCookies(res, result.accessToken, result.refreshToken);
      
      res.status(HttpStatus.OK).json({
        status: ResponseMessages.SUCCESS,
        message: ResponseMessages.LOGIN_SUCCESS,
        data: { vendor: result.vendor },
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.verifyOTPUseCase.execute(req.body);
      this.setTokenCookies(res, result.accessToken, result.refreshToken);
      
      res.status(HttpStatus.OK).json({
        status: ResponseMessages.SUCCESS,
        message: result.message,
        data: { [result.type]: result.user },
      });
    } catch (error) {
      next(error);
    }
  };

  public sendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phoneNumber } = req.body;
      await this.sendOTPUseCase.execute(phoneNumber);
      res.status(HttpStatus.OK).json({
        status: ResponseMessages.SUCCESS,
        message: 'OTP sent successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(HttpStatus.OK).json({
        status: ResponseMessages.SUCCESS,
        message: ResponseMessages.LOGOUT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };
}
