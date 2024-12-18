import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from './repository/role.repository';

@Injectable()
export class RolesService {
  constructor(@Inject() private readonly roleRepository: RolesRepository) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      return this.roleRepository.createRole(createRoleDto);
    } catch (error) {
      return error;
    }
  }
  async findAll() {
    try {
      return this.roleRepository.getAllRoles();
    } catch (error) {
      return error;
    }
  }
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      return this.roleRepository.updateRole(id, updateRoleDto);
    } catch (error) {
      return error;
    }
  }
  async remove(id: number) {
    try {
      return this.roleRepository.deleteRole(id);
    } catch (error) {
      return error;
    }
  }
}
