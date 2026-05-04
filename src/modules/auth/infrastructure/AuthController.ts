import { Request, Response, NextFunction } from 'express';
import { SignupUseCase } from '../application/SignupUseCase';
import { LoginUseCase } from '../application/LoginUseCase';
import { VerifyOTPUseCase } from '../application/VerifyOTPUseCase';
import { HttpStatus } from '../../../shared/constants/HttpStatus';
import { ResponseMessages } from '../../../shared/constants/ResponseMessages';

export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyOTPUseCase: VerifyOTPUseCase
  ) {}

  public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.signupUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json({
        status: ResponseMessages.SUCCESS,
        message: ResponseMessages.SIGNUP_SUCCESS,
        data: { id: customer.id, phoneNumber: customer.phoneNumber },
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(HttpStatus.OK).json({
        status: ResponseMessages.SUCCESS,
        message: ResponseMessages.LOGIN_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.verifyOTPUseCase.execute(req.body);
      res.status(HttpStatus.OK).json({
        status: ResponseMessages.SUCCESS,
        message: result.message,
        data: { token: result.token },
      });
    } catch (error) {
      next(error);
    }
  };
}
