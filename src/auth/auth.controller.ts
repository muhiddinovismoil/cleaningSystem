import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSchema, CreateAuthDto } from './dto/register.dto';
import { AuthSchema2, LoginAuthDto } from './dto/login.dto';
import {
  forgetPassSchem,
  ForgetPasswordDto,
  updatePassSchema,
  UpdatePasswordDto,
} from './dto/updatepassword.dto';
import { ZodValidationPipe } from 'src/validations/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(
    @Body(new ZodValidationPipe(AuthSchema)) createAuthDto: CreateAuthDto,
  ) {
    return this.authService.registerUser(createAuthDto);
  }

  @Post('login')
  login(@Body(new ZodValidationPipe(AuthSchema2)) loginAuthDto: LoginAuthDto) {
    return this.authService.loginUser(loginAuthDto);
  }
  @Post('verify/:id')
  verify(@Param('id') id: string, @Body('otp_code') otp: string) {
    return this.authService.verification(id, otp);
  }

  @Post('forget-password')
  forgetPassword(
    @Body(new ZodValidationPipe(updatePassSchema))
    forgetAuthDto: UpdatePasswordDto,
  ) {
    return this.authService.forgetUserPass(forgetAuthDto);
  }
  @Post('otp-forget-password')
  otpForgetPassword(@Body() email: string) {
    return this.authService.newOtpVerification(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body(new ZodValidationPipe(forgetPassSchem))
    updatePassword: ForgetPasswordDto,
  ) {
    return this.authService.resetPass(updatePassword);
  }
}
