import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from './database/database';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot(Sequelize.connect()),
    AuthModule,
    UsersModule,
    RolesModule,
  ],
})
export class AppModule {}
