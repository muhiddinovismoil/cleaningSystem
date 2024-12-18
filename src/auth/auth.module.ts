import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/auth.entity';
import { AuthRepository } from './repository/auth.repository';
import { OTP } from './entities/otp.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
dotenv.config();
@Module({
  imports: [
    SequelizeModule.forFeature([User, OTP]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.access.secret,
      signOptions: { expiresIn: '10m' },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService],
})
export class AuthModule {}
