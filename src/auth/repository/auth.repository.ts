import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/auth.entity';
import { comparePass, generateHash } from 'src/helpers/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { CreateAuthDto } from '../dto/register.dto';
import { LoginAuthDto } from '../dto/login.dto';
import {
  ForgetPasswordDto,
  UpdatePasswordDto,
} from '../dto/updatepassword.dto';
import { OTP } from '../entities/otp.entity';
import { sendEmail } from 'src/helpers/send.mail';
import { MailerService } from '@nestjs-modules/mailer';
import { generateOtp } from 'src/helpers/otp-generator';
@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(OTP) private readonly otpModel: typeof OTP,
    private readonly jwtService: JwtService,
    private readonly mailerHelper: MailerService,
  ) {}
  async register(createUserDto: CreateAuthDto) {
    try {
      const isUserExists = await this.userModel.findOne({
        where: { email: createUserDto.email },
      });
      const hashPass = await generateHash(createUserDto.password);
      if (!isUserExists) {
        const newUser = new this.userModel({
          ...createUserDto,
          password: hashPass,
        });
        await newUser.save();
        const otp = await generateOtp();
        await sendEmail(
          this.mailerHelper,
          createUserDto.email,
          'Welcome to Our Platform',
          'Thank you for registering!',
          `<h1>Welcome!</h1><p>We are glad to have you on board.<br>Here is your otp code and don't give it to others please: ${otp}</p>`,
        );
        const newOtp = new this.otpModel({
          otp_code: otp,
          user_id: newUser.id,
        });
        await newOtp.save();
        return {
          msg: 'You are registered successfully',
          userId: newUser.id,
        };
      }
      throw new BadRequestException('User already exists');
    } catch (error) {
      return error;
    }
  }

  async login(data: LoginAuthDto) {
    try {
      const getUser = await this.userModel.findOne({
        where: { email: data.email },
      });
      if (!getUser) {
        throw new NotFoundException('User not found');
      }
      if (getUser.isActive == false) {
        throw new BadRequestException('You are not verified your otp');
      }
      const checkPass = await comparePass(getUser.password, data.password);
      if (!checkPass) {
        throw new BadRequestException('Your email or password does not match');
      }
      const payload = {
        sub: getUser.id,
        name: getUser.name,
        email: getUser.email,
        role: getUser.role,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: jwtConstants.access.secret,
        expiresIn: jwtConstants.access.expiresTime,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: jwtConstants.refresh.secret,
        expiresIn: jwtConstants.refresh.expiresTime,
      });
      return {
        msg: 'You are logged in successfully',
        accessToken,
        refreshToken,
      };
    } catch (error) {
      return error;
    }
  }
  async verifyOTP(id: string, otp: string) {
    try {
      const getUser = await this.otpModel.findOne({ where: { user_id: id } });
      if (!getUser) {
        throw new NotFoundException('Your OTP not found');
      }
      if (getUser.otp_code == otp) {
        await this.otpModel.destroy({ where: { user_id: id } });
        await this.userModel.update({ isActive: true }, { where: { id: id } });
        return {
          msg: 'Your account is now activated',
        };
      } else {
        throw new BadRequestException('Invalid OTP');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async forgetPass(forgetAuthDto: ForgetPasswordDto) {
    try {
      const findUser = await this.userModel.findOne({
        where: { email: forgetAuthDto.email },
      });
      if (!findUser) {
        throw new NotFoundException('User not found with this email');
      }
      const checkOtp = await this.otpModel.findOne({
        where: { user_id: findUser.id },
      });
      if (!checkOtp) {
        throw new BadRequestException('OTP not found');
      }
      if (checkOtp.otp_code !== forgetAuthDto.otp_code) {
        throw new BadRequestException('Invalid OTP');
      }
      await this.otpModel.destroy({
        where: { user_id: findUser.id },
      });
      if (forgetAuthDto.newPassword !== forgetAuthDto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      const hashedPassword = await generateHash(forgetAuthDto.newPassword);
      await this.userModel.update(
        { password: hashedPassword },
        { where: { email: forgetAuthDto.email } },
      );
      return { msg: 'Your password has been updated successfully' };
    } catch (error) {
      console.error('Error updating password:', error);
      throw new InternalServerErrorException(
        'An error occurred while updating password',
      );
    }
  }

  async generateOtpVerification(id: number, email: string) {
    try {
      const otp = await generateOtp();
      await sendEmail(
        this.mailerHelper,
        email,
        'Welcome to Our Platform',
        'Thank you for registering!',
        `<h1>Welcome!</h1><p>We are glad to have you on board.<br>Here is your otp code and don't give it to others please: ${otp}</p>`,
      );
      const newOtp = new this.otpModel({
        user_id: id,
        otp_code: otp,
      });
      await newOtp.save();
      return {
        msg: 'Your otp sended to your email',
      };
    } catch (error) {
      return error;
    }
  }
  async rePassword(updateUserDto: UpdatePasswordDto) {
    try {
      const userPassUpdate = await this.userModel.findOne({
        where: { email: updateUserDto.email },
      });
      if (!userPassUpdate) {
        throw new NotFoundException('User not found');
      }
      const isMatch = await comparePass(
        userPassUpdate.password,
        updateUserDto.oldPassword,
      );
      if (!isMatch) {
        throw new BadRequestException('Your old password is incorrect');
      }
      const hashedPassword = await generateHash(updateUserDto.password);
      await this.userModel.update(
        { password: hashedPassword },
        { where: { email: updateUserDto.email } },
      );
      return {
        msg: 'Your password has been reset successfully',
      };
    } catch (error) {
      return error;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refresh.secret,
      });
      const { id, email } = decoded;
      const newAccessToken = this.jwtService.sign(
        { id, email },
        {
          secret: jwtConstants.access.secret,
          expiresIn: jwtConstants.access.expiresTime,
        },
      );
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid or expired refresh token ${error}`,
      );
    }
  }
}
