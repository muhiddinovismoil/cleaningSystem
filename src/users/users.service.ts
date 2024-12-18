import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repository/user.repository';

@Injectable()
export class UsersService {
  constructor(@Inject() private readonly userRepository: UsersRepository) {}
  async findAll() {
    try {
      return await this.userRepository.getAllUsers();
    } catch (error) {
      return error;
    }
  }
  async findOne(id: number) {
    try {
      return await this.userRepository.getByIdUser(id);
    } catch (error) {
      return error;
    }
  }
  async addAvatar(id: number, profile_logo: string) {
    try {
      return await this.userRepository.addAvatar(id, profile_logo);
    } catch (error) {
      return error;
    }
  }
  async getAvatar(id: number) {
    try {
      return await this.userRepository.getAvatar(id);
    } catch (error) {
      return error;
    }
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.userRepository.updateByIdUser(id, updateUserDto);
    } catch (error) {
      return error;
    }
  }
  async deleteUser(id: number) {
    try {
      return await this.userRepository.deleteByIdUser(id);
    } catch (error) {
      return error;
    }
  }
}
