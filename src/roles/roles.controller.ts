import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    try {
      return this.rolesService.findAll();
    } catch (error) {
      return error;
    }
  }
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return this.rolesService.create(createRoleDto);
    } catch (error) {
      return error;
    }
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      return this.rolesService.update(+id, updateRoleDto);
    } catch (error) {
      return error;
    }
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.rolesService.remove(+id);
    } catch (error) {
      return error;
    }
  }
}
