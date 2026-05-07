export enum ResponseMessages {
  // Auth Messages
  EMAIL_ALREADY_REGISTERED = 'Email is already registered',
  PHONE_ALREADY_REGISTERED = 'Phone number is already registered',
  SIGNUP_SUCCESS = 'Signup successful. Please verify OTP.',
  LOGIN_SUCCESS = 'Login successful',
  INVALID_CREDENTIALS = 'Invalid credentials',
  UNVERIFIED_ACCOUNT = 'Please verify your phone number via OTP first',
  OTP_VERIFIED_SUCCESS = 'Phone number verified successfully',
  INVALID_OTP = 'Invalid OTP',
  CUSTOMER_NOT_FOUND = 'Customer not found',
  PASSWORD_REQUIRED = 'Password is required for login',
  LOGOUT_SUCCESS = 'Logout successful',

  // General Status
  SUCCESS = 'success',
  ERROR = 'error',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}
