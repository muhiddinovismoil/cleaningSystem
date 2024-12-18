import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Roles } from '../entities/role.entity';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
export class RolesRepository {
  constructor(@InjectModel(Roles) private readonly rolesModel: typeof Roles) {}
  async getAllRoles() {
    try {
      const getRoles = await this.rolesModel.findAll();
      if (getRoles.length == 0) {
        throw new NotFoundException('Roles not found');
      }
      return getRoles;
    } catch (error) {
      return error;
    }
  }
  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const newRole = await this.rolesModel.create({
        ...createRoleDto,
      });
      return {
        msg: 'New Role added',
        newRoleId: newRole.id,
      };
    } catch (error) {
      return error;
    }
  }
  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const getRole = await this.rolesModel.findOne({ where: { id: id } });
      if (!getRole) {
        throw new NotFoundException('Role Not found');
      }
      await this.rolesModel.update({ ...updateRoleDto }, { where: { id: id } });
      return {
        msg: 'Role updated',
        updatedRole: id,
      };
    } catch (error) {
      return error;
    }
  }
  async deleteRole(id: number) {
    try {
      const getOneRole = await this.rolesModel.findOne({ where: { id: id } });
      if (!getOneRole) {
        throw new NotFoundException('Role not found');
      }
      await this.rolesModel.destroy({ where: { id: id } });
      return {
        msg: 'Role deleted',
        deletedRoleId: id,
      };
    } catch (error) {
      return error;
    }
  }
}
