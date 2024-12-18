import { createZodDto } from 'nestjs-zod';
import { RoleSchema } from './create-role.dto';

export const UpdateRoleSchema = RoleSchema.partial();
export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}
