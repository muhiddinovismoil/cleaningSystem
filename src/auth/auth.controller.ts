import { Controller, Post, Body, Param, Get } from '@nestjs/common';
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
    @Body(new ZodValidationPipe(forgetPassSchem))
    forgetAuthDto: ForgetPasswordDto,
  ) {
    return this.authService.forgetUserPass(forgetAuthDto);
  }
  @Post('otp-forget-password/:id')
  otpForgetPassword(@Param('id') id: string, @Body('email') email: string) {
    return this.authService.newOtpVerification(+id, email);
  }

  @Post('reset-password')
  resetPassword(
    @Body(new ZodValidationPipe(updatePassSchema))
    updatePassword: UpdatePasswordDto,
  ) {
    return this.authService.resetPass(updatePassword);
  }
  @Get('refreshToken')
  refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.tokenRefresh(refreshToken);
  }
}
