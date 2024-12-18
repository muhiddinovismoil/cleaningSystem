import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/auth/entities/auth.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}
  async getAllUsers() {
    try {
      const getdata = await this.userModel.findAll({
        attributes: { exclude: ['password'] },
      });
      if (getdata.length == 0) {
        throw new NotFoundException('Users not found');
      }
      return getdata;
    } catch (error) {
      return error;
    }
  }
  async getByIdUser(id: number) {
    try {
      const data = await this.userModel.findOne({
        where: { id: id },
        attributes: { exclude: ['password'] },
      });
      if (!data) {
        throw new NotFoundException('User not found');
      }
      return data;
    } catch (error) {
      return error;
    }
  }
  async updateByIdUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const data = await this.userModel.findOne({ where: { id: id } });
      if (!data) {
        throw new NotFoundException('User not found');
      }
      const [affectedRows, updatedUser] = await this.userModel.update(
        updateUserDto,
        {
          where: { id: id },
          returning: true,
        },
      );
      if (affectedRows === 0) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      return error;
    }
  }
  async deleteByIdUser(id: number) {
    try {
      const get = await this.userModel.findOne({ where: { id: id } });
      if (!get) {
        throw new NotFoundException('User not found');
      }
      await this.userModel.destroy({ where: { id: id } });
      return {
        msg: 'Your user deleted',
        deletedUserID: id,
      };
    } catch (error) {
      return error;
    }
  }
  async addAvatar(id: number, profile_logo: string) {
    try {
      const getUser = await this.userModel.findOne({ where: { id: id } });
      if (!getUser) {
        throw new NotFoundException('User not found');
      }
      await this.userModel.update({ profile_logo }, { where: { id: id } });
      return {
        msg: 'Avatar successfully added to your profile',
      };
    } catch (error) {
      return error;
    }
  }
  async getAvatar(id: number) {
    try {
      const getAvatar = await this.userModel.findOne({ where: { id: id } });
      if (!getAvatar) {
        throw new NotFoundException('User not found');
      }
      return {
        msg: 'Here is your avatar',
        profile_avatar: getAvatar.profile_logo,
      };
    } catch (error) {
      return error;
    }
  }
}
