import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    try {
      return this.usersService.findAll();
    } catch (error) {
      return error;
    }
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    try {
      return this.usersService.findOne(+id);
    } catch (error) {
      return error;
    }
  }

  @Post(':id')
  setAvatar(
    @Param('id') id: string,
    @Body('profile_logo') profile_logo: string,
  ) {
    try {
      return this.usersService.addAvatar(+id, profile_logo);
    } catch (error) {
      return error;
    }
  }

  @Put(':id')
  getAvatarById(@Param('id') id: string) {
    try {
      return this.usersService.getAvatar(+id);
    } catch (error) {
      return error;
    }
  }

  @Delete(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.usersService.updateUser(+id, updateUserDto);
    } catch (error) {
      return error;
    }
  }
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    try {
      return this.usersService.deleteUser(+id);
    } catch (error) {
      return error;
    }
  }
}
