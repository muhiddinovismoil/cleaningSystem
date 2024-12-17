import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/auth.entity';
import { Model } from 'mongoose';
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
    @InjectModel('users') private readonly userModel: Model<User>,
    @InjectModel('otp') private readonly otpModel: Model<OTP>,
    private readonly jwtService: JwtService,
    private readonly mailerHelper: MailerService,
  ) {}
  async register(createUserDto: CreateAuthDto) {
    try {
      const isUserExists = await this.userModel.findOne({
        email: createUserDto.email,
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
          user_id: newUser._id,
        });
        await newOtp.save();
        return {
          msg: 'You are registered successfully',
          userId: newUser._id,
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
        email: data.email,
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
        sub: getUser._id,
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
      const getUser = await this.otpModel.findOne({ user_id: id });
      if (!getUser) {
        throw new NotFoundException('Your OTP not found');
      }
      if (getUser.otp_code == otp) {
        await this.otpModel.findOneAndDelete({ user_id: id });
        await this.userModel.findOneAndUpdate(
          { _id: id },
          { $set: { isActive: true } },
          { new: true },
        );
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
        email: forgetAuthDto.email,
      });
      if (!findUser) {
        throw new NotFoundException('User not found with this email');
      }
      const checkOtp = await this.otpModel.findOne({ user_id: findUser._id });
      if (!checkOtp) {
        throw new BadRequestException('OTP not found');
      }
      if (checkOtp.otp_code == forgetAuthDto.otp_code) {
        await this.otpModel.findOneAndDelete({ user_id: checkOtp._id });
      }
      if (forgetAuthDto.newPassword == forgetAuthDto.confirmPassword) {
        await this.userModel.findOneAndUpdate({
          email: forgetAuthDto.email,
          password: generateHash(forgetAuthDto.newPassword),
        });
      }
      throw new BadRequestException('Your password not updated ');
    } catch (error) {
      return error;
    }
  }
  async generateOtpVerification(email: string) {
    try {
      const otp = await generateOtp();
      await sendEmail(
        this.mailerHelper,
        email,
        'Welcome to Our Platform',
        'Thank you for registering!',
        `<h1>Welcome!</h1><p>We are glad to have you on board.<br>Here is your otp code and don't give it to others please: ${otp}</p>`,
      );
      const newOtp = new this.otpModel({ otp_code: otp });
      await newOtp.save();
    } catch (error) {
      return error;
    }
  }
  async rePassword(updateUserDto: UpdatePasswordDto) {
    try {
      const userPassUpdate = await this.userModel.findOne({
        email: updateUserDto.email,
      });
      if (!userPassUpdate) {
        throw new NotFoundException('User not found');
      }
      if (userPassUpdate.password != updateUserDto.oldPassword) {
        throw new BadRequestException('User password or email is not suit');
      }
      await this.userModel.findOneAndUpdate({
        email: updateUserDto.email,
        password: generateHash(updateUserDto.password),
      });
    } catch (error) {
      return error;
    }
  }
}
