import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from 'src/auth/entities/auth.entity';
import * as dotenv from 'dotenv';
import { OTP } from 'src/auth/entities/otp.entity';
dotenv.config();
export class Sequelize {
  static connect(): SequelizeModuleOptions {
    return {
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      models: [User, OTP],
      autoLoadModels: true,
      logging: false,
      synchronize: true,
    };
  }
}
