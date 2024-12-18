import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../enums/role.enums';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/decorator/role.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
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
  @Post('/:id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              '.' +
              file.originalname.split('.')[1],
          );
        },
      }),
    }),
  )
  setAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const filePath = file.path.split('/')[1];
      return this.usersService.addAvatar(+id, filePath);
    } catch (error) {
      return error;
    }
  }
  @Get('/:id/avatar')
  async getAvatarById(@Param('id') id: string, @Res() res: Response) {
    try {
      const avatarFilename = await this.usersService.getAvatar(+id);
      const filePath = join(process.cwd(), 'uploads', avatarFilename);
      if (!existsSync(filePath)) {
        throw new NotFoundException('File not found on the server');
      }
      return res.sendFile(filePath);
    } catch (error) {
      return error;
    }
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.usersService.updateUser(+id, updateUserDto);
    } catch (error) {
      return error;
    }
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    try {
      return this.usersService.deleteUser(+id);
    } catch (error) {
      return error;
    }
  }
}
